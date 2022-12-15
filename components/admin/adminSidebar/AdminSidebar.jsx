import { useRouter } from "next/router"
import Link from "next/link"
import { Menu } from "antd"
import { HomeOutlined, PushpinOutlined, CopyOutlined, UserOutlined } from '@ant-design/icons'

const items = [
  {
    key: '/admin',
    label: <Link href='/admin'>Home</Link>,
    icon: <HomeOutlined />
  },
  {
    key: '2',
    label: "Posts",
    path: '/',
    icon: <PushpinOutlined />,
    children: [
      {
        key: '/admin/posts',
        label: <Link href='/admin/posts'>All posts</Link>
      },
      {
        key: '/admin/posts/create',
        label: <Link href='/admin/posts/create'>New post</Link>
      },
      {
        key: '/admin/posts/categories',
        label: <Link href='/admin/posts/categories'>Categories</Link>
      }
      ,
      {
        key: '/admin/posts/tags',
        label: <Link href='/admin/posts/tags'>Tags</Link>
      }
    ]
  },
  {
    key: '/admin/pages',
    label: <Link href='/admin/pages'>Pages</Link>,
    icon: <CopyOutlined />
  },
  {
    key: '/admin/users',
    label: <Link href='/admin/users'>Users</Link>,
    icon: <UserOutlined />
  }
]

export default function AdminSidebar() {
  const router = useRouter()

  return (
    <Menu 
      items={items}
      mode='inline'
      style={{ height: '100%' }}
      defaultSelectedKeys={[router.pathname]}
      defaultOpenKeys={['2']}
      theme="dark"
    />
  )
}