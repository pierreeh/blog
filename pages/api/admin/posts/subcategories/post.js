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

    const { name, slug, published, categoryId } = req.body
    if (!name || !name.replace(/\s/g, '').length || !slug || !slug.replace(/\s/g, '').length || !categoryId) {
      return res.status(400).json({ message: 'Invalid fields' })
    }

    const tags = await prisma.subCategory.findMany()
    const duplicate = tags.find(t => t.name === name)
    if (duplicate) {
      return res.status(400).json({ message: 'This tag already exists' })
    }

    const subCategories = await prisma.subCategory.create({
      data: {
        name,
        slug: slugify(slug),
        published,
        category_id: categoryId,
        user_id: session.user.id
      }
    })
    res.status(201).json(subCategories)
  } catch (e) {
    return res.status(500).json({ message: new Error(e).message })
  }

  res.end()
}