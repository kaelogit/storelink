"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, ChevronRight, Landmark, Loader2, Search, X } from "lucide-react";

type BankItem = { name: string; code: string };

type BankDetails = {
  bank_name?: string | null;
  bank_code?: string | null;
  account_name?: string | null;
  account_number?: string | null;
  recipient_code?: string | null;
  currency?: string | null;
};

type BankFormState = {
  bank_name: string;
  bank_code: string;
  account_name: string;
  account_number: string;
  recipient_code: string;
  currency: string;
};

type ProfileRow = {
  id: string;
  is_seller?: boolean | null;
  bank_details?: BankDetails | null;
};

export default function DashboardPayoutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [banks, setBanks] = useState<BankItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const hasExistingDetails = Boolean(profile?.bank_details?.recipient_code);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<BankFormState>({
    bank_name: "",
    bank_code: "",
    account_number: "",
    account_name: "",
    recipient_code: "",
    currency: "NGN",
  });

  const loadProfile = useCallback(async () => {
    const { data: authData } = await supabase.auth.getUser();
    const uid = authData?.user?.id;
    if (!uid) {
      setProfile(null);
      return;
    }
    const { data, error: pErr } = await supabase.from("profiles").select("id, is_seller, bank_details").eq("id", uid).maybeSingle();
    if (pErr) throw pErr;
    const p = (data as ProfileRow | null) ?? null;
    setProfile(p);
    const bank = p?.bank_details || {};
    setForm({
      bank_name: String(bank.bank_name || ""),
      bank_code: String(bank.bank_code || ""),
      account_number: String(bank.account_number || ""),
      account_name: String(bank.account_name || ""),
      recipient_code: String(bank.recipient_code || ""),
      currency: String(bank.currency || "NGN"),
    });
    setIsEditing(!bank.recipient_code);
  }, []);

  const loadBanks = useCallback(async () => {
    const { data } = await supabase.functions.invoke("paystack-account-resolve", {
      body: { action: "list_banks" },
    });
    if (data?.status && Array.isArray(data.data)) {
      setBanks(data.data as BankItem[]);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([loadProfile(), loadBanks()]);
      } catch (e: unknown) {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load payout settings.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loadBanks, loadProfile]);

  const filteredBanks = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    if (!q) return banks;
    return banks.filter((b) => b.name.toLowerCase().includes(q));
  }, [banks, pickerSearch]);

  const verifyAccount = useCallback(
    async (account_number: string, bank_code: string) => {
      setVerifying(true);
      setError(null);
      try {
        const { data, error: invokeError } = await supabase.functions.invoke("paystack-account-resolve", {
          body: { account_number, bank_code },
        });
        if (invokeError || !data?.success) {
          throw new Error("Invalid account details. Please check account number and bank.");
        }
        setForm((prev) => ({
          ...prev,
          account_name: String(data.account_name || ""),
          recipient_code: String(data.recipient_code || ""),
        }));
      } catch (e: unknown) {
        setForm((prev) => ({ ...prev, account_name: "", recipient_code: "" }));
        setError(e instanceof Error ? e.message : "Could not verify account.");
      } finally {
        setVerifying(false);
      }
    },
    []
  );

  useEffect(() => {
    const ready = isEditing && form.account_number.length === 10 && !!form.bank_code;
    if (!ready) return;
    const t = setTimeout(() => {
      void verifyAccount(form.account_number, form.bank_code);
    }, 300);
    return () => clearTimeout(t);
  }, [form.account_number, form.bank_code, isEditing, verifyAccount]);

  const save = useCallback(async () => {
    if (!profile?.id) return;
    if (!form.recipient_code) {
      setError("Please verify account first.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload: BankFormState = {
        bank_name: form.bank_name,
        bank_code: form.bank_code,
        account_name: form.account_name,
        account_number: form.account_number,
        recipient_code: form.recipient_code,
        currency: "NGN",
      };
      const { error: upErr } = await supabase
        .from("profiles")
        .update({ bank_details: payload, updated_at: new Date().toISOString() })
        .eq("id", profile.id);
      if (upErr) throw upErr;
      await loadProfile();
      setIsEditing(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not save bank account.");
    } finally {
      setSaving(false);
    }
  }, [form, loadProfile, profile?.id]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gray-300" size={32} />
      </div>
    );
  }

  if (!profile?.id) {
    return <p className="py-10 text-center text-sm text-gray-500">Sign in to set up payout details.</p>;
  }

  if (profile.is_seller !== true) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm font-semibold text-gray-600">Payout bank details are for seller accounts.</p>
        <a href="/account/start-selling" className="mt-4 inline-block text-sm font-black text-emerald-600 uppercase tracking-widest hover:underline">
          Start selling
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Payout bank account</h1>
        <p className="text-gray-500 mt-2 text-sm font-medium">
          Storefront payouts go to this verified account (same as the StoreLink app). You need a saved recipient before product orders can pay out.
        </p>
      </div>

      {error ? <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 font-medium">{error}</p> : null}

      {!isEditing && hasExistingDetails ? (
        <section className="rounded-[1.5rem] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Landmark size={22} />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-black tracking-widest text-white">
              <CheckCircle2 size={12} />
              SAVED
            </span>
          </div>
          <p className="text-lg font-black text-gray-900">{form.bank_name}</p>
          <p className="mt-1 text-sm font-bold uppercase tracking-wide text-gray-500">{form.account_name}</p>
          <div className="my-5 h-px bg-gray-100" />
          <p className="text-xl font-black tracking-widest text-gray-900">**** **** {form.account_number.slice(-4)}</p>
          <button
            type="button"
            className="mt-6 w-full py-3 rounded-xl border-2 border-gray-900 text-gray-900 font-black text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white transition"
            onClick={() => setIsEditing(true)}
          >
            Change bank account
          </button>
        </section>
      ) : (
        <section className="rounded-[1.5rem] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 rounded-2xl bg-emerald-50/80 border border-emerald-100 p-4 text-sm text-gray-800 font-medium">
            Use an account that matches your verified identity to avoid payout delays.
          </div>

          <label className="mb-2 ml-1 block text-[10px] font-black uppercase tracking-widest text-gray-400">Bank name</label>
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="flex h-14 w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 text-left"
          >
            <span className={`text-sm font-bold ${form.bank_name ? "text-gray-900" : "text-gray-400"}`}>
              {form.bank_name || "Select bank"}
            </span>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <label className="mb-2 mt-6 ml-1 block text-[10px] font-black uppercase tracking-widest text-gray-400">Account number</label>
          <div className="flex h-14 items-center rounded-xl border border-gray-200 bg-gray-50 px-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              value={form.account_number}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                setForm((prev) => ({ ...prev, account_number: v, account_name: "", recipient_code: "" }));
              }}
              placeholder="0000000000"
              className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400"
            />
            {verifying ? <span className="ml-3 text-xs text-gray-500">Verifying…</span> : null}
          </div>

          {form.account_name ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">
              <CheckCircle2 size={16} />
              <span>{form.account_name}</span>
            </div>
          ) : null}

          <div className="mt-8 flex items-center gap-3">
            {hasExistingDetails ? (
              <button
                type="button"
                className="min-w-24 py-3 px-4 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            ) : null}
            <button
              type="button"
              className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-black text-xs uppercase tracking-widest disabled:opacity-50"
              onClick={() => void save()}
              disabled={saving || !form.recipient_code}
            >
              {saving ? "Saving…" : "Save account"}
            </button>
          </div>
        </section>
      )}

      {showPicker ? (
        <div className="fixed inset-0 z-50 bg-black/45 p-4 flex items-start justify-center pt-10">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <p className="text-sm font-black uppercase tracking-widest text-gray-900">Select bank</p>
              <button
                type="button"
                onClick={() => setShowPicker(false)}
                className="rounded-lg p-1.5 hover:bg-gray-100"
                aria-label="Close bank picker"
              >
                <X size={20} className="text-gray-700" />
              </button>
            </div>
            <div className="border-b border-gray-100 p-4">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
                <Search size={16} className="text-gray-400" />
                <input
                  autoFocus
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Search banks..."
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="max-h-[55vh] overflow-auto">
              {filteredBanks.map((bank) => (
                <button
                  key={bank.code}
                  type="button"
                  className="w-full border-b border-gray-100 px-5 py-3.5 text-left text-sm font-bold text-gray-900 hover:bg-gray-50"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, bank_name: bank.name, bank_code: bank.code, account_name: "", recipient_code: "" }));
                    setShowPicker(false);
                    setPickerSearch("");
                  }}
                >
                  {bank.name}
                </button>
              ))}
              {filteredBanks.length === 0 ? <p className="px-5 py-8 text-center text-sm text-gray-500">No banks found.</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
