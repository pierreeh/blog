import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import dayjs from 'dayjs'
import { PrismaClient } from "@prisma/client"
import { Row, Col, Typography, Form, Input, Select, Button, Switch, Alert, DatePicker, Breadcrumb, Divider } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'

import PageSection from "components/admin/commons/pageSection/PageSection"
import AdminLayout from "components/admin/adminLayout/AdminLayout"
import { rem } from 'styles/ClobalStyles.style'
import { jsonify } from 'utils/utils'
import slugify from 'utils/slugify'

const Editor = dynamic(import('components/admin/commons/editor/Editor'), { ssr: false })

const prisma = new PrismaClient()
const document = [{ type: "p", children: [{ text: "" }] }]

export default function CreatePost({ categories, subCategories }) {
  const [form] = Form.useForm()
  const router = useRouter()
  const [error, setError] = useState({ type: '', message: '' })
  const [published, setPublished] = useState(true)
  const [commentsAllowed, setComments] = useState(true)
  const [publishTime, setPublishTime] = useState()
  const [findSubCategories, setFindSubCategories] = useState()
  const [body, updateBody] = useState(document)
  const nameValue = Form.useWatch('title', form)
  
  useEffect(() => {
    if (nameValue) {
      form.setFieldsValue({ slug: slugify(nameValue) })
    }

    return () => form.setFieldsValue({ slug: '' })
  }, [nameValue, form])
  
  async function onSubmit(data) {
    try {
      const body = JSON.stringify({
        title: data.title,
        slug: slugify(data.slug),
        excerpt: data.excerpt,
        body: data.body,
        categoryId: data.categoryId,
        subCategories: data.subCategories,
        commentsAllowed,
        publishTime,
        published
      })

      const res = await(await fetch('/api/admin/posts/post', {
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

      router.push('/admin/posts')
      return res
    } catch (e) {
      console.error(e)
    }
  }

  function disableDate(current) {
    return current && current < dayjs().endOf('day')
  }

  return (
    <>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <Breadcrumb.Item><Link href="/admin">Admin</Link></Breadcrumb.Item>
        <Breadcrumb.Item>New post</Breadcrumb.Item>
      </Breadcrumb>
      <Form 
        autoComplete='off'
        name='createPost'
        layout='vertical'
        onFinish={onSubmit}
        form={form}
      >
        <Row gutter={24}>
          <Col span={16}>
            <PageSection>
              <Typography.Title level={5}>New post</Typography.Title>

              <Form.Item
                label='Title'
                name='title'
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
                <Input />
              </Form.Item>
              <Form.Item
                label="Excerpt"
                name="excerpt"
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
                <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
              </Form.Item>

              <Divider />
              <Editor body={body} onChange={updateBody} />
            </PageSection>
          </Col>

          <Col span={8}>
            <PageSection isSticky>
              <Typography.Title level={5}>Publish</Typography.Title>

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
                <Select placeholder='Select' onChange={e => setFindSubCategories(e)}>
                  {categories.map(c => (
                    <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {!!findSubCategories &&
                <Form.Item
                  label="Sub categories"
                  name="subCategories"
                  rules={[
                    {
                      required: true,
                      message: 'This field is required'
                    }
                  ]}
                >
                  <Select placeholder="Select">
                    {subCategories.filter(f => f.category_id === findSubCategories).map(s => (
                      <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              }
              <div>
                <Typography.Text type="secondary"><CalendarOutlined /> Publish immediatly or</Typography.Text>
                <DatePicker 
                  style={{ marginLeft: '.5rem' }} 
                  showTime
                  disabledDate={disableDate}
                  onChange={(value, dateString) => setPublishTime(dateString)}
                />
              </div>
              <Row style={{ marginTop: rem(16), marginBottom: rem(20) }}>
                <Col span={3}>
                  <Switch defaultChecked onChange={e => setComments(e)} />
                </Col>
                <Col span={16}>
                  <Typography.Text>Comments: {commentsAllowed ? 'Opened' : 'Closed'}</Typography.Text>
                </Col>
              </Row>
              <Row style={{ marginTop: rem(16), marginBottom: rem(20) }}>
                <Col span={3}>
                  <Switch defaultChecked onChange={e => setPublished(e)} />
                </Col>
                <Col span={16}>
                  <Typography.Text>Status: {published ? 'Public' : 'Draft'}</Typography.Text>
                </Col>
              </Row>

              <Button
                type="primary"
                htmlType='submit'
              >
                Publish
              </Button>
            </PageSection>
          </Col>
        </Row>
      </Form>
    </>
  )
}

CreatePost.getLayout = page => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps() {
  try {
    const categories = await prisma.category.findMany({
      where: { published: true, visible: true },
      select: { id: true, name: true } 
    })
    const subCategories = await prisma.subCategory.findMany({
      where: { published: true, visible: true },
      select: { id: true, name: true, category_id: true }
    })

    return {
      props: {
        categories: jsonify(categories),
        subCategories: jsonify(subCategories)
      }
    }
  } catch (e) {
    throw new Error(e)
  }
}