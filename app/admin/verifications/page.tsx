"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle, FileText, ExternalLink, Camera } from "lucide-react";

type ProfileLite = {
  id: string;
  email: string | null;
  display_name: string;
  full_name: string | null;
  slug: string;
  location: string | null;
  location_city: string | null;
  location_state: string | null;
  is_seller: boolean | null;
};

type PendingRow = {
  id: string;
  user_id: string | null;
  id_type: string;
  id_number: string | null;
  id_url: string;
  face_url: string;
  status: string | null;
  created_at: string | null;
  profile: ProfileLite | null;
};

function locationLine(p: ProfileLite | null) {
  if (!p) return "—";
  const parts = [p.location_city, p.location_state, p.location].filter(Boolean);
  if (parts.length) return parts.join(", ");
  return p.slug ? `@${p.slug}` : "—";
}

function sellerTitle(p: ProfileLite | null) {
  if (!p) return "Unknown seller";
  return p.full_name?.trim() || p.display_name || p.email || p.slug || "Seller";
}

export default function AdminVerifications() {
  const [requests, setRequests] = useState<PendingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/verifications", { credentials: "include" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || res.statusText);
      setRequests(Array.isArray(json.items) ? json.items : []);
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : "Load failed");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (row: PendingRow) => {
    if (!row.user_id) return;
    if (!confirm(`Approve verification for ${sellerTitle(row.profile)}?`)) return;
    setProcessing(true);
    try {
      const res = await fetch("/api/admin/verifications", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: row.id, userId: row.user_id, decision: "approve" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || res.statusText);
      await fetchRequests();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Approve failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (row: PendingRow) => {
    if (!row.user_id) return;
    if (rejectReason.trim().length < 10) {
      alert("Please enter a rejection reason (at least 10 characters).");
      return;
    }
    setProcessing(true);
    try {
      const res = await fetch("/api/admin/verifications", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: row.id,
          userId: row.user_id,
          decision: "reject",
          reason: rejectReason.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || res.statusText);
      setRejectingId(null);
      setRejectReason("");
      await fetchRequests();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Reject failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-white flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-lg mx-auto p-8 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm">
        {loadError}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <CheckCircle className="text-emerald-500" /> Pending verifications
        </h1>
        <p className="text-gray-400">
          KYC queue from <span className="font-mono text-gray-500">merchant_verifications</span> (same source as the main app). Approve or reject to
          sync <span className="font-mono text-gray-500">profiles.verification_status</span>.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center">
          <CheckCircle size={48} className="text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">All caught up</h3>
          <p className="text-gray-500">No pending seller verification requests.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6"
            >
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{sellerTitle(req.profile)}</h3>
                  <p className="text-gray-400 text-sm">{locationLine(req.profile)}</p>
                  {req.profile?.email && <p className="text-gray-500 text-xs mt-1">{req.profile.email}</p>}
                  <p className="text-gray-500 text-xs font-mono mt-1">
                    User {req.user_id} · Request {req.id}
                  </p>
                  <p className="text-gray-600 text-[10px] font-mono mt-1 uppercase">
                    {req.id_type}
                    {req.id_number && req.id_number !== "WEB_DASHBOARD" ? ` · ${req.id_number}` : ""}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href={req.id_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col gap-2 p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Government ID</span>
                      <ExternalLink size={12} className="text-gray-500 group-hover:text-emerald-400" />
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="text-emerald-400" size={24} />
                      <span className="text-sm font-bold text-white">View ID</span>
                    </div>
                  </a>

                  <a
                    href={req.face_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col gap-2 p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live selfie</span>
                      <ExternalLink size={12} className="text-gray-500 group-hover:text-emerald-400" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Camera className="text-blue-400" size={24} />
                      <span className="text-sm font-bold text-white">View selfie</span>
                    </div>
                  </a>
                </div>
              </div>

              <div className="w-full md:w-72 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-6">
                {rejectingId === req.id ? (
                  <div className="space-y-3 animate-in fade-in">
                    <p className="text-white text-sm font-bold">Reason for rejection</p>
                    <textarea
                      className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white text-sm focus:border-red-500 outline-none"
                      rows={2}
                      placeholder="e.g. ID is blurry, name mismatch…"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={processing}
                        onClick={() => void handleReject(req)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg"
                      >
                        {processing ? "Sending…" : "Confirm reject"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejectingId(null)}
                        className="px-3 bg-gray-800 text-white text-xs font-bold py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={processing || !req.user_id}
                      onClick={() => void handleApprove(req)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <CheckCircle size={18} /> Approve
                    </button>

                    <button
                      type="button"
                      disabled={processing || !req.user_id}
                      onClick={() => setRejectingId(req.id)}
                      className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-red-400 font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <XCircle size={18} /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
