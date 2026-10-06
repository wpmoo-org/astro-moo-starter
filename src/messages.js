const messages = {
  en: {
    toggle: "Toggle sidebar",
    navigation: "Site navigation",
    breadcrumb: "Breadcrumb",
    skip: "Skip to content",
    empty: "No entries yet.",
  },
  de: {
    toggle: "Seitenleiste umschalten",
    navigation: "Seitennavigation",
    breadcrumb: "Brotkrümelnavigation",
    skip: "Zum Inhalt springen",
    empty: "Noch keine Einträge.",
  },
};
export function getMessages(locale) {
  return messages[locale] ?? messages.en;
}
