/* PERIĆ SISTEMI – accessible, lightweight site interactions */
(() => {
  "use strict";

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
