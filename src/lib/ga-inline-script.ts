/** Inline GA bootstrap — same pattern as phototourl `src/app/layout.tsx` */
export function buildGaInlineScript(gaId: string): string {
  return `(function(){var id=${JSON.stringify(gaId)};function load(){if(window.__fivesvgGa)return;window.__fivesvgGa=1;window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;var s=document.createElement("script");s.async=1;s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(id);s.onload=function(){gtag("js",new Date());gtag("config",id);};document.head.appendChild(s);}if(document.readyState==="complete")load();else window.addEventListener("load",load,{once:true});})();`;
}
