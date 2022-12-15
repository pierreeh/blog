import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PrismaClient } from "@prisma/client"
import dayjs from 'dayjs'
import { Colorpicker } from 'antd-colorpicker'
import { Row, Col, Typography, Form, Input, Button, Switch, Alert, List, Pagination, Modal, Breadcrumb, Badge } from 'antd'
import { DeleteOutlined, EyeOutlined, EyeInvisibleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import AdminLayout from "components/admin/adminLayout/AdminLayout"
import PageSection from "components/admin/commons/pageSection/PageSection"
import slugify from 'utils/slugify'
import { rem } from 'styles/ClobalStyles.style'
import { jsonify } from 'utils/utils'

const prisma = new PrismaClient()
const pageSize = 24

export default function PostsCategories({ categories }) {
  const router = useRouter()
  const [form] = Form.useForm()
  const [published, setPublished] = useState(true)
  const [error, setError] = useState({ type: '', message: '' })
  const [pages, setPages] = useState({ current: 1, minIndex: 0, maxIndex: pageSize })
  const [searchValue, setSearchValue] = useState('')
  const [datas, setDatas] = useState(categories)
  const nameValue = Form.useWatch('name', form)
  const { confirm } = Modal

  useEffect(() => {
    setDatas(categories.filter(c => c.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())))

    return () => setDatas(categories)
  }, [searchValue, categories])
  
  useEffect(() => {
    if (nameValue) {
      form.setFieldsValue({ slug: slugify(nameValue) })
    }

    return () => form.setFieldsValue({ slug: '' })
  }, [nameValue, form])

  async function onSubmit(data) {
    try {
      const duplicate = categories.find(c => c.name === data.name)
      if (duplicate) {
        setError({ type: 'error', message: 'This category already exists' })
        return false
      }

      const body = JSON.stringify({
        name: data.name,
        slug: slugify(data.slug),
        description: data.description,
        color: data.color,
        published
      })

      const res = await(await fetch('/api/admin/posts/categories/post', {
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

  async function deleteCategory(id, name) {
    try {
      confirm({
        title: `Delete ${name}?`,
        icon: <ExclamationCircleOutlined />,
        async onOk() {
          const res = await(await fetch(`/api/admin/posts/categories/hide/${id}`, { method: 'PATCH' })).json()
          router.reload()
          return res
        },
        onCancel() {}
      })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <Breadcrumb.Item><Link href="/admin">Admin</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Categories</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={24}>
        <Col span={16}>
          <PageSection>
            <Typography.Title level={5}>{datas.length} Categor{datas.length > 1 ? 'ies' : 'y'}</Typography.Title>

            <List 
              header={datas.length > pageSize && <Input placeholder="Find a category" allowClear onChange={e => setSearchValue(e.target.value)} />}
              footer={
                datas.length > pageSize && 
                <Row justify='center'>
                  <Pagination 
                    size='small'
                    pageSize={pageSize}
                    onChange={page => setPages({ current: page, minIndex: (page - 1) * pageSize, maxIndex: page * pageSize })}
                    current={pages.current}
                    total={datas.length}
                  />
                </Row>
              }
              bordered
              dataSource={datas}
              renderItem={(cat, i) => {
                return (
                  i >= pages.minIndex && i < pages.maxIndex &&
                  <List.Item
                    actions={[
                      <Button key={cat.id} onClick={() => deleteCategory(cat.id, cat.name)} type='text' htmlType='button'><DeleteOutlined /></Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={<><Badge color={cat.color} /> <Link href={`/admin/posts/categories/${cat.id}`}>{cat.name}</Link></>}
                      description={
                        <Typography.Text type='secondary'>
                          {!!cat.published 
                            ? <EyeOutlined style={{ marginRight: '.5rem' }} /> 
                            : <EyeInvisibleOutlined style={{ marginRight: '.5rem' }} />} 
                            {`${cat.updated_at > cat.created_at 
                            ? `Updated ${dayjs(cat.updated_at).format('ddd MMMM YYYY[,] hh[:] mm a')}` 
                            : `Created ${dayjs(cat.created_at).format('ddd MMMM YYYY[,] hh[:] mm a')}`} by ${cat.user.name}`
                          }
                        </Typography.Text>
                      }
                    />
                  </List.Item>
                )
              }}
            />
          </PageSection>
        </Col>

        <Col span={8}>
          <PageSection isSticky>
            <Typography.Title level={5}>New Category</Typography.Title>

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
              name='createCategory'
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

PostsCategories.getLayout = page => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps() {
  try {
    const postsCategories = await prisma.postCategory.findMany({
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
        categories: jsonify(postsCategories)
      }
    }
  } catch (e) {
    throw new Error(e)
  }
}