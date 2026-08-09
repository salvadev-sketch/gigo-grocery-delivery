import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, toFrontendProduct } from "../lib/api";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";

const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "FRw";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    api.get(`/products/${id}`).then((res) => setProduct(toFrontendProduct(res.data))).catch(() => setProduct(null));
  }, [id]);

  if (!product) return <div className="max-w-6xl mx-auto px-6 py-10 text-app-text-light">Loading product...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-10">
      <div className="bg-app-cream-dark rounded-3xl flex-center min-h-[320px]">
        <img src={product.image} alt={product.name} className="max-h-52 object-contain" />
      </div>
      <div>
        <button onClick={() => navigate(-1)} className="text-xs text-app-text-light mb-3">← Back</button>
        <div className="flex gap-2 mb-3">
          {product.isOrganic && <span className="text-[11px] font-bold bg-app-green/10 text-app-green px-2.5 py-1 rounded-full">🌿 Organic</span>}
          {product.discount > 0 && <span className="text-[11px] font-bold bg-app-orange/10 text-app-orange-dark px-2.5 py-1 rounded-full">{product.discount}% OFF</span>}
        </div>
        <h1 className="text-2xl font-serif mb-1">{product.name}</h1>
        <div className="text-sm text-app-orange-dark mb-3">★★★★★ {product.rating} ({product.reviewCount} reviews)</div>
        <div className="text-3xl font-bold text-app-green mb-1">
          {currency} {product.price}
          {product.originalPrice > product.price && (
            <span className="text-base text-app-text-light line-through ml-2 font-normal">{currency} {product.originalPrice}</span>
          )}
        </div>
        <p className="text-sm text-app-text-light my-4 max-w-md">{product.description}</p>
        <div className="text-sm font-semibold text-app-green mb-5">✓ In Stock ({product.stock} available)</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-app-border rounded-full overflow-hidden">
            <button className="w-9 h-9" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="w-8 text-center">{qty}</span>
            <button className="w-9 h-9" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
          <button onClick={() => addToCart(product, qty)} className="px-6 py-3 rounded-full bg-app-green text-white font-semibold">
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
