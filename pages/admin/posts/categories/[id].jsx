import { useEffect, useState } from "react"
import { PrismaClient } from "@prisma/client"
import { Row, Col, Typography, Form, Input, Button, Switch, Alert } from "antd"

import AdminLayout from "components/admin/adminLayout/AdminLayout"
import PageSection from "components/admin/commons/pageSection/PageSection"
import { jsonify } from "utils/utils"
import slugify from "utils/slugify"
import { rem } from "styles/ClobalStyles.style"

const prisma = new PrismaClient()

export default function EditCategory({ category }) {
  const [form] = Form.useForm()
  const nameValue = Form.useWatch('name', form)
  const [published, setPublished] = useState(true)
  console.log(category)

  useEffect(() => {
    if (nameValue) {
      form.setFieldsValue({ slug: slugify(nameValue) })
    }

    return () => form.setFieldsValue({ slug: '' })
  }, [nameValue, form])

  async function onSubmit(data) {
    console.log(data)
  }

  return (
    <Row gutter={24}>
      <Col span={24}>
        <PageSection>
          <Col span={12} offset={6}>
            <Typography.Title level={5}>Edit {category.name}</Typography.Title>

            <Form
              autoComplete='off'
              name='editCategory'
              layout='vertical'
              onFinish={onSubmit}
              form={form}
              initialValues={{
                name: category.name,
                slug: category.slug,
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
              <Form.Item
                label="Description"
                name='description'
              >
                <Input.TextArea />
              </Form.Item>
              <Row style={{ marginTop: rem(20), marginBottom: rem(20) }}>
                <Col span={2}>
                  <Switch defaultChecked onChange={e => setPublished(e)} />
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
  )
}

EditCategory.getLayout = page => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps(context) {
  try {
    const postCategory = await prisma.postCategory.findFirst({ where: { id: context.query.id } })

    return {
      props: {
        category: jsonify(postCategory)
      }
    }
  } catch (e) {
    throw new Error(e)
  }
}