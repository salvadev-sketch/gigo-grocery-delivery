import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PRODUCTS = [
  { name: "Carrot 500g", category: "fruits-vegetables", price: 440, originalPrice: 500, unit: "500g", stock: 100, isOrganic: true, image: "carrot.png" },
  { name: "Orange 1kg", category: "fruits-vegetables", price: 750, originalPrice: 800, unit: "1kg", stock: 80, isOrganic: true, image: "orange.png" },
  { name: "Banana 1kg", category: "fruits-vegetables", price: 450, originalPrice: 500, unit: "1kg", stock: 120, image: "banana.png" },
  { name: "Sprite 1.5L", category: "beverages", price: 600, originalPrice: 750, unit: "1.5L", stock: 100, image: "sprite.png" },
  { name: "Coca-Cola 1.5L", category: "beverages", price: 750, originalPrice: 800, unit: "1.5L", stock: 90, image: "coke.png" },
  { name: "Brown Rice 1kg", category: "pantry-staples", price: 1100, originalPrice: 1200, unit: "1kg", stock: 60, isOrganic: true, image: "brown_rice.png" },
  { name: "Basmati Rice 5kg", category: "pantry-staples", price: 5200, originalPrice: 5500, unit: "5kg", stock: 40, image: "basmati_rice.png" },
  { name: "Onion 500g", category: "fruits-vegetables", price: 450, originalPrice: 500, unit: "500g", stock: 75, image: "onion.png" },
  { name: "Sliced White Bread", category: "bakery", price: 700, originalPrice: 800, unit: "loaf", stock: 50, image: "bread.png" },
  { name: "Chicken Drumsticks 1kg", category: "meat-seafood", price: 3200, originalPrice: 3500, unit: "1kg", stock: 35, image: "chicken.png" },
  { name: "Potato Chips 150g", category: "snacks", price: 1200, originalPrice: 1400, unit: "150g", stock: 65, image: "chips.png" },
  { name: "Eggs 12 pcs", category: "dairy-eggs", price: 850, originalPrice: 900, unit: "12 pcs", stock: 70, isOrganic: true, image: "eggs.png" },
  { name: "Wheat Flour 5kg", category: "pantry-staples", price: 2300, originalPrice: 2900, unit: "5kg", stock: 50, image: "wheat_flour.png" },
  { name: "Mango 1kg", category: "fruits-vegetables", price: 1400, originalPrice: 1900, unit: "1kg", stock: 45, isOrganic: true, image: "mango.png" },
  { name: "Cheese 200g", category: "dairy-eggs", price: 1300, originalPrice: 1500, unit: "200g", stock: 38, image: "cheese.png" },
];

async function main() {
  console.log("Seeding products...");
  for (const p of PRODUCTS) {
    // Product.name isn't a unique column, so check-then-create instead of upsert
    const exists = await prisma.product.findFirst({ where: { name: p.name } });
    if (!exists) await prisma.product.create({ data: p });
  }

  console.log("Seeding a sample delivery partner (email: partner1@gigogrocery.dev / password: password123)...");
  const hashed = await bcrypt.hash("password123", 10);
  const existingPartner = await prisma.deliveryPartner.findUnique({ where: { email: "partner1@gigogrocery.dev" } });
  if (!existingPartner) {
    await prisma.deliveryPartner.create({
      data: { name: "Avinash", email: "partner1@gigogrocery.dev", password: hashed, phone: "0788000000", vehicleType: "bike" },
    });
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
