import { getSession } from "next-auth/react"
import { PrismaClient } from "@prisma/client"

import { dateFormated } from "utils/utils"

const prisma = new PrismaClient()

export default async function patch(req, res) {
  try {
    const session = await getSession({ req })

    if (req.method !== 'PATCH') {
      return res.status(405).json({ message: 'Method not allowed' })
    }

    const { name, published } = req.body
    if (!name || !name.replace(/\s/g, '').length) {
      return res.status(400).json({ message: 'Invalid fields' })
    }

    const tags = await prisma.postTag.findMany({ select: { name: true } })
    const duplicate = tags.find(t => t.name === name)
    if (duplicate) {
      return res.status(400).json({ message: 'This tag already exists' })
    }

    const patchTag = await prisma.postTag.update({
      where: { id: req.query.id },
      data: {
        name,
        published,
        updated_at: dateFormated,
        user_id: session.user.id
      }
    })
    res.status(200).json(patchTag)
  } catch (e) {
    return res.status(500).json({ message: new Error(e).message })
  }

  res.end()
}