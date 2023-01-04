import { getSession } from "next-auth/react"

import { db } from "utils/db"
import slugify from "utils/slugify"

const prisma = db

export default async function post(req, res) {
  try {
    const session = await getSession({ req })

    if (req.method !== 'POST') {
      return res.status(405).json({ message: "Method not allowed" })
    }

    const { name, slug, published } = req.body
    if (!name || !name.replace(/\s/g, '').length || !slug || !slug.replace(/\s/g, '').length) {
      return res.status(400).json({ message: "Invalid fields" })
    }

    const tags = await prisma.tag.findMany()
    const duplicate = tags.find(t => t.name === name)
    if (duplicate) {
      return res.status(400).json({ message: 'This tag already exists' })
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug: slugify(slug),
        published,
        user_id: session.user.id
      }
    })
    res.status(201).json(tag)
  } catch (e) {
    return res.status(500).json({ message: new Error(e).message })
  }

  res.end()
}