import Layout from "components/layout/Layout"
import { withGlobalData } from "hoc/withGlobalData"

export default function Home({ categories }) {
  return (
    <Layout categories={categories}>Home</Layout>
  )
}

export const getStaticProps = withGlobalData(async () => {
  return {
    props: {
      test: 'test'
    }
  }
})