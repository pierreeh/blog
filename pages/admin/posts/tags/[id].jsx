import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { PrismaClient } from "@prisma/client"
import { Breadcrumb, Row, Col, Typography, Form, Input, Button, Switch, Alert, Select, Badge } from "antd"

import AdminLayout from "components/admin/adminLayout/AdminLayout"
import PageSection from "components/admin/commons/pageSection/PageSection"
import { jsonify } from "utils/utils"
import { rem } from "styles/ClobalStyles.style"

const prisma = new PrismaClient()

export default function EditTag({ tag, categories }) {
  const router = useRouter()
  const [form] = Form.useForm()
  const [published, setPublished] = useState(tag.published)
  const [error, setError] = useState({ type: '', message: '' })
  
  async function onSubmit(data) {
    try {
      const body = JSON.stringify({
        name: data.name,
        categoryId: data.categoryId,
        published
      })

      const res = await(await fetch(`/api/admin/posts/tags/${router.query.id}`, {
        method: 'PATCH',
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

      router.push('/admin/posts/tags')
      return res
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <Breadcrumb.Item><Link href="/admin">Admin</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link href="/admin/posts/tags">Tags</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{tag.name}</Breadcrumb.Item>
      </Breadcrumb>
      
      <Row gutter={24}>
        <Col span={24}>
          <PageSection>
            <Col span={12} offset={6}>
              <Typography.Title level={5}>Edit {tag.name}</Typography.Title>

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
                name='editTag'
                layout='vertical'
                onFinish={onSubmit}
                form={form}
                initialValues={{
                  name: tag.name,
                  slug: tag.slug,
                  published: tag.published,
                  categoryId: tag.category_id
                }}
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
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Slug"
                  name='slug'
                >
                  <Input disabled />
                </Form.Item>

                <Form.Item 
                  label="Category"
                  name="categoryId"
                  rules={[
                    {
                      required: true,
                      message: 'This field is required'
                    }
                  ]}
                >
                  <Select placeholder='Select'>
                    {categories.map(c => (
                      <Select.Option key={c.id} value={c.id}><Badge color={c.color} /> {c.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Row style={{ marginTop: rem(20), marginBottom: rem(20) }}>
                  <Col span={2}>
                    <Form.Item valuePropName="checked" name="published" noStyle>
                      <Switch onChange={e => setPublished(e)} />
                    </Form.Item>
                  </Col>
                  <Col span={22}>
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
            </Col>
          </PageSection>
        </Col>
      </Row>
    </>
  )
}

EditTag.getLayout = page => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps(context) {
  try {
    const tag = await prisma.postTag.findFirst({ where: { id: context.query.id } })
    const categories = await prisma.postCategory.findMany({ where: { visible: true, published: true } })

    return {
      props: {
        tag: jsonify(tag),
        categories: jsonify(categories)
      }
    }
  } catch (e) {
    throw new Error(e)
  }
}