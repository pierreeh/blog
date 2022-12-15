import AdminLayout from "components/admin/adminLayout/AdminLayout"

export default function HomePost() {
  return (
    <section>Posts</section>
  )
}

HomePost.getLayout = page => <AdminLayout>{page}</AdminLayout>