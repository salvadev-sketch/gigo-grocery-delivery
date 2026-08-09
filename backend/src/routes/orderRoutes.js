import express from "express";
import { prisma } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/orders — place an order from the cart at checkout
router.post("/", async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, deliveryFee = 0, tax = 0 } = req.body;
    if (!items?.length || !shippingAddress) {
      return res.status(400).json({ message: "Items and shipping address are required" });
    }

    const total = subtotal + deliveryFee + tax;
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        items,
        shippingAddress,
        paymentMethod: paymentMethod || "card",
        subtotal,
        deliveryFee,
        tax,
        total,
        status: "Placed",
        statusHistory: [{ status: "Placed", at: new Date().toISOString() }],
        deliveryOtp: generateOtp(),
      },
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
});

router.get("/", async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    include: { deliveryPartner: { select: { name: true, phone: true, vehicleType: true } } },
  });
  res.json(orders);
});

router.get("/:id", async (req, res) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { deliveryPartner: { select: { name: true, phone: true, vehicleType: true } } },
  });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

export default router;
