"use client";

import { useState } from "react";
import { Copy, Check, Share2, QrCode, X, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { sellerStorefrontTenantUrl } from "@/lib/storefrontPublicUrl";

function resolveAccentColor(raw: string | undefined): string {
  const value = String(raw || "").trim();
  return /^#([0-9a-f]{6})$/i.test(value) ? value : "#059669";
}

export default function ShareStore({ slug, accent }: { slug: string; accent?: string }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const storeUrl = sellerStorefrontTenantUrl(slug);
  const primary = resolveAccentColor(accent);
  const r = parseInt(primary.slice(1, 3), 16);
  const g = parseInt(primary.slice(3, 5), 16);
  const b = parseInt(primary.slice(5, 7), 16);
  const softStrong = `rgba(${r}, ${g}, ${b}, 0.34)`;

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
      <div
        className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.95), rgba(${r}, ${g}, ${b}, 0.78))`,
        }}
      >
        <div className="relative z-10">
          <h3 className="mb-1 flex items-center gap-2 text-lg font-bold">
            <Share2 size={20} className="text-white/80" />
            Share Your Store
          </h3>
          <p className="mb-4 text-sm text-white/85">Get customers to visit your link.</p>

          <p className="mb-4 break-all font-mono text-xs font-semibold text-white/90">{storeUrl.replace(/^https:\/\//, "")}</p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-bold backdrop-blur-md transition"
              style={{ borderColor: "rgba(255,255,255,0.35)", backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <button
              type="button"
              onClick={() => setShowQR(true)}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition"
              style={{ backgroundColor: softStrong }}
            >
              <QrCode size={16} />
              QR Code
            </button>
          </div>
        </div>

        <Share2 size={120} className="absolute -bottom-6 -right-6 rotate-12 text-white/5" aria-hidden />
      </div>

      {showQR && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="animate-in zoom-in-95 relative w-full max-w-sm rounded-3xl bg-white p-6 text-center">
            <button
              type="button"
              onClick={() => setShowQR(false)}
              className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h3 className="mb-2 text-xl font-bold text-gray-900">Your Store QR Code</h3>
            <p className="mb-6 text-sm text-gray-500">Customers can scan this to visit your store immediately.</p>

            <div className="mb-6 inline-block rounded-2xl border-2 border-gray-100 bg-white p-4 shadow-sm">
              <QRCodeSVG id="store-qr-code" value={storeUrl} size={200} level="H" includeMargin />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowQR(false)}
                className="flex-1 rounded-xl py-3 font-bold text-gray-500 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={downloadQR}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-bold text-white shadow-lg"
                style={{ backgroundColor: primary }}
              >
                <Download size={18} />
                Save QR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
