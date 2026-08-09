import { useEffect, useState } from "react";
import { api, toFrontendProduct } from "../lib/api";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";

export default function Deals() {
  const [deals, setDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        const withDiscount = res.data
          .map(toFrontendProduct)
          .filter((p: Product) => p.discount > 0)
          .sort((a: Product, b: Product) => b.discount - a.discount);
        setDeals(withDiscount);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="rounded-2xl bg-gradient-to-r from-app-orange-dark to-app-orange text-white text-center py-9 mb-8">
        <h1 className="text-2xl font-serif mb-1">⚡ Flash Deals ⚡</h1>
        <p className="text-sm opacity-90">Limited-time offers on your favorite products. Grab them before they're gone!</p>
      </div>

      {loading ? (
        <p className="text-app-text-light text-sm">Loading deals...</p>
      ) : deals.length === 0 ? (
        <p className="text-app-text-light text-sm">No active deals right now — check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
