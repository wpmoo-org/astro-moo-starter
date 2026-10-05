import type { ComponentProps } from "astro/types";
import type SDKSidebar from "@wpmoo/astro/includes/Sidebar.astro";
import type SDKHeader from "@wpmoo/astro/includes/Header.astro";
import type { PageClassContext, PageOptions } from "@wpmoo/astro/config";
import type { LanguageLink } from "@wpmoo/astro/i18n";
import type { SeoMetadata } from "@wpmoo/astro/seo";

export interface SiteChrome {
  readonly brand: string;
  readonly homeHref: string;
  readonly navigation: readonly NonNullable<
    ComponentProps<typeof SDKSidebar>["groups"]
  >[number][];
  readonly languageLinks: readonly LanguageLink[];
  readonly breadcrumbs: readonly ComponentProps<
    typeof SDKHeader
  >["breadcrumbs"][number][];
}
export interface SiteLayoutProps {
  chrome: SiteChrome;
  options: Readonly<PageOptions>;
  title: string;
  description?: string;
  metadata?: SeoMetadata | null;
  pageContext?: PageClassContext;
}
