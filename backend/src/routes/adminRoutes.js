import express from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAdmin);

// GET /api/admin/upload-signature — signed params for direct-to-Cloudinary upload
router.get("/upload-signature", (_req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "gigo-grocery-delivery/products";
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET
  );
  res.json({
    signature,
    timestamp,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
});

router.get("/dashboard", async (_req, res) => {
  const [totalOrders, totalUsers, totalProducts, outOfStock, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lte: 0 } } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);
  res.json({ totalOrders, totalUsers, totalProducts, outOfStock, recentOrders });
});

router.get("/orders", async (_req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      deliveryPartner: { select: { name: true, phone: true } },
    },
  });
  res.json(orders);
});

// PATCH /api/admin/orders/:id/assign — assign a delivery partner to an order
router.patch("/orders/:id/assign", async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;

    const existing = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Order not found" });

    // Order.statusHistory is a Json column, not a Prisma list field, so it
    // has to be read, appended to in JS, and written back in one update.
    const history = Array.isArray(existing.statusHistory) ? existing.statusHistory : [];
    history.push({ status: "Assigned", at: new Date().toISOString() });

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { deliveryPartnerId, status: "Assigned", statusHistory: history },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to assign delivery partner", error: err.message });
  }
});

// PATCH /api/admin/orders/:id/status — manually change an order's status
router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const existing = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: "Order not found" });

    const history = Array.isArray(existing.statusHistory) ? existing.statusHistory : [];
    history.push({ status, at: new Date().toISOString() });

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status, statusHistory: history },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status", error: err.message });
  }
});

router.get("/delivery-partners", async (_req, res) => {
  const partners = await prisma.deliveryPartner.findMany({ orderBy: { createdAt: "desc" } });
  res.json(partners);
});

router.post("/delivery-partners", async (req, res) => {
  try {
    const { name, email, password, phone, vehicleType } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const partner = await prisma.deliveryPartner.create({
      data: { name, email, password: hashed, phone, vehicleType: vehicleType || "bike" },
    });
    res.status(201).json(partner);
  } catch (err) {
    res.status(500).json({ message: "Failed to add delivery partner", error: err.message });
  }
});

router.patch("/delivery-partners/:id/toggle", async (req, res) => {
  try {
    const partner = await prisma.deliveryPartner.findUnique({ where: { id: req.params.id } });
    if (!partner) return res.status(404).json({ message: "Delivery partner not found" });

    const updated = await prisma.deliveryPartner.update({
      where: { id: req.params.id },
      data: { isActive: !partner.isActive },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update delivery partner", error: err.message });
  }
});

export default router;
