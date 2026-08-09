import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { assets } from "../assets/assets";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 min-h-[calc(100vh-64px)]">
      <div className="hidden md:block relative">
        <img src={assets.hero_bg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-app-green/60 flex items-center p-12">
          <div className="text-white max-w-xs">
            <h2 className="text-3xl font-serif mb-2">Welcome back to GIGO Grocery</h2>
            <p className="text-white/80 text-sm">Fresh groceries, delivered and tracked to your door.</p>
          </div>
        </div>
      </div>
      <div className="flex-center p-8">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="flex items-center gap-2 font-bold text-xl text-app-green mb-6">
            <span className="size-8 rounded-lg bg-app-green text-app-orange flex-center text-sm">G</span> GIGO Grocery
          </div>
          <h1 className="text-xl font-semibold mb-1">{mode === "login" ? "Sign in to your account" : "Create your account"}</h1>
          <p className="text-sm text-app-text-light mb-6">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-app-orange-dark font-semibold">
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>

          {mode === "register" && (
            <div className="mb-4">
              <label className="text-xs font-semibold text-app-text-light">Full Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 border border-app-border rounded-xl px-4 py-3 text-sm" />
            </div>
          )}
          <div className="mb-4">
            <label className="text-xs font-semibold text-app-text-light">Email Address</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full mt-1 border border-app-border rounded-xl px-4 py-3 text-sm" />
          </div>
          <div className="mb-6">
            <label className="text-xs font-semibold text-app-text-light">Password</label>
            <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full mt-1 border border-app-border rounded-xl px-4 py-3 text-sm" />
          </div>

          {error && <p className="text-sm text-app-error mb-4">{error}</p>}

          <button disabled={loading} className="w-full py-3 rounded-xl bg-app-green text-white font-semibold disabled:opacity-60">
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
