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

    const { title, slug, excerpt, postBody, categoryId, subCategories, tags, filename, filetype, commentsAllowed, publishTime, published } = req.body
    if (
      !title || !title.replace(/\s/g, '').length
      || !slug || !slug.replace(/\s/g, '').length
      || !excerpt || !excerpt.replace(/\s/g, '').length
      || !categoryId || !categoryId.replace(/\s/g, '').length
      || !subCategories.length
    ) {
      return res.status(400).json({ message: 'Invalid fields' })
    }
    if (!!filename) {
      if (filetype !== "image/jpeg" && filetype !== "image/jpg" && filetype !== "image/png") {
        return res.status(400).json({ message: 'The image must be .jpeg, .jpg or .png' })
      }
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug: slugify(slug),
        featured_image: filename,
        excerpt,
        body: postBody,
        publish_time: publishTime,
        comments_allowed: commentsAllowed,
        published,
        user_id: session.user.id,
        category_id: categoryId
      }
    })

    const postSubCategories = await prisma.postSubCategory.createMany({
      data: subCategories.map(s => {
        return {
          post_id: post.id,
          subcategory_id: s
        }
      })
    })

    const postTags = await prisma.postTag.createMany({
      data: tags.map(t =>{
        return {
          post_id: post.id,
          tag_id: t
        }
      })
    })

    res.status(201).json([post, postSubCategories, postTags])
  } catch (e) {
    return res.status(500).json({ message: new Error(e).message })
  }

  res.end()
}