"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload, BadgeCheck, ShieldAlert, FileText, CheckCircle, Clock, XCircle } from "lucide-react";

export default function VerificationPage() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [status, setStatus] = useState("none"); 
  const [docUrl, setDocUrl] = useState("");
  const [note, setNote] = useState(""); // 👈 Added State for the Reason
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
      .select('id, name, verification_status, verification_doc_url, verification_note')
      .eq('owner_id', user.id)
      .single();

    if (store) {
      setStoreId(store.id);
      setStoreName(store.name);
      setStatus(store.verification_status || "none");
      setDocUrl(store.verification_doc_url || "");
      setNote(store.verification_note || ""); // 👈 Save the note
    }
    setLoading(false);
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `verification_docs/${storeId}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('products') 
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('stores')
        .update({ 
          verification_status: 'pending',
          verification_doc_url: publicUrl,
          verification_note: null // 👈 Clear the rejection note on new upload
        })
        .eq('id', storeId);

      if (dbError) throw dbError;

      setStatus('pending');
      setDocUrl(publicUrl);

    } catch (error: any) {
      alert("Upload failed: " + error.message);
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
    <div className="max-w-3xl mx-auto pb-12">
      
      <div className="mb-8">
         <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
           Verification
           {status === 'verified' && <BadgeCheck className="text-blue-500" size={32} />}
         </h1>
         <p className="text-gray-500 mt-2">
           Get the blue badge to build trust with your customers.
         </p>
      </div>

      {(status === 'none' || status === 'rejected') && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
           
           {status === 'rejected' && (
             <div className="mb-8 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 animate-in fade-in">
                <XCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                <div>
                   <h4 className="font-bold text-red-900 text-sm">Application Rejected</h4>
                   <p className="text-red-700 text-xs mt-1">
                     {note || "Your document was not accepted. Please upload a clear Government ID."}
                   </p>
                </div>
             </div>
           )}

           <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                 <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Identity Document</h3>
                 <ul className="space-y-3 mb-6">
                    <li className="flex gap-3 text-sm text-gray-600">
                      <CheckCircle size={18} className="text-emerald-500 shrink-0"/> 
                      <span>Government Issued ID (NIN, Voter's Card, Passport)</span>
                    </li>
                    <li className="flex gap-3 text-sm text-gray-600">
                      <CheckCircle size={18} className="text-emerald-500 shrink-0"/> 
                      <span>Must be clear and readable</span>
                    </li>
                    <li className="flex gap-3 text-sm text-gray-600">
                      <CheckCircle size={18} className="text-emerald-500 shrink-0"/> 
                      <span>Matches the name on your account</span>
                    </li>
                 </ul>

                 <label className={`
                    flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all
                    ${uploading ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/30'}
                 `}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        {uploading ? (
                          <>
                            <Loader2 className="animate-spin text-emerald-600 mb-3" size={32} />
                            <p className="text-sm font-bold text-gray-500">Uploading securely...</p>
                          </>
                        ) : (
                          <>
                            <Upload className="text-gray-400 mb-3" size={32} />
                            <p className="mb-2 text-sm font-bold text-gray-700">Click to upload document</p>
                            <p className="text-xs text-gray-400">PNG, JPG or PDF (Max 5MB)</p>
                          </>
                        )}
                    </div>
                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleUpload} disabled={uploading} />
                 </label>
              </div>

              <div className="w-full md:w-64 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                 <ShieldAlert className="text-gray-400 mb-4" size={32} />
                 <h4 className="font-bold text-gray-900 text-sm mb-2">Why Verify?</h4>
                 <p className="text-xs text-gray-500 leading-relaxed mb-4">
                   Verified stores get a blue badge on their profile and products. This increases customer trust and boosts sales by up to 40%.
                 </p>
                 <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    <span className="font-bold text-xs text-gray-900">{storeName}</span>
                    <BadgeCheck size={14} className="text-blue-500 fill-blue-50" />
                 </div>
              </div>
           </div>
        </div>
      )}

      {status === 'pending' && (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
           <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="text-amber-600" size={32} />
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-2">Under Review</h2>
           <p className="text-gray-500 max-w-md mx-auto mb-8">
             We have received your document. Our compliance team is reviewing it. This usually takes 24-48 hours.
           </p>
           
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-xs font-bold text-gray-400">
              <FileText size={14} /> Document Uploaded
           </div>
        </div>
      )}

      {status === 'verified' && (
        <div className="bg-white p-12 rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-emerald-400" />
           
           <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BadgeCheck className="text-blue-600" size={48} />
           </div>
           
           <h2 className="text-3xl font-black text-gray-900 mb-2">You are Verified!</h2>
           <p className="text-gray-500 max-w-md mx-auto mb-8">
             Congratulations! Your store now displays the verified badge. Customers can shop with full confidence.
           </p>

           <div className="flex justify-center">
             <div className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2">
               <ShieldAlert size={16} /> Trust Score: 100%
             </div>
           </div>
        </div>
      )}

    </div>
  );
}