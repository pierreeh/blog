import { db } from "utils/db"
import { jsonify } from "utils/utils"

export const withGlobalData = getStaticProps => async (...props) => {
  const res = await getStaticProps(...props)
  const staticProps = res?.props || {}

  const categories = await db.category.findMany({
    where: { visible: true, published: true },
    select: {
      id: true,
      name: true,
      slug: true,
      color: true
    }
  })

  return {
    ...res,
    props: {
      ...staticProps,
      categories: jsonify(categories)
    }
  }
}