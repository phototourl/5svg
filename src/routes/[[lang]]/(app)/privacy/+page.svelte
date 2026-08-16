<script lang="ts">
  import LegalDocumentPage from "@/components/trust/LegalDocumentPage.svelte";
  import { getI18n } from "@/lib/i18n/context";
  import { getLegalPage } from "@/lib/i18n/legal-pages";
  import { page } from "$app/state";
  import type { Messages } from "@/lib/i18n/messages";

  const i18n = $derived(getI18n());
  const legal = $derived(
    getLegalPage((page.data.messages as Messages) ?? {}, "privacy"),
  );
</script>

<LegalDocumentPage
  title={legal.title}
  description={legal.description}
  h1={legal.h1}
  sections={legal.sections}
  footerLinks={[
    {
      type: "internal",
      href: "/terms",
      label: i18n.t("common.footer.termsOfService"),
    },
    {
      type: "internal",
      href: "/license",
      label: i18n.t("common.footer.licensingPolicy"),
    },
    { type: "email" },
  ]}
/>
