/** Hero product art (`static/banner-logo.png`). */
export const homeMarketingImage = {
  bannerLogo: "/banner-logo.png",
  bannerLogoAlt: "5SVG — Free SVG Files & Craft SVG Bundles",
} as const;

/** Homepage FAQ mirror (JSON-LD / docs). Keep in sync with messages/en.json home.faq. */

export const homeSeoFaqSection = {
  title: "FAQs",
  subtitle: "What we sell, pricing, delivery, refunds, and support.",
  lead:
    "5SVG sells digital craft SVG Bundles (ZIP downloads) at clear USD prices on our Bundles page. The Free SVG logo library remains free. Payments are processed by Creem.",
} as const;

export const homeSeoFaq = [
  {
    question: "What do you sell?",
    answer:
      "We sell original craft SVG Bundles — digital ZIP packs of cut files for makers (Cricut, Silhouette, vinyl, shirts). We do not sell physical goods. Free brand logos in Free SVG are free and are not sold as paid products.",
  },
  {
    question: "How much does a Bundle cost?",
    answer:
      "Each craft Bundle is typically $4.50 USD as a one-time purchase. Exact prices are shown on https://5svg.com/shop and on every product page before you pay.",
  },
  {
    question: "How is the product delivered?",
    answer:
      "Delivery is 100% digital and instant after successful payment: you return to our download page to get your ZIP. No shipping. Use a valid email at checkout for your receipt.",
  },
  {
    question: "Do I need an account or software install?",
    answer:
      "No account is required to browse Free SVG or buy Bundles. Favorites stay in your browser. Import SVGs into Cricut Design Space, Silhouette Studio, Canva, or any vector-capable app — nothing to install from us.",
  },
  {
    question: "What license do I get?",
    answer:
      "Bundles include a personal craft license. You may not resell or redistribute the ZIP or individual files. Free SVG logos remain trademarks of their owners — check brand guidelines before commercial use. See our License and Terms of Service pages.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Because Bundles are digital downloads, we generally do not offer refunds once the ZIP has been delivered and remains available for normal use. If download fails due to an issue on our side, email support@5svg.com and we will review after verification.",
  },
  {
    question: "Where are Privacy Policy and Terms of Service?",
    answer:
      "Privacy Policy: https://5svg.com/privacy — Terms of Service: https://5svg.com/terms — License: https://5svg.com/license. Links are also in the site footer.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Email support@5svg.com or use the Contact us page. We aim to reply within 1–2 business days (within 3 business days for billing issues).",
  },
] as const;
