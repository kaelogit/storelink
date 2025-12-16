"use client";

import { useState } from "react";
import { Copy, Check, Share2, QrCode, X, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function ShareStore({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const storeUrl = `https://storelink.ng/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
     const svg = document.getElementById("store-qr-code");
     if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
           canvas.width = img.width;
           canvas.height = img.height;
           ctx?.drawImage(img, 0, 0);
           const pngFile = canvas.toDataURL("image/png");
           const downloadLink = document.createElement("a");
           downloadLink.download = `${slug}-qr.png`;
           downloadLink.href = pngFile;
           downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
     }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
         <div className="relative z-10">
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
               <Share2 size={20} className="text-emerald-300"/> Share Your Store
            </h3>
            <p className="text-emerald-100 text-sm mb-4">Get customers to visit your link.</p>
            
            <div className="flex gap-2">
                <button 
                  onClick={handleCopy} 
                  className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
                >
                   {copied ? <Check size={16} /> : <Copy size={16} />} 
                   {copied ? "Copied!" : "Copy Link"}
                </button>
                <button 
                   onClick={() => setShowQR(true)}
                   className="bg-white text-emerald-900 py-2.5 px-4 rounded-xl font-bold text-sm hover:bg-emerald-50 transition flex items-center gap-2"
                >
                   <QrCode size={16} /> QR Code
                </button>
            </div>
         </div>
         
         <Share2 size={120} className="absolute -bottom-6 -right-6 text-white/5 rotate-12" />
      </div>

      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center relative animate-in zoom-in-95">
              <button 
                onClick={() => setShowQR(false)} 
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              >
                 <X size={20} />
              </button>

              <h3 className="font-bold text-xl text-gray-900 mb-2">Your Store QR Code</h3>
              <p className="text-gray-500 text-sm mb-6">Customers can scan this to visit your store immediately.</p>

              <div className="bg-white p-4 rounded-2xl border-2 border-gray-100 inline-block mb-6 shadow-sm">
                 <QRCodeSVG 
                    id="store-qr-code"
                    value={storeUrl} 
                    size={200} 
                    level={"H"}
                    includeMargin={true}
                 />
              </div>

              <div className="flex gap-2">
                 <button onClick={() => setShowQR(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Close</button>
                 <button onClick={() => window.print()} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 flex items-center justify-center gap-2">
                    <Download size={18} /> Print / Save
                 </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}