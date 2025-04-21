import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  try {
    switch (method) {
      case "GET": {
        const prisma = new PrismaClient();
        const transactions = await prisma.transaction.findMany();
        return res.status(200).json(transactions);
      }

      case "POST": {
        const { transactions } = req.body;
        try {
          const prisma = new PrismaClient();
          await prisma.transaction.createMany({
            data: transactions,
          });
        } catch (error) {
          console.error("Error uploading transactions:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(201).json({
          message: "Transactions uploaded successfully",
        });
      }

      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: `Method ${method} not allowed` });
      }
    }
  } catch (error) {
    console.error("Error querying the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
