(function () {
  "use strict";

  function normalizePath(path) {
    if (!path) return "/";
    const trimmed = path.replace(/\/+$/, "");
    return trimmed === "" ? "/" : trimmed;
  }

  // The section menu (Info/Paintings/Prints/Assamblage/Calendar) is always
  // visible on every subpage. The only thing we need to do is mark which
  // entry matches the current page so it can be de-emphasized.
  function markActiveMenuItem() {
    const menu = document.getElementById("siteNavMenu");
    if (!menu) return;

    const currentPath = normalizePath(window.location.pathname);
    menu.querySelectorAll("[data-nav-key]").forEach((link) => {
      const href = normalizePath(link.getAttribute("href"));
      if (href === currentPath) link.setAttribute("aria-current", "page");
    });
  }

  // The standalone back button lives on its own in the top-left corner of
  // every subpage, independent of the section menu. When a gallery/prints/
  // assamblage page is showing an artwork detail view, the button is
  // flagged with [data-gallery-exit] so that it steps back to that page's
  // own grid instead of leaving to "/".
  function initBackButton() {
    document.addEventListener(
      "click",
      (event) => {
        const backButton = event.target.closest(".site-nav__back");
        if (!backButton) return;

        event.preventDefault();

        if (!backButton.hasAttribute("data-gallery-exit")) {
          window.location.href = "/";
          return;
        }

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
        } else {
          window.location.href = "/";
        }
      },
      true
    );
  }

  function init() {
    markActiveMenuItem();
    initBackButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
