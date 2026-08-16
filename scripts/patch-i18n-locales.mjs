/**
 * Patch shop + FAQ + About + Mail + footer.terms into all non-en locales.
 * Run: node scripts/patch-i18n-locales.mjs
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

/** Shared structure per locale — professional tone, EditStamp-aligned shop hints */
const LOCALE_PATCHES = {
  es: {
    common: {
      footer: {
        supportTitle: "Atención al cliente",
        supportBody:
          "¿Preguntas sobre SVG gratis o Bundles de pago? Escríbenos — respondemos en 1–2 días hábiles.",
        terms: "Términos del servicio",
      },
      announcement: {
        shop: "Bundles — packs SVG para craft, pago único, descarga ZIP",
      },
    },
    shop: {
      seoTitle: "SVG Bundles — Precios y packs craft | 5SVG",
      seoDescription:
        "Compra Bundles SVG craft originales por $4.50 USD — pago único, descarga ZIP inmediata. Los logos de marca siguen gratis en la biblioteca.",
      promo:
        "Packs SVG craft digitales — $4.50 USD cada uno, pago único, descarga ZIP inmediata. Los logos gratis están en Free SVG.",
      title: "SVG Bundles",
      subtitle:
        "Cada Bundle es una compra digital única a $4.50 USD con ~20–24 archivos craft en ZIP. El precio aparece en cada tarjeta. Los logos de marca siguen gratis en la biblioteca.",
      allCategories: "Todos",
      viewPack: "Ver",
      empty: "Aún no hay packs en esta categoría.",
      fileCount: "{count} archivos",
      freeHint: "¿Necesitas logos de marca gratis?",
      freeLibraryLink: "Abrir Free SVG →",
      backToShop: "Todos los bundles",
      emailLabel: "Email para recibo y descarga",
      mockNotice:
        "Checkout de prueba (Creem aún no conectado) — se redirigirá a la descarga de inmediato.",
      buyDownload: "Comprar y descargar",
      processing: "Redirigiendo…",
      checkoutError: "Error en el pago. Inténtalo de nuevo.",
      flowHint: "Tras el pago volverás aquí para descargar tu ZIP.",
      downloadTitle: "Tu descarga",
      downloadMissing:
        "Falta la información de retorno del pago. Vuelve a empezar desde Bundles.",
      downloadFailed: "No se pudo confirmar el pago.",
      downloadSyncing: "Confirmando el pago…",
      downloadReady: "Listo: {title}",
      downloadZip: "Descargar ZIP",
      downloadEmailHint:
        "También se ha enviado un enlace de descarga de respaldo al email que indicaste.",
      includesSample: "Incluye (muestra)",
      browseCategory: "Explorar esta categoría →",
      license: {
        personal: "Uso personal",
        commercial: "Licencia craft comercial",
      },
    },
    home: {
      faq: {
        title: "Preguntas frecuentes",
        subtitle: "Qué vendemos, precios, entrega, reembolsos y soporte.",
        lead: "5SVG vende Bundles SVG craft digitales (descargas ZIP) con precios en USD en la página Bundles. La biblioteca Free SVG sigue gratis. Los pagos los procesa Creem.",
        q1: "¿Qué venden?",
        a1: "Vendemos Bundles SVG craft originales — packs ZIP digitales de archivos de corte para makers (Cricut, Silhouette, vinilo, camisetas). No vendemos productos físicos. Los logos de marca en Free SVG son gratis y no se venden como producto de pago.",
        q2: "¿Cuánto cuesta un Bundle?",
        a2: "Cada Bundle craft suele costar $4.50 USD en compra única. El precio exacto se muestra en https://5svg.com/shop y en cada página de producto antes de pagar.",
        q3: "¿Cómo se entrega el producto?",
        a3: "Entrega 100% digital e inmediata tras el pago: vuelves a la página de descarga para obtener el ZIP. Sin envío físico. Usa un email válido en el checkout para el recibo.",
        q4: "¿Necesito una cuenta o instalar software?",
        a4: "No. Puedes explorar Free SVG y comprar Bundles sin registrarte. Los favoritos quedan en el navegador. Importa los SVG en Cricut Design Space, Silhouette Studio, Canva u otra app vectorial.",
        q5: "¿Qué licencia obtengo?",
        a5: "Los Bundles incluyen licencia craft personal. No puedes revender ni redistribuir el ZIP ni los archivos. Los logos Free SVG siguen siendo marcas de sus titulares. Consulta Licencia y Términos del servicio.",
        q6: "¿Puedo obtener un reembolso?",
        a6: "Al ser descargas digitales, generalmente no ofrecemos reembolso una vez entregado el ZIP y disponible el uso normal. Si la descarga falla por un problema nuestro, escribe a support@5svg.com.",
        q7: "¿Dónde están la Política de privacidad y los Términos?",
        a7: "Privacidad: https://5svg.com/privacy — Términos: https://5svg.com/terms — Licencia: https://5svg.com/license. También en el pie del sitio.",
        q8: "¿Cómo contacto con soporte?",
        a8: "Email support@5svg.com o la página Contáctanos. Respondemos en 1–2 días hábiles (hasta 3 en temas de facturación).",
        contactBefore: "Para lo anterior u otras consultas, usa la página ",
        contactLink: "Contáctanos",
        contactMiddle: " de este sitio o escribe a ",
        contactAfter: ". Respondemos en 1–2 días hábiles.",
      },
      about: {
        title: "Acerca de 5SVG",
        p1: "5SVG es una biblioteca gratuita de logos e iconos SVG y una tienda de Bundles SVG craft originales. Los productos de pago son solo descargas ZIP digitales — normalmente $4.50 USD, compra única, con precios en la página Bundles.",
        p2: "Explora Free SVG en cualquier momento, o abre Bundles para packs de corte estacionales y cotidianos. Soporte: support@5svg.com. Legal: Privacidad, Términos y Licencia en el pie.",
        logoAlt: "Logo de 5SVG — biblioteca SVG gratis y Bundles craft",
      },
    },
    Mail: {
      orderDownloadLink: {
        subject: "Tu descarga 5SVG — {title}",
        title: "Tu descarga está lista",
        body: "Gracias por comprar {title} en 5SVG.",
        downloadButton: "Descargar ZIP",
        linkFallback: "O copia este enlace de descarga de respaldo:",
        note: "Si el archivo no se descargó automáticamente tras el pago, abre este enlace de nuevo.",
        textIntro: "Gracias por tu compra de {title}.",
        textDownload: "Descarga tu ZIP (enlace de respaldo):",
        textSupport: "Soporte: {email}",
      },
    },
  },
};

