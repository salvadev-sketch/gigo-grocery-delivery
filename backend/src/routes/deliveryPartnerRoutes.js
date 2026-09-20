import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { requirePartnerAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const partner = await prisma.deliveryPartner.findUnique({ where: { email } });
    if (!partner || !partner.isActive) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, partner.password);
    if (!match) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: partner.id, role: "partner" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, partner: { id: partner.id, name: partner.name, vehicleType: partner.vehicleType } });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

router.get("/orders", requirePartnerAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { deliveryPartnerId: req.partner.id },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true, phone: true } } },
  });
  res.json(orders);
});

// PATCH /api/delivery-partners/orders/:id/status — e.g. Packed, Out for Delivery, Cancelled (+ optional reason)
router.patch("/orders/:id/status", requirePartnerAuth, async (req, res) => {
  try {
    const { status, reason } = req.body;
    const order = await prisma.order.findFirst({ where: { id: req.params.id, deliveryPartnerId: req.partner.id } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
    history.push({ status, at: new Date().toISOString(), ...(reason ? { reason } : {}) });

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status, statusHistory: history },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
});

// POST /api/delivery-partners/orders/:id/deliver — requires the customer's OTP
router.post("/orders/:id/deliver", requirePartnerAuth, async (req, res) => {
  try {
    const { otp } = req.body;
    const order = await prisma.order.findFirst({ where: { id: req.params.id, deliveryPartnerId: req.partner.id } });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.deliveryOtp !== otp) return res.status(400).json({ message: "Incorrect OTP" });

    const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
    history.push({ status: "Delivered", at: new Date().toISOString() });

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: "Delivered", statusHistory: history },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to confirm delivery", error: err.message });
  }
});

// PATCH /api/delivery-partners/orders/:id/location — live tracking updates
router.patch("/orders/:id/location", requirePartnerAuth, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const order = await prisma.order.findFirst({ where: { id: req.params.id, deliveryPartnerId: req.partner.id } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { liveLocation: { lat, lng, updatedAt: new Date().toISOString() } },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update location", error: err.message });
  }
});

export default router;
