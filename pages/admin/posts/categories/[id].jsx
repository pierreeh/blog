import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { PrismaClient } from "@prisma/client"
import { Colorpicker } from 'antd-colorpicker'
import { Breadcrumb, Row, Col, Typography, Form, Input, Button, Switch, Alert } from "antd"

import AdminLayout from "components/admin/adminLayout/AdminLayout"
import PageSection from "components/admin/commons/pageSection/PageSection"
import { jsonify } from "utils/utils"
import { rem } from "styles/ClobalStyles.style"

const prisma = new PrismaClient()

export default function EditCategory({ category, categories }) {
  const router = useRouter()
  const [form] = Form.useForm()
  const [published, setPublished] = useState(category.published)
  const [error, setError] = useState({ type: '', message: '' })

  async function onSubmit(data) {
    try {
      const body = JSON.stringify({
        name: data.name,
        color: data.color,
        description: data.description,
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
    const postCategory = await prisma.postCategory.findFirst({ where: { id: context.query.id } })
    const categories = await prisma.postCategory.findMany({ select: { name: true } })

    return {
      props: {
        category: jsonify(postCategory),
        categories: jsonify(categories)
      }
    }
  } catch (e) {
    throw new Error(e)
  }
}