// Continue with other locales in the same file via Object.assign
Object.assign(LOCALE_PATCHES, {
  de: buildDe(),
  fr: buildFr(),
  jp: buildJp(),
  pt: buildPt(),
  ko: buildKo(),
  ru: buildRu(),
  ar: buildAr(),
});

function shopBase(o) {
  return { shop: o.shop, home: o.home, common: o.common, Mail: o.Mail };
}

function buildDe() {
  return shopBase({
    common: {
      footer: {
        supportTitle: "Kundensupport",
        supportBody:
          "Fragen zu kostenlosen SVGs oder bezahlten Bundles? Schreiben Sie uns — Antwort in 1–2 Werktagen.",
        terms: "Nutzungsbedingungen",
      },
      announcement: {
        shop: "Bundles — Craft-SVG-Packs, einmal zahlen, ZIP laden",
      },
    },
    shop: {
      seoTitle: "SVG Bundles — Preise & Craft-Packs | 5SVG",
      seoDescription:
        "Originale Craft-SVG-Bundles für je $4.50 USD — Einmalkauf, sofortiger ZIP-Download. Markenlogos bleiben in der Bibliothek kostenlos.",
      promo:
        "Digitale Craft-SVG-Packs — je $4.50 USD, einmal zahlen, sofort ZIP. Kostenlose Logos unter Free SVG.",
      title: "SVG Bundles",
      subtitle:
        "Jedes Bundle ist ein digitaler Einmalkauf für $4.50 USD mit ~20–24 Craft-Dateien als ZIP. Preise stehen auf jeder Produktkarte. Markenlogos bleiben kostenlos.",
      allCategories: "Alle",
      viewPack: "Ansehen",
      empty: "In dieser Kategorie noch keine Packs.",
      fileCount: "{count} Dateien",
      freeHint: "Kostenlose Markenlogos nötig?",
      freeLibraryLink: "Free SVG öffnen →",
      backToShop: "Alle Bundles",
      emailLabel: "E-Mail für Beleg & Download",
      mockNotice:
        "Test-Checkout (Creem noch nicht verbunden) — Weiterleitung zum Download.",
      buyDownload: "Kaufen & herunterladen",
      processing: "Weiterleitung…",
      checkoutError: "Checkout fehlgeschlagen. Bitte erneut versuchen.",
      flowHint: "Nach der Zahlung kehren Sie hierher zurück, um Ihr ZIP zu laden.",
      downloadTitle: "Ihr Download",
      downloadMissing:
        "Zahlungsrückkehr unvollständig. Bitte erneut bei Bundles starten.",
      downloadFailed: "Zahlung konnte nicht bestätigt werden.",
      downloadSyncing: "Zahlung wird bestätigt…",
      downloadReady: "Bereit: {title}",
      downloadZip: "ZIP herunterladen",
      downloadEmailHint:
        "Ein Backup-Download-Link wurde auch an die von Ihnen angegebene E-Mail gesendet.",
      includesSample: "Enthält (Beispiel)",
      browseCategory: "Diese Kategorie durchsuchen →",
      license: {
        personal: "Private Nutzung",
        commercial: "Kommerzielle Craft-Lizenz",
      },
    },
    home: {
      faq: {
        title: "FAQs",
        subtitle: "Angebot, Preise, Lieferung, Erstattung und Support.",
        lead: "5SVG verkauft digitale Craft-SVG-Bundles (ZIP) mit klaren USD-Preisen auf der Bundles-Seite. Die Free-SVG-Bibliothek bleibt kostenlos. Zahlungen über Creem.",
        q1: "Was verkaufen Sie?",
        a1: "Originale Craft-SVG-Bundles — digitale ZIP-Packs mit Schnittdateien für Maker. Keine physischen Waren. Markenlogos in Free SVG sind kostenlos und werden nicht verkauft.",
        q2: "Was kostet ein Bundle?",
        a2: "Typischerweise $4.50 USD einmalig. Genaues Preis auf https://5svg.com/shop und jeder Produktseite.",
        q3: "Wie erfolgt die Lieferung?",
        a3: "100 % digital und sofort nach Zahlung: Download-Seite für das ZIP. Kein Versand. Gültige E-Mail beim Checkout für die Quittung.",
        q4: "Brauche ich Konto oder Software?",
        a4: "Nein. Free SVG und Bundles ohne Registrierung. Favoriten im Browser. SVG in Cricut, Silhouette, Canva usw. importieren.",
        q5: "Welche Lizenz erhalte ich?",
        a5: "Persönliche Craft-Lizenz. Kein Weiterverkauf/Weitergabe des ZIP. Free-SVG-Logos bleiben Marken der Rechteinhaber. Siehe Lizenz und Nutzungsbedingungen.",
        q6: "Kann ich eine Erstattung erhalten?",
        a6: "Bei digitalen Downloads in der Regel nicht, sobald das ZIP geliefert wurde. Bei Problemen unsererseits: support@5svg.com.",
        q7: "Wo sind Datenschutz und Nutzungsbedingungen?",
        a7: "Datenschutz: https://5svg.com/privacy — AGB: https://5svg.com/terms — Lizenz: https://5svg.com/license.",
        q8: "Wie erreiche ich den Support?",
        a8: "support@5svg.com oder Kontaktseite. Antwort in 1–2 Werktagen (Billing bis 3).",
        contactBefore: "Für obige und weitere Fragen nutzen Sie die Seite ",
        contactLink: "Kontakt",
        contactMiddle: " oder schreiben Sie an ",
        contactAfter: ". Wir antworten in 1–2 Werktagen.",
      },
      about: {
        title: "Über 5SVG",
        p1: "5SVG ist eine kostenlose SVG-Logo-Bibliothek und ein Shop für originale Craft-SVG-Bundles. Bezahlprodukte nur als digitale ZIP — typisch $4.50 USD, Einmalkauf.",
        p2: "Free SVG jederzeit nutzen oder Bundles für Schnittpacks öffnen. Support: support@5svg.com. Rechtliches in der Fußzeile.",
        logoAlt: "5SVG Logo — kostenlose SVG-Bibliothek und Craft-Bundles",
      },
    },
    Mail: {
      orderDownloadLink: {
        subject: "Ihr 5SVG-Download — {title}",
        title: "Ihr Download ist bereit",
        body: "Danke für Ihren Kauf von {title} bei 5SVG.",
        downloadButton: "ZIP herunterladen",
        linkFallback: "Oder kopieren Sie diesen Backup-Download-Link:",
        note: "Falls der Download nach der Zahlung nicht automatisch startete, öffnen Sie diesen Link erneut.",
        textIntro: "Danke für Ihren Kauf von {title}.",
        textDownload: "ZIP herunterladen (Backup-Link):",
        textSupport: "Support: {email}",
      },
    },
  });
}

