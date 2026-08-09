import express from "express";
import { prisma } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const addresses = await prisma.address.findMany({ where: { userId: req.user.id } });
  res.json(addresses);
});

router.post("/", async (req, res) => {
  try {
    if (req.body.isDefault) {
      await prisma.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } });
    }
    const address = await prisma.address.create({ data: { ...req.body, userId: req.user.id } });
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: "Failed to add address", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.address.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
    res.json({ message: "Address removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove address", error: err.message });
  }
});

export default router;
