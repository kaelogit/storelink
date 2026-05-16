"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Loader2, Lock, ShieldCheck, X } from "lucide-react";
import { getPaystackPublicKey, paystackCountryNameForCurrency, toSmallestUnit } from "@/lib/paystackPublic";

const MESSAGE_PREFIX = "STORELINK_PAYSTACK:";

type PaystackTerminalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reference: string) => void;
  email: string;
  amount: number;
  currency?: string;
  metadata?: Record<string, unknown>;
};

export function PaystackTerminalModal({
  isOpen,
  onClose,
  onSuccess,
  email,
  amount,
  currency = "NGN",
  metadata,
}: PaystackTerminalModalProps) {
  const id = useId();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeNonce, setIframeNonce] = useState(0);
  const [iframeReady, setIframeReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const currencyCode = currency.toUpperCase();
  const paystackKey = getPaystackPublicKey(currencyCode);
  const amountSmallest = toSmallestUnit(amount, currencyCode);
  const countryLabel = paystackCountryNameForCurrency(currencyCode);
  const amountInvalid = !Number.isFinite(amount) || amount <= 0 || !Number.isFinite(amountSmallest) || amountSmallest < 1;

  const htmlDoc = useMemo(() => {
    if (!paystackKey || amountInvalid) return "";
    const metaObj = metadata && typeof metadata === "object" ? metadata : {};
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>body{margin:0;background:#ffffff;color:#111827;min-height:100dvh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;}</style>
</head>
<body>
  <script src="https://js.paystack.co/v1/inline.js"></script>
  <script>
    (function () {
      function post(payload) {
        if (window.parent) {
          window.parent.postMessage('${MESSAGE_PREFIX}' + JSON.stringify(payload), '*');
        }
      }
      function payWithPaystack() {
        var handler = PaystackPop.setup({
          key: ${JSON.stringify(paystackKey)},
          email: ${JSON.stringify(email)},
          amount: ${amountSmallest},
          currency: ${JSON.stringify(currencyCode)},
          metadata: ${JSON.stringify(metaObj)},
          onClose: function () {
            post({ kind: 'close' });
          },
          callback: function (response) {
            post({ kind: 'success', reference: String(response && response.reference ? response.reference : '') });
          }
        });
        handler.openIframe();
      }
      try {
        payWithPaystack();
      } catch (e) {
        post({ kind: 'error', message: String(e && e.message ? e.message : e) });
      }
    })();
  </script>
</body>
</html>`;
  }, [amountSmallest, amountInvalid, currencyCode, email, metadata, paystackKey]);

  useEffect(() => {
    if (!isOpen) return;
    setLoadError(null);
    setIframeReady(false);
    setIframeNonce((n) => n + 1);
  }, [isOpen, htmlDoc]);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const win = iframeRef.current?.contentWindow;
      if (!win || event.source !== win) return;
      const raw = typeof event.data === "string" ? event.data : "";
      if (!raw.startsWith(MESSAGE_PREFIX)) return;

      let payload: { kind?: string; reference?: string; message?: string };
      try {
        payload = JSON.parse(raw.slice(MESSAGE_PREFIX.length)) as typeof payload;
      } catch {
        return;
      }

      if (payload.kind === "success" && payload.reference) {
        onSuccess(payload.reference);
        return;
      }
      if (payload.kind === "close") {
        onClose();
        return;
      }
      if (payload.kind === "error" && payload.message) {
        setLoadError(payload.message);
      }
    },
    [onClose, onSuccess],
  );

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (amountInvalid) {
      setLoadError(
        "Transaction amount was not set. Close this screen and open your bag, then tap checkout again.",
      );
      return;
    }
    if (!paystackKey) {
      setLoadError(`Payments for ${countryLabel} are not configured yet.`);
    }
  }, [amountInvalid, countryLabel, isOpen, paystackKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-white" role="dialog" aria-modal="true" aria-labelledby={`${id}-title`}>
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 px-3 py-1.5">
          <Lock size={12} className="text-emerald-600" strokeWidth={3} />
          <span id={`${id}-title`} className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Secure terminal</span>
        </div>
        <button type="button" onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-800" aria-label="Close payment">
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        {paystackKey && htmlDoc ? (
          <>
            <iframe
              key={iframeNonce}
              ref={iframeRef}
              title="Paystack checkout"
              className="h-full min-h-[50vh] w-full border-0 bg-white"
              srcDoc={htmlDoc}
              sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
              onLoad={() => setIframeReady(true)}
            />
            {!iframeReady && !loadError ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/95 px-6 text-center backdrop-blur-sm">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
                <p className="text-sm font-semibold text-gray-900">Opening secure checkout...</p>
              </div>
            ) : null}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-sm font-semibold text-gray-900">Payment unavailable</p>
            <p className="max-w-md text-sm text-gray-500">{loadError}</p>
            <button type="button" onClick={onClose} className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white">Close</button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-gray-200 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
        <ShieldCheck size={14} />
        Protected escrow checkout
      </div>
    </div>
  );
}
