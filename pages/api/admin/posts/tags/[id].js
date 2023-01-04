import { getSession } from "next-auth/react"

import { db } from "utils/db"
import { dateFormated } from "utils/utils"

const prisma = db

export default async function patch(req, res) {
  const session = await getSession({ req })
  try {
    if (req.method !== "PATCH") {
      return res.status(405).json({ message: "Method not allowed" })
    }

    const { name, published } = req.body
    if (!name || !name.replace(/\s/g, '').length) {
      return res.status(400).json({ message: "Invalid fields" })
    }

    const tag = await prisma.tag.update({
      where: { id: req.query.id },
      data: {
        name,
        published,
        updated_at: dateFormated,
        user_id: session.user.id
      }
    })
    res.status(200).json(tag)
  } catch (e) {
    return res.status(500).json({ message: new Error(e).maessage })
  }

  res.end()
}