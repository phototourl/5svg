/**
 * Fill LegalPages + high-visibility UI page copy for ALL locales.
 * Also used after merge.ts array-replace fix.
 * Run: node scripts/patch-i18n-all-locales-full.mjs
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

const enLegal = JSON.parse(fs.readFileSync(path.join(dir, "en.json"), "utf8"))
  .LegalPages;
const zhLegal = JSON.parse(fs.readFileSync(path.join(dir, "zh.json"), "utf8"))
  .LegalPages;

/** Shared UI chrome + library/browse/favorites (all locales). */
const UI = {
  en: {
    Ui: {
      searchPlaceholder: "Search...",
      sortAz: "Sort A–Z",
      sortLatest: "Sort by latest",
      accept: "Accept",
      logos: "logos",
      azIndex: "A–Z index",
      clearSearch: "Clear search",
      searchResults: "search results",
      svgs: "SVGs",
    },
    HeroTabs: {
      brands: "Brands",
      browse: "Browse",
      ai: "AI",
      design: "Design",
      social: "Social",
      aria: "Logo previews",
    },
    WarningBanner: {
      body: "SVG assets are provided for reference. You are responsible for verifying trademark and usage rights before using them in your projects.",
      accept: "Accept",
    },
    NotFound: {
      title: "SVG not found",
      inCategory: '"{title}" not found in "{category}" category',
      plain: '"{title}" not found',
      searchGlobally: "Search globally",
      requestSvg: "Request SVG",
      submitSvg: "Submit SVG",
    },
    LibraryPage: {
      title: "Free SVG Library — Browse Icons & Brand Logos | 5SVG",
      description:
        "Browse and download free SVG icons and brand logos. Search by name, filter by category, sort A–Z, and copy or download files — no signup.",
      h1: "Free SVG Icon & Logo Library",
      lead: "Search free SVG icons by name or category, then download vector SVG files for design, crafts, Cricut, and the web.",
      sections: {
        search: {
          h2: "Search free SVG icons and logos",
          body: "Use the search bar to find SVG files by brand or title. Sort A–Z or browse the newest vector logos in the library.",
          h3: "Find free SVGs by name, brand, or category",
        },
        download: {
          h2: "Download and use SVG vector files",
          body: "Open any card to copy SVG code or download the optimized file. Save SVG icons to your collection for quick access.",
          h3: "Copy, download, or bookmark SVG icons",
        },
      },
    },
    BrowsePage: {
      title: "Browse All SVG Logos A–Z — Free Icon Index | 5SVG",
      description:
        "Alphabetical index of every free SVG logo and brand icon on 5SVG. Jump to any logo detail page to copy or download vector files.",
      h1: "Browse all SVG logos",
      lead: "Complete A–Z index of free brand logo SVGs in the main library. Each link opens a detail page with copy, download, and license notes.",
      logosCount: "({count} logos)",
      backLibrary: "← Interactive library",
      popularBrands: "Popular brands",
      categories: "Categories",
    },
    FavoritesPage: {
      title: "Favorites",
      clearAll: "Clear all",
      emptyTitle: "No favorites yet",
      emptyBody:
        "Start adding SVGs to your favorites by clicking the heart icon on any SVG.",
      browseSvgs: "Browse SVGs",
    },
  },
  zh: {
    Ui: {
      searchPlaceholder: "搜索…",
      sortAz: "按 A–Z 排序",
      sortLatest: "按最新排序",
      accept: "知道了",
      logos: "个标志",
      azIndex: "A–Z 索引",
      clearSearch: "清除搜索",
      searchResults: "条搜索结果",
      svgs: "个 SVG",
    },
    HeroTabs: {
      brands: "品牌",
      browse: "浏览",
      ai: "AI",
      design: "设计",
      social: "社交",
      aria: "标志预览",
    },
    WarningBanner: {
      body: "SVG 资源仅供参考。你须自行核实商标与使用权限后再用于项目。",
      accept: "知道了",
    },
    NotFound: {
      title: "未找到 SVG",
      inCategory: "在「{category}」分类中未找到「{title}」",
      plain: "未找到「{title}」",
      searchGlobally: "全局搜索",
      requestSvg: "申请 SVG",
      submitSvg: "提交 SVG",
    },
    LibraryPage: {
      title: "免费 SVG 图库 — 浏览图标与品牌标志 | 5SVG",
      description:
        "浏览并下载免费 SVG 图标与品牌标志。按名称搜索、按分类筛选、A–Z 排序，复制或下载文件——无需注册。",
      h1: "免费 SVG 图标与标志图库",
      lead: "按名称或分类搜索免费 SVG，然后下载矢量文件，用于设计、手工、Cricut 与网页。",
      sections: {
        search: {
          h2: "搜索免费 SVG 图标与标志",
          body: "用搜索栏按品牌或标题查找 SVG。可按 A–Z 排序或浏览最新矢量标志。",
          h3: "按名称、品牌或分类查找免费 SVG",
        },
        download: {
          h2: "下载并使用 SVG 矢量文件",
          body: "打开任意卡片即可复制 SVG 代码或下载优化文件。可将图标加入收藏以便快速访问。",
          h3: "复制、下载或收藏 SVG 图标",
        },
      },
    },
    BrowsePage: {
      title: "浏览全部 SVG 标志 A–Z — 免费索引 | 5SVG",
      description:
        "5SVG 全部免费 SVG 标志与品牌图标的字母索引。跳转到详情页即可复制或下载矢量文件。",
      h1: "浏览全部 SVG 标志",
      lead: "主图库免费品牌标志 SVG 的完整 A–Z 索引。每个链接打开含复制、下载与许可说明的详情页。",
      logosCount: "（{count} 个标志）",
      backLibrary: "← 交互式图库",
      popularBrands: "热门品牌",
      categories: "分类",
    },
    FavoritesPage: {
      title: "收藏",
      clearAll: "全部清除",
      emptyTitle: "还没有收藏",
      emptyBody: "点击任意 SVG 上的心形图标即可加入收藏。",
      browseSvgs: "浏览 SVG",
    },
  },
  es: {
    Ui: {
      searchPlaceholder: "Buscar...",
      sortAz: "Ordenar A–Z",
      sortLatest: "Ordenar por más recientes",
      accept: "Aceptar",
      logos: "logos",
      azIndex: "Índice A–Z",
      clearSearch: "Borrar búsqueda",
      searchResults: "resultados",
      svgs: "SVGs",
    },
    HeroTabs: {
      brands: "Marcas",
      browse: "Explorar",
      ai: "IA",
      design: "Diseño",
      social: "Social",
      aria: "Vista previa de logos",
    },
    WarningBanner: {
      body: "Los SVG se ofrecen como referencia. Debes verificar marcas y derechos de uso antes de usarlos en tus proyectos.",
      accept: "Aceptar",
    },
    NotFound: {
      title: "SVG no encontrado",
      inCategory: '"{title}" no encontrado en la categoría "{category}"',
      plain: '"{title}" no encontrado',
      searchGlobally: "Buscar en todo",
      requestSvg: "Solicitar SVG",
      submitSvg: "Enviar SVG",
    },
    LibraryPage: {
      title: "Biblioteca SVG gratis — Iconos y logos | 5SVG",
      description:
        "Explora y descarga iconos y logos SVG gratis. Busca por nombre, filtra por categoría, ordena A–Z y copia o descarga — sin registro.",
      h1: "Biblioteca de iconos y logos SVG gratis",
      lead: "Busca SVG gratis por nombre o categoría y descarga vectores para diseño, crafts, Cricut y la web.",
      sections: {
        search: {
          h2: "Buscar iconos y logos SVG gratis",
          body: "Usa la barra de búsqueda por marca o título. Ordena A–Z o mira los logos más nuevos.",
          h3: "Encuentra SVG gratis por nombre, marca o categoría",
        },
        download: {
          h2: "Descargar y usar archivos SVG",
          body: "Abre cualquier tarjeta para copiar el código SVG o descargar el archivo. Guarda favoritos para acceso rápido.",
          h3: "Copia, descarga o guarda iconos SVG",
        },
      },
    },
    BrowsePage: {
      title: "Explorar todos los logos SVG A–Z | 5SVG",
      description:
        "Índice alfabético de todos los logos e iconos SVG gratis en 5SVG.",
      h1: "Explorar todos los logos SVG",
      lead: "Índice A–Z completo de logos de marca gratis. Cada enlace abre la página de detalle.",
      logosCount: "({count} logos)",
      backLibrary: "← Biblioteca interactiva",
      popularBrands: "Marcas populares",
      categories: "Categorías",
    },
    FavoritesPage: {
      title: "Favoritos",
      clearAll: "Borrar todo",
      emptyTitle: "Aún no hay favoritos",
      emptyBody:
        "Añade SVG a favoritos haciendo clic en el corazón de cualquier SVG.",
      browseSvgs: "Explorar SVG",
    },
  },
  de: {
    Ui: {
      searchPlaceholder: "Suchen...",
      sortAz: "A–Z sortieren",
      sortLatest: "Neueste zuerst",
      accept: "Akzeptieren",
      logos: "Logos",
      azIndex: "A–Z-Index",
      clearSearch: "Suche löschen",
      searchResults: "Treffer",
      svgs: "SVGs",
    },
    HeroTabs: {
      brands: "Marken",
      browse: "Stöbern",
      ai: "KI",
      design: "Design",
      social: "Social",
      aria: "Logo-Vorschau",
    },
    WarningBanner: {
      body: "SVG-Dateien dienen als Referenz. Du bist für Marken- und Nutzungsrechte vor der Verwendung verantwortlich.",
      accept: "Akzeptieren",
    },
    NotFound: {
      title: "SVG nicht gefunden",
      inCategory: '"{title}" in Kategorie "{category}" nicht gefunden',
      plain: '"{title}" nicht gefunden',
      searchGlobally: "Global suchen",
      requestSvg: "SVG anfragen",
      submitSvg: "SVG einreichen",
    },
    LibraryPage: {
      title: "Kostenlose SVG-Bibliothek — Icons & Logos | 5SVG",
      description:
        "Kostenlose SVG-Icons und Markenlogos durchsuchen und herunterladen. Suche, Filter, A–Z — ohne Anmeldung.",
      h1: "Kostenlose SVG-Icon- & Logo-Bibliothek",
      lead: "Suche kostenlose SVGs nach Name oder Kategorie und lade Vektordateien für Design, Crafts, Cricut unds Web.",
      sections: {
        search: {
          h2: "Kostenlose SVG-Icons und Logos suchen",
          body: "Nutze die Suche nach Marke oder Titel. Sortiere A–Z oder sieh die neuesten Logos.",
          h3: "Finde kostenlose SVGs nach Name, Marke oder Kategorie",
        },
        download: {
          h2: "SVG-Dateien herunterladen und nutzen",
          body: "Öffne eine Karte zum Kopieren oder Download. Speichere Favoriten für schnellen Zugriff.",
          h3: "SVG-Icons kopieren, laden oder merken",
        },
      },
    },
    BrowsePage: {
      title: "Alle SVG-Logos A–Z durchsuchen | 5SVG",
      description:
        "Alphabetischer Index aller kostenlosen SVG-Logos und Markenicons auf 5SVG.",
      h1: "Alle SVG-Logos durchsuchen",
      lead: "Vollständiger A–Z-Index kostenloser Marken-SVGs. Jeder Link öffnet die Detailseite.",
      logosCount: "({count} Logos)",
      backLibrary: "← Interaktive Bibliothek",
      popularBrands: "Beliebte Marken",
      categories: "Kategorien",
    },
    FavoritesPage: {
      title: "Favoriten",
      clearAll: "Alle löschen",
      emptyTitle: "Noch keine Favoriten",
      emptyBody:
        "Füge SVGs hinzu, indem du auf das Herz-Symbol klickst.",
      browseSvgs: "SVGs durchsuchen",
    },
  },
  fr: {
    Ui: {
      searchPlaceholder: "Rechercher...",
      sortAz: "Trier A–Z",
      sortLatest: "Plus récents",
      accept: "Accepter",
      logos: "logos",
      azIndex: "Index A–Z",
      clearSearch: "Effacer la recherche",
      searchResults: "résultats",
      svgs: "SVG",
    },
    HeroTabs: {
      brands: "Marques",
      browse: "Parcourir",
      ai: "IA",
      design: "Design",
      social: "Social",
      aria: "Aperçu des logos",
    },
    WarningBanner: {
      body: "Les SVG sont fournis à titre de référence. Vous devez vérifier les marques et droits d’usage avant utilisation.",
      accept: "Accepter",
    },
    NotFound: {
      title: "SVG introuvable",
      inCategory: '"{title}" introuvable dans la catégorie "{category}"',
      plain: '"{title}" introuvable',
      searchGlobally: "Recherche globale",
      requestSvg: "Demander un SVG",
      submitSvg: "Soumettre un SVG",
    },
    LibraryPage: {
      title: "Bibliothèque SVG gratuite — Icônes & logos | 5SVG",
      description:
        "Parcourez et téléchargez des icônes et logos SVG gratuits. Recherche, filtres, tri A–Z — sans inscription.",
      h1: "Bibliothèque d’icônes et logos SVG gratuits",
      lead: "Recherchez des SVG gratuits par nom ou catégorie, puis téléchargez des vecteurs pour le design, le craft, Cricut et le web.",
      sections: {
        search: {
          h2: "Rechercher des icônes et logos SVG gratuits",
          body: "Utilisez la barre de recherche par marque ou titre. Triez A–Z ou voyez les logos les plus récents.",
          h3: "Trouvez des SVG gratuits par nom, marque ou catégorie",
        },
        download: {
          h2: "Télécharger et utiliser des fichiers SVG",
          body: "Ouvrez une carte pour copier le code SVG ou télécharger le fichier. Enregistrez des favoris.",
          h3: "Copiez, téléchargez ou enregistrez des icônes SVG",
        },
      },
    },
    BrowsePage: {
      title: "Parcourir tous les logos SVG A–Z | 5SVG",
      description:
        "Index alphabétique de tous les logos et icônes SVG gratuits sur 5SVG.",
      h1: "Parcourir tous les logos SVG",
      lead: "Index A–Z complet des logos de marque gratuits. Chaque lien ouvre la page détail.",
      logosCount: "({count} logos)",
      backLibrary: "← Bibliothèque interactive",
      popularBrands: "Marques populaires",
      categories: "Catégories",
    },
    FavoritesPage: {
      title: "Favoris",
      clearAll: "Tout effacer",
      emptyTitle: "Pas encore de favoris",
      emptyBody:
        "Ajoutez des SVG en cliquant sur le cœur de n’importe quel SVG.",
      browseSvgs: "Parcourir les SVG",
    },
  },
  jp: {
    Ui: {
      searchPlaceholder: "検索...",
      sortAz: "A–Z で並べ替え",
      sortLatest: "新しい順",
      accept: "同意する",
      logos: "件のロゴ",
      azIndex: "A–Z 索引",
      clearSearch: "検索をクリア",
      searchResults: "件の結果",
      svgs: "件の SVG",
    },
    HeroTabs: {
      brands: "ブランド",
      browse: "閲覧",
      ai: "AI",
      design: "デザイン",
      social: "ソーシャル",
      aria: "ロゴプレビュー",
    },
    WarningBanner: {
      body: "SVG は参考用です。プロジェクトで使う前に商標と利用権限を確認してください。",
      accept: "同意する",
    },
    NotFound: {
      title: "SVG が見つかりません",
      inCategory: "「{category}」に「{title}」はありません",
      plain: "「{title}」が見つかりません",
      searchGlobally: "全体を検索",
      requestSvg: "SVG をリクエスト",
      submitSvg: "SVG を投稿",
    },
    LibraryPage: {
      title: "無料 SVG ライブラリ — アイコン＆ロゴ | 5SVG",
      description:
        "無料の SVG アイコンとブランドロゴを閲覧・ダウンロード。名前検索、カテゴリ、A–Z — 登録不要。",
      h1: "無料 SVG アイコン＆ロゴライブラリ",
      lead: "名前やカテゴリで無料 SVG を検索し、デザイン・クラフト・Cricut・Web 用のベクターをダウンロード。",
      sections: {
        search: {
          h2: "無料 SVG アイコンとロゴを検索",
          body: "ブランド名やタイトルで検索。A–Z 並べ替えや新着ロゴの閲覧も可能。",
          h3: "名前・ブランド・カテゴリで無料 SVG を見つける",
        },
        download: {
          h2: "SVG ファイルをダウンロードして使う",
          body: "カードを開いて SVG をコピーまたはダウンロード。お気に入りに保存できます。",
          h3: "SVG アイコンをコピー、ダウンロード、保存",
        },
      },
    },
    BrowsePage: {
      title: "すべての SVG ロゴを A–Z で閲覧 | 5SVG",
      description: "5SVG の無料 SVG ロゴ／アイコンの五十音・アルファベット索引。",
      h1: "すべての SVG ロゴを閲覧",
      lead: "無料ブランドロゴ SVG の完全 A–Z 索引。各リンクは詳細ページを開きます。",
      logosCount: "（{count} 件）",
      backLibrary: "← インタラクティブライブラリ",
      popularBrands: "人気ブランド",
      categories: "カテゴリ",
    },
    FavoritesPage: {
      title: "お気に入り",
      clearAll: "すべて削除",
      emptyTitle: "まだお気に入りがありません",
      emptyBody: "ハートアイコンをクリックして SVG をお気に入りに追加できます。",
      browseSvgs: "SVG を見る",
    },
  },
  pt: {
    Ui: {
      searchPlaceholder: "Pesquisar...",
      sortAz: "Ordenar A–Z",
      sortLatest: "Mais recentes",
      accept: "Aceitar",
      logos: "logos",
      azIndex: "Índice A–Z",
      clearSearch: "Limpar pesquisa",
      searchResults: "resultados",
      svgs: "SVGs",
    },
    HeroTabs: {
      brands: "Marcas",
      browse: "Explorar",
      ai: "IA",
      design: "Design",
      social: "Social",
      aria: "Pré-visualização de logos",
    },
    WarningBanner: {
      body: "Os SVG são fornecidos como referência. Verifique marcas e direitos de uso antes de os utilizar.",
      accept: "Aceitar",
    },
    NotFound: {
      title: "SVG não encontrado",
      inCategory: '"{title}" não encontrado na categoria "{category}"',
      plain: '"{title}" não encontrado',
      searchGlobally: "Pesquisar globalmente",
      requestSvg: "Pedir SVG",
      submitSvg: "Enviar SVG",
    },
    LibraryPage: {
      title: "Biblioteca SVG grátis — Ícones e logos | 5SVG",
      description:
        "Explore e descarregue ícones e logos SVG grátis. Pesquise, filtre, ordene A–Z — sem registo.",
      h1: "Biblioteca de ícones e logos SVG grátis",
      lead: "Pesquise SVG grátis por nome ou categoria e descarregue vetores para design, crafts, Cricut e web.",
      sections: {
        search: {
          h2: "Pesquisar ícones e logos SVG grátis",
          body: "Use a barra de pesquisa por marca ou título. Ordene A–Z ou veja os logos mais novos.",
          h3: "Encontre SVG grátis por nome, marca ou categoria",
        },
        download: {
          h2: "Descarregar e usar ficheiros SVG",
          body: "Abra qualquer cartão para copiar o código SVG ou descarregar. Guarde favoritos.",
          h3: "Copie, descarregue ou guarde ícones SVG",
        },
      },
    },
    BrowsePage: {
      title: "Explorar todos os logos SVG A–Z | 5SVG",
      description:
        "Índice alfabético de todos os logos e ícones SVG grátis no 5SVG.",
      h1: "Explorar todos os logos SVG",
      lead: "Índice A–Z completo de logos de marca grátis. Cada link abre a página de detalhe.",
      logosCount: "({count} logos)",
      backLibrary: "← Biblioteca interativa",
      popularBrands: "Marcas populares",
      categories: "Categorias",
    },
    FavoritesPage: {
      title: "Favoritos",
      clearAll: "Limpar tudo",
      emptyTitle: "Ainda sem favoritos",
      emptyBody:
        "Adicione SVGs aos favoritos clicando no coração de qualquer SVG.",
      browseSvgs: "Explorar SVGs",
    },
  },
  ko: {
    Ui: {
      searchPlaceholder: "검색...",
      sortAz: "A–Z 정렬",
      sortLatest: "최신순",
      accept: "확인",
      logos: "개 로고",
      azIndex: "A–Z 색인",
      clearSearch: "검색 지우기",
      searchResults: "개 결과",
      svgs: "개 SVG",
    },
    HeroTabs: {
      brands: "브랜드",
      browse: "둘러보기",
      ai: "AI",
      design: "디자인",
      social: "소셜",
      aria: "로고 미리보기",
    },
    WarningBanner: {
      body: "SVG는 참고용입니다. 프로젝트에 사용하기 전 상표와 사용 권한을 확인하세요.",
      accept: "확인",
    },
    NotFound: {
      title: "SVG를 찾을 수 없음",
      inCategory: '"{category}" 분류에서 "{title}"을(를) 찾을 수 없습니다',
      plain: '"{title}"을(를) 찾을 수 없습니다',
      searchGlobally: "전체 검색",
      requestSvg: "SVG 요청",
      submitSvg: "SVG 제출",
    },
    LibraryPage: {
      title: "무료 SVG 라이브러리 — 아이콘 & 로고 | 5SVG",
      description:
        "무료 SVG 아이콘과 브랜드 로고를 둘러보고 다운로드하세요. 검색, 분류, A–Z — 가입 불필요.",
      h1: "무료 SVG 아이콘 & 로고 라이브러리",
      lead: "이름이나 분류로 무료 SVG를 검색한 뒤 디자인·크래프트·Cricut·웹용 벡터를 다운로드하세요.",
      sections: {
        search: {
          h2: "무료 SVG 아이콘과 로고 검색",
          body: "브랜드나 제목으로 검색하세요. A–Z 정렬 또는 최신 로고를 볼 수 있습니다.",
          h3: "이름·브랜드·분류로 무료 SVG 찾기",
        },
        download: {
          h2: "SVG 파일 다운로드 및 사용",
          body: "카드를 열어 SVG 코드를 복사하거나 파일을 다운로드하세요. 즐겨찾기에 저장할 수 있습니다.",
          h3: "SVG 아이콘 복사, 다운로드, 저장",
        },
      },
    },
    BrowsePage: {
      title: "모든 SVG 로고 A–Z 둘러보기 | 5SVG",
      description: "5SVG의 모든 무료 SVG 로고/아이콘 알파벳 색인.",
      h1: "모든 SVG 로고 둘러보기",
      lead: "무료 브랜드 로고 SVG의 전체 A–Z 색인. 각 링크는 상세 페이지를 엽니다.",
      logosCount: "({count}개)",
      backLibrary: "← 인터랙티브 라이브러리",
      popularBrands: "인기 브랜드",
      categories: "분류",
    },
    FavoritesPage: {
      title: "즐겨찾기",
      clearAll: "모두 지우기",
      emptyTitle: "아직 즐겨찾기가 없습니다",
      emptyBody: "하트 아이콘을 눌러 SVG를 즐겨찾기에 추가하세요.",
      browseSvgs: "SVG 둘러보기",
    },
  },
  ru: {
    Ui: {
      searchPlaceholder: "Поиск...",
      sortAz: "Сортировать A–Z",
      sortLatest: "Сначала новые",
      accept: "Принять",
      logos: "логотипов",
      azIndex: "Индекс A–Z",
      clearSearch: "Очистить поиск",
      searchResults: "результатов",
      svgs: "SVG",
    },
    HeroTabs: {
      brands: "Бренды",
      browse: "Обзор",
      ai: "ИИ",
      design: "Дизайн",
      social: "Соцсети",
      aria: "Превью логотипов",
    },
    WarningBanner: {
      body: "SVG предоставлены для справки. Перед использованием проверьте товарные знаки и права на использование.",
      accept: "Принять",
    },
    NotFound: {
      title: "SVG не найден",
      inCategory: '"{title}" не найден в категории "{category}"',
      plain: '"{title}" не найден',
      searchGlobally: "Искать везде",
      requestSvg: "Запросить SVG",
      submitSvg: "Отправить SVG",
    },
    LibraryPage: {
      title: "Бесплатная библиотека SVG — иконки и логотипы | 5SVG",
      description:
        "Смотрите и скачивайте бесплатные SVG-иконки и логотипы. Поиск, фильтры, A–Z — без регистрации.",
      h1: "Бесплатная библиотека SVG-иконок и логотипов",
      lead: "Ищите бесплатные SVG по имени или категории и скачивайте векторы для дизайна, crafts, Cricut и веба.",
      sections: {
        search: {
          h2: "Поиск бесплатных SVG-иконок и логотипов",
          body: "Ищите по бренду или названию. Сортируйте A–Z или смотрите новые логотипы.",
          h3: "Найдите бесплатные SVG по имени, бренду или категории",
        },
        download: {
          h2: "Скачивание и использование SVG",
          body: "Откройте карточку, чтобы скопировать код или скачать файл. Сохраняйте избранное.",
          h3: "Копируйте, скачивайте или сохраняйте SVG",
        },
      },
    },
    BrowsePage: {
      title: "Все SVG-логотипы A–Z | 5SVG",
      description:
        "Алфавитный индекс всех бесплатных SVG-логотипов и иконок на 5SVG.",
      h1: "Просмотр всех SVG-логотипов",
      lead: "Полный A–Z индекс бесплатных брендовых SVG. Каждая ссылка открывает страницу деталей.",
      logosCount: "({count} логотипов)",
      backLibrary: "← Интерактивная библиотека",
      popularBrands: "Популярные бренды",
      categories: "Категории",
    },
    FavoritesPage: {
      title: "Избранное",
      clearAll: "Очистить всё",
      emptyTitle: "Пока нет избранного",
      emptyBody:
        "Добавляйте SVG в избранное, нажимая на сердечко.",
      browseSvgs: "Смотреть SVG",
    },
  },
  ar: {
    Ui: {
      searchPlaceholder: "بحث...",
      sortAz: "ترتيب A–Z",
      sortLatest: "الأحدث",
      accept: "موافق",
      logos: "شعار",
      azIndex: "فهرس A–Z",
      clearSearch: "مسح البحث",
      searchResults: "نتائج",
      svgs: "ملفات SVG",
    },
    HeroTabs: {
      brands: "العلامات",
      browse: "تصفح",
      ai: "ذكاء اصطناعي",
      design: "تصميم",
      social: "اجتماعي",
      aria: "معاينة الشعارات",
    },
    WarningBanner: {
      body: "ملفات SVG للمراجع فقط. أنت مسؤول عن التحقق من العلامات التجارية وحقوق الاستخدام قبل الاستخدام.",
      accept: "موافق",
    },
    NotFound: {
      title: "لم يُعثر على SVG",
      inCategory: 'لم يُعثر على "{title}" في تصنيف "{category}"',
      plain: 'لم يُعثر على "{title}"',
      searchGlobally: "بحث شامل",
      requestSvg: "طلب SVG",
      submitSvg: "إرسال SVG",
    },
    LibraryPage: {
      title: "مكتبة SVG مجانية — أيقونات وشعارات | 5SVG",
      description:
        "تصفح وحمل أيقونات وشعارات SVG مجانية. ابحث وفلتر ورتب A–Z — بدون تسجيل.",
      h1: "مكتبة أيقونات وشعارات SVG مجانية",
      lead: "ابحث عن SVG مجاني بالاسم أو التصنيف ثم حمّل ملفات متجهة للتصميم والحرف وCricut والويب.",
      sections: {
        search: {
          h2: "البحث عن أيقونات وشعارات SVG مجانية",
          body: "استخدم شريط البحث بالعلامة أو العنوان. رتّب A–Z أو اعرض أحدث الشعارات.",
          h3: "اعثر على SVG مجاني بالاسم أو العلامة أو التصنيف",
        },
        download: {
          h2: "تنزيل واستخدام ملفات SVG",
          body: "افتح أي بطاقة لنسخ كود SVG أو تنزيل الملف. احفظ المفضلة للوصول السريع.",
          h3: "انسخ أو نزّل أو احفظ أيقونات SVG",
        },
      },
    },
    BrowsePage: {
      title: "تصفح كل شعارات SVG A–Z | 5SVG",
      description: "فهرس أبجدي لكل شعارات وأيقونات SVG المجانية على 5SVG.",
      h1: "تصفح كل شعارات SVG",
      lead: "فهرس A–Z كامل لشعارات العلامات المجانية. كل رابط يفتح صفحة التفاصيل.",
      logosCount: "({count} شعارًا)",
      backLibrary: "← المكتبة التفاعلية",
      popularBrands: "علامات شائعة",
      categories: "التصنيفات",
    },
    FavoritesPage: {
      title: "المفضلة",
      clearAll: "مسح الكل",
      emptyTitle: "لا مفضلات بعد",
      emptyBody: "أضف SVG إلى المفضلة بالنقر على أيقونة القلب.",
      browseSvgs: "تصفح SVG",
    },
  },
};

