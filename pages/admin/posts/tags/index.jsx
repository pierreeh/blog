import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dayjs from 'dayjs'
import { PrismaClient } from "@prisma/client"
import { Row, Col, Typography, Form, Input, Button, Switch, Alert, List, Pagination, Modal, Breadcrumb } from 'antd'
import { DeleteOutlined, EyeOutlined, EyeInvisibleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import AdminLayout from "components/admin/adminLayout/AdminLayout"
import PageSection from "components/admin/commons/pageSection/PageSection"
import { rem } from 'styles/ClobalStyles.style'
import slugify from 'utils/slugify'
import { jsonify } from 'utils/utils'

const prisma = new PrismaClient()
const pageSize = 24

export default function PostsTags({ tags }) {
  const router = useRouter()
  const [form] = Form.useForm()
  const [published, setPublished] = useState(true)
  const [error, setError] = useState({ type: '', message: '' })
  const [pages, setPages] = useState({ current: 1, minIndex: 0, maxIndex: pageSize })
  const [searchValue, setSearchValue] = useState('')
  const [datas, setDatas] = useState(tags)
  const nameValue = Form.useWatch('name', form)
  const { confirm } = Modal

  useEffect(() => {
    if (nameValue) {
      form.setFieldsValue({ slug: slugify(nameValue) })
    }

    return () => form.setFieldsValue({ slug: '' })
  }, [nameValue, form])

  useEffect(() => {
    setDatas(tags.filter(c => c.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())))

    return () => setDatas(tags)
  }, [searchValue, tags])

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

      const res = await(await fetch(`/api/admin/posts/tags/post`, {
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

  async function deleteTag(id, name) {
    try {
      confirm({
        title: `Delete ${name}?`,
        icon: <ExclamationCircleOutlined />,
        async onOk() {
          const res = await(await fetch(`/api/admin/posts/tags/hide/${id}`, { method: 'PATCH' })).json()
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
    <Row gutter={24}>
      <Col span={16}>
        <PageSection>
          <Breadcrumb style={{ marginBottom: '1rem' }}>
            <Breadcrumb.Item><Link href="/admin">Admin</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Tags</Breadcrumb.Item>
          </Breadcrumb>
          <Typography.Title level={5}>{datas.length} Tag{datas.length > 1 ? 's' : ''}</Typography.Title>

          <List 
            header={datas.length > pageSize && <Input placeholder="Find a tag" allowClear onChange={e => setSearchValue(e.target.value)} />}
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
            renderItem={(tag, i) => {
              return (
                i >= pages.minIndex && i < pages.maxIndex &&
                <List.Item
                  actions={[
                    <Button key={tag.id} onClick={() => deleteTag(tag.id, tag.name)} type='text' htmlType='button'><DeleteOutlined /></Button>
                  ]}
                >
                  <List.Item.Meta
                    title={<Link href={`/admin/posts/tags/${tag.id}`}>{tag.name}</Link>}
                    description={
                      <>
                        <Typography.Text type='secondary'>
                          {!!tag.published 
                            ? <EyeOutlined style={{ marginRight: '.5rem' }} /> 
                            : <EyeInvisibleOutlined style={{ marginRight: '.5rem' }} />} 
                            {`${tag.updated_at > tag.created_at 
                            ? `Updated ${dayjs(tag.updated_at).format('ddd MMMM YYYY[,] hh[:] mm a')}` 
                            : `Created ${dayjs(tag.created_at).format('ddd MMMM YYYY[,] hh[:] mm a')}`} by ${tag.user.name}`
                          }
                        </Typography.Text>
                      </>
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
  )
}

PostsTags.getLayout = page => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps() {
  try {
    const tags = await prisma.postTag.findMany({
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