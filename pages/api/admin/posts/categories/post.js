import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"

import slugify from "utils/slugify"

const prisma = new PrismaClient()

export default async function post(req, res) {
  const session = await getSession({ req })

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, slug, description, published } = req.body

    if (!name || !name.replace(/\s/g, '').length || !slug || !slug.replace(/\s/g, '').length) {
      return res.status(400).json({ message: 'Invalid fields' })
    }
    console.log(name, slug, description, published)
    const postCategory = await prisma.postCategory.create({
      data: {
        name,
        slug: slugify(slug),
        description,
        published,
        user_id: session.user.id
      }
    })
    res.status(201).json(postCategory)
  } catch (e) {
    return res.status(500).json({ message: new Error(e).message })
  }

  res.end()
}