/** Legal page translations (full bodies) for locales without LegalPages yet. */
const LEGAL = {
  es: {
    about: {
      title: "Acerca de 5SVG — Biblioteca SVG gratis y Bundles craft",
      description:
        "5SVG es una biblioteca independiente de logos SVG gratis y una tienda de Bundles craft originales. Solo descargas digitales — precios claros en Bundles.",
      h1: "Acerca de 5SVG",
      sections: [
        {
          h2: "Qué ofrecemos",
          body: "5SVG ofrece una biblioteca gratuita de logos e iconos SVG de marcas, más Bundles craft de pago como ZIP de descarga única. Free SVG sigue gratis. Los Bundles son packs de corte originales para makers (Cricut, Silhouette, vinilo, camisetas).",
        },
        {
          h2: "Qué vendemos",
          body: "En Bundles vendemos solo packs SVG craft digitales — normalmente $4.50 USD cada uno, pago único, ZIP inmediato tras el pago. No vendemos productos físicos. Packs y precios actuales en /shop.",
        },
        {
          h2: "Quiénes somos",
          body: "5SVG es un proyecto independiente. No estamos afiliados ni respaldados por las marcas de la biblioteca gratuita. Los Bundles de pago son diseños craft originales para uso personal.",
        },
        {
          h2: "Soporte",
          body: "Email de soporte: support@5svg.com. Respondemos en 1–2 días hábiles. También puedes usar Contáctanos.",
        },
      ],
    },
    license: {
      title: "Política de licencias — 5SVG",
      description:
        "Cómo puedes usar los SVG gratis y los Bundles craft de pago en 5SVG.",
      h1: "Política de licencias",
      sections: [
        {
          h2: "Introducción",
          body: "Esta Política de licencias explica cómo puedes usar materiales de 5SVG. Al descargar Free SVG o comprar Bundles, aceptas esta política, los Términos del servicio y la Política de privacidad.",
        },
        {
          h2: "Biblioteca Free SVG",
          body: "Los logos e iconos de Free SVG son gratis para explorar, copiar y descargar en proyectos personales, educación y mockups. El uso comercial de marcas puede requerir permiso del titular. Free SVG no se vende como producto de pago.",
        },
        {
          h2: "Bundles de pago (packs craft)",
          body: "Los packs craft vendidos en Bundles se licencian para proyectos craft personales. No puedes revender, redistribuir ni volver a subir el ZIP o los SVG individuales como productos digitales independientes.",
        },
        {
          h2: "Propiedad intelectual",
          body: "Los diseños craft originales de los Bundles de pago pertenecen a 5SVG o están licenciados para la venta. Los logos de marca en Free SVG siguen siendo de sus titulares.",
        },
        {
          h2: "Marcas comerciales",
          body: "Los logos y marcas siguen siendo de sus respectivos titulares. 5SVG no está afiliado ni respaldado por esas marcas. No vendemos logos de marca registrados como productos de pago.",
        },
        {
          h2: "Sin garantía",
          body: "Los archivos se ofrecen tal cual. No garantizamos integridad, autorización legal para tu caso, ni que coincidan con las versiones oficiales más recientes.",
        },
        {
          h2: "Contacto",
          body: "Preguntas sobre esta política: support@5svg.com o Contáctanos.",
        },
      ],
    },
    privacy: {
      title: "Política de privacidad — 5SVG",
      description: "Cómo protegemos tus datos cuando usas 5SVG",
      h1: "Política de privacidad",
      sections: [
        {
          h2: "Introducción",
          body: "Bienvenido a la Política de privacidad de 5SVG. Explica cómo recopilamos, usamos y protegemos tu información al usar el sitio, Free SVG y la tienda de Bundles.",
        },
        {
          h2: "Información que recopilamos",
          body: "Podemos recopilar: (1) datos de contacto que facilitas — email en el checkout de Bundles o mensajes de contacto; (2) datos de uso cuando hay analítica; (3) datos técnicos del dispositivo. Los favoritos se guardan solo en tu navegador.",
        },
        {
          h2: "Cómo usamos la información",
          body: "Usamos la información para operar Free SVG y la tienda de Bundles; entregar ZIPs y recibos; dar soporte; mejorar el sitio; y prevenir abusos técnicos.",
        },
        {
          h2: "Pagos",
          body: "Los pagos de Bundles los procesa Creem. No almacenamos números completos de tarjeta en servidores de 5SVG.",
        },
        {
          h2: "Cookies y almacenamiento",
          body: "Podemos usar cookies o almacenamiento local para tema, idioma, favoritos y analítica. Puedes borrar los datos del sitio en el navegador.",
        },
        {
          h2: "Seguridad de los datos",
          body: "Aplicamos medidas de seguridad adecuadas. Ninguna transmisión por Internet es 100% segura.",
        },
        {
          h2: "Servicios de terceros",
          body: "Podemos usar terceros para pagos, email, analítica o hosting. Los enlaces externos se rigen por sus propias políticas.",
        },
        {
          h2: "Cambios",
          body: "Podemos actualizar esta política publicando la versión nueva en esta página.",
        },
        {
          h2: "Contacto",
          body: "Preguntas: support@5svg.com o Contáctanos.",
        },
      ],
    },
    terms: {
      title: "Términos del servicio — 5SVG",
      description:
        "Términos para usar 5SVG y comprar Bundles craft SVG",
      h1: "Términos del servicio",
      sections: [
        {
          h2: "Introducción",
          body: "Estos Términos rigen el uso del sitio 5SVG, Free SVG y la tienda de Bundles. Al acceder o comprar, aceptas estos Términos, la Política de privacidad y la Política de licencias.",
        },
        {
          h2: "Uso del servicio",
          body: "El servicio se ofrece «tal cual». No garantizamos disponibilidad ininterrumpida. Puedes explorar Free SVG sin cuenta; comprar Bundles requiere un email válido.",
        },
        {
          h2: "Productos que vendemos",
          body: "Vendemos Bundles SVG craft digitales (ZIP) de compra única, normalmente $4.50 USD. Free SVG no es un producto de pago. No vendemos bienes físicos ni packs de logos de marca de terceros.",
        },
        {
          h2: "Precio y pago",
          body: "Los precios están en https://5svg.com/shop. El pago lo procesa Creem. Debes facilitar un email válido para la entrega.",
        },
        {
          h2: "Entrega",
          body: "Solo entrega digital. Tras el pago vuelves a la página de descarga; puede enviarse un enlace de respaldo por email. Sin envío físico.",
        },
        {
          h2: "Propiedad intelectual",
          body: "Los Bundles comprados se licencian para craft personal según la Política de licencias. No puedes revender el ZIP. Los logos Free SVG siguen sujetos a marcas de terceros.",
        },
        {
          h2: "Actividades prohibidas",
          body: "No uses el sitio de forma ilegal; no intentes acceso no autorizado; no sobrecargues el servicio; no distribuyas malware; no uses archivos incumpliendo estos Términos.",
        },
        {
          h2: "Reembolsos",
          body: "Al ser descargas digitales, generalmente no hay reembolso tras entregar el ZIP. Si falla la descarga por nuestra culpa, escribe a support@5svg.com.",
        },
        {
          h2: "Limitación de responsabilidad",
          body: "5SVG no responde de daños indirectos o consecuentes derivados del uso del sitio o de los archivos.",
        },
        {
          h2: "Cambios",
          body: "Podemos modificar estos Términos publicando la versión actualizada aquí.",
        },
        {
          h2: "Contacto",
          body: "Preguntas: support@5svg.com o Contáctanos. Respondemos en 1–2 días hábiles.",
        },
      ],
    },
  },
};

// For remaining locales (de,fr,jp,pt,ko,ru,ar) — load from companion file if present,
// else generate from EN with note. We'll embed compact translations below.
