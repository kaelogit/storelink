"use client";

import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { useCart } from "@/context/CartContext";
import {
  X,
  ShoppingBag,
  User,
  Trash2,
  Loader2,
  Coins,
  Zap,
  RefreshCw,
  Send,
  Check,
  Minus,
  Plus,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import { sendGAEvent } from '@next/third-parties/google';
import { PaystackTerminalModal } from "@/components/shared/PaystackTerminalModal";
import { fetchOnboardingContext, isProfileOnboardingComplete } from "@/lib/onboardingState";
import { isWalletTableUnavailable } from "@/lib/walletSync";
import { TOUCH_TARGET, STOREFRONT_GUTTER_X, STOREFRONT_SAFE_BOTTOM } from "@/lib/mobileLayout";
import {
  formatShippingAddressForCheckout,
  parseShippingDetails,
  pickDefaultSavedAddress,
  profilePhoneToFormValue,
  type ShippingAddress,
} from "@/lib/shippingAddresses";
import { estimateNgnSellerSettlementFromGross } from "@/lib/settlementFees";

function isAbortLikeError(err: unknown) {
  const msg = String((err as { message?: string } | null)?.message || err || "").toLowerCase();
  return msg.includes("aborterror") || msg.includes("signal is aborted");
}

type ReceiptLine = { name: string; quantity: number; unitPrice: number };

type PendingPayment = {
  orderId: string;
  /** Seller profile id (`profiles.id`) — matches `orders.seller_id` / `products.seller_id`. */
  sellerId: string;
  /** Seller notification email (sent only after Paystack confirms payment). */
  sellerNotifyEmail: string | null;
  storeName: string;
  finalPayable: number;
  cleanPhone: string;
  cleanEmail: string;
  coinsToApply: number;
  itemIds: string[];
  checkoutMode: "account";
  customerName: string;
  shippingAddress: string;
  storeTotalGross: number;
  itemLines: ReceiptLine[];
};

export default function GlobalCartSidebar() {
  const router = useRouter();
  const context = useCart();
  if (!context) return null;

  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    useCoins,
    setUseCoins,
    actualBalance,
    setActualBalance,
  } = context;

  const pathname = usePathname();
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", email: "" });
  const [accountUserId, setAccountUserId] = useState<string | null>(null);
  const [authGate, setAuthGate] = useState<null | { sellerId: string; store: any; items: any[] }>(null);
  const [signupPassword, setSignupPassword] = useState("");
  const [authGateBusy, setAuthGateBusy] = useState(false);
  const [authGateError, setAuthGateError] = useState("");
  const [authGateInfo, setAuthGateInfo] = useState("");
  const [authGateAgreedLegal, setAuthGateAgreedLegal] = useState(false);
  const [loadingStoreId, setLoadingStoreId] = useState<string | null>(null);
  const [isSyncingWallet, setIsSyncingWallet] = useState(false);
  const [liveStoreSettings, setLiveStoreSettings] = useState<Record<string, any>>({});
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pendingStoreName, setPendingStoreName] = useState("");
  const [pendingOrderId, setPendingOrderId] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [paystackOpen, setPaystackOpen] = useState(false);
  const [settlingPayment, setSettlingPayment] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);
  /** Major currency units (e.g. ₦) — set synchronously before opening Paystack so the modal never reads amount 0 on the first paint. */
  const paystackChargeMajorRef = useRef(0);
  const [checkoutFollowUp, setCheckoutFollowUp] = useState<"none" | "profile">("none");
  const [profileContinueHref, setProfileContinueHref] = useState<string | null>(null);
  const [savedShippingAddresses, setSavedShippingAddresses] = useState<ShippingAddress[]>([]);
  const [profileLocationLine, setProfileLocationLine] = useState("");
  const [deliverySelectValue, setDeliverySelectValue] = useState<string>("custom");

  // Load billing data from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("storelink_billing");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, unknown>;
        setFormData({
          name: String(parsed.name ?? ""),
          phone: String(parsed.phone ?? ""),
          address: String(parsed.address ?? ""),
          email: String(parsed.email ?? ""),
        });
        const p = String(parsed.phone ?? "");
        if (p.replace(/\D/g, "").length >= 10) {
          void syncStoreCoinWallet(p);
        }
      } catch (e) {
        console.error("Billing parse error", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!accountUserId) {
      setUseCoins(false);
    }
  }, [accountUserId, setUseCoins]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccountUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (accountUserId && authGate) {
      setAuthGate(null);
      setAuthGateError("");
      setAuthGateInfo("");
      setSignupPassword("");
      setAuthGateAgreedLegal(false);
    }
  }, [accountUserId, authGate]);

  useEffect(() => {
    if (!isCartOpen || !accountUserId) {
      if (!isCartOpen) {
        setSavedShippingAddresses([]);
        setProfileLocationLine("");
      }
      return;
    }
    let cancelled = false;
    void (async () => {
      const [{ data: authData }, { data: profile }] = await Promise.all([
        supabase.auth.getUser(),
        supabase
          .from("profiles")
          .select("full_name, display_name, phone_number, email, shipping_details, location")
          .eq("id", accountUserId)
          .maybeSingle(),
      ]);
      if (cancelled) return;
      const user = authData?.user;
      const addresses = parseShippingDetails(profile?.shipping_details);
      const displayName = String(profile?.display_name || profile?.full_name || "").trim();
      const email = String(user?.email || (profile as { email?: string } | null)?.email || "").trim();
      const phone = profilePhoneToFormValue(profile?.phone_number as string | null | undefined);
      const loc = String(profile?.location || "").trim();
      setSavedShippingAddresses(addresses);
      setProfileLocationLine(loc);
      const defaultAddr = pickDefaultSavedAddress(addresses);
      let nextAddress = "";
      let selectVal = "custom";
      if (defaultAddr) {
        nextAddress = formatShippingAddressForCheckout(defaultAddr);
        selectVal = defaultAddr.id;
      } else if (loc) {
        nextAddress = loc;
        selectVal = "profile_location";
      }
      setFormData((prev) => {
        const merged = {
          name: displayName || prev.name,
          phone: phone || prev.phone,
          email: email || prev.email,
          address: nextAddress || prev.address,
        };
        localStorage.setItem("storelink_billing", JSON.stringify(merged));
        return merged;
      });
      setDeliverySelectValue(selectVal);
    })();
    return () => {
      cancelled = true;
    };
  }, [isCartOpen, accountUserId]);

  // Sync wallet balance and store-specific settings (like owner_email)
  useEffect(() => {
    const fetchEverything = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user ?? null;
      setAccountUserId(user?.id ?? null);

      if (user?.email && !(formData.email || "").trim()) {
        setFormData((prev) => ({ ...prev, email: user.email || "" }));
      }

      if (user?.id) {
        const { data: prof } = await supabase.from("profiles").select("coin_balance").eq("id", user.id).maybeSingle();
        if (prof && prof.coin_balance != null) {
          setActualBalance(Number(prof.coin_balance));
        }
      } else {
        const savedBilling = localStorage.getItem("storelink_billing");
        let cleanPhone = "";

        if (savedBilling) {
          try {
            const parsed = JSON.parse(savedBilling);
            cleanPhone = String(parsed.phone ?? "").replace(/\D/g, "").slice(-10);
          } catch (e) {
            console.error(e);
          }
        }

        if (cleanPhone && cleanPhone.length >= 10) {
          const { data: wallet, error: walletErr } = await supabase
            .from("user_wallets")
            .select("coin_balance")
            .eq("phone_number", cleanPhone)
            .maybeSingle();

          if (walletErr && isWalletTableUnavailable(walletErr)) {
            setActualBalance(0);
          } else if (wallet) {
            setActualBalance(Number(wallet.coin_balance ?? 0));
          } else {
            setActualBalance(0);
          }
        } else {
          setActualBalance(0);
        }
      }

      const sellerIds = Array.from(new Set(cart.map((item) => item.store.owner_id)));
      if (sellerIds.length > 0) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, email, loyalty_enabled, loyalty_percentage")
          .in("id", sellerIds);

        if (profs?.length) {
          const settingsMap = profs.reduce(
            (acc, p) => ({
              ...acc,
              [p.id]: {
                owner_email: p.email,
                loyalty_enabled: p.loyalty_enabled ?? false,
                loyalty_percentage: Number(p.loyalty_percentage ?? 0),
              },
            }),
            {} as Record<string, Record<string, unknown>>
          );
          setLiveStoreSettings(settingsMap);
        }
      }
    };

    if (isCartOpen) {
      fetchEverything();
    }
  }, [isCartOpen, cart.length, setActualBalance, formData.email]);

  const syncStoreCoinWallet = async (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10); 
    if (cleanPhone.length < 10) return;

    setIsSyncingWallet(true);
    try {
      let rpcData: any[] | null = null;
      let rpcError: any = null;

      const attemptWithPhone = await supabase.rpc('sync_or_create_wallet', { phone: cleanPhone });
      rpcData = (attemptWithPhone.data as any[] | null) ?? null;
      rpcError = attemptWithPhone.error;

      if (rpcError) {
        const attemptWithArgPhone = await supabase.rpc('sync_or_create_wallet', { arg_phone: cleanPhone });
        rpcData = (attemptWithArgPhone.data as any[] | null) ?? null;
        rpcError = attemptWithArgPhone.error;
      }

      if (rpcError) {
        const { data: wallet, error: walletError } = await supabase
          .from("user_wallets")
          .select("coin_balance, customer_name")
          .eq("phone_number", cleanPhone)
          .maybeSingle();

        if (walletError) {
          if (isWalletTableUnavailable(walletError)) {
            setActualBalance(0);
            return;
          }
          throw walletError;
        }
        if (wallet) {
          setActualBalance(Number(wallet.coin_balance || 0));
          if (wallet.customer_name && !formData.name) {
            setFormData((prev) => ({ ...prev, name: wallet.customer_name }));
          }
        }
        return;
      }

      if (rpcData && rpcData.length > 0) {
        setActualBalance(rpcData[0].coin_balance); 
        if (rpcData[0].customer_name && !formData.name) {
          setFormData(prev => ({ ...prev, name: rpcData[0].customer_name }));
        }
      }
    } catch (err: unknown) {
      if (!isWalletTableUnavailable(err) && !isAbortLikeError(err)) {
        console.error("Wallet Sync Error:", (err as Error)?.message || err);
      }
    } finally {
      setIsSyncingWallet(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    localStorage.setItem("storelink_billing", JSON.stringify(newData));
    
    if (field === "phone" && value.replace(/\D/g, '').length >= 10) {
      syncStoreCoinWallet(value);
    }
  };

  const applyDeliverySelect = (value: string) => {
    setDeliverySelectValue(value);
    if (value === "custom") return;
    const addr = savedShippingAddresses.find((a) => a.id === value);
    let nextAddr = "";
    if (addr) nextAddr = formatShippingAddressForCheckout(addr);
    else if (value === "profile_location" && profileLocationLine.trim()) nextAddr = profileLocationLine.trim();
    if (!nextAddr) return;
    setFormData((prev) => {
      const newData = { ...prev, address: nextAddr };
      localStorage.setItem("storelink_billing", JSON.stringify(newData));
      return newData;
    });
  };

  const startVendorCheckout = (sellerId: string, storeData: any, items: any[]) => {
    setCheckoutError("");
    if (!formData.address.trim()) {
      setCheckoutError("Add your delivery address before checkout.");
      return;
    }
    if (!formData.name.trim() || formData.phone.replace(/\D/g, "").length < 10) {
      setCheckoutError("Add your name and a valid phone number before checkout.");
      return;
    }
    if (accountUserId) {
      void handleCheckout(sellerId, storeData, items);
      return;
    }
    const gateEmail = (formData.email || "").trim().toLowerCase();
    if (gateEmail.length < 3 || !gateEmail.includes("@")) {
      setCheckoutError("Add a valid email — we use it for your account and order updates.");
      return;
    }
    setAuthGateError("");
    setAuthGateInfo("");
    setSignupPassword("");
    setAuthGateAgreedLegal(false);
    setAuthGate({ sellerId, store: storeData, items });
  };

  const runSignupFromGate = async () => {
    if (!authGate) return;
    setAuthGateBusy(true);
    setAuthGateError("");
    setAuthGateInfo("");
    try {
      const email = (formData.email || "").trim().toLowerCase();
      const pw = signupPassword;
      if (email.length < 3 || !email.includes("@")) {
        setAuthGateError("Enter a valid email.");
        return;
      }
      if (!authGateAgreedLegal) {
        setAuthGateError("Please agree to the Terms of Service and Privacy Policy.");
        return;
      }
      const pwHasNumber = /\d/.test(pw);
      if (pw.length < 8 || !pwHasNumber) {
        setAuthGateError("Password must be at least 8 characters and include at least one number.");
        return;
      }
      if (!formData.name.trim()) {
        setAuthGateError("Full name is required.");
        return;
      }
      const cleanPhone = formData.phone.replace(/\D/g, "").slice(-10);
      if (cleanPhone.length < 10) {
        setAuthGateError("Enter a valid phone number.");
        return;
      }
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pw,
        options: {
          emailRedirectTo: origin ? `${origin}/post-login` : undefined,
          data: {
            display_name: formData.name.trim(),
            full_name: formData.name.trim(),
            phone_number: `234${cleanPhone}`,
          },
        },
      });
      if (error) throw error;
      const sess = data.session;
      const uid = data.user?.id;
      if (sess && uid) {
        setAccountUserId(uid);
        const addressParts = formData.address
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
        const inferredState = addressParts.length >= 1 ? addressParts[addressParts.length - 1] : null;
        const inferredCity = addressParts.length >= 2 ? addressParts[addressParts.length - 2] : null;
        const { error: profErr } = await supabase.from("profiles").upsert(
          {
            id: uid,
            email,
            full_name: formData.name.trim(),
            display_name: formData.name.trim(),
            phone_number: `234${cleanPhone}`,
            location: formData.address.trim(),
            location_state: inferredState,
            location_city: inferredCity,
            acquisition_channel: "storefront",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
        if (profErr) {
          console.error("Checkout gate profile upsert:", profErr);
          throw new Error(profErr.message || "Could not save your profile. Try logging in, or contact support.");
        }
        setAuthGate(null);
        setSignupPassword("");
        setAuthGateAgreedLegal(false);
        await handleCheckout(authGate.sellerId, authGate.store, authGate.items, { userIdOverride: uid });
      } else {
        setAuthGateInfo(
          "Check your inbox to verify your email. After verification, log in with this email — your cart is saved here — then tap checkout again."
        );
      }
    } catch (e: unknown) {
      const msg = String((e as { message?: string })?.message || e || "");
      if (/already registered|already been registered|User already/i.test(msg)) {
        setAuthGateError("An account with this email already exists. Use “Log in instead”, then checkout again.");
      } else if (/Database error saving new user|database error/i.test(msg)) {
        setAuthGateError(
          "We could not finish creating your account (server profile step). This is often fixed by applying the latest Supabase migration, or the email may already be in use — try Log in instead."
        );
      } else {
        setAuthGateError(msg || "Sign up failed.");
      }
    } finally {
      setAuthGateBusy(false);
    }
  };

  const finalizePaidOrder = async (reference: string) => {
    if (!pendingPayment) return;
    const receipt = pendingPayment;
    setSettlingPayment(true);
    setCheckoutError("");
    try {
      const confirmRes = await fetch("/api/paystack/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: receipt.orderId,
          reference,
        }),
      });
      if (!confirmRes.ok) {
        const payload = await confirmRes.json().catch(() => ({}));
        throw new Error(payload?.error || "Payment verification failed.");
      }

      for (let i = 0; i < 6; i += 1) {
        const { data: latestOrder } = await supabase
          .from("orders")
          .select("status")
          .eq("id", receipt.orderId)
          .maybeSingle();
        const latestStatus = String((latestOrder as { status?: string } | null)?.status || "").toUpperCase();
        if (["PAID", "SHIPPED", "COMPLETED", "DISPUTE_OPEN"].includes(latestStatus)) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      if (receipt.coinsToApply > 0) {
        await supabase.rpc("decrement_wallet", {
          arg_phone: receipt.cleanPhone,
          arg_amount: Number(receipt.coinsToApply),
          arg_store: String(receipt.storeName),
        });
        setUseCoins(false);
      }

      const buyerEmail = (receipt.cleanEmail || "").trim().toLowerCase();
      if (buyerEmail.includes("@")) {
        void fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "BUYER_CHECKOUT_RECEIPT",
            email: buyerEmail,
            data: {
              orderId: receipt.orderId,
              orderShortId: String(receipt.orderId).slice(0, 8).toUpperCase(),
              storeName: receipt.storeName,
              customerName: receipt.customerName,
              shippingAddress: receipt.shippingAddress,
              storeTotalGross: receipt.storeTotalGross,
              coinsApplied: receipt.coinsToApply,
              amountPaid: receipt.finalPayable,
              items: receipt.itemLines,
            },
          }),
        }).catch((e) => console.error("Buyer receipt email failed:", e));
      }

      const sellerNotify = (receipt.sellerNotifyEmail || "").trim().toLowerCase();
      if (sellerNotify.includes("@")) {
        void fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "CHECKOUT_ALERT",
            email: sellerNotify,
            data: {
              paymentCompleted: true,
              productName: receipt.itemLines.map((l) => l.name),
              storeName: receipt.storeName,
              customerName: receipt.customerName,
              customerEmail: buyerEmail || "—",
              customerPhone: receipt.cleanPhone ? `0${receipt.cleanPhone}` : "—",
              orderAmount: receipt.finalPayable,
              orderIdFull: receipt.orderId,
              orderShortId: String(receipt.orderId).slice(0, 8).toUpperCase(),
            },
          }),
        }).catch((e) => console.error("Seller paid-order email failed:", e));
      }

      let followUp: "none" | "profile" = "none";
      let nextProfileHref: string | null = null;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) {
        const ctx = await fetchOnboardingContext(supabase, user.id);
        if (ctx.profile && !isProfileOnboardingComplete(ctx.profile)) {
          followUp = "profile";
          nextProfileHref = "/onboarding/role";
        }
      }
      setCheckoutFollowUp(followUp);
      setProfileContinueHref(nextProfileHref);

      setPendingStoreName(receipt.storeName);
      setPendingOrderId(String(receipt.orderId).slice(0, 8).toUpperCase());
      setShowSuccessModal(true);
      sendGAEvent("event", "purchase", { store: receipt.storeName, value: receipt.finalPayable });
      receipt.itemIds.forEach((id) => removeFromCart(id));
      setPendingPayment(null);
      paystackChargeMajorRef.current = 0;
    } catch (err: any) {
      setCheckoutError(err?.message || "Payment verification failed.");
    } finally {
      setSettlingPayment(false);
      setPaystackOpen(false);
    }
  };

  const handleCheckout = async (
    sellerId: string,
    storeData: any,
    items: any[],
    opts?: { userIdOverride?: string | null },
  ) => {
    setCheckoutError("");
    const uuidRe =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const fromStore = typeof sellerId === "string" ? sellerId.trim() : "";
    const fromProduct =
      typeof items[0]?.product?.seller_id === "string" ? String(items[0].product.seller_id).trim() : "";
    const effectiveSellerId = uuidRe.test(fromStore) ? fromStore : uuidRe.test(fromProduct) ? fromProduct : "";
    if (!effectiveSellerId) {
      setCheckoutError(
        "This bag is missing seller information (often from an old saved cart). Empty the bag, add the products again, then checkout.",
      );
      setLoadingStoreId(null);
      return;
    }
    setLoadingStoreId(effectiveSellerId);
    const cleanPhone = formData.phone.replace(/\D/g, "").slice(-10);
    const cleanEmail = (formData.email || "").trim().toLowerCase();
    const uid = (opts?.userIdOverride ?? accountUserId)?.trim() || null;

    if (!uid) {
      setCheckoutError(
        cleanEmail.includes("@")
          ? "We couldn’t attach your session to checkout yet. Close the cart, wait a second, and tap checkout again — or refresh the page."
          : "Sign in to complete checkout.",
      );
      setLoadingStoreId(null);
      return;
    }

    if (!cleanEmail.includes("@")) {
      setCheckoutError("Add a valid email for receipts and account recovery.");
      setLoadingStoreId(null);
      return;
    }

    try {
        // Mini onboarding sync for account checkout:
        // persist essentials so users don't repeat onboarding later in app.
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_seller, full_name, display_name, phone_number, slug, location, location_state, location_city, onboarding_step")
          .eq("id", uid)
          .maybeSingle();

        const addressParts = formData.address
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
        const inferredState = addressParts.length >= 1 ? addressParts[addressParts.length - 1] : null;
        const inferredCity = addressParts.length >= 2 ? addressParts[addressParts.length - 2] : null;

        const updates: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };
        if (!profile?.full_name && formData.name.trim()) updates.full_name = formData.name.trim();
        if (!profile?.display_name && formData.name.trim()) updates.display_name = formData.name.trim();
        if (!profile?.phone_number && cleanPhone) updates.phone_number = `234${cleanPhone}`;
        if (!profile?.location && formData.address.trim()) updates.location = formData.address.trim();
        if (!profile?.location_state && inferredState) updates.location_state = inferredState;
        if (!profile?.location_city && inferredCity) updates.location_city = inferredCity;
        // Do not advance onboarding_step / onboarding_completed here. Checkout pre-fills profile
        // fields only; /onboarding/role must stay first so users can choose shopper vs storefront.

        if (Object.keys(updates).length > 1) {
          await supabase.from("profiles").update(updates).eq("id", uid);
        }

        const lineTotal = (i: any) => Number(i?.product?.price ?? 0) * Number(i?.qty ?? 0);
        const storeTotal = Math.round(items.reduce((sum: number, i: any) => sum + lineTotal(i), 0));
        const allowCoins = !!uid && useCoins;
        const coinsToApply = allowCoins ? Math.min(actualBalance, Math.floor(storeTotal * 0.05)) : 0;
        const finalPayable = Math.max(0, Math.round(storeTotal - coinsToApply));
        if (!Number.isFinite(finalPayable) || finalPayable < 1) {
          setCheckoutError("Order total is invalid or too low to charge. Check item prices and try again.");
          setLoadingStoreId(null);
          return;
        }

        const currentStoreSettings = liveStoreSettings[effectiveSellerId];
        const sellerNotifyEmail =
          typeof currentStoreSettings?.owner_email === "string"
            ? String(currentStoreSettings.owner_email).trim()
            : null;

        // RPC reads buyer name / phone / email from public.profiles (p_user_id); we only send delivery line + totals.
        // p_seller_id must always be a real UUID — undefined is omitted by JSON and PostgREST then looks up the wrong overload.
        const { data: newOrderId, error: orderError } = await supabase.rpc("create_new_order", {
          p_seller_id: effectiveSellerId,
          customer_address: formData.address,
          total_amount_paid: finalPayable,
          coins_used: coinsToApply,
          checkout_mode: "account",
          origin_channel: "storefront",
          p_user_id: uid,
          is_guest_checkout: false,
          order_items_array: items.map((item) => ({
            product_id: item.product.id,
            product_name: item.product.name,
            quantity: item.qty,
            price: item.product.price,
          })),
        });

        if (orderError) throw orderError;

        const nextPending: PendingPayment = {
          orderId: String(newOrderId),
          sellerId: effectiveSellerId,
          sellerNotifyEmail: sellerNotifyEmail && sellerNotifyEmail.includes("@") ? sellerNotifyEmail : null,
          storeName: String(storeData.name),
          finalPayable,
          cleanPhone,
          cleanEmail,
          coinsToApply,
          itemIds: items.map((item: any) => String(item.product.id)),
          checkoutMode: "account" as const,
          customerName: formData.name.trim(),
          shippingAddress: formData.address.trim(),
          storeTotalGross: storeTotal,
          itemLines: items.map((item: any) => ({
            name: String(item.product.name),
            quantity: Number(item.qty),
            unitPrice: Number(item.product.price),
          })),
        };
        paystackChargeMajorRef.current = finalPayable;
        flushSync(() => {
          setPendingPayment(nextPending);
          setPaystackOpen(true);
        });
    } catch (err: any) {
      setCheckoutError(err?.message || "Order failed. Please try again.");
    } finally {
      setLoadingStoreId(null);
    }
  };

  const isInternalPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
  if (isInternalPage || !isCartOpen) return null;

  const canApplyCoins = !!accountUserId;

  const cartByVendor = cart.reduce((acc, item) => {
    const vendorKey = item.store.owner_id;
    if (!acc[vendorKey]) acc[vendorKey] = { store: item.store, items: [] };
    acc[vendorKey].items.push(item);
    return acc;
  }, {} as Record<string, { store: any; items: any[] }>);

  const accountContactComplete =
    !!accountUserId &&
    formData.name.trim().length > 0 &&
    formData.phone.replace(/\D/g, "").length >= 10 &&
    (formData.email || "").includes("@");

  const showSavedAddressPicker =
    !!accountUserId && (savedShippingAddresses.length > 0 || !!profileLocationLine.trim());

  return (
    <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>

      <div className="relative flex h-dvh max-h-dvh w-full max-w-md flex-col bg-white pt-[env(safe-area-inset-top,0px)] pr-[env(safe-area-inset-right,0px)] shadow-2xl animate-in slide-in-from-right duration-300">
        
        {showSuccessModal && (
          <div className="absolute inset-0 z-110 bg-white flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-300">
             <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Check size={40} strokeWidth={3} />
             </div>
             <h2 className="font-black text-2xl uppercase tracking-tighter mb-2 text-gray-900">Order paid</h2>
             <p className="text-gray-500 text-sm font-medium mb-3">Your order for <span className="text-gray-900 font-bold">{pendingStoreName}</span> is confirmed.</p>
             <p className="text-gray-900 text-xs font-black uppercase tracking-widest mb-8">Order ID: #{pendingOrderId}</p>
             {checkoutFollowUp === "profile" && profileContinueHref && (
               <button
                 type="button"
                 onClick={() => {
                   setCheckoutFollowUp("none");
                   setShowSuccessModal(false);
                   setIsCartOpen(false);
                   router.push(profileContinueHref);
                 }}
                 className="mb-3 w-full bg-emerald-600 text-white py-3 rounded-[1.4rem] font-black text-[11px] uppercase tracking-widest hover:bg-emerald-700 transition-all"
               >
                 Continue account setup
               </button>
             )}
             
             <button 
              onClick={() => {
                setCheckoutFollowUp("none");
                setShowSuccessModal(false);
                if (cart.length === 0) setIsCartOpen(false);
              }}
              className="w-full bg-gray-900 text-white py-5 rounded-4xl font-black text-[13px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-200"
             >
                Continue shopping
             </button>

             <button 
              onClick={() => {
                setCheckoutFollowUp("none");
                setShowSuccessModal(false);
                if (cart.length === 0) setIsCartOpen(false);
              }}
              className="mt-6 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
             >
                Back to bag
             </button>
          </div>
        )}

        <div className="z-10 flex shrink-0 items-center justify-between border-b border-gray-100 bg-white p-4 pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] shadow-sm">
           <h2 className="font-black text-xl flex items-center gap-2 uppercase tracking-tighter"><ShoppingBag className="text-emerald-600" /> My Bag ({cart.length})</h2>
           <button
             type="button"
             onClick={() => setIsCartOpen(false)}
             className={`rounded-full bg-gray-50 text-gray-700 transition hover:bg-gray-100 ${TOUCH_TARGET}`}
             aria-label="Close cart"
           >
             <X size={20} />
           </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto bg-gray-50 p-4 pl-[max(1.25rem,env(safe-area-inset-left,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] pb-[calc(6rem+env(safe-area-inset-bottom,0px))]">
          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-900 mb-2 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <User size={14} className="text-emerald-500" /> Delivery details
              </h3>
              {accountUserId ? (
                <p className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mb-3">
                  Signed in — contact comes from your StoreLink profile. Choose where to deliver below. Store Coins apply when loyalty is on.
                </p>
              ) : (
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed mb-3">
                  Add your details once. When you tap <span className="font-black text-gray-800">Checkout with…</span>, we&apos;ll ask you to sign up or log in before payment — only takes a moment.
                </p>
              )}
              <div className="space-y-3">
                {accountUserId && accountContactComplete ? (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Contact on this order</p>
                    <p className="text-sm font-black text-gray-900">{formData.name}</p>
                    <p className="mt-1 text-xs font-bold text-gray-600">{formData.phone}</p>
                    <p className="mt-1 truncate text-[11px] font-medium text-gray-500">{formData.email}</p>
                    <button
                      type="button"
                      onClick={() => router.push("/account/settings")}
                      className="mt-3 text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-800"
                    >
                      Edit name &amp; phone in account
                    </button>
                  </div>
                ) : null}

                {(!accountUserId || !accountContactComplete) && (
                  <>
                    <input
                      placeholder="Full name"
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                    <input
                      placeholder="Phone number"
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                    <input
                      placeholder="Email"
                      type="email"
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </>
                )}

                {accountUserId && showSavedAddressPicker && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Saved delivery address</label>
                    <select
                      className="w-full appearance-none rounded-2xl border-none bg-gray-50 p-4 text-sm font-bold text-gray-900 outline-none ring-emerald-500 focus:ring-2"
                      value={deliverySelectValue}
                      onChange={(e) => applyDeliverySelect(e.target.value)}
                    >
                      {savedShippingAddresses.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.label} — {a.city}
                          {a.is_default ? " (default)" : ""}
                        </option>
                      ))}
                      {profileLocationLine.trim() ? (
                        <option value="profile_location">Profile location (one line)</option>
                      ) : null}
                      <option value="custom">Custom — edit box below</option>
                    </select>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCartOpen(false);
                          router.push("/dashboard/addresses");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-emerald-800 hover:bg-emerald-100"
                      >
                        <MapPin size={12} />
                        Manage saved addresses
                      </button>
                    </div>
                  </div>
                )}

                {accountUserId && !showSavedAddressPicker && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartOpen(false);
                        router.push("/dashboard/addresses");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[9px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50"
                    >
                      <MapPin size={12} />
                      Add saved addresses
                    </button>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-[9px] font-black uppercase tracking-widest text-gray-400">
                    {accountUserId ? "Delivery address" : "Full delivery address"}
                  </label>
                  <textarea
                    placeholder={accountUserId ? "Street, city, phone for rider…" : "Full delivery address"}
                    className="w-full min-h-[5.5rem] resize-none rounded-2xl border-none bg-gray-50 p-4 text-sm font-bold outline-none ring-emerald-500 focus:ring-2"
                    value={formData.address}
                    onChange={(e) => {
                      setDeliverySelectValue("custom");
                      handleChange("address", e.target.value);
                    }}
                  />
                </div>

                {!accountUserId && (
                  <button
                    type="button"
                    onClick={() => router.push(`/login?next=${encodeURIComponent(pathname || "/")}`)}
                    className="w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                  >
                    Already have an account? Log in
                  </button>
                )}
              </div>
            </div>

            {canApplyCoins && actualBalance > 0 && (
              <div className="space-y-3 animate-in zoom-in duration-300">
                <div className={`p-5 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center justify-between ${useCoins ? 'bg-amber-500 border-amber-400 shadow-xl' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`${useCoins ? 'bg-white text-amber-500' : 'bg-amber-500 text-white'} p-2.5 rounded-2xl shadow-sm`}><Coins size={20} fill="currentColor"/></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`text-[9px] font-black uppercase tracking-widest ${useCoins ? 'text-white' : 'text-amber-600'}`}>Your wallet balance</p>
                          <button type="button" onClick={() => syncStoreCoinWallet(formData.phone)} disabled={isSyncingWallet} className={`transition-all hover:scale-110 ${useCoins ? 'text-white/60' : 'text-amber-400'}`}><RefreshCw size={10} className={isSyncingWallet ? "animate-spin" : ""} /></button>
                        </div>
                        <p className={`text-lg font-black ${useCoins ? 'text-white' : 'text-gray-900'}`}>₦{actualBalance.toLocaleString()}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setUseCoins(!useCoins)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${useCoins ? 'bg-white text-amber-600' : 'bg-amber-500 text-white'}`}>
                      {useCoins ? "Applied" : "Apply Coins"}
                    </button>
                </div>
              </div>
            )}

            {!accountUserId && actualBalance > 0 && (
              <p className="text-[9px] text-amber-900 bg-amber-50 border border-amber-100 rounded-2xl p-3 font-medium leading-relaxed">
                Store Coins are tied to your StoreLink account. <strong>Log in</strong> after opening your bag to apply them at checkout.
              </p>
            )}

            {Object.entries(cartByVendor).map(([vendorKey, { store, items }]) => {
              const settings = {
                ...store,
                ...(liveStoreSettings[store.owner_id] || {}),
              };
              const storeTotal = items.reduce(
                (sum, i) => sum + Number(i.product.price ?? 0) * Number(i.qty ?? 0),
                0,
              );
              const discount =
                canApplyCoins && useCoins ? Math.min(actualBalance, Math.floor(storeTotal * 0.05)) : 0;
              const finalTotal = storeTotal - discount;
              const earned = settings.loyalty_enabled ? Math.floor(finalTotal * (settings.loyalty_percentage / 100)) : 0;

              return (
                <div key={vendorKey} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative mb-4">
                   <div className="flex justify-between items-start border-b border-gray-50 pb-4 mb-4">
                      <h3 className="font-black text-[11px] uppercase tracking-tighter text-gray-400">{store.name}</h3>
                      <div className="text-right">
                        {discount > 0 && <p className="text-[10px] text-gray-300 line-through font-bold">₦{storeTotal.toLocaleString()}</p>}
                        <span className="text-emerald-600 font-black text-xl tracking-tighter">₦{finalTotal.toLocaleString()}</span>
                      </div>
                   </div>

                   <div className="space-y-4 mb-6">
                      {items.map((item, lineIdx) => (
                        <div
                          key={`${vendorKey}-${String(item.product.id)}-${lineIdx}`}
                          className="flex gap-3 items-center group text-left min-w-0"
                        >
                          <div className="relative w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border shrink-0">
                            {item.product.image_urls?.[0] && (
                              <Image src={item.product.image_urls[0]} alt="" fill className="object-cover" unoptimized />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[13px] text-gray-900 uppercase truncate">{item.product.name}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              {item.product.compare_at_price != null &&
                              Number(item.product.compare_at_price) > Number(item.product.price) ? (
                                <span className="inline">
                                  <span className="text-gray-300 line-through decoration-gray-300">
                                    ₦{Number(item.product.compare_at_price).toLocaleString()}
                                  </span>{" "}
                                  <span className="text-emerald-600">₦{Number(item.product.price).toLocaleString()}</span>{" "}
                                  each
                                </span>
                              ) : (
                                <span className="inline">₦{Number(item.product.price).toLocaleString()} each</span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-gray-100 text-gray-600 hover:bg-gray-50`}
                              onClick={() => updateQuantity(item.product.id, item.qty - 1)}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-[2rem] text-center text-sm font-black text-gray-900">{item.qty}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-gray-100 text-gray-600 hover:bg-gray-50`}
                              onClick={() => updateQuantity(item.product.id, item.qty + 1)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className={`flex shrink-0 text-gray-300 transition-colors hover:text-red-500 ${TOUCH_TARGET}`}
                            aria-label="Remove line"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                   {settings.loyalty_enabled && (
                     <div className={`text-[9px] font-black p-4 rounded-2xl mb-6 flex flex-col gap-1 border bg-emerald-50 text-emerald-700 border-emerald-100`}>
                        <div className="flex items-center justify-between uppercase">
                            <span className="flex items-center gap-2"><Zap size={14} fill="currentColor" /> You are earning</span>
                            <span className="text-xs">+₦{earned.toLocaleString()}</span>
                        </div>
                        <p className="text-[7px] opacity-60 uppercase tracking-widest text-left">Calculated as {settings.loyalty_percentage}% of your ₦{finalTotal.toLocaleString()} total</p>
                     </div>
                   )}

                   
                   <button
                     type="button"
                     onClick={() => {
                       const pending = pendingPayment;
                       if (pending && pending.sellerId === store.owner_id) {
                         const major = Number(pending.finalPayable);
                         paystackChargeMajorRef.current = Number.isFinite(major) ? major : 0;
                         setPaystackOpen(true);
                         return;
                       }
                       startVendorCheckout(store.owner_id, store, items);
                     }}
                     disabled={
                       !formData.name.trim() ||
                       formData.phone.replace(/\D/g, "").length < 10 ||
                       !formData.address.trim() ||
                       loadingStoreId === store.owner_id ||
                       settlingPayment ||
                       (!!pendingPayment && pendingPayment.sellerId !== store.owner_id)
                     }
                     className="w-full bg-gray-900 text-white py-5 rounded-4xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:bg-gray-100 disabled:text-gray-300 flex items-center justify-center gap-2"
                   >
                     {loadingStoreId === store.owner_id ? (
                       <Loader2 className="animate-spin" size={18} />
                     ) : pendingPayment?.sellerId === store.owner_id ? (
                       <span className="inline-flex items-center justify-center gap-2">
                         <Send size={16} aria-hidden /> Continue payment
                       </span>
                     ) : (
                       <span className="inline-flex items-center justify-center gap-2">
                         <Send size={16} aria-hidden /> Checkout with {store.name}
                       </span>
                     )}
                   </button>
                </div>
              );
            })}
            {checkoutError && (
              <div className="bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 p-4">
                {checkoutError}
              </div>
            )}
          </div>
        </div>

        {authGate && (
          <div
            className={`absolute inset-0 z-[95] flex animate-in fade-in flex-col overflow-y-auto bg-white duration-200 ${STOREFRONT_GUTTER_X} pt-[max(1.5rem,env(safe-area-inset-top,0px))] ${STOREFRONT_SAFE_BOTTOM}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start gap-3 mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Checkout</p>
                <h3 className="text-lg font-black text-gray-900 tracking-tight mt-1">Almost there</h3>
                <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">
                  Create a free StoreLink account (same as signing up on our site), or log in — then you&apos;ll pay{" "}
                  <span className="font-bold text-gray-900">{authGate.store.name}</span> securely.
                </p>
              </div>
              <button
                type="button"
                className={`rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 ${TOUCH_TARGET}`}
                onClick={() => {
                  setAuthGate(null);
                  setAuthGateError("");
                  setAuthGateInfo("");
                  setAuthGateAgreedLegal(false);
                }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {authGateError ? (
              <div className="mb-3 rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-[11px] font-bold text-red-700">{authGateError}</div>
            ) : null}
            {authGateInfo ? (
              <div className="mb-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-[11px] font-medium text-emerald-900">{authGateInfo}</div>
            ) : null}

            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Password</label>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="8+ characters, include at least one number"
              className="mb-3 w-full min-h-[48px] rounded-2xl border border-gray-100 bg-gray-50 p-4 text-base font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />

            <label className="mb-4 flex min-h-[48px] cursor-pointer items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
              <input
                type="checkbox"
                checked={authGateAgreedLegal}
                onChange={(e) => setAuthGateAgreedLegal(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-emerald-600"
              />
              <span className="text-[11px] font-bold leading-relaxed text-gray-600 normal-case tracking-normal">
                I agree to the{" "}
                <Link href="/terms" className="font-black text-emerald-700 underline underline-offset-2">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-black text-emerald-700 underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <button
              type="button"
              disabled={authGateBusy || !authGateAgreedLegal}
              onClick={() => void runSignupFromGate()}
              className="mb-3 flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-emerald-600 py-4 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {authGateBusy ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Sign up & continue to payment"}
            </button>

            <button
              type="button"
              disabled={authGateBusy}
              onClick={() => router.push(`/login?next=${encodeURIComponent(pathname || "/")}`)}
              className="mb-4 flex min-h-[48px] w-full items-center justify-center rounded-2xl border border-gray-200 py-3 text-[10px] font-black uppercase tracking-widest text-gray-800 transition hover:bg-gray-50"
            >
              Log in instead
            </button>
          </div>
        )}
      </div>
      <PaystackTerminalModal
        isOpen={paystackOpen}
        onClose={() => {
          setPaystackOpen(false);
          if (pendingPayment) {
            setCheckoutError("Payment not completed yet. Tap 'Continue payment' to finish checkout.");
          }
        }}
        onSuccess={(reference) => void finalizePaidOrder(reference)}
        email={(pendingPayment?.cleanEmail || formData.email || (accountUserId ? `buyer-${accountUserId}@storelink.ng` : "buyer@storelink.ng") || "").trim()}
        amount={(() => {
          if (!paystackOpen) return 0;
          const fromRef = Number(paystackChargeMajorRef.current);
          if (Number.isFinite(fromRef) && fromRef > 0) return fromRef;
          const fromState = Number(pendingPayment?.finalPayable);
          return Number.isFinite(fromState) && fromState > 0 ? fromState : 0;
        })()}
        currency="NGN"
        metadata={{
          order_id: pendingPayment?.orderId,
          seller_id: pendingPayment?.sellerId,
          checkout_mode: "account",
          origin_channel: "storefront",
        }}
      />
      {settlingPayment && (
        <div className="fixed inset-0 z-190 flex items-center justify-center bg-black/45 p-4">
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 text-center shadow-xl">
            <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-emerald-600" />
            <p className="text-sm font-bold text-gray-900">Finalizing payment...</p>
            <p className="mt-1 text-xs text-gray-500">Syncing your order status.</p>
          </div>
        </div>
      )}
    </div>
  );
}
