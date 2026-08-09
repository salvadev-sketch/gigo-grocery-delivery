import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, toFrontendProduct } from "../lib/api";
import { categoriesData } from "../assets/assets";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all";
  const search = params.get("search") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query: Record<string, string> = {};
    if (category !== "all") query.category = category;
    if (search) query.search = search;
    api
      .get("/products", { params: query })
      .then((res) => setProducts(res.data.map(toFrontendProduct)))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="text-xs text-app-text-light mb-1">Home / All Products</div>
      <h1 className="text-2xl font-serif mb-6">{search ? `Results for "${search}"` : "All Products"}</h1>

      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="bg-white border border-app-border rounded-2xl p-4 h-fit">
          <h4 className="text-xs font-bold uppercase tracking-wide text-app-text-light mb-3">Categories</h4>
          <button
            onClick={() => setParams(search ? { search } : {})}
            className={`block w-full text-left text-sm px-3 py-2 rounded-lg mb-1 ${category === "all" ? "bg-app-green text-white font-semibold" : "hover:bg-app-cream"}`}
          >
            All Categories
          </button>
          {categoriesData.map((c) => (
            <button
              key={c.slug}
              onClick={() => setParams({ category: c.slug, ...(search ? { search } : {}) })}
              className={`block w-full text-left text-sm px-3 py-2 rounded-lg mb-1 ${category === c.slug ? "bg-app-green text-white font-semibold" : "hover:bg-app-cream"}`}
            >
              {c.name}
            </button>
          ))}
        </aside>

        <div>
          {loading ? (
            <p className="text-app-text-light text-sm">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-app-text-light text-sm">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
