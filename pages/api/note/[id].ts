// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const noteId = req.query.id as string;

  try {
    if (req.method === "DELETE") {
      const note = await prisma.note.delete({
        where: {
          id: noteId,
        },
      });
      return res.status(200).json({ message: "Note deleted!", note });
    }

    if (req.method === "PUT") {
      const { title, content } = req.body;

      const note = await prisma.note.update({
        where: {
          id: noteId,
        },
        data: {
          title,
          content,
        },
      });
      return res.status(200).json({ message: "Note updated!", note });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Note not found." });
  }
}