function buildFr() {
  return shopBase({
    common: {
      footer: {
        supportTitle: "Support client",
        supportBody:
          "Questions sur les SVG gratuits ou les Bundles payants ? Écrivez-nous — réponse sous 1–2 jours ouvrés.",
        terms: "Conditions d'utilisation",
      },
      announcement: {
        shop: "Bundles — packs SVG craft, paiement unique, ZIP",
      },
    },
    shop: {
      seoTitle: "SVG Bundles — Tarifs et packs craft | 5SVG",
      seoDescription:
        "Achetez des Bundles SVG craft originaux à $4.50 USD — paiement unique, téléchargement ZIP immédiat. Les logos de marque restent gratuits.",
      promo:
        "Packs SVG craft numériques — $4.50 USD pièce, paiement unique, ZIP immédiat. Logos gratuits sous Free SVG.",
      title: "SVG Bundles",
      subtitle:
        "Chaque Bundle est un achat numérique unique à $4.50 USD avec ~20–24 fichiers craft en ZIP. Les prix sont affichés sur chaque carte. Les logos restent gratuits.",
      allCategories: "Tous",
      viewPack: "Voir",
      empty: "Aucun pack dans cette catégorie pour le moment.",
      fileCount: "{count} fichiers",
      freeHint: "Besoin de logos de marque gratuits ?",
      freeLibraryLink: "Ouvrir Free SVG →",
      backToShop: "Tous les bundles",
      emailLabel: "E-mail pour reçu et téléchargement",
      mockNotice:
        "Checkout de test (Creem non branché) — redirection immédiate vers le téléchargement.",
      buyDownload: "Acheter et télécharger",
      processing: "Redirection…",
      checkoutError: "Échec du paiement. Réessayez.",
      flowHint: "Après paiement, vous revenez ici pour télécharger le ZIP.",
      downloadTitle: "Votre téléchargement",
      downloadMissing:
        "Informations de retour de paiement manquantes. Recommencez depuis Bundles.",
      downloadFailed: "Impossible de confirmer le paiement.",
      downloadSyncing: "Confirmation du paiement…",
      downloadReady: "Prêt : {title}",
      downloadZip: "Télécharger le ZIP",
      downloadEmailHint:
        "Un lien de téléchargement de secours a aussi été envoyé à l'e-mail indiqué.",
      includesSample: "Contenu (échantillon)",
      browseCategory: "Parcourir cette catégorie →",
      license: {
        personal: "Usage personnel",
        commercial: "Licence craft commerciale",
      },
    },
    home: {
      faq: {
        title: "FAQ",
        subtitle: "Offre, tarifs, livraison, remboursements et support.",
        lead: "5SVG vend des Bundles SVG craft numériques (ZIP) avec des prix en USD sur la page Bundles. Free SVG reste gratuit. Paiements via Creem.",
        q1: "Que vendez-vous ?",
        a1: "Des Bundles SVG craft originaux — packs ZIP numériques pour makers. Pas de biens physiques. Les logos Free SVG sont gratuits et non vendus.",
        q2: "Combien coûte un Bundle ?",
        a2: "Généralement $4.50 USD en paiement unique. Prix exacts sur https://5svg.com/shop et chaque fiche produit.",
        q3: "Comment le produit est-il livré ?",
        a3: "100 % numérique et immédiat après paiement : page de téléchargement du ZIP. Pas d'expédition. E-mail valide au checkout pour le reçu.",
        q4: "Faut-il un compte ou un logiciel ?",
        a4: "Non. Free SVG et Bundles sans inscription. Favoris dans le navigateur. Importez les SVG dans Cricut, Silhouette, Canva, etc.",
        q5: "Quelle licence ?",
        a5: "Licence craft personnelle. Pas de revente/redistribution du ZIP. Logos Free SVG = marques des titulaires. Voir Licence et Conditions.",
        q6: "Puis-je être remboursé ?",
        a6: "Téléchargements numériques : généralement pas de remboursement une fois le ZIP livré. Problème de notre côté : support@5svg.com.",
        q7: "Où sont Confidentialité et Conditions ?",
        a7: "Confidentialité : https://5svg.com/privacy — Conditions : https://5svg.com/terms — Licence : https://5svg.com/license.",
        q8: "Comment contacter le support ?",
        a8: "support@5svg.com ou page Contact. Réponse sous 1–2 jours ouvrés (3 pour la facturation).",
        contactBefore: "Pour ces questions ou d'autres, utilisez la page ",
        contactLink: "Contact",
        contactMiddle: " ou écrivez à ",
        contactAfter: ". Réponse sous 1–2 jours ouvrés.",
      },
      about: {
        title: "À propos de 5SVG",
        p1: "5SVG est une bibliothèque SVG gratuite et une boutique de Bundles craft originaux. Produits payants = ZIP numériques uniquement — typiquement $4.50 USD.",
        p2: "Parcourez Free SVG ou ouvrez Bundles. Support : support@5svg.com. Mentions légales dans le pied de page.",
        logoAlt: "Logo 5SVG — bibliothèque SVG gratuite et Bundles craft",
      },
    },
    Mail: {
      orderDownloadLink: {
        subject: "Votre téléchargement 5SVG — {title}",
        title: "Votre téléchargement est prêt",
        body: "Merci d'avoir acheté {title} sur 5SVG.",
        downloadButton: "Télécharger le ZIP",
        linkFallback: "Ou copiez ce lien de téléchargement de secours :",
        note: "Si le fichier ne s'est pas téléchargé automatiquement après le paiement, rouvrez ce lien.",
        textIntro: "Merci pour votre achat de {title}.",
        textDownload: "Téléchargez votre ZIP (lien de secours) :",
        textSupport: "Support : {email}",
      },
    },
  });
}

