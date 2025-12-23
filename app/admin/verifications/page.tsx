"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle, XCircle, FileText, ExternalLink, Camera, UserCircle } from "lucide-react";

export default function AdminVerifications() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    const { data, error } = await supabase.rpc('get_pending_verifications');

    if (error) {
       console.error("RPC Error:", error);
    } else {
       setRequests(data || []);
    }
    setLoading(false);
  }

  const handleApprove = async (store: any) => {
    if (!confirm(`Verify ${store.name}?`)) return;
    setProcessing(true);

    const { error } = await supabase.rpc('admin_approve_store', { target_store_id: store.id });

    if (!error) {
      await supabase.from('notifications').insert({
        user_id: store.owner_id,
        title: 'Verification Approved! 🎉',
        message: 'Congratulations! Your store is now verified. You have the blue badge.',
        type: 'success'
      });
      fetchRequests(); 
    } else {
      alert("Error: " + error.message);
    }
    setProcessing(false);
  };

  const handleReject = async (store: any) => {
    if (!rejectReason.trim()) return alert("Please enter a reason.");
    setProcessing(true);

    const { error } = await supabase.rpc('admin_reject_store', { 
       target_store_id: store.id,
       reason: rejectReason 
    });
    
    if (!error) {
      await supabase.from('notifications').insert({
        user_id: store.owner_id,
        title: 'Verification Rejected',
        message: `Your verification request was rejected. Reason: ${rejectReason}. Please upload a valid ID.`,
        type: 'warning'
      });
      
      setRejectingId(null);
      setRejectReason("");
      fetchRequests(); 
    } else {
      alert("Error: " + error.message);
    }
    setProcessing(false);
  };

  if (loading) return <div className="p-10 text-white flex justify-center"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <CheckCircle className="text-emerald-500" /> Pending Verifications
        </h1>
        <p className="text-gray-400">Review documents and compare selfies to approve blue badges.</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center">
          <CheckCircle size={48} className="text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">All Caught Up!</h3>
          <p className="text-gray-500">No pending verification requests.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
               
               <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{req.name}</h3>
                    <p className="text-gray-400 text-sm">{req.location}</p>
                    <p className="text-gray-500 text-xs font-mono mt-1">ID: {req.id}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a 
                      href={req.verification_doc_url} 
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
                        <span className="text-sm font-bold text-white">View ID Card</span>
                      </div>
                    </a>

                    <a 
                      href={req.verification_selfie_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex flex-col gap-2 p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Selfie</span>
                        <ExternalLink size={12} className="text-gray-500 group-hover:text-emerald-400" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Camera className="text-blue-400" size={24} />
                        <span className="text-sm font-bold text-white">View Selfie</span>
                      </div>
                    </a>
                  </div>
               </div>

               <div className="w-full md:w-72 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-6">
                  
                  {rejectingId === req.id ? (
                    <div className="space-y-3 animate-in fade-in">
                       <p className="text-white text-sm font-bold">Reason for Rejection:</p>
                       <textarea 
                         className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white text-sm focus:border-red-500 outline-none"
                         rows={2}
                         placeholder="e.g. ID is blurry, Name mismatch..."
                         value={rejectReason}
                         onChange={e => setRejectReason(e.target.value)}
                       />
                       <div className="flex gap-2">
                         <button 
                           disabled={processing}
                           onClick={() => handleReject(req)}
                           className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg"
                         >
                           {processing ? "Sending..." : "Confirm Reject"}
                         </button>
                         <button 
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
                        disabled={processing}
                        onClick={() => handleApprove(req)}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        <CheckCircle size={18} /> Approve & Verify
                      </button>
                      
                      <button 
                        disabled={processing}
                        onClick={() => setRejectingId(req.id)}
                        className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-red-400 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        <XCircle size={18} /> Reject Request
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