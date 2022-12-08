import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"

import { dateFormated } from "utils/utils"

const prisma = new PrismaClient()

export default async function Hide(req, res) {
  const session = await getSession({ req })

  try {
    if (req.method !== 'PATCH') {
      return res.status(405).json({ message: 'Method not allowed' })
    }

    const category = await prisma.postCategory.findFirst({ where: { id: req.query.id } })
    const hideCategory = await prisma.postCategory.update({
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