function buildJp() {
  return shopBase({
    common: {
      footer: {
        supportTitle: "カスタマーサポート",
        supportBody:
          "無料 SVG や有料 Bundles についてご質問はメールでどうぞ。1〜2 営業日以内に返信します。",
        terms: "利用規約",
      },
      announcement: {
        shop: "Bundles — クラフト SVG パック、一括払い、ZIP ダウンロード",
      },
    },
    shop: {
      seoTitle: "SVG Bundles — 料金とクラフトパック | 5SVG",
      seoDescription:
        "オリジナルのクラフト SVG Bundle を各 $4.50 USD — 一回払い、即時 ZIP。ブランドロゴはライブラリで無料のままです。",
      promo:
        "デジタル クラフト SVG パック — 各 $4.50 USD、一回払い、即時 ZIP。無料ロゴは Free SVG にあります。",
      title: "SVG Bundles",
      subtitle:
        "各 Bundle は $4.50 USD の一回購入で、約 20〜24 のクラフトファイルを ZIP で提供します。価格は各カードに表示。ブランドロゴは無料のままです。",
      allCategories: "すべて",
      viewPack: "見る",
      empty: "このカテゴリにパックはまだありません。",
      fileCount: "{count} ファイル",
      freeHint: "無料のブランドロゴが必要ですか？",
      freeLibraryLink: "Free SVG を開く →",
      backToShop: "すべての Bundles",
      emailLabel: "領収書とダウンロード用メール",
      mockNotice:
        "テスト決済（Creem 未接続）— すぐにダウンロードへ進みます。",
      buyDownload: "購入してダウンロード",
      processing: "リダイレクト中…",
      checkoutError: "決済に失敗しました。もう一度お試しください。",
      flowHint: "お支払い後、ここに戻り ZIP をダウンロードできます。",
      downloadTitle: "ダウンロード",
      downloadMissing:
        "決済の戻り情報が不足しています。Bundles からやり直してください。",
      downloadFailed: "支払いを確認できませんでした。",
      downloadSyncing: "支払いを確認しています…",
      downloadReady: "準備完了：{title}",
      downloadZip: "ZIP をダウンロード",
      downloadEmailHint:
        "ご入力のメールアドレスにもバックアップ用ダウンロードリンクを送信しました。",
      includesSample: "内容（サンプル）",
      browseCategory: "このカテゴリを見る →",
      license: {
        personal: "個人利用",
        commercial: "商用クラフトライセンス",
      },
    },
    home: {
      faq: {
        title: "よくある質問",
        subtitle: "販売内容、価格、配信、返金、サポートについて。",
        lead: "5SVG はデジタル クラフト SVG Bundles（ZIP）を Bundles ページで USD 価格表示して販売します。Free SVG は無料のままです。決済は Creem が処理します。",
        q1: "何を販売していますか？",
        a1: "オリジナルのクラフト SVG Bundles — メーカー向けカットファイルの ZIP です。実物商品は扱いません。Free SVG のブランドロゴは無料で、有料販売しません。",
        q2: "Bundle の価格は？",
        a2: "通常 $4.50 USD の一回購入です。正確な価格は https://5svg.com/shop と各商品ページに表示されます。",
        q3: "どのように届きますか？",
        a3: "支払い成功後、ダウンロードページで ZIP を即時取得（完全デジタル）。配送はありません。レシート用に有効なメールを入力してください。",
        q4: "アカウントやソフトのインストールは必要ですか？",
        a4: "不要です。登録なしで Free SVG と Bundles を利用できます。お気に入りはブラウザに保存。Cricut / Silhouette / Canva などに読み込んでください。",
        q5: "ライセンスは？",
        a5: "個人クラフトライセンスです。ZIP や個別ファイルの再販・再配布は不可。Free SVG ロゴは各権利者の商標です。ライセンスと利用規約をご確認ください。",
        q6: "返金できますか？",
        a6: "デジタル配信のため、ZIP 提供後の通常利用では原則返金しません。当方都合でダウンロードできない場合は support@5svg.com へ。",
        q7: "プライバシーと利用規約はどこ？",
        a7: "プライバシー：https://5svg.com/privacy — 利用規約：https://5svg.com/terms — ライセンス：https://5svg.com/license。フッターにもあります。",
        q8: "サポートへの連絡は？",
        a8: "support@5svg.com またはお問い合わせページ。1〜2 営業日以内（請求関連は 3 営業日以内）に返信します。",
        contactBefore: "上記やその他のご質問は、本サイトの ",
        contactLink: "お問い合わせ",
        contactMiddle: " ページ、または ",
        contactAfter: " まで。1〜2 営業日以内に返信します。",
      },
      about: {
        title: "5SVG について",
        p1: "5SVG は無料 SVG ロゴライブラリと、オリジナル クラフト SVG Bundles のショップです。有料商品はデジタル ZIP のみ — 通常 $4.50 USD の一回購入です。",
        p2: "Free SVG をいつでも閲覧するか、Bundles でカットパックを購入できます。サポート：support@5svg.com。法的ページはフッターにあります。",
        logoAlt: "5SVG ロゴ — 無料 SVG ライブラリとクラフト Bundles",
      },
    },
    Mail: {
      orderDownloadLink: {
        subject: "5SVG ダウンロード — {title}",
        title: "ダウンロードの準備ができました",
        body: "5SVG で {title} をご購入いただきありがとうございます。",
        downloadButton: "ZIP をダウンロード",
        linkFallback: "または、このバックアップ用リンクをコピーしてください：",
        note: "お支払い後に自動ダウンロードされなかった場合は、このリンクを再度開いてください。",
        textIntro: "{title} のご購入ありがとうございます。",
        textDownload: "ZIP をダウンロード（バックアップリンク）：",
        textSupport: "サポート：{email}",
      },
    },
  });
}

