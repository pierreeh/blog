import { getSession } from "next-auth/react"

import slugify from "utils/slugify"
import { db } from "utils/db"

const prisma = db

export default async function post(req, res) {
  try {
    const session = await getSession({ req })

    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' })
    }

    const { title, slug, excerpt, body, categoryId, tags, commentsAllowed, publishTime, published } = req.body
    if (
      !title || !title.replace(/\s/g, '').length
      || !slug || !slug.replace(/\s/g, '').length
      || !excerpt || !excerpt.replace(/\s/g, '').length
      || !categoryId || !categoryId.replace(/\s/g, '').length
    ) {
      return res.status(400).json({ message: 'Invalid fields' })
    }

    const tagsPost = tags.length && await prisma.tagsPost.createMany({
      data: tags.map(t => {
        return {
          post_id: '',
          tag_id: t
        }
      })
    })
  } catch (e) {
    return res.status(500).json({ message: new Error(e).message })
  }

  res.end()
}