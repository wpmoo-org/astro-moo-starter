/** @type {import("@wpmoo/astro/config").PageOptionsInput} */
export const projectDefaults = {
  theme: "dark",
  pageWidth: "xl",
  headerWidth: "xl",
  parts: {
    content: { utilities: ["mx-auto", "py-4", "py-md-5", "px-3", "px-md-5"] },
  },
  sidebar: { mode: "drawer" },
  aside: { side: "right", columns: 3, breakpoint: "lg", sticky: true },
};