function buildPt() {
  return shopBase({
    common: {
      footer: {
        supportTitle: "Suporte ao cliente",
        supportBody:
          "Dúvidas sobre SVG grátis ou Bundles pagos? Envie um e-mail — respondemos em 1–2 dias úteis.",
        terms: "Termos de Serviço",
      },
      announcement: {
        shop: "Bundles — packs SVG craft, pagamento único, download ZIP",
      },
    },
    shop: {
      seoTitle: "SVG Bundles — Preços e packs craft | 5SVG",
      seoDescription:
        "Compre Bundles SVG craft originais por $4.50 USD — pagamento único, download ZIP imediato. Logos de marca continuam grátis na biblioteca.",
      promo:
        "Packs SVG craft digitais — $4.50 USD cada, pagamento único, ZIP imediato. Logos grátis em Free SVG.",
      title: "SVG Bundles",
      subtitle:
        "Cada Bundle é uma compra digital única a $4.50 USD com ~20–24 ficheiros craft em ZIP. Os preços aparecem em cada cartão. Logos de marca continuam grátis.",
      allCategories: "Todos",
      viewPack: "Ver",
      empty: "Ainda não há packs nesta categoria.",
      fileCount: "{count} ficheiros",
      freeHint: "Precisa de logos de marca grátis?",
      freeLibraryLink: "Abrir Free SVG →",
      backToShop: "Todos os bundles",
      emailLabel: "E-mail para recibo e download",
      mockNotice:
        "Checkout de teste (Creem ainda não ligado) — redirecionamento imediato para o download.",
      buyDownload: "Comprar e descarregar",
      processing: "A redirecionar…",
      checkoutError: "Falha no checkout. Tente novamente.",
      flowHint: "Após o pagamento regressa aqui para descarregar o ZIP.",
      downloadTitle: "A sua descarga",
      downloadMissing:
        "Falta informação de retorno do pagamento. Recomece em Bundles.",
      downloadFailed: "Não foi possível confirmar o pagamento.",
      downloadSyncing: "A confirmar o pagamento…",
      downloadReady: "Pronto: {title}",
      downloadZip: "Descarregar ZIP",
      downloadEmailHint:
        "Também foi enviado um link de descarga de reserva para o e-mail que indicou.",
      includesSample: "Inclui (amostra)",
      browseCategory: "Explorar esta categoria →",
      license: {
        personal: "Uso pessoal",
        commercial: "Licença craft comercial",
      },
    },
    home: {
      faq: {
        title: "Perguntas frequentes",
        subtitle: "O que vendemos, preços, entrega, reembolsos e suporte.",
        lead: "A 5SVG vende Bundles SVG craft digitais (ZIP) com preços em USD na página Bundles. A biblioteca Free SVG continua grátis. Pagamentos via Creem.",
        q1: "O que vendem?",
        a1: "Bundles SVG craft originais — packs ZIP digitais para makers. Sem bens físicos. Logos Free SVG são grátis e não são vendidos.",
        q2: "Quanto custa um Bundle?",
        a2: "Tipicamente $4.50 USD, compra única. Preços exatos em https://5svg.com/shop e em cada página de produto.",
        q3: "Como é entregue?",
        a3: "100% digital e imediato após pagamento: página de descarga do ZIP. Sem envio. Use um e-mail válido no checkout.",
        q4: "Preciso de conta ou software?",
        a4: "Não. Free SVG e Bundles sem registo. Favoritos no browser. Importe SVG no Cricut, Silhouette, Canva, etc.",
        q5: "Que licença obtenho?",
        a5: "Licença craft pessoal. Sem revenda/redistribuição do ZIP. Logos Free SVG são marcas dos titulares. Ver Licença e Termos.",
        q6: "Posso ser reembolsado?",
        a6: "Downloads digitais: em geral sem reembolso após entrega do ZIP. Problema nosso: support@5svg.com.",
        q7: "Onde estão Privacidade e Termos?",
        a7: "Privacidade: https://5svg.com/privacy — Termos: https://5svg.com/terms — Licença: https://5svg.com/license.",
        q8: "Como contacto o suporte?",
        a8: "support@5svg.com ou página Contacte-nos. Resposta em 1–2 dias úteis (até 3 em faturação).",
        contactBefore: "Para o acima ou outras questões, use a página ",
        contactLink: "Contacte-nos",
        contactMiddle: " ou escreva para ",
        contactAfter: ". Respondemos em 1–2 dias úteis.",
      },
      about: {
        title: "Sobre a 5SVG",
        p1: "A 5SVG é uma biblioteca SVG gratuita e uma loja de Bundles craft originais. Produtos pagos são só ZIP digitais — tipicamente $4.50 USD.",
        p2: "Explore Free SVG ou abra Bundles. Suporte: support@5svg.com. Páginas legais no rodapé.",
        logoAlt: "Logo 5SVG — biblioteca SVG gratuita e Bundles craft",
      },
    },
    Mail: {
      orderDownloadLink: {
        subject: "A sua descarga 5SVG — {title}",
        title: "A sua descarga está pronta",
        body: "Obrigado por comprar {title} na 5SVG.",
        downloadButton: "Descarregar ZIP",
        linkFallback: "Ou copie este link de descarga de reserva:",
        note: "Se o ficheiro não descarregou automaticamente após o pagamento, abra este link novamente.",
        textIntro: "Obrigado pela compra de {title}.",
        textDownload: "Descarregue o ZIP (link de reserva):",
        textSupport: "Suporte: {email}",
      },
    },
  });
}

