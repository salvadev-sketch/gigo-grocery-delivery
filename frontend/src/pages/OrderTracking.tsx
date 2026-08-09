import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, toFrontendOrder } from "../lib/api";
import LiveMap from "../components/OrderTracking/LiveMap";
import OrderOTP from "../components/OrderTracking/OrderOTP";
import OrderTimeLine from "../components/OrderTracking/OrderTimeLine";

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    let interval: any;

    async function load() {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(toFrontendOrder(data));
      } catch (err) {
        console.error(err);
      }
    }
    load();
    // Poll every 8s so the map/timeline reflect the delivery partner's live updates
    interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, [id]);

  if (!order) return <div className="max-w-5xl mx-auto px-6 py-10 text-app-text-light">Loading order...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <Link to="/orders" className="text-xs text-app-text-light">← Back to Orders</Link>
      <h1 className="text-2xl font-serif mt-1">Order #{order._id.slice(0, 8).toUpperCase()}</h1>
      <p className="text-xs text-app-text-light mb-6">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <div>
          <LiveMap order={order} liveLocation={order.liveLocation} />
        </div>
        <div className="space-y-4">
          <OrderOTP order={order} />
          <OrderTimeLine order={order} />
        </div>
      </div>
    </div>
  );
}
