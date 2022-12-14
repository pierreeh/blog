import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"

import slugify from "utils/slugify"

const prisma = new PrismaClient()

export default async function(req, res) {
  try {
    const session = await getSession({ req })
    
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' })
    }

    const { name, slug, published } = req.body
    if (!name || !name.replace(/\s/g, '').length || !slug || !slug.replace(/\s/g, '').length) {
      return res.status(400).json({ message: 'Invalid fields' })
    }

    const tags = await prisma.postTag.findMany()
    const duplicate = tags.find(t => t.name === name)
    if (duplicate) {
      return res.status(400).json({ message: 'This tag already exists' })
    }

    const postTags = await prisma.postTag.create({
      data: {
        name,
        slug: slugify(slug),
        published,
        user_id: session.user.id
      }
    })
    res.status(201).json(postTags)
  } catch (e) {
    return res.status(500).json({ message: new Error(e).message })
  }

  res.end()
}