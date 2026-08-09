import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, toFrontendOrder } from "../lib/api";

const STATUS_STYLES: Record<string, string> = {
  Placed: "bg-blue-50 text-blue-700",
  Confirmed: "bg-blue-50 text-blue-700",
  Assigned: "bg-amber-50 text-amber-700",
  Packed: "bg-amber-50 text-amber-700",
  "Out for Delivery": "bg-amber-50 text-amber-700",
  Delivered: "bg-green-50 text-green-700",
};

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders").then((res) => setOrders(res.data.map(toFrontendOrder))).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-serif mb-6">My Orders</h1>
      {loading ? (
        <p className="text-app-text-light text-sm">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-app-text-light text-sm">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o._id} to={`/orders/${o._id}`} className="flex items-center justify-between bg-white border border-app-border rounded-2xl p-4 hover:border-app-orange">
              <div>
                <p className="font-semibold text-sm">#{o._id.slice(0, 8).toUpperCase()}</p>
                <p className="text-xs text-app-text-light">{new Date(o.createdAt).toLocaleString()} · {o.items.length} items</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-app-green mb-1">{o.total} FRw</p>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status] || "bg-gray-100 text-gray-700"}`}>{o.status}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
