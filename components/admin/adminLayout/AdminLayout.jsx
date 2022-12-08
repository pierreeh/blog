import { Layout } from 'antd'

import AdminHeader from 'components/admin/adminHeader/AdminHeader'
import AdminSidebar from 'components/admin/adminSidebar/AdminSidebar'
import { StyledLayout, StyledContent } from "./AdminLayout.style"

export default function AdminLayout({ children }) {
  const { Header, Sider } = Layout

  return (
    <StyledLayout>
      <Header>
        <AdminHeader />
      </Header>
      <Layout>
        <Sider>
          <AdminSidebar />
        </Sider>
        <StyledContent>{children}</StyledContent>
      </Layout>
    </StyledLayout>
  )
}