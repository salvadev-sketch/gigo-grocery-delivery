import { Link } from "react-router-dom";

// TODO: replace with the real customer-site navbar (search, cart, sign-in dropdown)
// seen in the tutorial reference — this is a placeholder stub so AdminLayout builds.
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white border-b">
      <Link to="/" className="font-bold text-brand text-lg">
        GIGO Grocery
      </Link>
      <div className="flex gap-4 text-sm text-gray-600">
        <Link to="/products">Products</Link>
        <Link to="/deals">Deals</Link>
      </div>
    </nav>
  );
}
