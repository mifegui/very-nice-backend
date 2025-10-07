import { Router } from "express";
import { pool } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [ 
      userId,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
