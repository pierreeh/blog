import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dayjs from 'dayjs'
import { PrismaClient } from "@prisma/client"
import { Row, Col, Typography, Form, Input, Select, Button, Switch, Alert, DatePicker, Breadcrumb } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'

import PageSection from "components/admin/commons/pageSection/PageSection"
import AdminLayout from "components/admin/adminLayout/AdminLayout"
import { rem } from 'styles/ClobalStyles.style'
import { jsonify } from 'utils/utils'
import slugify from 'utils/slugify'

const prisma = new PrismaClient()

export default function CreatePost({ categories, tags }) {
  const [form] = Form.useForm()
  const router = useRouter()
  const [error, setError] = useState({ type: '', message: '' })
  const [published, setPublished] = useState(true)
  const [commentsAllowed, setComments] = useState(true)
  const [publishTime, setPublishTime] = useState()
  const nameValue = Form.useWatch('title', form)
  // console.log(categories, tags)

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
        tags: data.tags,
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
            <Breadcrumb style={{ marginBottom: '1rem' }}>
              <Breadcrumb.Item><Link href="/admin">Admin</Link></Breadcrumb.Item>
              <Breadcrumb.Item>New post</Breadcrumb.Item>
            </Breadcrumb>
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
            <Form.Item
              label="Post"
              name="body"
            >
              <Input.TextArea />
            </Form.Item>
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
              <Select placeholder='Select'>
                {categories.map(c => (
                  <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Tags"
              name="tags"
            >
              <Select
                mode="multiple"
                placeholder="Select"
                style={{ width: '100%' }}
                options={tags.map(t => {
                  return {
                    value: t.id,
                    label: t.name
                  }
                })}
              />
            </Form.Item>
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
                <Typography.Text>Comments: {commentsAllowed ? 'Allowed' : 'Not allowed'}</Typography.Text>
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
  )
}

CreatePost.getLayout = page => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps() {
  try {
    const categories = await prisma.postCategory.findMany({
      where: { published: true, visible: true },
      select: { id: true, name: true } 
    })
    const tags = await prisma.postTag.findMany({
      where: { published: true, visible: true },
      select: { id: true, name: true }
    })

    return {
      props: {
        categories: jsonify(categories),
        tags: jsonify(tags)
      }
    }
  } catch (e) {
    throw new Error(e)
  }
}