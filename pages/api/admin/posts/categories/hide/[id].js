import { getSession } from "next-auth/react"

import { db } from "utils/db"
import { dateFormated } from "utils/utils"

const prisma = db

export default async function patch(req, res) {
  try {
    const session = await getSession({ req })

    if (req.method !== 'PATCH') {
      return res.status(405).json({ message: 'Method not allowed' })
    }

    const category = await prisma.category.findFirst({ where: { id: req.query.id } })
    const hideCategory = await prisma.category.update({
      where: { id: req.query.id },
      data: {
        visible: !category.visible,
        updated_at: dateFormated,
        user_id: session.user.id
      }
    })

    res.status(200).json(hideCategory)
  } catch (e) {
    return res.status(500).json({ message: new Error(e).message })
  }

  res.end()
}