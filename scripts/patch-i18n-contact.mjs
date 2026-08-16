/**
 * Patch ContactPage + common.siteName into non-en/zh locales.
 * Run: node scripts/patch-i18n-contact.mjs
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
    common: { siteName: "5SVG" },
    ContactPage: {
      title: "Contáctanos",
      description:
        "Contacta con 5SVG sobre SVG gratis, Bundles, licencias o comentarios. Respondemos en 1–2 días hábiles.",
      subtitle:
        "Te ayudamos con Free SVG, Bundles craft y preguntas de licencia.",
      introShort:
        "¿Tienes una pregunta o comentario? Completa el formulario y te responderemos pronto.",
      whyTitle: "Sobre qué puedes contactarnos",
      why1: "Biblioteca Free SVG: navegación, descarga o marcas registradas",
      why2: "SVG Bundles: compras, descargas o contenido del pack",
      why3: "Licencias y uso comercial",
      why4: "Comentarios, colaboraciones o reportes de abuso",
      expectTitle: "Qué esperar",
      expectContent:
        "Leemos cada mensaje y respondemos en 1–2 días hábiles. Para asuntos urgentes, indica un asunto claro y el máximo de detalle.",
      orEmail: "O escríbenos a",
      form: {
        title: "Enviar un mensaje",
        description:
          "¿Preguntas sobre Free SVG, Bundles o comentarios? Completa el formulario y te responderemos cuanto antes.",
        name: "Nombre",
        email: "Email",
        message: "Mensaje",
        namePlaceholder: "Tu nombre",
        emailPlaceholder: "tu@email.com",
        messagePlaceholder: "Tu mensaje o pregunta…",
        submit: "Enviar mensaje",
        mailtoHint:
          "Se abrirá tu app de correo con el mensaje listo para support@5svg.com.",
      },
    },
  },
  de: {
    common: { siteName: "5SVG" },
    ContactPage: {
      title: "Kontakt",
      description:
        "Kontaktiere 5SVG zu Free SVG, Bundles, Lizenz oder Feedback. Antwort in der Regel binnen 1–2 Werktagen.",
      subtitle: "Wir helfen bei Free SVG, Craft-Bundles und Lizenzfragen.",
      introShort:
        "Frage oder Feedback? Fülle das Formular aus — wir melden uns bald.",
      whyTitle: "Wobei wir helfen",
      why1: "Free-SVG-Bibliothek: Browse, Download oder Markenfragen",
      why2: "SVG Bundles: Kauf, Download oder Pack-Inhalt",
      why3: "Lizenz und kommerzielle Nutzung",
      why4: "Feedback, Partnerschaften oder Missbrauchsmeldungen",
      expectTitle: "Was du erwarten kannst",
      expectContent:
        "Wir lesen jede Nachricht und antworten in 1–2 Werktagen. Bei Dringendem bitte klaren Betreff und möglichst viele Details.",
      orEmail: "Oder schreib uns an",
      form: {
        title: "Nachricht senden",
        description:
          "Fragen zu Free SVG, Bundles oder Feedback? Formular ausfüllen — wir antworten so schnell wie möglich.",
        name: "Name",
        email: "E-Mail",
        message: "Nachricht",
        namePlaceholder: "Dein Name",
        emailPlaceholder: "deine@email.com",
        messagePlaceholder: "Deine Nachricht oder Frage…",
        submit: "Nachricht senden",
        mailtoHint:
          "Dein E-Mail-Programm öffnet sich mit einer Nachricht an support@5svg.com.",
      },
    },
  },
  fr: {
    common: { siteName: "5SVG" },
    ContactPage: {
      title: "Nous contacter",
      description:
        "Contactez 5SVG pour Free SVG, Bundles, licence ou retours. Réponse sous 1–2 jours ouvrés.",
      subtitle:
        "Nous aidons pour Free SVG, Bundles craft et questions de licence.",
      introShort:
        "Une question ou un retour ? Remplissez le formulaire — nous répondrons bientôt.",
      whyTitle: "Sujets possibles",
      why1: "Bibliothèque Free SVG : navigation, téléchargement ou marques",
      why2: "SVG Bundles : achats, téléchargements ou contenu du pack",
      why3: "Licence et usage commercial",
      why4: "Retours, partenariats ou signalement d’abus",
      expectTitle: "Ce à quoi s’attendre",
      expectContent:
        "Nous lisons chaque message et répondons sous 1–2 jours ouvrés. Pour l’urgent, indiquez un objet clair et un maximum de détails.",
      orEmail: "Ou écrivez-nous à",
      form: {
        title: "Envoyer un message",
        description:
          "Questions sur Free SVG, Bundles ou retours ? Remplissez le formulaire — nous répondrons dès que possible.",
        name: "Nom",
        email: "E-mail",
        message: "Message",
        namePlaceholder: "Votre nom",
        emailPlaceholder: "votre@email.com",
        messagePlaceholder: "Votre message ou question…",
        submit: "Envoyer le message",
        mailtoHint:
          "Votre application mail s’ouvrira avec un message prêt pour support@5svg.com.",
      },
    },
  },
  jp: {
    common: { siteName: "5SVG" },
    ContactPage: {
      title: "お問い合わせ",
      description:
        "Free SVG、Bundles、ライセンス、フィードバックについて 5SVG へご連絡ください。通常 1～2 営業日で返信します。",
      subtitle:
        "Free SVG、クラフト Bundles、ライセンスのご質問に対応します。",
      introShort:
        "ご質問やご意見は、下のフォームからお送りください。できるだけ早く返信します。",
      whyTitle: "お問い合わせ内容の例",
      why1: "Free SVG ライブラリ：閲覧・ダウンロード・商標関連",
      why2: "SVG Bundles：購入・ダウンロード・パック内容",
      why3: "ライセンスと商用利用",
      why4: "フィードバック、提携、不正利用の報告",
      expectTitle: "返信について",
      expectContent:
        "すべてのメッセージを確認し、通常 1～2 営業日で返信します。緊急の場合は件名を明確にし、できるだけ詳しくご記入ください。",
      orEmail: "またはメールで",
      form: {
        title: "メッセージを送信",
        description:
          "Free SVG、Bundles、フィードバックについてフォームにご記入ください。できるだけ早く返信します。",
        name: "お名前",
        email: "メール",
        message: "メッセージ",
        namePlaceholder: "お名前",
        emailPlaceholder: "your@email.com",
        messagePlaceholder: "ご質問やご意見を入力…",
        submit: "メッセージを送信",
        mailtoHint:
          "メールアプリが開き、support@5svg.com 宛の下書きが表示されます。",
      },
    },
  },
  pt: {
    common: { siteName: "5SVG" },
    ContactPage: {
      title: "Fale conosco",
      description:
        "Contacte a 5SVG sobre Free SVG, Bundles, licença ou feedback. Respondemos em 1–2 dias úteis.",
      subtitle: "Ajudamos com Free SVG, Bundles craft e questões de licença.",
      introShort:
        "Tem uma pergunta ou feedback? Preencha o formulário e responderemos em breve.",
      whyTitle: "Sobre o que pode contactar-nos",
      why1: "Biblioteca Free SVG: navegação, download ou marcas registadas",
      why2: "SVG Bundles: compras, downloads ou conteúdo do pack",
      why3: "Licença e uso comercial",
      why4: "Feedback, parcerias ou denúncia de abuso",
      expectTitle: "O que esperar",
      expectContent:
        "Lemos cada mensagem e respondemos em 1–2 dias úteis. Em urgências, indique um assunto claro e o máximo de detalhe.",
      orEmail: "Ou envie e-mail para",
      form: {
        title: "Enviar uma mensagem",
        description:
          "Perguntas sobre Free SVG, Bundles ou feedback? Preencha o formulário — responderemos o mais cedo possível.",
        name: "Nome",
        email: "E-mail",
        message: "Mensagem",
        namePlaceholder: "Seu nome",
        emailPlaceholder: "seu@email.com",
        messagePlaceholder: "Sua mensagem ou pergunta…",
        submit: "Enviar mensagem",
        mailtoHint:
          "Seu app de e-mail abrirá com a mensagem pronta para support@5svg.com.",
      },
    },
  },
  ko: {
    common: { siteName: "5SVG" },
    ContactPage: {
      title: "문의하기",
      description:
        "Free SVG, Bundles, 라이선스, 피드백에 대해 5SVG에 문의하세요. 영업일 기준 1–2일 내 답변을 목표로 합니다.",
      subtitle: "Free SVG, 크래프트 Bundles, 라이선스 관련 문의를 도와드립니다.",
      introShort:
        "질문이나 피드백이 있으신가요? 아래 양식을 작성해 주시면 곧 답변드리겠습니다.",
      whyTitle: "문의할 수 있는 내용",
      why1: "Free SVG 라이브러리: 탐색, 다운로드, 상표 관련",
      why2: "SVG Bundles: 구매, 다운로드, 팩 구성",
      why3: "라이선스 및 상업적 사용",
      why4: "피드백, 파트너십, 남용 신고",
      expectTitle: "답변 안내",
      expectContent:
        "모든 메시지를 확인하며 영업일 기준 1–2일 내 답변을 목표로 합니다. 긴급한 경우 명확한 제목과 자세한 내용을 적어 주세요.",
      orEmail: "또는 이메일",
      form: {
        title: "메시지 보내기",
        description:
          "Free SVG, Bundles, 피드백 관련 문의는 양식을 작성해 주세요. 가능한 빨리 답변드리겠습니다.",
        name: "이름",
        email: "이메일",
        message: "메시지",
        namePlaceholder: "이름",
        emailPlaceholder: "your@email.com",
        messagePlaceholder: "메시지나 질문을 입력하세요…",
        submit: "메시지 보내기",
        mailtoHint:
          "메일 앱이 열리며 support@5svg.com로 보낼 내용이 준비됩니다.",
      },
    },
  },
  ru: {
    common: { siteName: "5SVG" },
    ContactPage: {
      title: "Связаться с нами",
      description:
        "Свяжитесь с 5SVG по поводу Free SVG, Bundles, лицензии или отзывов. Отвечаем в течение 1–2 рабочих дней.",
      subtitle: "Помогаем с Free SVG, craft Bundles и вопросами лицензии.",
      introShort:
        "Есть вопрос или отзыв? Заполните форму — мы скоро ответим.",
      whyTitle: "О чём можно написать",
      why1: "Библиотека Free SVG: просмотр, скачивание или товарные знаки",
      why2: "SVG Bundles: покупки, загрузки или содержимое пакета",
      why3: "Лицензия и коммерческое использование",
      why4: "Отзывы, партнёрства или жалобы на злоупотребления",
      expectTitle: "Чего ожидать",
      expectContent:
        "Мы читаем каждое сообщение и отвечаем за 1–2 рабочих дня. В срочных случаях укажите тему и как можно больше деталей.",
      orEmail: "Или напишите на",
      form: {
        title: "Отправить сообщение",
        description:
          "Вопросы о Free SVG, Bundles или отзывы? Заполните форму — ответим как можно скорее.",
        name: "Имя",
        email: "Email",
        message: "Сообщение",
        namePlaceholder: "Ваше имя",
        emailPlaceholder: "your@email.com",
        messagePlaceholder: "Ваше сообщение или вопрос…",
        submit: "Отправить сообщение",
        mailtoHint:
          "Откроется почтовое приложение с письмом для support@5svg.com.",
      },
    },
  },
  ar: {
    common: { siteName: "5SVG" },
    ContactPage: {
      title: "تواصل معنا",
      description:
        "تواصل مع 5SVG بشأن Free SVG أو Bundles أو الترخيص أو الملاحظات. نرد خلال 1–2 يوم عمل.",
      subtitle: "نساعد في Free SVG وBundles الحرفية وأسئلة الترخيص.",
      introShort: "لديك سؤال أو ملاحظة؟ املأ النموذج وسنرد قريبًا.",
      whyTitle: "مواضيع يمكنك مراسلتنا بشأنها",
      why1: "مكتبة Free SVG: التصفح أو التنزيل أو العلامات التجارية",
      why2: "SVG Bundles: الشراء أو التنزيل أو محتوى الحزمة",
      why3: "الترخيص والاستخدام التجاري",
      why4: "الملاحظات أو الشراكات أو الإبلاغ عن إساءة الاستخدام",
      expectTitle: "ما يمكن توقعه",
      expectContent:
        "نقرأ كل رسالة ونهدف للرد خلال 1–2 يوم عمل. للأمور العاجلة اذكر موضوعًا واضحًا وأكبر قدر من التفاصيل.",
      orEmail: "أو راسلنا على",
      form: {
        title: "إرسال رسالة",
        description:
          "أسئلة عن Free SVG أو Bundles أو ملاحظات؟ املأ النموذج وسنرد في أقرب وقت.",
        name: "الاسم",
        email: "البريد الإلكتروني",
        message: "الرسالة",
        namePlaceholder: "اسمك",
        emailPlaceholder: "your@email.com",
        messagePlaceholder: "رسالتك أو سؤالك…",
        submit: "إرسال الرسالة",
        mailtoHint:
          "سيفتح تطبيق البريد برسالة جاهزة إلى support@5svg.com.",
      },
    },
  },
};

for (const [locale, patch] of Object.entries(patches)) {
  const file = path.join(dir, `${locale}.json`);
  const cur = JSON.parse(fs.readFileSync(file, "utf8"));
  const next = deepMerge(cur, patch);
  fs.writeFileSync(file, JSON.stringify(next, null, 2) + "\n");
  console.log("patched contact", locale);
}

function deepKeys(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out.push(...deepKeys(v, p));
    } else {
      out.push(p);
    }
  }
  return out;
}

const en = new Set(
  deepKeys(JSON.parse(fs.readFileSync(path.join(dir, "en.json"), "utf8"))),
);
for (const locale of Object.keys(patches).concat(["zh"])) {
  const keys = new Set(
    deepKeys(
      JSON.parse(fs.readFileSync(path.join(dir, `${locale}.json`), "utf8")),
    ),
  );
  const missing = [...en].filter((k) => !keys.has(k));
  console.log(`${locale}: missing=${missing.length}`);
}

console.log("done");
