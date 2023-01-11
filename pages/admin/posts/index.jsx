import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Row, Col, Typography, Breadcrumb, Input, Switch, Button, List, Pagination, Modal } from 'antd'
import { DeleteOutlined, EyeOutlined, EyeInvisibleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import PageSection from "components/admin/commons/pageSection/PageSection"
import AdminLayout from "components/admin/adminLayout/AdminLayout"
import { db } from 'utils/db'
import { jsonify } from 'utils/utils'

export default function HomePost({ posts }) {
  const [datas, setDatas] = useState(posts)
  console.log(posts)

  return (
    <>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <Breadcrumb.Item><Link href="/admin">Admin</Link></Breadcrumb.Item>
        <Breadcrumb.Item>Posts</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={24}>
        <Col span={24}>
          <PageSection>
            <Typography.Title level={5}>{datas.length} Post{datas.length > 1 ? 's' : ''}</Typography.Title>
          </PageSection>
        </Col>
      </Row>
    </>
  )
}

HomePost.getLayout = page => <AdminLayout>{page}</AdminLayout>

export async function getServerSideProps() {
  try {
    const posts = await db.post.findMany({
      where: { visible: true },
      include : {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return {
      props: {
        posts: jsonify(posts)
      }
    }
  } catch (e) {
    throw new Error(e)
  }
}