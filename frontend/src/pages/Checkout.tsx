import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutAddress from "../components/Checkout/CheckoutAddress";
import CheckoutPayment from "../components/Checkout/CheckoutPayment";
import CheckoutReview from "../components/Checkout/CheckoutReview";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { api, toFrontendOrder } from "../lib/api";

const STEPS = [
  { key: "address", label: "📍 Address" },
  { key: "payment", label: "💳 Payment" },
  { key: "review", label: "✓ Review" },
];

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<string>("address");
  const [address, setAddress] = useState({ label: "", address: "", city: "", state: "", zip: "", lat: 0, lng: 0 });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <p className="text-app-text-light mb-4">Sign in to check out.</p>
        <button onClick={() => navigate("/login")} className="px-6 py-3 bg-app-green text-white rounded-xl font-semibold">Sign In</button>
      </div>
    );
  }
  if (items.length === 0 && step !== "review") {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <p className="text-app-text-light mb-4">Your cart is empty.</p>
        <button onClick={() => navigate("/products")} className="px-6 py-3 bg-app-green text-white rounded-xl font-semibold">Browse Products</button>
      </div>
    );
  }

  async function handlePlaceOrder() {
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({
          product: i.product._id,
          name: i.product.name,
          image: i.product.image,
          price: i.product.price,
          quantity: i.quantity,
          unit: i.product.unit,
        })),
        shippingAddress: address,
        paymentMethod,
        subtotal,
        deliveryFee: 0,
        tax,
      };
      const { data } = await api.post("/orders", payload);
      clearCart();
      navigate(`/orders/${toFrontendOrder(data)._id}`);
    } catch (err) {
      console.error(err);
      alert("Could not place order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-serif mb-5">Checkout</h1>
      <div className="flex gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${
              i === stepIndex ? "bg-app-green text-white border-app-green" : i < stepIndex ? "text-app-green border-app-border" : "text-app-text-light border-app-border bg-white"
            }`}
          >
            {s.label}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <div>
          {step === "address" && <CheckoutAddress user={user} address={address} setAddress={setAddress} setStep={setStep} />}
          {step === "payment" && <CheckoutPayment setStep={setStep} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />}
          {step === "review" && (
            <CheckoutReview address={address as any} items={items} handlePlaceOrder={handlePlaceOrder} loading={loading} total={total} />
          )}
        </div>
        <div className="bg-white border border-app-border rounded-2xl p-5 h-fit">
          <h4 className="text-xs font-bold uppercase tracking-wide text-app-text-light mb-3">Order Summary</h4>
          <div className="flex justify-between text-sm mb-1"><span>Subtotal ({items.length} items)</span><span>{subtotal} FRw</span></div>
          <div className="flex justify-between text-sm mb-1"><span>Delivery</span><span className="text-app-green font-semibold">Free</span></div>
          <div className="flex justify-between text-sm mb-2"><span>Tax</span><span>{tax} FRw</span></div>
          <div className="flex justify-between text-base font-bold border-t border-app-border pt-2"><span>Total</span><span>{total} FRw</span></div>
        </div>
      </div>
    </div>
  );
}
