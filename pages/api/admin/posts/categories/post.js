import { getSession } from "next-auth/react"

import { db } from "utils/db"
import slugify from "utils/slugify"

const prisma = db

export default async function post(req, res) {
  try {
    const session = await getSession({ req })

    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' })
    }

    const { name, slug, description, color, published, filename, filetype } = req.body
    if (!name || !name.replace(/\s/g, '').length || !slug || !slug.replace(/\s/g, '').length || !color) {
      return res.status(400).json({ message: 'Invalid fields' })
    }
    
    if (!!filename) {
      if (filetype !== "image/jpeg" && filetype !== "image/jpg" && filetype !== "image/png") {
        return res.status(400).json({ message: 'The image must be .jpeg, .jpg or .png' })
      }
    }
    
    const categories = await prisma.category.findMany()
    const duplicate = categories.find(c => c.name === name)
    if (duplicate) {
      return res.status(400).json({ message: 'This category already exists' })
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: slugify(slug),
        description,
        color,
        published,
        user_id: session.user.id,
        featuredImage: filename
      }
    })
    res.status(201).json(category)
  } catch (e) {
    return res.status(500).json({ message: new Error(e).message })
  }

  res.end()
}