import { getSession } from "next-auth/react"

import { db } from "utils/db"
import { dateFormated } from "utils/utils"

const prisma = db

export default async function patch(req, res) {
  try {
    const session = await getSession({ req })

    if (req.method !== 'PATCH') {
      return res.status(405).json({ message: 'Method not allowed'})
    }

    const { name, color, description, published, filename, filetype } = req.body
    if (!name || !name.replace(/\s/g, '').length || !color) {
      return res.status(400).json({ message: 'Invalid fields' })
    }

    if (!!filename) {
      if (filetype !== "image/jpeg" && filetype !== "image/jpg" && filetype !== "image/png") {
        return res.status(400).json({ message: 'The image must be .jpeg, .jpg or .png' })
      }
    }

    const patchCategory = await prisma.category.update({
      where: { id: req.query.id },
      data: {
        name,
        color,
        description,
        published,
        user_id: session.user.id,
        updated_at: dateFormated,
        featuredImage: filename
      }
    })
    res.status(200).json(patchCategory)
  } catch (e) {
    return res.status(500).json({ message: new Error(e).message })
  }

  res.end()
}