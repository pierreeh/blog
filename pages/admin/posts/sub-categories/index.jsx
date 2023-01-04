import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dayjs from 'dayjs'
import { Row, Col, Typography, Form, Input, Button, Switch, Alert, List, Pagination, Modal, Breadcrumb, Select, Badge } from 'antd'
import { DeleteOutlined, EyeOutlined, EyeInvisibleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import { db } from 'utils/db'
import AdminLayout from "components/admin/adminLayout/AdminLayout"
import PageSection from "components/admin/commons/pageSection/PageSection"
import { rem } from 'styles/ClobalStyles.style'
import slugify from 'utils/slugify'
import { jsonify } from 'utils/utils'

const prisma = db
const pageSize = 24

export default function PostsSubCategories({ subCategories, categories }) {
  const router = useRouter()
  const [form] = Form.useForm()
  const [published, setPublished] = useState(true)
  const [error, setError] = useState({ type: '', message: '' })
  const [pages, setPages] = useState({ current: 1, minIndex: 0, maxIndex: pageSize })
  const [searchValue, setSearchValue] = useState('')
  const [datas, setDatas] = useState(subCategories)
  const nameValue = Form.useWatch('name', form)
  const { confirm } = Modal
  
  useEffect(() => {
    if (nameValue) {
      form.setFieldsValue({ slug: slugify(nameValue) })
    }

    return () => form.setFieldsValue({ slug: '' })
  }, [nameValue, form])

  useEffect(() => {
    setDatas(subCategories.filter(c => c.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())))

    return () => setDatas(subCategories)
  }, [searchValue, subCategories])

  async function onSubmit(data) {
    try {
      const duplicate = subCategories.find(t => t.name === data.name)
      if (duplicate) {
        setError({ type: 'error', message: 'This sub category already exists' })
        return false
      }

      const body = JSON.stringify({
        name: data.name,
        slug: slugify(data.slug),
        categoryId: data.categoryId, 
        published
      })

      const res = await(await fetch(`/api/admin/posts/subcategories/post`, {
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

  async function deleteSubCat(id, name) {
    try {
      confirm({
        title: `Delete ${name}?`,
        icon: <ExclamationCircleOutlined />,
        async onOk() {
          const res = await(await fetch(`/api/admin/posts/subcategories/hide/${id}`, { method: 'PATCH' })).json()
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
        <Breadcrumb.Item>Sub Categories</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={24}>
        <Col span={16}>
          <PageSection>
            <Typography.Title level={5}>{datas.length} Sub Categor{datas.length > 1 ? 'ies' : 'y'}</Typography.Title>

            <List 
              header={datas.length > pageSize && <Input placeholder="Find a sub category" allowClear onChange={e => setSearchValue(e.target.value)} />}
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
              renderItem={(subCat, i) => {
                return (
                  i >= pages.minIndex && i < pages.maxIndex &&
                  <List.Item
                    actions={[
                      <Button key={subCat.id} onClick={() => deleteSubCat(subCat.id, subCat.name)} type='text' htmlType='button'><DeleteOutlined /></Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={<><Badge color={subCat.category.color} /> <Link href={`/admin/posts/sub-categories/${subCat.id}`}>{subCat.name}</Link></>}
                      description={
                        <Typography.Text type='secondary'>
                          {!!subCat.published 
                            ? <EyeOutlined style={{ marginRight: '.5rem' }} /> 
                            : <EyeInvisibleOutlined style={{ marginRight: '.5rem' }} />} 
                            {`${subCat.updated_at > subCat.created_at 
                            ? `Updated ${dayjs(subCat.updated_at).format('ddd MMMM YYYY[,] hh[:] mm a')}` 
                            : `Created ${dayjs(subCat.created_at).format('ddd MMMM YYYY[,] hh[:] mm a')}`} by ${subCat.user.name}`
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
            <Typography.Title level={5}>New Sub Category</Typography.Title>

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
                label="Parent"
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

PostsSubCategories.getLayout = page => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps() {
  try {
    const subCategories = await prisma.subCategory.findMany({
      where: { visible: true },
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            name: true
          }
        },
        category: {
          select: {
            name: true,
            color: true
          }
        }
      }
    })

    const categories = await prisma.category.findMany({
      where: { visible: true, published: true },
      select: {
        id: true,
        name: true,
        color: true
      }
    })

    return {
      props: {
        subCategories: jsonify(subCategories),
        categories: jsonify(categories)
      }
    }
  } catch (e) {
    throw new Error(e)
  }
}