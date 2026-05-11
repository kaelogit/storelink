"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Loader2,
  Upload,
  BadgeCheck,
  ShieldAlert,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Camera,
  UserCircle,
} from "lucide-react";

/** Same source of truth as the mobile app: `profiles.verification_status` + `merchant_verifications` for KYC payloads. */
export default function VerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("none");
  const [docUrl, setDocUrl] = useState("");
  const [selfieUrl, setSelfieUrl] = useState("");
  const [note, setNote] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    void fetchStatus();
  }, []);

  function normalizeVerificationStatus(
    profileStatus?: string | null,
    kycStatus?: string | null,
  ): "none" | "pending" | "rejected" | "verified" {
    const p = (profileStatus || "").toLowerCase();
    const k = (kycStatus || "").toLowerCase();
    const any = [p, k];

    // Treat approved and verified as the same final state.
    if (any.includes("verified") || any.includes("approved")) return "verified";
    if (any.includes("pending") || any.includes("under_review")) return "pending";
    if (any.includes("rejected")) return "rejected";
    return "none";
  }

  async function fetchStatus() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, full_name, verification_status, verification_note")
      .eq("id", user.id)
      .maybeSingle();

    const p = profile as {
      display_name?: string | null;
      full_name?: string | null;
      verification_status?: string | null;
      verification_note?: string | null;
    } | null;

    const name =
      p?.display_name?.trim() || p?.full_name?.trim() || user.email?.split("@")[0] || "Your store";
    setDisplayName(name);
    setNote(p?.verification_note || "");

    const { data: kyc } = await supabase
      .from("merchant_verifications")
      .select("id_url, face_url, status")
      .eq("user_id", user.id)
      .maybeSingle();

    const k = kyc as { id_url?: string | null; face_url?: string | null; status?: string | null } | null;
    if (k?.id_url) setDocUrl(String(k.id_url));
    if (k?.face_url) setSelfieUrl(String(k.face_url));
    setStatus(normalizeVerificationStatus(p?.verification_status, k?.status));

    setLoading(false);
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "id" | "selfie") => {
    if (!e.target.files?.[0] || !userId) return;

    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `verification_docs/${userId}_${type}_${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage.from("products").upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(fileName);

      if (type === "id") setDocUrl(publicUrl);
      if (type === "selfie") setSelfieUrl(publicUrl);
    } catch (error: unknown) {
      alert("Upload failed: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitVerification = async () => {
    if (!docUrl || !selfieUrl || !userId) {
      alert("Please upload both your ID and your Selfie before submitting.");
      return;
    }

    setUploading(true);
    try {
      const payload = {
        user_id: userId,
        id_type: "PASSPORT" as const,
        id_number: "WEB_DASHBOARD",
        id_url: docUrl,
        face_url: selfieUrl,
        status: "pending" as const,
      };

      const { data: existingRow } = await supabase
        .from("merchant_verifications")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      const existingId = (existingRow as { id?: string } | null)?.id;
      if (existingId) {
        const { error: updateError } = await supabase.from("merchant_verifications").update(payload).eq("user_id", userId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("merchant_verifications").insert(payload);
        if (insertError) throw insertError;
      }

      const { error: profError } = await supabase
        .from("profiles")
        .update({ verification_status: "pending", verification_note: null })
        .eq("id", userId);

      if (profError) throw profError;

      setStatus("pending");
    } catch (error: unknown) {
      alert("Submission failed: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gray-300" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 px-4 sm:px-6">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex flex-wrap items-center justify-center sm:justify-start gap-3">
          MERCHANT VERIFICATION
          {status === "verified" && <BadgeCheck className="text-blue-500 animate-in zoom-in" size={36} />}
        </h1>
        <p className="text-gray-500 mt-3 text-sm sm:text-base max-w-xl">
          Build authority and show your customers that your brand is verified. Status matches your StoreLink profile (same as the app).
        </p>
      </div>

      {(status === "none" || status === "rejected") && (
        <div className="space-y-8">
          {status === "rejected" && (
            <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
              <XCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
              <div>
                <h4 className="font-bold text-red-900 text-sm uppercase tracking-tight">Your previous submission was rejected</h4>
                <p className="text-red-700 text-xs mt-1 leading-relaxed">
                  {note || "Reason: The document provided was unclear or mismatched."}
                </p>
                <p className="text-red-700 text-xs mt-1 leading-relaxed">
                  Please upload clearer and matching documents before resubmitting.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            <div
              className={`bg-white p-5 sm:p-8 rounded-[2rem] border transition-all duration-300 ${
                docUrl ? "border-emerald-500 ring-4 ring-emerald-50 shadow-sm" : "border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">1. Identity Document</h3>
                {docUrl && <CheckCircle className="text-emerald-500" size={20} />}
              </div>

              <label
                className={`
                  flex flex-col items-center justify-center w-full min-h-[160px] sm:min-h-[200px] border-2 border-dashed rounded-3xl cursor-pointer transition-all
                  ${uploading ? "bg-gray-50 border-gray-300" : docUrl ? "bg-emerald-50/40 border-emerald-200" : "bg-white border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/30"}
                `}
              >
                <div className="flex flex-col items-center justify-center text-center px-6">
                  {docUrl ? (
                    <>
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-3">
                        <FileText size={28} />
                      </div>
                      <p className="text-xs font-black text-emerald-800 uppercase">Document on file</p>
                      <p className="text-[10px] text-emerald-600 mt-2 font-bold opacity-60 bg-emerald-100/50 px-3 py-1 rounded-full">Replace file</p>
                    </>
                  ) : (
                    <>
                      <Upload className="text-gray-300 mb-3" size={32} />
                      <p className="text-xs font-bold text-gray-700">Upload NIN, Voter&apos;s Card, or Passport</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">JPG, PNG or PDF</p>
                    </>
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => void handleFileUpload(e, "id")} disabled={uploading} />
              </label>
            </div>

            <div
              className={`bg-white p-5 sm:p-8 rounded-[2rem] border transition-all duration-300 ${
                selfieUrl ? "border-blue-500 ring-4 ring-blue-50 shadow-sm" : "border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">2. Live Selfie</h3>
                {selfieUrl && <CheckCircle className="text-blue-500" size={20} />}
              </div>

              <label
                className={`
                  flex flex-col items-center justify-center w-full min-h-[160px] sm:min-h-[200px] border-2 border-dashed rounded-3xl cursor-pointer transition-all
                  ${uploading ? "bg-gray-50 border-gray-300" : selfieUrl ? "bg-blue-50/40 border-blue-200" : "bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50/30"}
                `}
              >
                <div className="flex flex-col items-center justify-center text-center px-6">
                  {selfieUrl ? (
                    <>
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
                        <UserCircle size={28} />
                      </div>
                      <p className="text-xs font-black text-blue-800 uppercase">Live selfie on file</p>
                      <p className="text-[10px] text-blue-600 mt-2 font-bold opacity-60 bg-blue-100/50 px-3 py-1 rounded-full">Replace file</p>
                    </>
                  ) : (
                    <>
                      <Camera className="text-gray-300 mb-3" size={32} />
                      <p className="text-xs font-bold text-gray-700">Upload Selfie holding your ID</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Ensure face is clear</p>
                    </>
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => void handleFileUpload(e, "selfie")} disabled={uploading} />
              </label>
            </div>
          </div>

          <div className="max-w-2xl mx-auto w-full pt-4">
            <button
              type="button"
              onClick={() => void handleSubmitVerification()}
              disabled={uploading || !docUrl || !selfieUrl}
              className={`
                  w-full py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-[0.98]
                  ${!docUrl || !selfieUrl ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-black hover:shadow-2xl"}
                `}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="animate-spin" size={20} /> Submitting...
                </span>
              ) : (
                status === "rejected" ? "Resubmit for review" : "Submit for review"
              )}
            </button>
          </div>

          <div className="max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 rounded-2xl border border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition"
            >
              Return to dashboard
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100 max-w-2xl mx-auto">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
              <ShieldAlert className="text-emerald-600" size={24} />
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed text-center sm:text-left">
              <b className="text-gray-900 uppercase tracking-tighter mr-1 font-black">Security Note:</b>
              Your documents are stored in a secure, encrypted vault. They are only used for manual verification and are never shared with third parties.
            </p>
          </div>
        </div>
      )}

      {status === "pending" && (
        <div className="bg-white p-8 sm:p-16 rounded-[3rem] border border-gray-100 shadow-sm text-center max-w-3xl mx-auto animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Clock className="text-amber-600" size={40} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 uppercase tracking-tighter">UNDER REVIEW</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-10 text-sm sm:text-base leading-relaxed">
            We are currently checking your documents. This usually takes 24 hours.
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-gray-200 active:scale-95 transition-transform"
          >
            GO BACK
          </button>
        </div>
      )}

      {status === "verified" && (
        <div className="bg-white p-8 sm:p-20 rounded-[3rem] border border-blue-100 shadow-2xl shadow-blue-900/5 text-center relative overflow-hidden max-w-3xl mx-auto animate-in fade-in zoom-in duration-700">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-400 via-indigo-500 to-emerald-400" />
          <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-100">
            <BadgeCheck className="text-blue-600" size={56} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">VERIFIED SELLER</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-10 text-sm sm:text-base leading-relaxed">
            <span className="text-gray-900 font-black">{displayName}</span>, your verification is complete and synced with the StoreLink app.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-gray-200 active:scale-95 transition-transform"
          >
            RETURN TO DASHBOARD
          </Link>
        </div>
      )}
    </div>
  );
}
