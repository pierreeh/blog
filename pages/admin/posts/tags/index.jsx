import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Row, Col, Typography, Breadcrumb, Form, Alert, Input, Switch, Button } from 'antd'

import { db } from 'utils/db'
import AdminLayout from "components/admin/adminLayout/AdminLayout"
import PageSection from "components/admin/commons/pageSection/PageSection"
import slugify from 'utils/slugify'
import { rem } from 'styles/ClobalStyles.style'
import { jsonify } from 'utils/utils'

const prisma = db

export default function PostsTags({ tags }) {
  const router = useRouter()
  const [form] = Form.useForm()
  const [error, setError] = useState({ type: '', message: '' })
  const [published, setPublished] = useState(true)
  const nameValue = Form.useWatch('name', form)

  useEffect(() => {
    if (nameValue) {
      form.setFieldsValue({ slug: slugify(nameValue) })
    }

    return () => form.setFieldsValue({ slug: '' })
  }, [nameValue, form])

  async function onSubmit(data) {
    try {
      const duplicate = tags.find(t => t.name === data.name)
      if (duplicate) {
        setError({ type: 'error', message: 'This tag already exists' })
        return false
      }

      const body = JSON.stringify({
        name: data.name,
        slug: slugify(data.slug),
        published
      })

      const res = await(await fetch('/api/admin/posts/tags/post', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      })).json()

      if (res.message) {
        setError({ type: 'error', message: res.message })
        return false
      }

      router.reload()
      return res
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <Breadcrumb.Item><Link href="/admin">Admin</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Tags</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={24}>
        <Col span={16}>
          <PageSection>
            <Typography.Title level={5}>Tags</Typography.Title>
          </PageSection>
        </Col>

        <Col span={8}>
          <PageSection isSticky>
            <Typography.Title level={5}>New Tag</Typography.Title>

            {error.type && 
              <Alert 
                message={error.message} 
                type={error.type} 
                showIcon 
                style={{ marginBottom: rem(16) }} 
                closable 
                onClose={() => {
                  setError({ type: '', message: '' })
                  form.resetFields()
                }} 
              />
            }

            <Form 
              autoComplete='off'
              name='createSubCategories'
              layout='vertical'
              onFinish={onSubmit}
              form={form}
            >
              <Form.Item
                label='Name'
                name='name'
                rules={[
                  {
                    required: true,
                    message: 'This field is required'
                  },
                  {
                    pattern: /.*[^ ].*/,
                    message: "This field can't be empty"
                  },
                  {
                    pattern: /^\S+$/,
                    message: "This field can't have space"
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Slug"
                name='slug'
                tooltip="Part of the URL after the last backslash"
                rules={[
                  {
                    required: true,
                    message: 'This field is required'
                  },
                  {
                    pattern: /.*[^ ].*/,
                    message: "This field can't be empty"
                  }
                ]}
              >
                <Input  />
              </Form.Item>

              <Row style={{ marginTop: rem(20), marginBottom: rem(20) }}>
                <Col span={3}>
                  <Switch defaultChecked onChange={e => setPublished(e)} />
                </Col>
                <Col span={16}>
                  <Typography>{published ? 'Published' : 'Draft'}</Typography>
                </Col>
              </Row>

              <Button
                type="primary"
                htmlType="submit"
              >
                Publish
              </Button>
            </Form>
          </PageSection>
        </Col>
      </Row>
    </>
  )
}

PostsTags.getLayout = page => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps() {
  try {
    const tags = await prisma.tag.findMany({
      where: { visible: true },
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    return {
      props: {
        tags: jsonify(tags)
      }
    }
  } catch (e) {
    throw new Error(e)
  }
}