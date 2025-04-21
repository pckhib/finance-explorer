import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query; // Extract the id from the URL

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing ID" });
  }

  try {
    switch (method) {
      case "PUT": {
        const prisma = new PrismaClient();
        const data = req.body;
        const result = await prisma.transaction.update({
          where: { id: Number(id) },
          data,
        });
        return res.status(200).json(result);
      }

      default: {
        res.setHeader("Allow", ["PUT"]);
        return res.status(405).json({ error: `Method ${method} not allowed` });
      }
    }
  } catch (error) {
    console.error("Error querying the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
