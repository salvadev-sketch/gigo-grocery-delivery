import { useState } from "react";
import { PlusIcon, MapPinIcon, TrashIcon } from "lucide-react";
import { api, toFrontendAddress } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Addresses() {
  const { user, refreshUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "Home", address: "", city: "", state: "", zip: "", lat: 0, lng: 0, isDefault: false });
  const [saving, setSaving] = useState(false);

  async function addAddress(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/addresses", form);
      await refreshUser();
      setShowForm(false);
      setForm({ label: "Home", address: "", city: "", state: "", zip: "", lat: 0, lng: 0, isDefault: false });
    } finally {
      setSaving(false);
    }
  }

  async function removeAddress(id: string) {
    await api.delete(`/addresses/${id}`);
    await refreshUser();
  }

  if (!user) return <div className="max-w-2xl mx-auto px-6 py-10 text-app-text-light">Sign in to manage addresses.</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-serif mb-6">Your Addresses</h1>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {user.addresses.map((addr: any) => (
          <div key={addr._id} className="p-4 rounded-xl border border-app-border bg-white">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <MapPinIcon className="size-4 text-app-green" />
                <span className="font-semibold text-sm">{addr.label}</span>
                {addr.isDefault && <span className="text-[10px] font-bold text-app-orange-dark bg-orange-50 px-2 py-0.5 rounded-full">DEFAULT</span>}
              </div>
              <button onClick={() => removeAddress(addr._id)} className="text-app-text-light hover:text-app-error">
                <TrashIcon className="size-4" />
              </button>
            </div>
            <p className="text-sm text-app-text-light">{addr.address}</p>
            <p className="text-xs text-app-text-light">{addr.city}, {addr.state} {addr.zip}</p>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="px-5 py-2.5 border border-app-green text-app-green rounded-xl flex items-center gap-2 text-sm font-semibold">
          <PlusIcon className="size-4" /> Add New Address
        </button>
      ) : (
        <form onSubmit={addAddress} className="bg-white border border-app-border rounded-2xl p-5 space-y-3">
          <input required placeholder="Label (e.g. Home)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full border border-app-border rounded-lg px-3 py-2.5 text-sm" />
          <input required placeholder="Street address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-app-border rounded-lg px-3 py-2.5 text-sm" />
          <div className="grid grid-cols-3 gap-2">
            <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="border border-app-border rounded-lg px-3 py-2.5 text-sm" />
            <input required placeholder="State/Province" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="border border-app-border rounded-lg px-3 py-2.5 text-sm" />
            <input required placeholder="Zip" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className="border border-app-border rounded-lg px-3 py-2.5 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} /> Set as default
          </label>
          <div className="flex gap-2">
            <button disabled={saving} className="px-5 py-2.5 bg-app-green text-white rounded-xl text-sm font-semibold disabled:opacity-60">
              {saving ? "Saving..." : "Save Address"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-app-border rounded-xl text-sm">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
