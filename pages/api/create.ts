// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

type NoteData = {
  title: string;
  content: string;
};

type NoteDataRequest = Override<NextApiRequest, { body: NoteData }>;

export default async function handler(
  req: NoteDataRequest,
  res: NextApiResponse
) {
  const { title, content } = req.body;
  try {
    if (title === "" || content === "")
      throw new Error("Please fill all fields!", { cause: "empty" });
    await prisma.note.create({
      data: {
        title,
        content,
      },
    });
    return res.status(200).json({ message: "Note created!" });
  } catch (error) {
    if (error instanceof Error && error.cause === "empty")
      return res.status(400).json({ message: error.message });
    else
      return res
        .status(400)
        .json({ message: "Unknown error! Please try again." });
  }
}
