import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";

const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "FRw";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white border border-app-border rounded-2xl overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <Link to={`/products/${product._id}`} className="relative h-28 bg-app-cream-dark flex-center">
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-app-orange-dark text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {product.discount}% OFF
          </span>
        )}
        <img src={product.image} alt={product.name} className="max-h-16 object-contain" />
      </Link>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <Link to={`/products/${product._id}`} className="text-sm font-semibold truncate">{product.name}</Link>
        <div className="text-xs text-app-orange-dark">★★★★★ ({product.reviewCount})</div>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-bold text-app-green">{currency} {product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-app-text-light line-through ml-1">{currency} {product.originalPrice}</span>
            )}
          </div>
          <button onClick={() => addToCart(product)} className="size-8 rounded-lg bg-app-green text-white flex-center">
            <PlusIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
