import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import dayjs from 'dayjs'
import ImgCrop from 'antd-img-crop'
import { Row, Col, Typography, Form, Input, Select, Button, Switch, Alert, DatePicker, Breadcrumb, Divider, Upload } from 'antd'
import { CalendarOutlined, UploadOutlined } from '@ant-design/icons'

import { db } from 'utils/db'
import PageSection from "components/admin/commons/pageSection/PageSection"
import AdminLayout from "components/admin/adminLayout/AdminLayout"
import { rem } from 'styles/ClobalStyles.style'
import { jsonify } from 'utils/utils'
import slugify from 'utils/slugify'

const TextEditor = dynamic(import('components/admin/commons/textEditor/TextEditor'), { ssr: false })
const prisma = db
const document = [{ type: "p", children: [{ text: "" }] }]

export default function CreatePost({ categories, subCategories, tags }) {
  const [form] = Form.useForm()
  const router = useRouter()
  const [postBody, updatePostBody] = useState(document)
  const [error, setError] = useState({ type: '', message: '' })
  const [published, setPublished] = useState(true)
  const [commentsAllowed, setComments] = useState(true)
  const [publishTime, setPublishTime] = useState()
  const [findSubCategories, setFindSubCategories] = useState()
  const [fileName, setFileName] = useState(null)
  const nameValue = Form.useWatch('title', form)
  
  useEffect(() => {
    if (nameValue) {
      form.setFieldsValue({ slug: slugify(nameValue) })
    }

    return () => form.setFieldsValue({ slug: '' })
  }, [nameValue, form])
  
  async function onSubmit(data) {
    try {
      if (!!fileName && fileName?.file?.status !== "removed") {
        if (fileName?.file?.type !== 'image/jpeg' && fileName?.file?.type !== 'image/jpg' && fileName?.file?.type !== 'image/png') {
          setError({ type: 'error', message: 'The image must be .jpeg, .jpg or .png' })
          return false
        }

        const filename = encodeURIComponent(fileName?.file?.name)
        const fileType = fileName?.file?.type
        const key = `posts/${slugify(data.slug)}/${filename}`
        const files = await fetch(`/api/admin/medias/upload?key=${key}&fileType=${fileType}`)
        const { url, fields } = await files.json()
        const formData = new FormData()

        const file = fileName?.file?.originFileObj
        Object.entries({ ...fields, file }).forEach(([key, value]) => formData.append(key, value))
        await fetch(url, {
          method: 'POST',
          body: formData,
        })
      }

      const body = JSON.stringify({
        title: data.title,
        slug: slugify(data.slug),
        excerpt: data.excerpt,
        postBody,
        categoryId: data.categoryId,
        subCategories: data.subCategories,
        tags: data.tags,
        filename: !fileName?.file?.name || fileName?.file?.status === "removed" ? null : encodeURIComponent(fileName?.file?.name), 
        filetype: !fileName?.file?.status || fileName?.file?.status === "removed" ? null : fileName?.file?.type,
        publishTime,
        commentsAllowed,
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

  function dummyRequest({ onSuccess }) {
    setTimeout(() => { onSuccess("ok") }, 0)
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
              <TextEditor body={postBody} onChange={updatePostBody} />
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
                  <Select placeholder="Select" mode="multiple">
                    {subCategories.filter(f => f.category_id === findSubCategories).map(s => (
                      <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              }
              <Form.Item
                label="Tags"
                name="tags"
              >
                <Select
                  mode="multiple"
                  placeholder="Select"
                  style={{ width: '100%' }}
                  options={tags}
                />
              </Form.Item>

              <div style={{ marginBottom: '1rem' }}>
                <ImgCrop grid aspect={16/9}>
                  <Upload
                    maxCount={1}
                    listType="picture"
                    customRequest={dummyRequest}
                    onChange={e => setFileName(e)}
                    accept="image/jpg, image/jpeg, image/png"
                  >
                    <Button icon={<UploadOutlined />}>Featured Image</Button>
                  </Upload>
                </ImgCrop>
              </div>

              <div>
                <Typography.Text type="secondary"><CalendarOutlined /> Publish immediatly or</Typography.Text>
                <DatePicker 
                  style={{ marginLeft: '.5rem' }}
                  placeholder="Select a date"
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
    const tags = await prisma.tag.findMany({
      where: { published: true, visible: true },
      select: { id: true, name: true }
    })

    const formatedTags = tags.map(t => {
      return {
        value: t.id,
        label: t.name
      }
    })

    return {
      props: {
        categories: jsonify(categories),
        subCategories: jsonify(subCategories),
        tags: jsonify(formatedTags)
      }
    }
  } catch (e) {
    throw new Error(e)
  }
}