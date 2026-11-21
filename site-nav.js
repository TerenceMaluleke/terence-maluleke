(function () {
  "use strict";

  function normalizePath(path) {
    if (!path) return "/";
    const trimmed = path.replace(/\/+$/, "");
    return trimmed === "" ? "/" : trimmed;
  }

  function initQuickNavMenu() {
    const toggle = document.getElementById("siteNavSectionTitle");
    const menu = document.getElementById("siteNavMenu");
    if (!toggle || !menu) return;

    const currentPath = normalizePath(window.location.pathname);
    menu.querySelectorAll("[data-nav-key]").forEach((link) => {
      const href = normalizePath(link.getAttribute("href"));
      if (href === currentPath) link.setAttribute("aria-current", "page");
    });

    function closeMenu() {
      if (menu.hidden) return;
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      if (menu.hidden) openMenu();
      else closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (menu.hidden) return;
      if (event.target.closest("#siteNavMenu") || event.target.closest("#siteNavSectionTitle")) return;
      closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("pagehide", closeMenu);
  }

  // When a gallery/prints/assamblage page is showing an artwork detail view,
  // the back arrow (.site-nav__home) is flagged with [data-gallery-exit] so
  // that it steps back to that page's own grid instead of leaving to "/".
  function initGalleryExitHandling() {
    document.addEventListener(
      "click",
      (event) => {
        const galleryExit = event.target.closest("[data-gallery-exit]");
        if (!galleryExit) return;

        event.preventDefault();

        if (
          document.getElementById("galleryLayout")?.dataset.mode === "detail" &&
          window.galleryIsImmersive?.()
        ) {
          window.gallerySetImmersive?.(false);
        } else if (document.getElementById("galleryLayout")?.dataset.mode === "detail") {
          window.galleryShowGrid?.();
        } else if (
          document.getElementById("printsLayout")?.dataset.mode === "detail" &&
          window.printsIsImmersive?.()
        ) {
          window.printsSetImmersive?.(false);
        } else if (document.getElementById("printsLayout")?.dataset.mode === "detail") {
          window.printsShowGrid?.();
        } else if (
          document.getElementById("maquettesLayout")?.dataset.mode === "detail" &&
          window.maquettesIsImmersive?.()
        ) {
          window.maquettesSetImmersive?.(false);
        } else if (document.getElementById("maquettesLayout")?.dataset.mode === "detail") {
          window.maquettesShowGrid?.();
        }
      },
      true
    );
  }

  function init() {
    initQuickNavMenu();
    initGalleryExitHandling();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
