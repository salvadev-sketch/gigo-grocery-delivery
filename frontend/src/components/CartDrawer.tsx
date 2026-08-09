import { useNavigate } from "react-router-dom";
import { XIcon } from "lucide-react";
import { useCart } from "../context/CartContext";

const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "FRw";

export default function CartDrawer() {
  const { items, isOpen, closeCart, changeQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  function proceed() {
    if (items.length === 0) return;
    closeCart();
    navigate("/checkout");
  }

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-app-green/30 z-[60] transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[61] flex flex-col transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-app-border">
          <strong>Your Cart</strong>
          <button onClick={closeCart}><XIcon className="size-5" /></button>
        </div>
        <div className="flex-1 overflow-auto px-5">
          {items.length === 0 ? (
            <p className="text-center text-app-text-light py-10 text-sm">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.product._id} className="flex items-center gap-3 py-3 border-b border-app-border">
                <img src={item.product.image} alt={item.product.name} className="size-11 rounded-lg object-cover bg-app-cream-dark" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.product.name}</p>
                  <p className="text-xs text-app-text-light">{currency} {item.product.price} × {item.quantity}</p>
                </div>
                <div className="flex items-center border border-app-border rounded-full overflow-hidden">
                  <button className="w-7 h-7" onClick={() => changeQuantity(item.product._id, -1)}>−</button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button className="w-7 h-7" onClick={() => changeQuantity(item.product._id, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="px-5 py-5 border-t border-app-border">
          <div className="flex justify-between text-sm mb-1"><span>Subtotal</span><span>{currency} {subtotal}</span></div>
          <div className="flex justify-between text-sm mb-3"><span>Delivery</span><span className="text-app-green font-semibold">Free</span></div>
          <button onClick={proceed} className="w-full py-3 rounded-full bg-app-orange text-app-green font-semibold">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}
