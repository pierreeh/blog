import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { Colorpicker } from 'antd-colorpicker'
import ImgCrop from 'antd-img-crop'
import { Breadcrumb, Row, Col, Typography, Form, Input, Button, Switch, Alert, Upload } from "antd"
import { UploadOutlined } from '@ant-design/icons'

import { db } from "utils/db"
import AdminLayout from "components/admin/adminLayout/AdminLayout"
import PageSection from "components/admin/commons/pageSection/PageSection"
import { jsonify } from "utils/utils"
import slugify from "utils/slugify"
import { rem } from "styles/ClobalStyles.style"

const prisma = db

export default function EditCategory({ category }) {
  const router = useRouter()
  const [form] = Form.useForm()
  const [published, setPublished] = useState(category.published)
  const [error, setError] = useState({ type: '', message: '' })
  const [fileName, setFileName] = useState(null)

  async function onSubmit(data) {
    try {
      let featuredImage = category.featuredImage[0]?.name
      let featuredImageType = category.featuredImage[0]?.type

      if (!featuredImage && !!fileName?.file?.name) {
        featuredImage = encodeURIComponent(fileName?.file?.name)
      }

      if (fileName?.file?.status === "removed") {
        featuredImage = null
        featuredImageType = null
        const filename = encodeURIComponent(fileName?.file?.name)
        const key = `categories/${slugify(category.slug)}/${filename}`
        await fetch(`/api/admin/medias/delete?key=${key}`, { method: 'DELETE' })
      }

      if (!!fileName?.file?.name && fileName?.file?.name !== category.featuredImage[0]?.name) {
        const filename = encodeURIComponent(fileName?.file?.name)
        const fileType = fileName?.file?.type
        const key = `categories/${slugify(category.slug)}/${filename}`
        await fetch(`/api/admin/medias/delete?key=${`categories/${slugify(category.slug)}/${category.featuredImage[0]?.name}`}`, { method: 'DELETE' })

        featuredImage = filename
        featuredImageType = fileType

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
        name: data.name,
        color: data.color,
        description: data.description,
        filename: featuredImage, 
        filetype: featuredImageType,
        published
      })

      const res = await(await fetch(`/api/admin/posts/categories/${router.query.id}`, {
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
      
      router.push('/admin/posts/categories')
      return res
    } catch (e) {
      console.error(e)
    }
  }

  function dummyRequest({ onSuccess }) {
    setTimeout(() => { onSuccess("ok") }, 0)
  }

  return (
    <>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <Breadcrumb.Item><Link href="/admin">Admin</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link href="/admin/posts/categories">Categories</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{category.name}</Breadcrumb.Item>
      </Breadcrumb>
      
      <Row gutter={24}>
        <Col span={24}>
          <PageSection>
            <Col span={12} offset={6}>
              <Typography.Title level={5}>Edit {category.name}</Typography.Title>

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
                name='editCategory'
                layout='vertical'
                onFinish={onSubmit}
                form={form}
                initialValues={{
                  name: category.name,
                  slug: category.slug,
                  color: category.color || "",
                  description: category.description,
                  published: category.published
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
                  label="Color"
                  name='color'
                  rules={[
                    {
                      required: true,
                      message: 'This field is required'
                    }
                  ]}
                >
                  <Colorpicker 
                    onColorResult={color => color.hex}
                    picker='SliderPicker'
                  />
                </Form.Item>
                <Form.Item
                  label="Description"
                  name='description'
                >
                  <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
                </Form.Item>
                <ImgCrop grid aspect={16/9}>
                <Upload
                  maxCount={1}
                  listType="picture"
                  customRequest={dummyRequest}
                  onChange={e => setFileName(e)}
                  defaultFileList={!!category.featuredImage && [...category.featuredImage]}
                  accept="image/jpg, image/jpeg, image/png"
                >
                  <Button icon={<UploadOutlined />}>Featured Image</Button>
                </Upload>
              </ImgCrop>

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
                  Save
                </Button>
              </Form>
            </Col>
          </PageSection>
        </Col>
      </Row>
    </>
  )
}

EditCategory.getLayout = page => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps(context) {
  try {
    const patchCategory = await prisma.category.findFirst({ where: { id: context.query.id } })
    const category = {
      ...patchCategory,
      featuredImage: !!patchCategory.featuredImage && [{
        uid: '0',
        type: `image/${patchCategory.featuredImage.split('.').slice(1).join('.')}`,
        name: patchCategory.featuredImage,
        thumbUrl: `${process.env.S3_BUCKET_URL}/categories/${patchCategory.slug}/${patchCategory.featuredImage}`
      }]
    }

    return {
      props: {
        category: jsonify(category),
      }
    }
  } catch (e) {
    throw new Error(e)
  }
}