/**
 * Inject LegalPages into en.json + zh.json and fix zh announcement / $4.50 glitches.
 * Run: node scripts/patch-i18n-legal-pages.mjs
 */
import fs from "fs";
import path from "path";

const dir = path.resolve("messages");

function deepMerge(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) return b;
  if (a && b && typeof a === "object" && typeof b === "object") {
    const out = { ...a };
    for (const [k, v] of Object.entries(b)) {
      out[k] = k in a ? deepMerge(a[k], v) : v;
    }
    return out;
  }
  return b;
}

const enLegal = {
  LegalPages: {
    about: {
      title: "About 5SVG — Free SVG Library & Craft Bundles",
      description:
        "5SVG is an independent free SVG logo library and a shop for original craft SVG Bundles. Digital downloads only — clear pricing on our Bundles page.",
      h1: "About 5SVG",
      sections: [
        {
          h2: "What we offer",
          body: "5SVG hosts a free library of SVG brand logos and icons, plus paid craft SVG Bundles sold as one-time digital ZIP downloads. Free SVG stays free. Bundles are original cut-file packs for makers (Cricut, Silhouette, vinyl, shirts).",
        },
        {
          h2: "What we sell",
          body: "Through Bundles we sell digital craft SVG packs only — typically $4.50 USD each, pay once, instant ZIP download after payment. We do not sell physical goods. Current packs and prices are listed on the Bundles page (/shop).",
        },
        {
          h2: "Who we are",
          body: "5SVG is an independent project. We are not affiliated with, endorsed by, or sponsored by the brands whose logos appear in the free library. Paid Bundles are original craft designs we assemble or create for personal craft use.",
        },
        {
          h2: "Support",
          body: "Customer support email: support@5svg.com. We aim to reply within 1–2 business days. You can also use the Contact us page on this site.",
        },
      ],
    },
    license: {
      title: "Licensing Policy — 5SVG",
      description:
        "How you may use Free SVG files and paid craft Bundles on 5SVG, including trademarks and personal craft use.",
      h1: "Licensing Policy",
      sections: [
        {
          h2: "Introduction",
          body: "This Licensing Policy explains how you may use materials from 5SVG. By downloading Free SVG files or purchasing Bundles, you agree to this policy, our Terms of Service, and our Privacy Policy.",
        },
        {
          h2: "Free SVG library",
          body: "Brand logos and icons in Free SVG are free to browse, copy, and download for personal projects, education, and mockups. Commercial use of brand marks may still require permission from the trademark owner. Free SVG files are not sold as paid products.",
        },
        {
          h2: "Paid Bundles (craft packs)",
          body: "Craft SVG packs sold under Bundles are licensed for personal craft projects (for example cutting, vinyl, shirts, stickers, and similar maker use). You may not resell, redistribute, share, or re-upload the digital ZIP or individual SVG files as standalone digital products.",
        },
        {
          h2: "Intellectual property",
          body: "Original craft designs in paid Bundles are owned by 5SVG or licensed to us for sale. Free SVG brand logos and wordmarks remain the property of their respective owners. 5SVG does not claim ownership of third-party trademarks shown in the free library.",
        },
        {
          h2: "Trademarks",
          body: "Logos and wordmarks remain trademarks of their respective owners. 5SVG is not affiliated with or endorsed by those brands. We do not sell trademarked brand logos as paid products.",
        },
        {
          h2: "No warranty",
          body: "Files are provided as-is. We do not guarantee completeness, legal clearance for your specific use case, or that assets match the latest official brand versions.",
        },
        {
          h2: "Contact Us",
          body: "Questions about this Licensing Policy: email support@5svg.com or use the Contact us page on this site.",
        },
      ],
    },
    privacy: {
      title: "Privacy Policy — 5SVG",
      description: "How we protect your data when you use 5SVG",
      h1: "Privacy Policy",
      sections: [
        {
          h2: "Introduction",
          body: "Welcome to the 5SVG Privacy Policy. This document explains how we collect, use, and protect your personal information when you use the 5SVG website, Free SVG library, and craft Bundle shop.",
        },
        {
          h2: "Information We Collect",
          body: "We may collect the following types of information: (1) Contact details you provide — such as the email address entered at Bundle checkout for receipt and download delivery, or messages sent via Contact us. (2) Usage data — how you interact with the site (for example pages visited), when analytics are enabled. (3) Device information — such as browser type or approximate technical data used to operate and secure the service. Favorites you save are stored locally in your browser; we do not receive your saved list on our servers.",
        },
        {
          h2: "How We Use Your Information",
          body: "We use your information to provide and maintain the Free SVG library and Bundle shop; to deliver paid ZIP downloads and related receipts; to provide customer support; to improve the site; to monitor usage; and to detect, prevent, and address technical or abuse-related issues.",
        },
        {
          h2: "Payments",
          body: "Payments for Bundles are processed by our payment provider (Creem). Card details are handled by the provider — we do not store full payment card numbers on 5SVG servers.",
        },
        {
          h2: "Cookies & Storage",
          body: "The site may use cookies or local storage for theme preference, language preference, favorites, and analytics. You can clear site data in your browser settings at any time. Blocking some cookies may limit certain features.",
        },
        {
          h2: "Data Security",
          body: "We implement appropriate security measures to protect personal information from unauthorized access, alteration, disclosure, or destruction. No method of transmission over the Internet is 100% secure.",
        },
        {
          h2: "Third-Party Services",
          body: "We may use third-party companies to facilitate payments, email delivery, analytics, or hosting. Outbound links and embedded badges are governed by those sites’ policies.",
        },
        {
          h2: "Changes to This Privacy Policy",
          body: "We may update this Privacy Policy from time to time. We will notify you of changes by posting the updated policy on this page.",
        },
        {
          h2: "Contact Us",
          body: "If you have any questions about this Privacy Policy, please email support@5svg.com or use the Contact us page on this site.",
        },
      ],
    },
    terms: {
      title: "Terms of Service — 5SVG",
      description:
        "Terms for using the 5SVG website and purchasing craft SVG Bundles",
      h1: "Terms of Service",
      sections: [
        {
          h2: "Introduction",
          body: "These Terms of Service (“Terms”) govern your use of the 5SVG website, Free SVG library, and Bundle shop. By accessing 5SVG.com or purchasing a Bundle, you agree to these Terms, our Privacy Policy, and our Licensing Policy. If you do not agree, do not use the site or purchase Bundles.",
        },
        {
          h2: "Use of Services",
          body: "Our services are provided “as is” and “as available” without warranties of any kind, either express or implied. We do not guarantee that the site will be uninterrupted, secure, or error-free. You may browse Free SVG without an account. Buying Bundles requires a valid email at checkout.",
        },
        {
          h2: "Products we sell",
          body: "5SVG sells digital craft SVG Bundles (ZIP downloads of original cut files) as one-time purchases. Prices are shown in USD on each Bundle page (typically $4.50 per pack). The free SVG logo library is not a paid product. We do not sell physical goods or third-party brand logo packs as paid products.",
        },
        {
          h2: "Pricing and payment",
          body: "Bundle prices are displayed on https://5svg.com/shop and on each product page before checkout. Payment is processed by Creem (Merchant of Record). You are responsible for providing a valid email at checkout so we can deliver your download and receipt.",
        },
        {
          h2: "Delivery",
          body: "Bundles are delivered digitally only. After successful payment you are redirected to a download page to obtain your ZIP, and a backup download link may be emailed to you. No shipping of physical items occurs.",
        },
        {
          h2: "Intellectual Property",
          body: "Purchased Bundles are licensed for personal craft use as described in our Licensing Policy. You may not resell, redistribute, or share the ZIP or individual files as standalone digital products. Free SVG brand logos remain subject to trademark owners’ rights. Site content, branding, and original craft designs are protected by applicable intellectual property laws.",
        },
        {
          h2: "Prohibited Activities",
          body: "You agree not to: use the site in any way that violates applicable law; attempt unauthorized access to our systems; scrape or overload the service in a way that harms availability; distribute malware; or use downloaded files in violation of these Terms or our Licensing Policy.",
        },
        {
          h2: "Refunds",
          body: "Because Bundles are digital downloads, we generally do not offer refunds once the ZIP has been delivered and remains available for normal use. If you cannot download due to a fault on our side, email support@5svg.com within a reasonable time; we will review after verification and, where appropriate, provide a re-download or other remedy.",
        },
        {
          h2: "Limitation of Liability",
          body: "In no event shall 5SVG be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the site or downloaded files.",
        },
        {
          h2: "Changes to Terms",
          body: "We reserve the right to modify these Terms at any time. If we make changes, we will provide notice by posting the updated Terms on this page.",
        },
        {
          h2: "Contact Us",
          body: "If you have any questions about these Terms, please email support@5svg.com or use the Contact us page. We aim to reply within 1–2 business days (and within 3 business days for billing issues).",
        },
      ],
    },
  },
};

