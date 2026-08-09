import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, toFrontendProduct } from "../lib/api";
import { assets, categoriesData } from "../assets/assets";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [popular, setPopular] = useState<Product[]>([]);

  useEffect(() => {
    api.get("/products").then((res) => setPopular(res.data.slice(0, 4).map(toFrontendProduct)));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6">
      <section className="grid md:grid-cols-2 gap-10 items-center py-14">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wide text-app-green bg-app-green/10 px-3 py-1.5 rounded-full mb-4">
            Tracked door to door
          </span>
          <h1 className="text-4xl font-serif leading-tight mb-4">
            Fresh groceries, <span className="text-app-orange-dark">delivered</span> and watched every step.
          </h1>
          <p className="text-app-text-light mb-6 max-w-md">
            Order from local farms and trusted suppliers. Watch your delivery partner's route live, right up to your door.
          </p>
          <div className="flex gap-3">
            <Link to="/products" className="px-6 py-3 rounded-full bg-app-orange text-app-green font-semibold">Shop Now →</Link>
            <Link to="/products" className="px-6 py-3 rounded-full border-2 border-app-green text-app-green font-semibold">Browse Categories</Link>
          </div>
        </div>
        <img src={assets.hero_bg} alt="Fresh produce" className="rounded-3xl w-full h-72 object-cover" />
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-serif mb-5">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {categoriesData.map((c) => (
            <Link key={c.slug} to={`/products?category=${c.slug}`} className="bg-white border border-app-border rounded-2xl p-4 text-center hover:border-app-orange hover:-translate-y-0.5 transition-all">
              <img src={c.image} alt={c.name} className="size-10 mx-auto mb-2 object-contain" />
              <p className="text-xs font-semibold">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-8">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-2xl font-serif">Popular Products</h2>
          <Link to="/products" className="text-sm font-bold text-app-orange-dark">View All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popular.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