function buildKo() {
  return shopBase({
    common: {
      footer: {
        supportTitle: "고객 지원",
        supportBody:
          "무료 SVG 또는 유료 Bundles 문의는 이메일로 보내 주세요. 영업일 기준 1–2일 내 답변합니다.",
        terms: "이용약관",
      },
      announcement: {
        shop: "Bundles — 공예 SVG 팩, 1회 결제, ZIP 다운로드",
      },
    },
    shop: {
      seoTitle: "SVG Bundles — 가격 및 공예 팩 | 5SVG",
      seoDescription:
        "오리지널 공예 SVG Bundle 각 $4.50 USD — 1회 결제, 즉시 ZIP. 브랜드 로고는 라이브러리에서 무료입니다.",
      promo:
        "디지털 공예 SVG 팩 — 각 $4.50 USD, 1회 결제, 즉시 ZIP. 무료 로고는 Free SVG.",
      title: "SVG Bundles",
      subtitle:
        "각 Bundle은 $4.50 USD 1회 구매이며 ~20–24개의 공예 파일이 ZIP으로 제공됩니다. 가격은 각 카드에 표시됩니다. 브랜드 로고는 무료입니다.",
      allCategories: "전체",
      viewPack: "보기",
      empty: "이 카테고리에 아직 팩이 없습니다.",
      fileCount: "{count}개 파일",
      freeHint: "무료 브랜드 로고가 필요하신가요?",
      freeLibraryLink: "Free SVG 열기 →",
      backToShop: "모든 Bundles",
      emailLabel: "영수증 및 다운로드용 이메일",
      mockNotice:
        "테스트 결제(Creem 미연결) — 즉시 다운로드로 이동합니다.",
      buyDownload: "구매 및 다운로드",
      processing: "이동 중…",
      checkoutError: "결제에 실패했습니다. 다시 시도해 주세요.",
      flowHint: "결제 후 여기로 돌아와 ZIP을 다운로드합니다.",
      downloadTitle: "다운로드",
      downloadMissing:
        "결제 복귀 정보가 없습니다. Bundles에서 다시 시작해 주세요.",
      downloadFailed: "결제를 확인할 수 없습니다.",
      downloadSyncing: "결제 확인 중…",
      downloadReady: "준비됨: {title}",
      downloadZip: "ZIP 다운로드",
      downloadEmailHint:
        "입력하신 이메일로 백업 다운로드 링크도 발송되었습니다.",
      includesSample: "포함 (샘플)",
      browseCategory: "이 카테고리 보기 →",
      license: {
        personal: "개인 사용",
        commercial: "상업용 공예 라이선스",
      },
    },
    home: {
      faq: {
        title: "자주 묻는 질문",
        subtitle: "판매 상품, 가격, 배송, 환불 및 지원.",
        lead: "5SVG는 Bundles 페이지에서 USD 가격이 명시된 디지털 공예 SVG Bundles(ZIP)를 판매합니다. Free SVG는 무료입니다. 결제는 Creem이 처리합니다.",
        q1: "무엇을 판매하나요?",
        a1: "오리지널 공예 SVG Bundles — 메이커용 컷 파일 ZIP입니다. 실물 상품은 없습니다. Free SVG 브랜드 로고는 무료이며 유료 판매하지 않습니다.",
        q2: "Bundle 가격은?",
        a2: "보통 $4.50 USD 1회 결제입니다. 정확한 가격은 https://5svg.com/shop 및 각 상품 페이지에 표시됩니다.",
        q3: "어떻게 전달되나요?",
        a3: "결제 성공 후 다운로드 페이지에서 ZIP을 즉시 받습니다(완전 디지털). 배송 없음. 영수증용으로 유효한 이메일을 입력하세요.",
        q4: "계정이나 설치가 필요한가요?",
        a4: "아니요. 가입 없이 Free SVG와 Bundles를 이용할 수 있습니다. 즐겨찾기는 브라우저에 저장됩니다. Cricut, Silhouette, Canva 등에 SVG를 가져오세요.",
        q5: "어떤 라이선스인가요?",
        a5: "개인 공예 라이선스입니다. ZIP/개별 파일 재판매·재배포 금지. Free SVG 로고는 권리자의 상표입니다. 라이선스와 이용약관을 확인하세요.",
        q6: "환불이 가능한가요?",
        a6: "디지털 다운로드는 ZIP 제공 후 일반적으로 환불하지 않습니다. 당사 문제로 다운로드가 안 되면 support@5svg.com으로 문의하세요.",
        q7: "개인정보처리방침과 약관은 어디에?",
        a7: "개인정보: https://5svg.com/privacy — 약관: https://5svg.com/terms — 라이선스: https://5svg.com/license. 푸터에도 있습니다.",
        q8: "지원팀에 어떻게 연락하나요?",
        a8: "support@5svg.com 또는 문의 페이지. 영업일 1–2일 내(결제 관련 최대 3일) 답변합니다.",
        contactBefore: "위 내용 및 기타 문의는 사이트의 ",
        contactLink: "문의하기",
        contactMiddle: " 페이지 또는 ",
        contactAfter: "로 연락해 주세요. 영업일 1–2일 내 답변합니다.",
      },
      about: {
        title: "5SVG 소개",
        p1: "5SVG는 무료 SVG 로고 라이브러리이자 오리지널 공예 SVG Bundles 상점입니다. 유료 상품은 디지털 ZIP만 해당 — 보통 $4.50 USD 1회 결제입니다.",
        p2: "Free SVG를 언제든 둘러보거나 Bundles에서 컷 팩을 구매하세요. 지원: support@5svg.com. 법적 페이지는 푸터에 있습니다.",
        logoAlt: "5SVG 로고 — 무료 SVG 라이브러리 및 공예 Bundles",
      },
    },
    Mail: {
      orderDownloadLink: {
        subject: "5SVG 다운로드 — {title}",
        title: "다운로드가 준비되었습니다",
        body: "5SVG에서 {title}을(를) 구매해 주셔서 감사합니다.",
        downloadButton: "ZIP 다운로드",
        linkFallback: "또는 이 백업 다운로드 링크를 복사하세요:",
        note: "결제 후 자동 다운로드되지 않았다면 이 링크를 다시 열어 주세요.",
        textIntro: "{title} 구매해 주셔서 감사합니다.",
        textDownload: "ZIP 다운로드(백업 링크):",
        textSupport: "지원: {email}",
      },
    },
  });
}

