import { Request, Response } from "express";
import prisma from "../config/database";

export const expenses = async (req: Request, res: Response) => {
    try {
      console.log("Fetching expenses...");
      const expenses = await prisma.expense.findMany({
        orderBy: {
          expense_date: "desc",
        },
      });
      res.json(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({
        error: "Unable to fetch expenses",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
