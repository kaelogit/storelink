"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Loader2, Upload, BadgeCheck, ShieldAlert, FileText, 
  CheckCircle, Clock, XCircle, Camera, UserCircle 
} from "lucide-react";

export default function VerificationPage() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [status, setStatus] = useState("none"); 
  const [docUrl, setDocUrl] = useState("");
  const [selfieUrl, setSelfieUrl] = useState(""); 
  const [note, setNote] = useState(""); 
  const [storeName, setStoreName] = useState("");
  const [storeId, setStoreId] = useState("");

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: store } = await supabase
      .from('stores')
      .select('id, name, verification_status, verification_doc_url, verification_selfie_url, verification_note')
      .eq('owner_id', user.id)
      .single();

    if (store) {
      setStoreId(store.id);
      setStoreName(store.name);
      setStatus(store.verification_status || "none");
      setDocUrl(store.verification_doc_url || "");
      setSelfieUrl(store.verification_selfie_url || "");
      setNote(store.verification_note || "");
    }
    setLoading(false);
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'selfie') => {
    if (!e.target.files?.[0]) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `verification_docs/${storeId}_${type}_${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('products') 
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      // Update local state only
      if (type === 'id') setDocUrl(publicUrl);
      if (type === 'selfie') setSelfieUrl(publicUrl);

    } catch (error: any) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitVerification = async () => {
    if (!docUrl || !selfieUrl) {
      alert("Please upload both your ID and your Selfie before submitting.");
      return;
    }

    setUploading(true);
    try {
      const { error: dbError } = await supabase
        .from('stores')
        .update({ 
          verification_status: 'pending',
          verification_doc_url: docUrl,
          verification_selfie_url: selfieUrl,
          verification_note: null 
        })
        .eq('id', storeId);

      if (dbError) throw dbError;
      setStatus('pending');
    } catch (error: any) {
      alert("Submission failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gray-300" size={32}/>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 px-4">
      
      <div className="mb-8">
         <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            Verification
            {status === 'verified' && <BadgeCheck className="text-blue-500" size={32} />}
         </h1>
         <p className="text-gray-500 mt-2">
            Build authority and show your customers that your brand is verified.
         </p>
      </div>

      {(status === 'none' || status === 'rejected') && (
        <div className="space-y-6">
           
           {status === 'rejected' && (
             <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 animate-in fade-in">
                <XCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                <div>
                   <h4 className="font-bold text-red-900 text-sm">Application Rejected</h4>
                   <p className="text-red-700 text-xs mt-1">
                     {note || "Reason: The document provided was unclear or mismatched."}
                   </p>
                </div>
             </div>
           )}

           <div className="grid md:grid-cols-2 gap-6">
              <div className={`bg-white p-6 rounded-3xl border transition-all ${docUrl ? 'border-emerald-500 shadow-md' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">1. Identity Document</h3>
                  {docUrl && <CheckCircle className="text-emerald-500" size={18} />}
                </div>
                
                <label className={`
                  flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all
                  ${uploading ? 'bg-gray-50 border-gray-300' : docUrl ? 'bg-emerald-50/30 border-emerald-200' : 'bg-white border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/30'}
                `}>
                  <div className="flex flex-col items-center justify-center text-center px-4">
                    {docUrl ? (
                      <>
                        <FileText className="text-emerald-600 mb-2" size={24} />
                        <p className="text-xs font-bold text-emerald-700">ID Uploaded Successfully</p>
                        <p className="text-[10px] text-emerald-600 mt-1 opacity-60">Tap to change</p>
                      </>
                    ) : (
                      <>
                        <Upload className="text-gray-400 mb-2" size={24} />
                        <p className="text-xs font-bold text-gray-700">Upload NIN, Voter's Card, or Passport</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'id')} disabled={uploading} />
                </label>
              </div>

              <div className={`bg-white p-6 rounded-3xl border transition-all ${selfieUrl ? 'border-blue-500 shadow-md' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">2. Live Selfie</h3>
                  {selfieUrl && <CheckCircle className="text-blue-500" size={18} />}
                </div>
                
                <label className={`
                  flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all
                  ${uploading ? 'bg-gray-50 border-gray-300' : selfieUrl ? 'bg-blue-50/30 border-blue-200' : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50/30'}
                `}>
                  <div className="flex flex-col items-center justify-center text-center px-4">
                    {selfieUrl ? (
                      <>
                        <UserCircle className="text-blue-600 mb-2" size={24} />
                        <p className="text-xs font-bold text-blue-700">Selfie Captured</p>
                        <p className="text-[10px] text-blue-600 mt-1 opacity-60">Tap to change</p>
                      </>
                    ) : (
                      <>
                        <Camera className="text-gray-400 mb-2" size={24} />
                        <p className="text-xs font-bold text-gray-700">Upload Selfie holding your ID</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'selfie')} disabled={uploading} />
                </label>
              </div>
           </div>

           <button 
            onClick={handleSubmitVerification}
            disabled={uploading || !docUrl || !selfieUrl}
            className={`
              w-full py-5 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95
              ${(!docUrl || !selfieUrl) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-black'}
            `}
           >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} /> Processing...
              </span>
            ) : "Submit Verification Request"}
           </button>

           <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <ShieldAlert className="text-blue-600 shrink-0" size={20} />
              <p className="text-xs text-blue-700 leading-tight">
                <b>Privacy Note:</b> Your documents are stored in a secure, encrypted vault. They are only used for manual verification and are never shared with third parties.
              </p>
           </div>
        </div>
      )}

      {status === 'pending' && (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
           <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="text-amber-600" size={32} />
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-2">Verification Pending</h2>
           <p className="text-gray-500 max-w-md mx-auto mb-8">
              We’ve received your ID and Selfie. Our team is currently matching them to verify your identity. This usually takes 24-48 hours.
           </p>
           <div className="inline-flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg text-[10px] font-black text-emerald-700 uppercase">
                <CheckCircle size={12} /> ID Uploaded
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg text-[10px] font-black text-blue-700 uppercase">
                <CheckCircle size={12} /> Selfie Uploaded
              </div>
           </div>
        </div>
      )}

      {status === 'verified' && (
        <div className="bg-white p-12 rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-emerald-400" />
           <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BadgeCheck className="text-blue-600" size={48} />
           </div>
           <h2 className="text-3xl font-black text-gray-900 mb-2">Verification Complete!</h2>
           <p className="text-gray-500 max-w-md mx-auto mb-8">
              Congratulations, **{storeName}**. Your store is officially verified. You now have full access to the Marketplace and Trending features.
           </p>
           <div className="flex justify-center">
             <div className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2">
               <ShieldAlert size={16} /> Verified Store Profile
             </div>
           </div>
        </div>
      )}

    </div>
  );
}