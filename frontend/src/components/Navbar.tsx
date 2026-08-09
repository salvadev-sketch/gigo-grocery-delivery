import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShoppingCartIcon, SearchIcon, UserIcon, ChevronDownIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(search)}`);
  }

  return (
    <header className="sticky top-0 z-40 bg-app-cream/90 backdrop-blur border-b border-app-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-5 px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-app-green shrink-0">
          <span className="size-8 rounded-lg bg-app-green text-app-orange flex-center text-sm">G</span>
          GIGO Grocery
        </Link>

        <nav className="hidden md:flex gap-6 text-sm font-semibold text-app-text-light">
          <Link to="/" className="hover:text-app-green">Home</Link>
          <Link to="/products" className="hover:text-app-green">Products</Link>
          <Link to="/deals" className="hover:text-app-green">Deals</Link>
        </nav>

        <form onSubmit={submitSearch} className="hidden md:flex items-center gap-2 bg-white border border-app-border rounded-full px-4 py-2 text-sm flex-1 max-w-xs">
          <SearchIcon className="size-4 text-app-text-light" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for groceries..."
            className="flex-1 outline-none bg-transparent"
          />
        </form>

        <div className="flex items-center gap-3 shrink-0">
          {user && (
            <Link to="/orders" className="size-9 rounded-lg border border-app-border bg-white flex-center" title="My orders">
              📍
            </Link>
          )}
          <button onClick={openCart} className="relative size-9 rounded-lg border border-app-border bg-white flex-center">
            <ShoppingCartIcon className="size-4" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-app-orange-dark text-white text-[10px] font-bold rounded-full min-w-4 h-4 flex-center px-1">
                {count}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-1 px-3 py-2 rounded-full bg-app-green text-white text-sm font-semibold">
                <UserIcon className="size-4" /> {user.name.split(" ")[0]} <ChevronDownIcon className="size-3.5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-app-border shadow-lg py-1 z-50">
                  <Link to="/orders" className="dropdown-link" onClick={() => setMenuOpen(false)}>My Orders</Link>
                  <Link to="/addresses" className="dropdown-link" onClick={() => setMenuOpen(false)}>Addresses</Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                      navigate("/");
                    }}
                    className="dropdown-link w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 rounded-full bg-app-green text-white text-sm font-semibold">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
