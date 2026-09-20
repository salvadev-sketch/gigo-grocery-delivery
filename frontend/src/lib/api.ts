import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("gigo_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// The backend (Prisma/Postgres) returns `id`; the frontend types/components
// (ported from the Mongo-based tutorial) expect `_id`. Rather than rewrite
// every component, normalize responses at the API boundary.
export function toFrontendProduct(p: any) {
  return {
    ...p,
    _id: p.id,
    discount: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
  };
}

export function toFrontendAddress(a: any) {
  return { ...a, _id: a.id };
}

export function toFrontendOrder(o: any) {
  return {
    ...o,
    _id: o.id,
    statusHistory: (o.statusHistory || []).map((h: any) => ({
      status: h.status,
      timestamp: h.at,
      note: h.reason || "",
    })),
    deliveryPartner: o.deliveryPartner ? { ...o.deliveryPartner, _id: o.deliveryPartnerId } : null,
  };
}

export function toFrontendUser(u: any) {
  return { ...u, _id: u.id, addresses: (u.addresses || []).map(toFrontendAddress) };
}