function buildRu() {
  return shopBase({
    common: {
      footer: {
        supportTitle: "Поддержка",
        supportBody:
          "Вопросы о бесплатных SVG или платных Bundles? Напишите нам — ответим за 1–2 рабочих дня.",
        terms: "Условия использования",
      },
      announcement: {
        shop: "Bundles — craft SVG-пакеты, разовая оплата, ZIP",
      },
    },
    shop: {
      seoTitle: "SVG Bundles — цены и craft-пакеты | 5SVG",
      seoDescription:
        "Оригинальные craft SVG Bundles по $4.50 USD — разовая оплата, мгновенный ZIP. Брендовые логотипы остаются бесплатными.",
      promo:
        "Цифровые craft SVG-пакеты — $4.50 USD каждый, разовая оплата, мгновенный ZIP. Бесплатные логотипы в Free SVG.",
      title: "SVG Bundles",
      subtitle:
        "Каждый Bundle — разовая цифровая покупка за $4.50 USD с ~20–24 craft-файлами в ZIP. Цены на каждой карточке. Брендовые логотипы бесплатны.",
      allCategories: "Все",
      viewPack: "Смотреть",
      empty: "В этой категории пока нет пакетов.",
      fileCount: "{count} файлов",
      freeHint: "Нужны бесплатные брендовые логотипы?",
      freeLibraryLink: "Открыть Free SVG →",
      backToShop: "Все bundles",
      emailLabel: "Email для чека и скачивания",
      mockNotice:
        "Тестовый checkout (Creem ещё не подключён) — сразу на скачивание.",
      buyDownload: "Купить и скачать",
      processing: "Перенаправление…",
      checkoutError: "Ошибка оплаты. Попробуйте снова.",
      flowHint: "После оплаты вы вернётесь сюда, чтобы скачать ZIP.",
      downloadTitle: "Ваша загрузка",
      downloadMissing:
        "Нет данных возврата оплаты. Начните снова с Bundles.",
      downloadFailed: "Не удалось подтвердить оплату.",
      downloadSyncing: "Подтверждение оплаты…",
      downloadReady: "Готово: {title}",
      downloadZip: "Скачать ZIP",
      downloadEmailHint:
        "Резервная ссылка для скачивания также отправлена на указанный email.",
      includesSample: "Включает (образец)",
      browseCategory: "Смотреть эту категорию →",
      license: {
        personal: "Личное использование",
        commercial: "Коммерческая craft-лицензия",
      },
    },
    home: {
      faq: {
        title: "Частые вопросы",
        subtitle: "Что продаём, цены, доставка, возвраты и поддержка.",
        lead: "5SVG продаёт цифровые craft SVG Bundles (ZIP) с ценами в USD на странице Bundles. Free SVG остаётся бесплатной. Платежи обрабатывает Creem.",
        q1: "Что вы продаёте?",
        a1: "Оригинальные craft SVG Bundles — цифровые ZIP с файлами для резки. Без физических товаров. Логотипы Free SVG бесплатны и не продаются.",
        q2: "Сколько стоит Bundle?",
        a2: "Обычно $4.50 USD разово. Точная цена на https://5svg.com/shop и на странице товара.",
        q3: "Как доставляется товар?",
        a3: "100% цифровая мгновенная выдача после оплаты: страница скачивания ZIP. Без доставки. Укажите действительный email для чека.",
        q4: "Нужен аккаунт или установка ПО?",
        a4: "Нет. Free SVG и Bundles без регистрации. Избранное в браузере. Импортируйте SVG в Cricut, Silhouette, Canva и т.д.",
        q5: "Какая лицензия?",
        a5: "Личная craft-лицензия. Нельзя перепродавать/распространять ZIP. Логотипы Free SVG — товарные знаки правообладателей. См. Лицензию и Условия.",
        q6: "Можно ли вернуть деньги?",
        a6: "Для цифровых загрузок обычно нет, если ZIP уже выдан. При сбое с нашей стороны: support@5svg.com.",
        q7: "Где Политика конфиденциальности и Условия?",
        a7: "Конфиденциальность: https://5svg.com/privacy — Условия: https://5svg.com/terms — Лицензия: https://5svg.com/license.",
        q8: "Как связаться с поддержкой?",
        a8: "support@5svg.com или страница контактов. Ответ за 1–2 рабочих дня (до 3 по биллингу).",
        contactBefore: "По вопросам выше или другим используйте страницу ",
        contactLink: "Контакты",
        contactMiddle: " или напишите на ",
        contactAfter: ". Ответим за 1–2 рабочих дня.",
      },
      about: {
        title: "О 5SVG",
        p1: "5SVG — бесплатная библиотека SVG-логотипов и магазин оригинальных craft SVG Bundles. Платные товары — только цифровые ZIP, обычно $4.50 USD.",
        p2: "Смотрите Free SVG или открывайте Bundles. Поддержка: support@5svg.com. Юридические страницы в подвале сайта.",
        logoAlt: "Логотип 5SVG — бесплатная SVG-библиотека и craft Bundles",
      },
    },
    Mail: {
      orderDownloadLink: {
        subject: "Ваша загрузка 5SVG — {title}",
        title: "Загрузка готова",
        body: "Спасибо за покупку {title} на 5SVG.",
        downloadButton: "Скачать ZIP",
        linkFallback: "Или скопируйте резервную ссылку:",
        note: "Если файл не скачался автоматически после оплаты, откройте эту ссылку снова.",
        textIntro: "Спасибо за покупку {title}.",
        textDownload: "Скачайте ZIP (резервная ссылка):",
        textSupport: "Поддержка: {email}",
      },
    },
  });
}

