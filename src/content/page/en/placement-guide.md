---
title: "Placement guide"
description: "Content placements and an independent aside."
slug: "placement-guide"
status: publish
locale: en
translationKey: placement-guide
taxonomies:
  category: [guides]
  tag: [astro]
  sector: [development]
---

## Intro

A normal Markdown page can have an automatic table of contents beside its content. This guide brings together four parts of a small multilingual website: the article itself, the project configuration, the translated content, and the navigation around it. Each section explains a different responsibility so you can follow the page while scrolling or jump directly to a subject.

The article remains the main reading area. Its heading, description, paragraphs, and lists come from the project's content file. The information beside it gives additional context without interrupting that reading order. A visitor can finish the article first and still find the supporting information afterwards on a narrow screen.

The table of contents serves a different purpose from the site menu. Its links point to headings on this page, while the site menu leads to other pages and archives. As you move through the article, the active indicator helps you keep your place. Following a heading link also gives that section a URL fragment that can be copied and shared.

Try reading the page from beginning to end before using the links on the right. Notice how the current section changes when the next heading reaches the top of the reading area. Then return to this introduction through the table of contents and compare that movement with ordinary scrolling.

### Content and configuration

The project owns this content. The package supplies the layout and reusable blocks. That division lets an author update the text without editing a template, and lets a site change its layout without moving the article into a theme package. A new paragraph, list, or heading can be written directly in the same Markdown file.

Content and configuration answer different questions. The article describes the subject of the page. Configuration determines how the site presents that article, which navigation is available, and where supporting blocks appear. Reusable information can be maintained separately and placed beside several articles, while the main text stays specific to each page.

For a small project, the editing routine can stay simple:

- Write the article and its description in the content file.
- Choose useful headings that describe the sections clearly.
- Assign the category, tags, and any other relevant taxonomy terms.
- Keep shared notices or contact information in reusable blocks.
- Use project preferences when the same layout choice should apply across the site.

The aside in this example contains the table of contents and a separate page-information block. Each has its own section, and the configured gap provides consistent space between them. Adding more supporting content should preserve that rhythm. The text does not need empty paragraphs or manual spacing to make room for the next widget.

## Languages

Each published translation uses its own headings and reusable content. The English and German versions of this guide discuss the same subjects, but the article titles and section labels are written for their readers. The language switcher connects the two versions, so a visitor can change language while staying with the same article.

Translation involves more than replacing words. A useful localized article should keep examples, terminology, and instructions understandable in that language. An author can revise a sentence, explain a term, or expand a paragraph when the translated version needs more context. The files can be edited independently while retaining their relationship through the translation key.

The table of contents follows the headings in the selected article. In the German version, its entries therefore show Einführung, Inhalt und Konfiguration, Sprachen, and Navigation. A link to a section uses the heading identifier from that version. Readers should see the language of the page consistently in both the article and its surrounding navigation.

When reviewing a translation, move through the whole page instead of checking only its first paragraph. Compare the description, heading order, taxonomy labels, supporting information, and navigation controls. Follow several section links and switch languages again. This makes it easier to notice a missing piece of content or a label that still belongs to the other language.

## Navigation

Use the header toggle to open the site navigation. The content aside is independent. The menu helps visitors find pages and taxonomy archives throughout the website; the table of contents helps them move within the article they are currently reading. Both are useful, but they guide readers at different scales.

On a wide screen, supporting information can sit next to the article while the main text keeps a comfortable reading width. When the layout becomes narrower, the ordinary aside content follows the article. The compact table of contents remains available above the reading area, where it can be opened without searching through the supporting blocks below.

A section link is also a useful starting point for someone arriving from another page. Instead of saying “look near the bottom,” a shared URL can point to the relevant heading. The heading still belongs to the same article, so the reader can continue into the surrounding explanation or use the table of contents to return to an earlier subject.

Try a short reading journey: open the site menu, close it, jump back to the introduction, and then scroll down to this section. Watch the active indicator travel through the intervening headings. Finally, narrow the window and open the compact table of contents. The same section links should remain understandable while the supporting information moves into the article's normal reading flow.
