import jwt from "jsonwebtoken";

// Verifies a customer JWT and attaches { id } to req.user
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Verifies a delivery-partner JWT and attaches { id } to req.partner
export function requirePartnerAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "partner") throw new Error("wrong role");
    req.partner = { id: decoded.id };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Simple shared-secret admin gate for the prototype.
// TODO: replace with a real Admin model + login once auth is fleshed out.
export function requireAdmin(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
}
