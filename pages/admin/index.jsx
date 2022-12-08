import AdminLayout from "components/admin/adminLayout/AdminLayout"

export default function AdminHome() {
  return (
    <section>Admin</section>
  )
}

AdminHome.getLayout = page => <AdminLayout>{page}</AdminLayout>