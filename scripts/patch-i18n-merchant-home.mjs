/**
 * Align non-en/zh locales with merchant-facing home/seo copy (8svg-style sell signal).
 * Run: node scripts/patch-i18n-merchant-home.mjs
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

const patches = {
  es: {
    common: {
      nav: { shopNow: "Tienda" },
      announcement: {
        library: "{count}+ SVG gratis — explora Free SVG",
        shop: "SVG Bundles desde $4.50 — pago único, descarga ZIP inmediata",
      },
    },
    seo: {
      title: "5SVG — SVG gratis y Bundles craft",
      description:
        "Biblioteca Free SVG y Bundles craft de pago. Explora Free SVG o compra packs ZIP desde $4.50 para Cricut, Silhouette, vinilo y crafts.",
      keywords:
        "svg bundles, craft svg, free svg, descarga svg, cricut svg, silhouette svg",
    },
    home: {
      hero: {
        title: "SVG gratis y Bundles craft",
        subtitle:
          "Explora Free SVG o compra Bundles craft originales — packs ZIP desde $4.50, pago único, descarga inmediata. Para Cricut, Silhouette, vinilo y makers.",
        ctaShop: "Comprar SVG Bundles",
        ctaFree: "Explorar Free SVG",
      },
      value: {
        freeTitle: "Entrega digital instantánea",
        freeDesc:
          "Compra un Bundle y descarga el ZIP tras el pago — sin envío. Free SVG sigue gratis en la biblioteca.",
        curatedTitle: "Bundles craft desde $4.50",
        curatedDesc:
          "Packs de corte originales con precio en USD en cada producto. Compra única para uso craft personal.",
        easyTitle: "Atención al cliente",
        easyDesc:
          "¿Free SVG, Bundles o licencia? Escríbenos a support@5svg.com o Contáctanos — respondemos en 1–2 días hábiles.",
      },
      shopStrip: {
        title: "SVG Bundles a la venta",
        subtitle:
          "Packs craft originales — $4.50 cada uno, pago único, descarga ZIP inmediata.",
        viewAll: "Ver todos los Bundles →",
        fromPrice: "{price}",
      },
      craft: {
        subtitle:
          "Usa logos Free SVG o archivos de Bundle en Cricut, Silhouette, Canva, camisetas, stickers y más.",
      },
      how: {
        tag: "Cómo funciona",
        title: "Biblioteca gratis o compra Bundles",
        subtitle:
          "Explora Free SVG cuando quieras — o abre Bundles, paga y descarga tu ZIP.",
        searchTitle: "Explorar Free SVG",
        searchDesc:
          "Abre Free SVG, elige categoría o busca por nombre — descarga sin cuenta.",
        downloadTitle: "Comprar un Bundle",
        downloadDesc:
          "Elige un pack en Bundles, paga el precio en USD y descarga el ZIP.",
        favoritesTitle: "Guardar y reutilizar",
        favoritesDesc:
          "Guarda favoritos Free SVG en este dispositivo, o conserva los archivos del Bundle comprado.",
      },
      seoIntro: {
        tag: "Tienda y biblioteca SVG",
        title: "SVG gratis y Bundles craft de pago",
        description:
          "5SVG vende Bundles craft SVG originales (ZIP, normalmente $4.50) y hospeda una biblioteca Free SVG. Explora Free SVG o compra Bundles para Cricut, Silhouette, vinilo y crafts.",
      },
      bannerAlt: "5SVG — SVG gratis y Bundles craft",
    },
  },
  de: {
    common: {
      nav: { shopNow: "Shop" },
      announcement: {
        library: "{count}+ kostenlose SVGs — Free SVG durchstöbern",
        shop: "SVG Bundles ab $4.50 — einmal zahlen, ZIP sofort laden",
      },
    },
    seo: {
      title: "5SVG — Kostenlose SVGs & Craft-Bundles",
      description:
        "Free-SVG-Bibliothek plus bezahlte Craft-SVG-Bundles. Free SVG jederzeit nutzen oder ZIP-Packs ab $4.50 für Cricut, Silhouette, Vinyl und Crafts kaufen.",
      keywords:
        "svg bundles, craft svg, free svg, svg download, cricut svg, silhouette svg",
    },
    home: {
      hero: {
        title: "Kostenlose SVGs & Craft-Bundles",
        subtitle:
          "Free SVG durchstöbern oder Original-Craft-Bundles kaufen — ZIP-Packs ab $4.50, einmalig, Sofort-Download. Für Cricut, Silhouette, Vinyl und Maker.",
        ctaShop: "SVG Bundles kaufen",
        ctaFree: "Free SVG öffnen",
      },
      value: {
        freeTitle: "Sofortiger Digital-Download",
        freeDesc:
          "Nach dem Kauf laden Sie Ihr ZIP sofort — kein Versand. Free SVG bleibt in der Bibliothek kostenlos.",
        curatedTitle: "Craft-Bundles ab $4.50",
        curatedDesc:
          "Originale Schnittdateien mit klarem USD-Preis. Einmalkauf für persönliche Craft-Projekte.",
        easyTitle: "Kundensupport",
        easyDesc:
          "Fragen zu Free SVG, Bundles oder Lizenz? support@5svg.com oder Kontakt — Antwort in 1–2 Werktagen.",
      },
      shopStrip: {
        title: "SVG Bundles zum Kauf",
        subtitle:
          "Originale Craft-Packs — je $4.50, einmal zahlen, ZIP sofort.",
        viewAll: "Alle Bundles ansehen →",
        fromPrice: "{price}",
      },
      craft: {
        subtitle:
          "Free-SVG-Logos oder Bundle-Dateien in Cricut, Silhouette, Canva, Shirts, Stickern und mehr.",
      },
      how: {
        tag: "So funktioniert’s",
        title: "Gratis-Bibliothek oder Bundles kaufen",
        subtitle:
          "Free SVG jederzeit — oder Bundles öffnen, bezahlen und ZIP laden.",
        searchTitle: "Free SVG durchstöbern",
        searchDesc:
          "Free SVG öffnen, Kategorie wählen oder suchen — Download ohne Konto.",
        downloadTitle: "Bundle kaufen",
        downloadDesc:
          "Pack auf Bundles wählen, USD-Preis zahlen, ZIP herunterladen.",
        favoritesTitle: "Speichern & wiederverwenden",
        favoritesDesc:
          "Free-SVG-Favoriten speichern oder gekaufte Bundle-Dateien behalten.",
      },
      seoIntro: {
        tag: "SVG-Shop & Bibliothek",
        title: "Kostenlose SVGs und bezahlte Craft-Bundles",
        description:
          "5SVG verkauft originale Craft-SVG-Bundles (ZIP, typisch $4.50) und hostet Free SVG. Free SVG nutzen oder Bundles für Cricut, Silhouette, Vinyl und Crafts kaufen.",
      },
      bannerAlt: "5SVG — Kostenlose SVGs & Craft-Bundles",
    },
  },
  fr: {
    common: {
      nav: { shopNow: "Boutique" },
      announcement: {
        library: "{count}+ SVG gratuits — parcourir Free SVG",
        shop: "SVG Bundles dès $4.50 — paiement unique, ZIP immédiat",
      },
    },
    seo: {
      title: "5SVG — SVG gratuits & Bundles craft",
      description:
        "Bibliothèque Free SVG et Bundles craft payants. Parcourez Free SVG ou achetez des packs ZIP dès $4.50 pour Cricut, Silhouette, vinyle et crafts.",
      keywords:
        "svg bundles, craft svg, free svg, téléchargement svg, cricut svg, silhouette svg",
    },
    home: {
      hero: {
        title: "SVG gratuits & Bundles craft",
        subtitle:
          "Parcourez Free SVG ou achetez des Bundles craft — packs ZIP dès $4.50, paiement unique, téléchargement immédiat. Pour Cricut, Silhouette, vinyle et makers.",
        ctaShop: "Acheter les SVG Bundles",
        ctaFree: "Parcourir Free SVG",
      },
      value: {
        freeTitle: "Livraison numérique instantanée",
        freeDesc:
          "Achetez un Bundle et téléchargez le ZIP après paiement — pas d’expédition. Free SVG reste gratuit.",
        curatedTitle: "Bundles craft dès $4.50",
        curatedDesc:
          "Packs de découpe originaux avec prix USD affiché. Achat unique pour usage craft personnel.",
        easyTitle: "Support client",
        easyDesc:
          "Free SVG, Bundles ou licence ? support@5svg.com ou Contact — réponse sous 1–2 jours ouvrés.",
      },
      shopStrip: {
        title: "SVG Bundles en vente",
        subtitle:
          "Packs craft originaux — $4.50 chacun, paiement unique, ZIP immédiat.",
        viewAll: "Voir tous les Bundles →",
        fromPrice: "{price}",
      },
      craft: {
        subtitle:
          "Utilisez logos Free SVG ou fichiers Bundle dans Cricut, Silhouette, Canva, t-shirts, stickers, etc.",
      },
      how: {
        tag: "Comment ça marche",
        title: "Bibliothèque gratuite ou acheter des Bundles",
        subtitle:
          "Parcourez Free SVG — ou ouvrez Bundles, payez et téléchargez votre ZIP.",
        searchTitle: "Parcourir Free SVG",
        searchDesc:
          "Ouvrez Free SVG, choisissez une catégorie ou cherchez — téléchargement sans compte.",
        downloadTitle: "Acheter un Bundle",
        downloadDesc:
          "Choisissez un pack, payez le prix USD, téléchargez le ZIP.",
        favoritesTitle: "Enregistrer et réutiliser",
        favoritesDesc:
          "Favoris Free SVG sur cet appareil, ou gardez les fichiers Bundle achetés.",
      },
      seoIntro: {
        tag: "Boutique & bibliothèque SVG",
        title: "SVG gratuits et Bundles craft payants",
        description:
          "5SVG vend des Bundles craft SVG originaux (ZIP, environ $4.50) et héberge Free SVG. Parcourez Free SVG ou achetez des Bundles pour Cricut, Silhouette, vinyle et crafts.",
      },
      bannerAlt: "5SVG — SVG gratuits & Bundles craft",
    },
  },
  jp: {
    common: {
      nav: { shopNow: "ショップ" },
      announcement: {
        library: "{count}+ 無料 SVG — Free SVG を見る",
        shop: "SVG Bundles $4.50 から — 買い切り、即 ZIP ダウンロード",
      },
    },
    seo: {
      title: "5SVG — 無料 SVG とクラフト Bundles",
      description:
        "無料 SVG ライブラリと有料クラフト SVG Bundles。Free SVG を閲覧するか、$4.50 からの ZIP パックを購入。Cricut、Silhouette、ビニール向け。",
      keywords:
        "svg bundles, craft svg, free svg, svg ダウンロード, cricut svg, silhouette svg",
    },
    home: {
      hero: {
        title: "無料 SVG とクラフト Bundles",
        subtitle:
          "Free SVG を閲覧するか、オリジナルクラフト Bundles を購入 — ZIP $4.50 から、買い切り、即ダウンロード。Cricut、Silhouette、ビニール向け。",
        ctaShop: "SVG Bundles を購入",
        ctaFree: "Free SVG を見る",
      },
      value: {
        freeTitle: "即時デジタル配信",
        freeDesc:
          "購入後すぐに ZIP をダウンロード — 配送なし。Free SVG はライブラリで無料のまま。",
        curatedTitle: "クラフト Bundles $4.50 から",
        curatedDesc:
          "オリジナルカットファイル。各商品に USD 価格。買い切りで個人クラフト向け。",
        easyTitle: "カスタマーサポート",
        easyDesc:
          "Free SVG・Bundles・ライセンスは support@5svg.com またはお問い合わせ — 通常 1～2 営業日で返信。",
      },
      shopStrip: {
        title: "販売中の SVG Bundles",
        subtitle:
          "オリジナルクラフトパック — 各 $4.50、買い切り、即 ZIP。",
        viewAll: "すべての Bundles →",
        fromPrice: "{price}",
      },
      craft: {
        subtitle:
          "Free SVG ロゴや Bundle ファイルを Cricut、Silhouette、Canva、Tシャツ、ステッカーなどに。",
      },
      how: {
        tag: "使い方",
        title: "無料ライブラリか Bundles 購入",
        subtitle:
          "Free SVG をいつでも — または Bundles で購入し ZIP をダウンロード。",
        searchTitle: "Free SVG を見る",
        searchDesc:
          "Free SVG を開き、カテゴリ選択または検索 — アカウント不要でダウンロード。",
        downloadTitle: "Bundle を購入",
        downloadDesc:
          "Bundles でパックを選び、USD 価格を支払い ZIP を取得。",
        favoritesTitle: "保存して再利用",
        favoritesDesc:
          "Free SVG をお気に入り保存、または購入 Bundle を保管。",
      },
      seoIntro: {
        tag: "SVG ショップ＆ライブラリ",
        title: "無料 SVG と有料クラフト Bundles",
        description:
          "5SVG はオリジナルクラフト SVG Bundles（ZIP、通常 $4.50）を販売し、Free SVG を提供。Cricut、Silhouette、ビニール向け。",
      },
      bannerAlt: "5SVG — 無料 SVG とクラフト Bundles",
    },
  },
  pt: {
    common: {
      nav: { shopNow: "Loja" },
      announcement: {
        library: "{count}+ SVG grátis — explorar Free SVG",
        shop: "SVG Bundles desde $4.50 — pagamento único, ZIP imediato",
      },
    },
    seo: {
      title: "5SVG — SVG grátis e Bundles craft",
      description:
        "Biblioteca Free SVG e Bundles craft pagos. Explore Free SVG ou compre packs ZIP desde $4.50 para Cricut, Silhouette, vinil e crafts.",
      keywords:
        "svg bundles, craft svg, free svg, download svg, cricut svg, silhouette svg",
    },
    home: {
      hero: {
        title: "SVG grátis e Bundles craft",
        subtitle:
          "Explore Free SVG ou compre Bundles craft — packs ZIP desde $4.50, pagamento único, download imediato. Para Cricut, Silhouette, vinil e makers.",
        ctaShop: "Comprar SVG Bundles",
        ctaFree: "Explorar Free SVG",
      },
      value: {
        freeTitle: "Entrega digital instantânea",
        freeDesc:
          "Compre um Bundle e baixe o ZIP após o pagamento — sem envio. Free SVG continua grátis.",
        curatedTitle: "Bundles craft desde $4.50",
        curatedDesc:
          "Packs de corte originais com preço em USD. Compra única para uso craft pessoal.",
        easyTitle: "Suporte ao cliente",
        easyDesc:
          "Free SVG, Bundles ou licença? support@5svg.com ou Contacte-nos — resposta em 1–2 dias úteis.",
      },
      shopStrip: {
        title: "SVG Bundles à venda",
        subtitle:
          "Packs craft originais — $4.50 cada, pagamento único, ZIP imediato.",
        viewAll: "Ver todos os Bundles →",
        fromPrice: "{price}",
      },
      craft: {
        subtitle:
          "Use logos Free SVG ou ficheiros Bundle no Cricut, Silhouette, Canva, camisas, stickers e mais.",
      },
      how: {
        tag: "Como funciona",
        title: "Biblioteca grátis ou comprar Bundles",
        subtitle:
          "Explore Free SVG — ou abra Bundles, pague e baixe o ZIP.",
        searchTitle: "Explorar Free SVG",
        searchDesc:
          "Abra Free SVG, escolha categoria ou pesquise — download sem conta.",
        downloadTitle: "Comprar um Bundle",
        downloadDesc:
          "Escolha um pack, pague o preço em USD e baixe o ZIP.",
        favoritesTitle: "Guardar e reutilizar",
        favoritesDesc:
          "Favoritos Free SVG neste dispositivo, ou guarde os ficheiros Bundle comprados.",
      },
      seoIntro: {
        tag: "Loja e biblioteca SVG",
        title: "SVG grátis e Bundles craft pagos",
        description:
          "5SVG vende Bundles craft SVG originais (ZIP, tipicamente $4.50) e hospeda Free SVG. Explore Free SVG ou compre Bundles para Cricut, Silhouette, vinil e crafts.",
      },
      bannerAlt: "5SVG — SVG grátis e Bundles craft",
    },
  },
  ko: {
    common: {
      nav: { shopNow: "샵" },
      announcement: {
        library: "{count}+ 무료 SVG — Free SVG 둘러보기",
        shop: "SVG Bundles $4.50부터 — 한 번 결제, 즉시 ZIP 다운로드",
      },
    },
    seo: {
      title: "5SVG — 무료 SVG & 크래프트 Bundles",
      description:
        "무료 SVG 라이브러리와 유료 크래프트 SVG Bundles. Free SVG를 둘러보거나 $4.50부터 ZIP 팩을 구매하세요. Cricut, Silhouette, 비닐 공예용.",
      keywords:
        "svg bundles, craft svg, free svg, svg 다운로드, cricut svg, silhouette svg",
    },
    home: {
      hero: {
        title: "무료 SVG & 크래프트 Bundles",
        subtitle:
          "Free SVG를 둘러보거나 오리지널 크래프트 Bundles를 구매하세요 — ZIP $4.50부터, 한 번 결제, 즉시 다운로드. Cricut, Silhouette, 비닐용.",
        ctaShop: "SVG Bundles 구매",
        ctaFree: "Free SVG 둘러보기",
      },
      value: {
        freeTitle: "즉시 디지털 배송",
        freeDesc:
          "구매 후 바로 ZIP 다운로드 — 배송 없음. Free SVG는 라이브러리에서 계속 무료.",
        curatedTitle: "크래프트 Bundles $4.50부터",
        curatedDesc:
          "오리지널 컷 파일 팩, USD 가격 표시. 개인 크래프트용 일회성 구매.",
        easyTitle: "고객 지원",
        easyDesc:
          "Free SVG, Bundles, 라이선스 문의는 support@5svg.com 또는 문의하기 — 영업일 1–2일 내 답변.",
      },
      shopStrip: {
        title: "판매 중인 SVG Bundles",
        subtitle:
          "오리지널 크래프트 팩 — 각 $4.50, 한 번 결제, 즉시 ZIP.",
        viewAll: "모든 Bundles 보기 →",
        fromPrice: "{price}",
      },
      craft: {
        subtitle:
          "Free SVG 로고 또는 Bundle 파일을 Cricut, Silhouette, Canva, 티셔츠, 스티커 등에 사용.",
      },
      how: {
        tag: "이용 방법",
        title: "무료 라이브러리 또는 Bundles 구매",
        subtitle:
          "Free SVG를 언제든 — 또는 Bundles에서 구매 후 ZIP 다운로드.",
        searchTitle: "Free SVG 둘러보기",
        searchDesc:
          "Free SVG를 열고 카테고리 선택 또는 검색 — 계정 없이 다운로드.",
        downloadTitle: "Bundle 구매",
        downloadDesc:
          "Bundles에서 팩을 고르고 USD 가격을 결제한 뒤 ZIP 다운로드.",
        favoritesTitle: "저장하고 재사용",
        favoritesDesc:
          "Free SVG 즐겨찾기 저장, 또는 구매한 Bundle 파일 보관.",
      },
      seoIntro: {
        tag: "SVG 샵 & 라이브러리",
        title: "무료 SVG와 유료 크래프트 Bundles",
        description:
          "5SVG는 오리지널 크래프트 SVG Bundles(ZIP, 보통 $4.50)를 판매하고 Free SVG를 제공합니다. Cricut, Silhouette, 비닐 공예용.",
      },
      bannerAlt: "5SVG — 무료 SVG & 크래프트 Bundles",
    },
  },
  ru: {
    common: {
      nav: { shopNow: "Магазин" },
      announcement: {
        library: "{count}+ бесплатных SVG — смотреть Free SVG",
        shop: "SVG Bundles от $4.50 — разовый платёж, мгновенный ZIP",
      },
    },
    seo: {
      title: "5SVG — бесплатные SVG и craft Bundles",
      description:
        "Библиотека Free SVG и платные craft SVG Bundles. Смотрите Free SVG или покупайте ZIP от $4.50 для Cricut, Silhouette, винила и crafts.",
      keywords:
        "svg bundles, craft svg, free svg, скачать svg, cricut svg, silhouette svg",
    },
    home: {
      hero: {
        title: "Бесплатные SVG и craft Bundles",
        subtitle:
          "Смотрите Free SVG или покупайте оригинальные craft Bundles — ZIP от $4.50, разовый платёж, мгновенная загрузка. Для Cricut, Silhouette, винила и makers.",
        ctaShop: "Купить SVG Bundles",
        ctaFree: "Смотреть Free SVG",
      },
      value: {
        freeTitle: "Мгновенная цифровая доставка",
        freeDesc:
          "Купите Bundle и скачайте ZIP после оплаты — без доставки. Free SVG остаётся бесплатным.",
        curatedTitle: "Craft Bundles от $4.50",
        curatedDesc:
          "Оригинальные cut-файлы с ценой в USD. Разовая покупка для личного craft-использования.",
        easyTitle: "Поддержка",
        easyDesc:
          "Free SVG, Bundles или лицензия? support@5svg.com или Связаться — ответ за 1–2 рабочих дня.",
      },
      shopStrip: {
        title: "SVG Bundles в продаже",
        subtitle:
          "Оригинальные craft-пакеты — по $4.50, разовый платёж, мгновенный ZIP.",
        viewAll: "Все Bundles →",
        fromPrice: "{price}",
      },
      craft: {
        subtitle:
          "Логотипы Free SVG или файлы Bundle в Cricut, Silhouette, Canva, футболках, стикерах и др.",
      },
      how: {
        tag: "Как это работает",
        title: "Бесплатная библиотека или покупка Bundles",
        subtitle:
          "Смотрите Free SVG — или откройте Bundles, оплатите и скачайте ZIP.",
        searchTitle: "Смотреть Free SVG",
        searchDesc:
          "Откройте Free SVG, выберите категорию или поиск — скачивание без аккаунта.",
        downloadTitle: "Купить Bundle",
        downloadDesc:
          "Выберите пакет, оплатите цену в USD и скачайте ZIP.",
        favoritesTitle: "Сохранить и использовать снова",
        favoritesDesc:
          "Избранное Free SVG на устройстве или файлы купленного Bundle.",
      },
      seoIntro: {
        tag: "SVG-магазин и библиотека",
        title: "Бесплатные SVG и платные craft Bundles",
        description:
          "5SVG продаёт оригинальные craft SVG Bundles (ZIP, обычно $4.50) и размещает Free SVG. Для Cricut, Silhouette, винила и crafts.",
      },
      bannerAlt: "5SVG — бесплатные SVG и craft Bundles",
    },
  },
  ar: {
    common: {
      nav: { shopNow: "المتجر" },
      announcement: {
        library: "{count}+ ملف SVG مجاني — تصفح Free SVG",
        shop: "حزم SVG Bundles من $4.50 — دفع مرة واحدة وتنزيل ZIP فوري",
      },
    },
    seo: {
      title: "5SVG — ملفات SVG مجانية وحزم Craft",
      description:
        "مكتبة Free SVG وحزم SVG craft مدفوعة. تصفح Free SVG أو اشترِ حزم ZIP من $4.50 لـ Cricut وSilhouette والفينيل والحرف.",
      keywords:
        "svg bundles, craft svg, free svg, تحميل svg, cricut svg, silhouette svg",
    },
    home: {
      hero: {
        title: "ملفات SVG مجانية وحزم Craft",
        subtitle:
          "تصفح Free SVG أو اشترِ حزم craft أصلية — ZIP من $4.50، دفع مرة واحدة، تنزيل فوري. لـ Cricut وSilhouette والفينيل والصناع.",
        ctaShop: "شراء SVG Bundles",
        ctaFree: "تصفح Free SVG",
      },
      value: {
        freeTitle: "تسليم رقمي فوري",
        freeDesc:
          "اشترِ Bundle ونزّل ZIP بعد الدفع — بلا شحن. Free SVG يبقى مجانيًا في المكتبة.",
        curatedTitle: "حزم Craft من $4.50",
        curatedDesc:
          "ملفات قص أصلية بأسعار بالدولار على كل منتج. شراء لمرة واحدة للاستخدام الحرفي الشخصي.",
        easyTitle: "دعم العملاء",
        easyDesc:
          "أسئلة عن Free SVG أو Bundles أو الترخيص؟ support@5svg.com أو تواصل معنا — نرد خلال 1–2 يوم عمل.",
      },
      shopStrip: {
        title: "حزم SVG Bundles للبيع",
        subtitle:
          "حزم craft أصلية — $4.50 لكل منها، دفع مرة واحدة، ZIP فوري.",
        viewAll: "عرض كل Bundles →",
        fromPrice: "{price}",
      },
      craft: {
        subtitle:
          "استخدم شعارات Free SVG أو ملفات Bundle في Cricut وSilhouette وCanva والقمصان والملصقات والمزيد.",
      },
      how: {
        tag: "كيف يعمل",
        title: "مكتبة مجانية أو شراء Bundles",
        subtitle:
          "تصفح Free SVG في أي وقت — أو افتح Bundles وادفع ونزّل ZIP.",
        searchTitle: "تصفح Free SVG",
        searchDesc:
          "افتح Free SVG واختر فئة أو ابحث — تنزيل بلا حساب.",
        downloadTitle: "شراء Bundle",
        downloadDesc:
          "اختر حزمة وادفع السعر بالدولار ثم نزّل ZIP.",
        favoritesTitle: "حفظ وإعادة استخدام",
        favoritesDesc:
          "احفظ مفضلات Free SVG على هذا الجهاز، أو احتفظ بملفات Bundle المشتراة.",
      },
      seoIntro: {
        tag: "متجر ومكتبة SVG",
        title: "ملفات SVG مجانية وحزم craft مدفوعة",
        description:
          "تبيع 5SVG حزم craft SVG أصلية (ZIP، عادة $4.50) وتستضيف Free SVG. لـ Cricut وSilhouette والفينيل والحرف.",
      },
      bannerAlt: "5SVG — ملفات SVG مجانية وحزم Craft",
    },
  },
};

for (const [locale, patch] of Object.entries(patches)) {
  const file = path.join(dir, `${locale}.json`);
  const cur = JSON.parse(fs.readFileSync(file, "utf8"));
  const next = deepMerge(cur, patch);
  fs.writeFileSync(file, JSON.stringify(next, null, 2) + "\n");
  console.log("patched", locale);
}

console.log("done");
