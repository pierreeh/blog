import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"

import { dateFormated } from "utils/utils"

const prisma = new PrismaClient()

export default async function patch(req, res) {
  try {
    const session = await getSession({ req })

    if (req.method !== 'PATCH') {
      return res.status(405).json({ message: 'Method not allowed'})
    }

    const { name, description, published } = req.body
    if (!name || !name.replace(/\s/g, '').length) {
      return res.status(400).json({ message: 'Invalid fields' })
    }

    const patchCategory = await prisma.postCategory.update({
      where: { id: req.query.id },
      data: {
        name,
        description,
        published,
        user_id: session.user.id,
        updated_at: dateFormated
      }
    })
    res.status(200).json(patchCategory)
  } catch (e) {
    return res.status(500).json({ message: new Error(e).message })
  }

  res.end()
}