function buildAr() {
  return shopBase({
    common: {
      footer: {
        supportTitle: "دعم العملاء",
        supportBody:
          "أسئلة حول SVG المجاني أو حزم Bundles المدفوعة؟ راسلنا — نرد خلال يوم إلى يومين عمل.",
        terms: "شروط الخدمة",
      },
      announcement: {
        shop: "Bundles — حزم SVG للحرف، دفع لمرة واحدة، تنزيل ZIP",
      },
    },
    shop: {
      seoTitle: "SVG Bundles — الأسعار وحزم الحرف | 5SVG",
      seoDescription:
        "اشترِ حزم SVG حرفية أصلية بسعر $4.50 USD — دفع لمرة واحدة وتنزيل ZIP فوري. شعارات العلامات تبقى مجانية في المكتبة.",
      promo:
        "حزم SVG رقمية للحرف — $4.50 USD لكل منها، دفع لمرة واحدة، ZIP فوري. الشعارات المجانية ضمن Free SVG.",
      title: "SVG Bundles",
      subtitle:
        "كل Bundle عملية شراء رقمية لمرة واحدة بسعر $4.50 USD مع حوالي 20–24 ملفًا حرفيًا في ZIP. الأسعار ظاهرة على كل بطاقة. شعارات العلامات تبقى مجانية.",
      allCategories: "الكل",
      viewPack: "عرض",
      empty: "لا توجد حزم في هذه الفئة بعد.",
      fileCount: "{count} ملفات",
      freeHint: "هل تحتاج شعارات علامات مجانية؟",
      freeLibraryLink: "فتح Free SVG →",
      backToShop: "كل الحزم",
      emailLabel: "البريد للإيصال والتنزيل",
      mockNotice:
        "دفع تجريبي (Creem غير موصول بعد) — سيتم التوجيه للتنزيل فورًا.",
      buyDownload: "اشترِ ونزّل",
      processing: "جارٍ التوجيه…",
      checkoutError: "فشل الدفع. حاول مرة أخرى.",
      flowHint: "بعد الدفع ستعود هنا لتنزيل ملف ZIP.",
      downloadTitle: "تنزيلك",
      downloadMissing:
        "معلومات العودة من الدفع ناقصة. ابدأ من جديد من Bundles.",
      downloadFailed: "تعذر تأكيد الدفع.",
      downloadSyncing: "جارٍ تأكيد الدفع…",
      downloadReady: "جاهز: {title}",
      downloadZip: "تنزيل ZIP",
      downloadEmailHint:
        "تم أيضًا إرسال رابط تنزيل احتياطي إلى البريد الذي أدخلته.",
      includesSample: "يتضمن (عينة)",
      browseCategory: "تصفح هذه الفئة →",
      license: {
        personal: "استخدام شخصي",
        commercial: "ترخيص حرفي تجاري",
      },
    },
    home: {
      faq: {
        title: "الأسئلة الشائعة",
        subtitle: "ما نبيعه والأسعار والتسليم والاسترداد والدعم.",
        lead: "تبيع 5SVG حزم SVG حرفية رقمية (ZIP) بأسعار بالدولار على صفحة Bundles. مكتبة Free SVG تبقى مجانية. تتم المدفوعات عبر Creem.",
        q1: "ماذا تبيعون؟",
        a1: "حزم SVG حرفية أصلية — ملفات قص رقمية بصيغة ZIP لصنّاع المحتوى. لا نبيع سلعًا مادية. شعارات Free SVG مجانية وغير معروضة للبيع.",
        q2: "كم سعر الحزمة؟",
        a2: "عادةً $4.50 USD لعملية شراء واحدة. السعر الدقيق على https://5svg.com/shop وكل صفحة منتج.",
        q3: "كيف يتم التسليم؟",
        a3: "رقمي بالكامل وفوري بعد الدفع: صفحة تنزيل ZIP. بلا شحن. استخدم بريدًا صالحًا عند الدفع للإيصال.",
        q4: "هل أحتاج حسابًا أو برنامجًا؟",
        a4: "لا. تصفح Free SVG واشترِ Bundles دون تسجيل. المفضلة في المتصفح. استورد SVG إلى Cricut أو Silhouette أو Canva وغيرها.",
        q5: "ما الترخيص؟",
        a5: "ترخيص حرفي شخصي. لا إعادة بيع أو توزيع للـ ZIP. شعارات Free SVG علامات تجارية لأصحابها. راجع الترخيص وشروط الخدمة.",
        q6: "هل يمكن الاسترداد؟",
        a6: "للتنزيلات الرقمية عادة لا بعد تسليم ZIP. إذا فشل التنزيل بسببنا راسل support@5svg.com.",
        q7: "أين سياسة الخصوصية والشروط؟",
        a7: "الخصوصية: https://5svg.com/privacy — الشروط: https://5svg.com/terms — الترخيص: https://5svg.com/license.",
        q8: "كيف أتواصل مع الدعم؟",
        a8: "support@5svg.com أو صفحة اتصل بنا. نرد خلال يوم إلى يومين عمل (حتى 3 للفواتير).",
        contactBefore: "للأسئلة أعلاه وغيرها استخدم صفحة ",
        contactLink: "اتصل بنا",
        contactMiddle: " أو راسل ",
        contactAfter: ". نرد خلال يوم إلى يومين عمل.",
      },
      about: {
        title: "عن 5SVG",
        p1: "5SVG مكتبة شعارات SVG مجانية ومتجر لحزم SVG حرفية أصلية. المنتجات المدفوعة تنزيلات ZIP رقمية فقط — عادة $4.50 USD لمرة واحدة.",
        p2: "تصفح Free SVG أو افتح Bundles. الدعم: support@5svg.com. الصفحات القانونية في التذييل.",
        logoAlt: "شعار 5SVG — مكتبة SVG مجانية وحزم حرفية",
      },
    },
    Mail: {
      orderDownloadLink: {
        subject: "تنزيل 5SVG — {title}",
        title: "تنزيلك جاهز",
        body: "شكرًا لشرائك {title} من 5SVG.",
        downloadButton: "تنزيل ZIP",
        linkFallback: "أو انسخ رابط التنزيل الاحتياطي:",
        note: "إذا لم يُنزَّل الملف تلقائيًا بعد الدفع، افتح هذا الرابط مرة أخرى.",
        textIntro: "شكرًا لشرائك {title}.",
        textDownload: "نزّل ملف ZIP (رابط احتياطي):",
        textSupport: "الدعم: {email}",
      },
    },
  });
}

const enMail = {
  Mail: {
    orderDownloadLink: {
      subject: "Your 5SVG download — {title}",
      title: "Your download is ready",
      body: "Thanks for buying {title} on 5SVG.",
      downloadButton: "Download ZIP",
      linkFallback: "Or copy this backup download link:",
      note: "If the file did not download automatically after payment, open this link again to download.",
      textIntro: "Thanks for your purchase of {title}.",
      textDownload: "Download your ZIP (backup link):",
      textSupport: "Support: {email}",
    },
  },
};

const zhMail = {
  Mail: {
    orderDownloadLink: {
      subject: "您的 5SVG 下载 — {title}",
      title: "您的下载已就绪",
      body: "感谢您在 5SVG 购买 {title}。",
      downloadButton: "下载 ZIP",
      linkFallback: "或复制此备用下载链接：",
      note: "若支付后未自动下载，请再次打开此链接下载。",
      textIntro: "感谢您购买 {title}。",
      textDownload: "下载 ZIP（备用链接）：",
      textSupport: "支持：{email}",
    },
  },
};

for (const [locale, patch] of Object.entries(LOCALE_PATCHES)) {
  const file = path.join(dir, `${locale}.json`);
  const cur = JSON.parse(fs.readFileSync(file, "utf8"));
  const next = deepMerge(cur, patch);
  fs.writeFileSync(file, JSON.stringify(next, null, 2) + "\n");
  console.log("patched", locale);
}

for (const [locale, patch] of [
  ["en", enMail],
  ["zh", zhMail],
]) {
  const file = path.join(dir, `${locale}.json`);
  const cur = JSON.parse(fs.readFileSync(file, "utf8"));
  const next = deepMerge(cur, patch);
  // also refresh zh footer terms if needed — zh already has terms
  fs.writeFileSync(file, JSON.stringify(next, null, 2) + "\n");
  console.log("patched mail", locale);
}

console.log("done");
