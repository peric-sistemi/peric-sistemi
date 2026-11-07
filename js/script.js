/* PERIĆ SISTEMI – accessible, lightweight site interactions */
(() => {
  "use strict";

  // Provide a keyboard skip link on pages with a main landmark.
  const mainContent = document.querySelector("main");
  if (mainContent && !document.querySelector(".skip-link")) {
    if (!mainContent.id) mainContent.id = "main-content";
    const skipLink = document.createElement("a");
    skipLink.className = "skip-link";
    skipLink.href = "#" + mainContent.id;
    skipLink.textContent = "Preskoči na sadržaj";
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  const header = document.querySelector("header");
  if (header) {
    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 50);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector("#main-nav");
  // Keep the quote-request path visible on desktop and mobile navigation.
  const estimatePath = "/brza-procena.html";
  if (mainNav) {
    const list = mainNav.querySelector("ul");
    if (list && !list.querySelector('a[href="' + estimatePath + '"]')) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = estimatePath;
      link.textContent = "Brza procena";
      item.appendChild(link);
      list.appendChild(item);
    }
  }
  const headerButtons = document.querySelector(".header-buttons");
  if (headerButtons && !headerButtons.querySelector(".estimate-btn")) {
    const estimate = document.createElement("a");
    estimate.href = estimatePath;
    estimate.className = "estimate-btn";
    estimate.textContent = "Brza procena";
    headerButtons.prepend(estimate);
  }
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("mobile-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Zatvori meni" : "Otvori meni");
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("mobile-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Otvori meni");
      });
    });
  }

  // Client-side product catalogue search (does not send or store query data).
  const catalogInput = document.getElementById("catalog-search-input");
  const catalogStatus = document.getElementById("catalog-search-status");
  const catalogEmpty = document.getElementById("catalog-search-empty");
  if (catalogInput) {
    const cards = [...document.querySelectorAll(".catalog-grid .catalog-card")];
    const entries = cards.map((card) => ({
      card,
      heading: (card.querySelector("h2")?.textContent || "").toLocaleLowerCase("sr-Latn"),
      items: [...card.querySelectorAll(".model-list > li")]
    }));
    const filterCatalog = () => {
      const query = catalogInput.value.trim().toLocaleLowerCase("sr-Latn");
      let visible = 0;
      let total = 0;
      entries.forEach(({ card, heading, items }) => {
        let cardVisible = 0;
        items.forEach((item) => {
          total += 1;
          const searchable = (item.textContent || "").toLocaleLowerCase("sr-Latn");
          const matches = !query || heading.includes(query) || searchable.includes(query);
          item.hidden = !matches;
          if (matches) {
            visible += 1;
            cardVisible += 1;
          }
        });
        card.hidden = items.length > 0 && cardVisible === 0;
      });
      if (catalogStatus) {
        catalogStatus.textContent = query
          ? `${visible} od ${total} prikazanih stavki odgovara pretrazi.`
          : `Prikazano ${total} stavki iz kataloga.`;
      }
      if (catalogEmpty) catalogEmpty.hidden = visible !== 0;
    };
    catalogInput.addEventListener("input", filterCatalog);
    filterCatalog();
  }

  // Smooth-scroll only valid in-page anchors; ignore href="#" placeholders.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Keep the footer year current without replacing other footer content.
  const copyright = document.querySelector(".copyright");
  if (copyright) {
    copyright.textContent = `© ${new Date().getFullYear()} Perić Sistemi. Sva prava zadržana.`;
  }
})();