const zhLegal = {
  common: {
    announcement: {
      library: "{count}+ 个免费 SVG — 打开免费图库",
      shop: "手工资源包起价 $4.50 — 一次付费，即时下载",
    },
    nav: {
      freeSvg: "免费 SVG",
      svgBundles: "资源包",
      shopNow: "商店",
    },
  },
  LegalPages: {
    about: {
      title: "关于 5SVG — 免费 SVG 图库与手工资源包",
      description:
        "5SVG 是独立的免费 SVG 标志图库，并售卖原创手工 SVG 资源包。仅数字下载——价格见资源包页面。",
      h1: "关于 5SVG",
      sections: [
        {
          h2: "我们提供什么",
          body: "5SVG 提供免费品牌标志与图标 SVG 图库，以及一次付费的数字 ZIP 手工资源包。免费图库保持免费。资源包为面向创作者的原创切割文件（Cricut、Silhouette、刻字膜、T 恤等）。",
        },
        {
          h2: "我们卖什么",
          body: "通过资源包，我们仅销售数字手工 SVG 包——通常每个 $4.50 美元，一次付费，付款后即时下载 ZIP。不销售实体商品。当前商品与价格见资源包页面（/shop）。",
        },
        {
          h2: "我们是谁",
          body: "5SVG 为独立项目。我们与免费图库中出现的品牌无隶属、背书或赞助关系。付费资源包为原创或我们整理的手工设计，供个人手工使用。",
        },
        {
          h2: "客服支持",
          body: "客服邮箱：support@5svg.com。我们尽量在 1～2 个工作日内回复。也可使用本站「联系我们」页面。",
        },
      ],
    },
    license: {
      title: "许可政策 — 5SVG",
      description:
        "说明如何使用 5SVG 的免费 SVG 与付费手工资源包，包括商标与个人手工用途。",
      h1: "许可政策",
      sections: [
        {
          h2: "引言",
          body: "本许可政策说明你可如何使用 5SVG 上的材料。下载免费 SVG 或购买资源包，即表示你同意本政策、用户协议与隐私政策。",
        },
        {
          h2: "免费 SVG 图库",
          body: "免费图库中的品牌标志与图标可免费浏览、复制与下载，用于个人项目、教育与样机。品牌商标的商业使用可能仍需权利人许可。免费 SVG 不作为付费商品出售。",
        },
        {
          h2: "付费资源包（手工包）",
          body: "资源包中的手工 SVG 许可用于个人手工项目（如切割、刻字膜、T 恤、贴纸等）。不得将 ZIP 或单个 SVG 作为独立数字商品转售、再分发、分享或重新上传。",
        },
        {
          h2: "知识产权",
          body: "付费资源包中的原创手工设计归 5SVG 所有或经授权销售。免费图库中的品牌标志与文字标识仍归各自权利人所有。5SVG 不主张第三方商标的所有权。",
        },
        {
          h2: "商标",
          body: "标志与文字标识仍为各自权利人的商标。5SVG 与这些品牌无隶属或背书关系。我们不将商标品牌标志作为付费商品出售。",
        },
        {
          h2: "无担保",
          body: "文件按「现状」提供。我们不保证完整性、适用于你的具体场景的法律合规，或资产与最新官方品牌版本一致。",
        },
        {
          h2: "联系我们",
          body: "关于本许可政策：请发送邮件至 support@5svg.com，或使用本站「联系我们」页面。",
        },
      ],
    },
    privacy: {
      title: "隐私政策 — 5SVG",
      description: "我们如何保护你在使用 5SVG 时的数据",
      h1: "隐私政策",
      sections: [
        {
          h2: "引言",
          body: "欢迎阅读 5SVG 隐私政策。本文说明我们在你使用 5SVG 网站、免费 SVG 图库与手工资源包商店时，如何收集、使用与保护你的个人信息。",
        },
        {
          h2: "我们收集的信息",
          body: "我们可能收集以下信息：（1）你提供的联系方式——如购买资源包结账时填写的邮箱（用于收据与下载），或通过「联系我们」发送的留言；（2）使用数据——在启用分析时，你与网站的互动（如访问页面）；（3）设备信息——如浏览器类型等用于运营与安全的技术数据。你保存的收藏仅存于本机浏览器，我们不会在服务器接收你的收藏列表。",
        },
        {
          h2: "我们如何使用信息",
          body: "我们使用这些信息以提供并维护免费图库与资源包商店；交付付费 ZIP 下载及相关收据；提供客服支持；改进网站；监控使用情况；以及发现、预防并处理技术或滥用问题。",
        },
        {
          h2: "付款",
          body: "资源包付款由支付服务商 Creem 处理。银行卡信息由服务商处理——我们不会在 5SVG 服务器存储完整卡号。",
        },
        {
          h2: "Cookie 与本地存储",
          body: "网站可能使用 Cookie 或本地存储以记住主题、语言偏好、收藏与分析。你可以随时在浏览器设置中清除网站数据。阻止部分 Cookie 可能影响部分功能。",
        },
        {
          h2: "数据安全",
          body: "我们采取适当安全措施，保护个人信息免遭未经授权的访问、篡改、披露或毁损。任何互联网传输方式都无法做到百分之百安全。",
        },
        {
          h2: "第三方服务",
          body: "我们可能使用第三方协助付款、邮件发送、分析或托管。外链与页脚徽章受对应网站政策约束。",
        },
        {
          h2: "隐私政策的变更",
          body: "我们可能不时更新本隐私政策。变更将通过在本页发布更新后的政策通知你。",
        },
        {
          h2: "联系我们",
          body: "如对本隐私政策有疑问，请发送邮件至 support@5svg.com，或使用本站「联系我们」页面。",
        },
      ],
    },
    terms: {
      title: "用户协议 — 5SVG",
      description: "使用 5SVG 网站及购买手工 SVG 资源包的条款",
      h1: "用户协议",
      sections: [
        {
          h2: "引言",
          body: "本用户协议（「本协议」）约束你对 5SVG 网站、免费 SVG 图库与资源包商店的使用。访问 5SVG.com 或购买资源包，即表示你同意本协议、隐私政策与许可政策。如不同意，请勿使用本站或购买资源包。",
        },
        {
          h2: "服务使用",
          body: "我们的服务按「现状」与「可用」提供，不作任何明示或默示担保。我们不保证网站不间断、安全或无错误。浏览免费图库无需账户；购买资源包须在结账时提供有效邮箱。",
        },
        {
          h2: "售卖产品",
          body: "5SVG 销售数字手工 SVG 资源包（原创切割文件的 ZIP 下载），为一次付费购买。价格以美元标在每个资源包页面（通常每包 $4.50）。免费标志图库不是付费商品。我们不销售实体商品，也不将第三方品牌标志包作为付费商品出售。",
        },
        {
          h2: "价格与付款",
          body: "资源包价格见 https://5svg.com/shop 及各商品页，结账前均可查看。付款由 Creem（商户记录方）处理。你须在结账时提供有效邮箱，以便我们交付下载与收据。",
        },
        {
          h2: "交付",
          body: "资源包仅数字交付。付款成功后将跳转下载页获取 ZIP，并可能向你发送备用下载链接邮件。不涉及实体物流。",
        },
        {
          h2: "知识产权",
          body: "已购资源包按许可政策用于个人手工用途。不得将 ZIP 或单个文件作为独立数字商品转售、再分发或分享。免费图库中的品牌标志仍受商标权利人约束。网站内容、品牌标识与原创手工设计受适用知识产权法保护。",
        },
        {
          h2: "禁止行为",
          body: "你同意不得：以任何违反适用法律的方式使用本站；试图未经授权访问我们的系统；以损害可用性的方式抓取或过载服务；传播恶意软件；或以违反本协议或许可政策的方式使用已下载文件。",
        },
        {
          h2: "退款",
          body: "资源包为数字下载，在 ZIP 已交付且可正常使用时，一般不支持退款。若因我方原因无法下载，请在合理时间内发送邮件至 support@5svg.com；核实后我们将酌情提供重新下载或其他补救。",
        },
        {
          h2: "责任限制",
          body: "在任何情况下，5SVG 均不对因使用或无法使用本站或已下载文件而产生的任何间接、附带、特殊、后果性或惩罚性损害承担责任。",
        },
        {
          h2: "协议变更",
          body: "我们保留随时修改本协议的权利。如有变更，将通过在本页发布更新后的协议进行通知。",
        },
        {
          h2: "联系我们",
          body: "对本协议有疑问：请发送邮件至 support@5svg.com，或使用「联系我们」页面。我们尽量在 1～2 个工作日内回复（账单问题 3 个工作日内）。",
        },
      ],
    },
  },
};

for (const [locale, patch] of [
  ["en", enLegal],
  ["zh", zhLegal],
]) {
  const file = path.join(dir, `${locale}.json`);
  let cur = JSON.parse(fs.readFileSync(file, "utf8"));
  cur = deepMerge(cur, patch);
  // Fix accidental "$4.50" -> ".50" corruption in zh from earlier shell escapes
  if (locale === "zh") {
    const raw = JSON.stringify(cur);
    const fixed = raw
      .replace(/以 \.50 起/g, "以 $4.50 起")
      .replace(/起价 \.50/g, "起价 $4.50")
      .replace(/每个 \.50/g, "每个 $4.50")
      .replace(/通常 \.50/g, "通常 $4.50")
      .replace(/通常每个 \.50/g, "通常每个 $4.50");
    cur = JSON.parse(fixed);
  }
  fs.writeFileSync(file, JSON.stringify(cur, null, 2) + "\n");
  console.log("patched", locale, "privacy h1 =", cur.LegalPages.privacy.h1);
}

console.log("done");
