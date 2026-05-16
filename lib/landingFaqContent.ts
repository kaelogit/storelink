/** Home landing FAQ — single source for `FAQ.tsx` + `FaqJsonLd.tsx` (schema.org). */

export type LandingFaqCategoryId =
  | "checkout"
  | "plans"
  | "discovery"
  | "trust"
  | "account";

export const LANDING_FAQ_CATEGORY_LABELS: Record<LandingFaqCategoryId, string> = {
  checkout: "Checkout & orders",
  plans: "Plans & money",
  discovery: "Discovery & growth",
  trust: "Trust & safety",
  account: "Account & data",
};

export type LandingFaqItem = {
  question: string;
  answer: string;
  /** Used for segmented filtering on the landing FAQ. */
  category: LandingFaqCategoryId;
};

export const LANDING_PAGE_FAQS: LandingFaqItem[] = [
  {
    category: "checkout",
    question: "How does StoreLink checkout work?",
    answer:
      "Customers checkout directly in StoreLink with a free StoreLink account (sign up or log in at checkout). Payment is handled securely, order status updates in real time, and both buyer and seller get a structured order record.",
  },
  {
    category: "discovery",
    question: "Is StoreLink only a “link in bio” tool?",
    answer:
      "No. You get a real storefront: catalog, stock where applicable, checkout, and order records—not just a list of taps out to other apps. Your shop link is the place buyers complete the purchase.",
  },
  {
    category: "plans",
    question: "Does upgrading to Diamond guarantee ranking or sales?",
    answer:
      "No. Diamond is an optional boost with extra discovery tools and features; it does not guarantee a specific rank, impressions, or sales. Results still depend on your catalog, pricing, fulfilment, and buyer demand.",
  },
  {
    category: "trust",
    question: "Does StoreLink replace my accountant, legal advice, or tax filing?",
    answer:
      "No. StoreLink is commerce infrastructure—storefront, checkout, orders, and discovery—not professional accounting, legal, or tax services. You remain responsible for compliance in your jurisdiction.",
  },
  {
    category: "account",
    question: "Do I need to be a registered business to use StoreLink?",
    answer:
      "No. Whether you are a registered business or an independent seller, you can sell on StoreLink. Requirements may apply for verification or certain payouts depending on region and policy.",
  },
  {
    category: "discovery",
    question: "Who can find my store on StoreLink?",
    answer:
      "Two ways: your public storefront link (path or subdomain, depending on how your deployment is configured) for your bio, status, or QR code—and the StoreLink marketplace where shoppers discover products from many sellers.",
  },
  {
    category: "discovery",
    question: "Does the marketplace guarantee me new customers?",
    answer:
      "No. Discovery is additive: it can surface your listings to shoppers beyond your own audience, under fair caps and ranking rules. It does not replace good photos, pricing, stock, and fulfilment—and no one can honestly guarantee sales.",
  },
  {
    category: "plans",
    question: "Do I have to buy my own domain name to start?",
    answer:
      "No. Your StoreLink shop URL is included so you can start selling without purchasing a separate domain. If you later map a custom domain (when supported), that is optional—not required to open your store.",
  },
  {
    category: "checkout",
    question: "How do I get paid by customers?",
    answer:
      "StoreLink handles structured checkout and payment confirmation. Orders are tracked in-platform so you can fulfill, ship, and resolve disputes with a clean audit trail.",
  },
  {
    category: "plans",
    question: "What exactly are Store Coins?",
    answer:
      "They are loyalty value buyers earn on eligible purchases, held in their StoreLink wallet, and can redeem as discounts at participating stores—so repeat purchases have a clear reason to stay on StoreLink.",
  },
  {
    category: "plans",
    question: "Is there a free plan?",
    answer:
      "Yes. Standard is the free default for every seller—your storefront link, catalog, and checkout stay available without a subscription. Diamond is an optional paid boost for extra discovery tools and AI features if you choose to upgrade.",
  },
  {
    category: "account",
    question: "Do I need technical skills to set this up?",
    answer:
      "If you can post a photo from your phone, you can use StoreLink. Our dashboard is mobile-first and you can launch your store in minutes.",
  },
  {
    category: "trust",
    question: "What is the 'Blue Tick' and how do I get it?",
    answer:
      "The Blue Tick is our 'Seal of Trust.' To get verified, you must provide a valid ID through our verification portal for manual vetting. Any vendor on any plan can earn the badge once they pass the verification process; it is not automatically granted by just upgrading.",
  },
  {
    category: "plans",
    question: "Can I downgrade or cancel Diamond if it is not working for me?",
    answer:
      "Yes. Diamond is optional—you can stay on Standard indefinitely. If you upgrade and later decide the paid tier is not right for you, you can move back to Standard according to the billing rules shown in your app or dashboard at the time.",
  },
  {
    category: "plans",
    question: "Do buyers pay a subscription to shop on StoreLink?",
    answer:
      "No. Buyers create a free account to checkout and track orders. They may pay for products and shipping as you set them; StoreLink does not charge shoppers a monthly fee to browse or buy.",
  },
  {
    category: "checkout",
    question: "Who sets refund and return rules—StoreLink or me?",
    answer:
      "You set the policy that buyers see on your storefront. StoreLink provides the order record and support channels; resolving refunds for fit, change of mind, or damage is between you and the buyer within your stated policy and applicable law.",
  },
  {
    category: "account",
    question: "Can I export my orders or customer list?",
    answer:
      "Your orders live in your seller dashboard for fulfilment and history. Exact export formats can evolve—check your dashboard for export or reporting tools. We do not sell your customer list to third parties.",
  },
  {
    category: "plans",
    question: "Are there payment processing fees on top of Diamond?",
    answer:
      "Diamond is a seller subscription for extra platform features. Card and wallet payments still go through payment providers (for example Paystack), which charge their own processing fees—see your provider and dashboard for current rates.",
  },
  {
    category: "discovery",
    question: "Should I still promote my own StoreLink URL on Instagram or WhatsApp?",
    answer:
      "Yes. Your direct link converts people who already know you. Marketplace discovery adds a second stream—people browsing StoreLink who may never have found you in chat. Use both.",
  },
  {
    category: "trust",
    question: "What if someone copies my product photos or name?",
    answer:
      "Report impersonation or policy violations through in-app or storefront support links. We review reports against our terms; serious fraud can lead to account restrictions. You should also watermark or brand assets where it helps.",
  },
];
