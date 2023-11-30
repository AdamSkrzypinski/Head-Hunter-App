import { Router } from "express";

export const adminRouter = Router();

adminRouter.get("/", async (req, res) => {
  res.json({ message: "Dzień dobry, zapraszam do logowania" });
});
