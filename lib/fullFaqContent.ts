/** Full help center FAQ — data only (icons mapped in `app/faq/page.tsx`). */

export type FullFaqQuestion = { q: string; a: string };

export type FullFaqCategoryIconKey = "help" | "bag" | "card" | "shield" | "sparkles";

export type FullFaqCategory = {
  category: string;
  id: string;
  iconKey: FullFaqCategoryIconKey;
  questions: FullFaqQuestion[];
};

export const FULL_FAQ_CATEGORIES: FullFaqCategory[] = [
  {
    category: "Getting Started & Costs",
    id: "getting-started",
    iconKey: "help",
    questions: [
      {
        q: "What exactly is StoreLink?",
        a: "StoreLink is storefront infrastructure for independent sellers: a branded shop link, catalog and inventory, structured in-app checkout, order records, and marketplace discovery so you can reach buyers beyond your immediate chat list.",
      },
      {
        q: "Are there any hidden transaction fees or commissions?",
        a: "Standard has no StoreLink subscription fee—you can sell from your storefront without a monthly plan. Diamond is an optional paid boost if you want extra discovery tools. Checkout runs through payment providers (for example Paystack), which apply their own processing fees and settlement rules; see your dashboard and provider docs for current rates—not a hidden StoreLink “tax,” but not “zero fees everywhere” either.",
      },
      {
        q: "How does StoreLink differ from selling only on social feeds?",
        a: "Social feeds are great for attention; StoreLink is where the sale becomes real. Your storefront holds prices, stock, and checkout in one place—so customers move from browsing to paying with a clear order trail.",
      },
      {
        q: "Do I need a credit card to open a Standard storefront?",
        a: "Standard has no subscription fee. You create your seller account and list products; any card or payment step is tied to checkout or provider rules—not a paywall to “unlock” your free storefront.",
      },
      {
        q: "Does upgrading to Diamond guarantee sales or ranking?",
        a: "No. Diamond adds tools and discovery headroom; it does not guarantee impressions, rank, or revenue. Your catalog, fulfilment, and demand still drive outcomes.",
      },
    ],
  },
  {
    category: "Managing Your Storefront",
    id: "managing-store",
    iconKey: "bag",
    questions: [
      {
        q: "How do I upload and post my products?",
        a: "Use Add Product in the dashboard: photos, price, description, and stock where applicable. Diamond may include AI background cleanup depending on your plan features in the app.",
      },
      {
        q: "Can I use my own brand name in the link?",
        a: "Yes. You choose your public slug (subject to availability) so your storefront URL reflects your brand.",
      },
      {
        q: "Can I manage my store from my phone?",
        a: "Yes. StoreLink is mobile-first—you can manage inventory, orders, and pricing from your smartphone.",
      },
    ],
  },
  {
    category: "Orders & Payments",
    id: "orders-payments",
    iconKey: "card",
    questions: [
      {
        q: "How do I receive money from my customers?",
        a: "Checkout is in StoreLink with payment handled by integrated providers (for example Paystack). Paid orders show in your seller dashboard with a structured trail for fulfillment. Settlement timing and any processing fees follow your payment account and provider rules—check your dashboard and provider for payout details.",
      },
      {
        q: "What should I do if a customer claims they haven't received their order?",
        a: "Keep your order status and delivery proof updated in the dashboard (photos, tracking, handover notes where applicable). If a dispute arises, support can review transaction and order logs to help mediate, but the sale is still between you and your customer.",
      },
      {
        q: "What if a buyer receives the wrong product?",
        a: "Publish a clear return or mistake policy on your storefront. Shoppers can use Report if a vendor refuses to fix a clear error; serious or repeated issues can affect verification or account status.",
      },
      {
        q: "Who sets refund rules?",
        a: "You set the policy buyers see. StoreLink provides order records and support channels; refunds for fit, change of mind, or damage follow your stated policy and applicable law.",
      },
    ],
  },
  {
    category: "Trust & Safety",
    id: "trust-safety",
    iconKey: "shield",
    questions: [
      {
        q: "How can I get the Blue Tick verification badge?",
        a: "Submit valid ID and any required proof through the verification flow in your dashboard. Our team manually reviews applications. Verification is not automatically granted by upgrading to Diamond alone.",
      },
      {
        q: "Is my customer data safe with StoreLink?",
        a: "We protect data in line with our security practices and policies. Your customer lists and sales history are for your business operations on the platform; we do not sell your business data to third parties.",
      },
      {
        q: "Does StoreLink replace my lawyer or accountant?",
        a: "No. StoreLink is commerce infrastructure—storefront, checkout, orders, discovery—not professional legal, tax, or accounting advice.",
      },
    ],
  },
  {
    category: "Discovery & Store Coins",
    id: "discovery-loyalty",
    iconKey: "sparkles",
    questions: [
      {
        q: "Does the marketplace guarantee new customers?",
        a: "No. Discovery can surface you to shoppers beyond your own audience under fair caps and ranking rules. It complements your own promotion—it does not replace good listings and fulfilment.",
      },
      {
        q: "What are Store Coins?",
        a: "Buyers can earn loyalty value on eligible purchases, held in their StoreLink wallet, and redeem as discounts at participating stores—so repeat purchases have a reason to stay on the platform.",
      },
      {
        q: "Can I share a link to the marketplace with search or category already applied?",
        a: "Yes. On the web storefront you can use query parameters on `/marketplace`: `q` for search text, `category` with a valid category slug, and `flash=1` to show only active live drops. The URL updates when you change filters after opening the page.",
      },
      {
        q: "What do the badges on marketplace listings mean?",
        a: "Verification shows the seller completed merchant review where the tick appears. Diamond or “TOP” styling reflects an active visibility plan. Store Coins appear when a shop runs loyalty rewards.",
      },
      {
        q: "How does product ranking work on the web marketplace?",
        a: "The feed blends freshness (newer listings get a modest boost), a capped Diamond uplift when that subscription is active, and sometimes location or same-state relevance when shoppers share location. Search still ranks primarily by that score; Diamond is not a paid guarantee to occupy slot #1 on every screen.",
      },
      {
        q: "What do the purple “TOP” or Diamond styling mean?",
        a: "They indicate an active Diamond visibility plan—extra discovery headroom and merchandising emphasis—not manual curation by StoreLink staff. Standard sellers can still appear prominently when listings are fresh and relevant.",
      },
      {
        q: "Should I still share my storefront link on Instagram or WhatsApp?",
        a: "Yes. Your direct link converts people who already know you. Marketplace discovery adds a second stream. Use both.",
      },
    ],
  },
];

export function flattenFullFaqForJsonLd(): { question: string; answer: string }[] {
  const out: { question: string; answer: string }[] = [];
  for (const cat of FULL_FAQ_CATEGORIES) {
    for (const item of cat.questions) {
      out.push({ question: item.q, answer: item.a });
    }
  }
  return out;
}
