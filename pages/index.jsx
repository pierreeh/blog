import Layout from "components/layout/Layout"

export default function Home() {
  return (
    <div>Home</div>
  )
}

Home.getLayout = page => <Layout>{page}</Layout>