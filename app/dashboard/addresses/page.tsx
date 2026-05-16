"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MapPin, Plus, Pencil, Trash2, Star, Loader2, X } from "lucide-react";
import {
  formatShippingAddressForCheckout,
  parseShippingDetails,
  profilePhoneToFormValue,
  type ShippingAddress,
} from "@/lib/shippingAddresses";

function newAddressId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `addr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

const emptyForm: ShippingAddress = {
  id: "",
  label: "Home",
  street_address: "",
  city: "",
  state: "",
  postal_code: "",
  country: "Nigeria",
  phone_contact: "",
  is_default: false,
};

export default function DeliveryAddressesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [profilePhone, setProfilePhone] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ShippingAddress>(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    setUserId(user.id);
    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("shipping_details, phone_number")
      .eq("id", user.id)
      .maybeSingle();
    if (pErr) {
      setError(pErr.message);
      setAddresses([]);
    } else {
      setAddresses(parseShippingDetails(profile?.shipping_details));
      setProfilePhone(profilePhoneToFormValue(profile?.phone_number as string | null));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const persist = async (next: ShippingAddress[]) => {
    if (!userId) return;
    setSaving(true);
    setError(null);
    const { error: uErr } = await supabase
      .from("profiles")
      .update({ shipping_details: next, updated_at: new Date().toISOString() })
      .eq("id", userId);
    setSaving(false);
    if (uErr) {
      setError(uErr.message);
      return;
    }
    setAddresses(next);
    setModalOpen(false);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      id: newAddressId(),
      phone_contact: profilePhone,
      is_default: addresses.length === 0,
    });
    setModalOpen(true);
  };

  const openEdit = (a: ShippingAddress) => {
    setEditingId(a.id);
    setForm({ ...a });
    setModalOpen(true);
  };

  const submitForm = async () => {
    if (!form.street_address.trim() || !form.city.trim() || !form.state.trim() || !form.phone_contact.trim()) {
      setError("Street, city, region/state, and contact phone are required.");
      return;
    }
    let list = [...addresses];
    if (form.is_default) {
      list = list.map((a) => ({ ...a, is_default: false }));
    }
    if (editingId) {
      list = list.map((a) => (a.id === editingId ? { ...form, id: editingId } : a));
    } else {
      list.push({ ...form, id: form.id || newAddressId() });
    }
    await persist(list);
  };

  const remove = async (id: string) => {
    if (!window.confirm("Remove this saved address?")) return;
    const filtered = addresses.filter((a) => a.id !== id);
    await persist(filtered);
  };

  const setDefault = async (id: string) => {
    const next = addresses.map((a) => ({ ...a, is_default: a.id === id }));
    await persist(next);
  };

  return (
    <div className="mx-auto w-full max-w-2xl pb-24">
      <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase italic leading-none tracking-tighter text-gray-900">
            Delivery addresses
          </h1>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Shopping · Saved to your profile</p>
          <p className="mt-2 max-w-lg text-xs font-medium leading-relaxed text-gray-500">
            Same address book as the StoreLink app. Your default shows first in checkout on the storefront when you&apos;re signed in.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          disabled={saving || !userId}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400"
        >
          <Plus size={16} /> Add address
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-xs font-bold text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white p-10 text-center">
          <MapPin className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm font-bold text-gray-700">No saved addresses yet</p>
          <p className="mt-1 text-xs text-gray-500">Add one so checkout can fill delivery for you automatically.</p>
          <button
            type="button"
            onClick={openAdd}
            disabled={saving || !userId}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400"
          >
            <Plus size={16} /> Add address
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {addresses.map((a) => (
            <li
              key={a.id}
              className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{a.label}</span>
                    {a.is_default && (
                      <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[8px] font-black uppercase text-amber-700">
                        Default
                      </span>
                    )}
                  </div>
                  <pre className="mt-2 whitespace-pre-wrap font-sans text-xs font-medium leading-relaxed text-gray-800">
                    {formatShippingAddressForCheckout(a)}
                  </pre>
                </div>
                <div className="flex shrink-0 gap-1">
                  {!a.is_default && (
                    <button
                      type="button"
                      title="Set default"
                      onClick={() => void setDefault(a.id)}
                      disabled={saving}
                      className="rounded-xl p-2.5 text-gray-400 transition hover:bg-amber-50 hover:text-amber-600 disabled:opacity-40"
                    >
                      <Star size={18} />
                    </button>
                  )}
                  <button
                    type="button"
                    title="Edit"
                    onClick={() => openEdit(a)}
                    disabled={saving}
                    className="rounded-xl p-2.5 text-gray-400 transition hover:bg-gray-50 hover:text-gray-800 disabled:opacity-40"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => void remove(a.id)}
                    disabled={saving}
                    className="rounded-xl p-2.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-tight text-gray-900">
                {editingId ? "Edit address" : "New address"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                className="w-full rounded-2xl border-none bg-gray-50 p-4 text-sm font-bold outline-none ring-emerald-500 focus:ring-2"
                placeholder="Label (Home, Office…)"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              />
              <input
                className="w-full rounded-2xl border-none bg-gray-50 p-4 text-sm font-bold outline-none ring-emerald-500 focus:ring-2"
                placeholder="Street address"
                value={form.street_address}
                onChange={(e) => setForm((f) => ({ ...f, street_address: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full rounded-2xl border-none bg-gray-50 p-4 text-sm font-bold outline-none ring-emerald-500 focus:ring-2"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
                <input
                  className="w-full rounded-2xl border-none bg-gray-50 p-4 text-sm font-bold outline-none ring-emerald-500 focus:ring-2"
                  placeholder="State"
                  value={form.state}
                  onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full rounded-2xl border-none bg-gray-50 p-4 text-sm font-bold outline-none ring-emerald-500 focus:ring-2"
                  placeholder="Postal code"
                  value={form.postal_code}
                  onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
                />
                <input
                  className="w-full rounded-2xl border-none bg-gray-50 p-4 text-sm font-bold outline-none ring-emerald-500 focus:ring-2"
                  placeholder="Country"
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                />
              </div>
              <input
                className="w-full rounded-2xl border-none bg-gray-50 p-4 text-sm font-bold outline-none ring-emerald-500 focus:ring-2"
                placeholder="Phone for this delivery"
                value={form.phone_contact}
                onChange={(e) => setForm((f) => ({ ...f, phone_contact: e.target.value }))}
              />
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={form.is_default}
                  onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                Default for checkout
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-2xl border border-gray-200 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void submitForm()}
                disabled={saving}
                className="flex-1 rounded-2xl bg-emerald-600 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-700 disabled:bg-gray-200"
              >
                {saving ? <Loader2 className="mx-auto animate-spin" size={18} /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
