// Interações para a versão convertida do exemplo React -> HTML
(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Toggle mobile menu
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  if (navToggle && mobileMenu) {
    const ensureBackdrop = () => {
      let bd = document.getElementById("menuBackdrop");
      if (!bd) {
        bd = document.createElement("div");
        bd.id = "menuBackdrop";
        bd.className = "menu-backdrop";
        // Inserir antes do menu para não sobrepor
        document.body.insertBefore(bd, mobileMenu);
        bd.addEventListener("click", closeMenu);
      }
      return bd;
    };
    const applyOffsets = () => {
      const header = document.querySelector(".site-header");
      const headerH = header ? header.offsetHeight : 0;
      mobileMenu.style.setProperty("--menu-top", headerH + "px");
      // Ajustar altura caso mude em resize
      mobileMenu.style.height = `calc(100dvh - ${headerH}px)`;
      const bd = document.getElementById("menuBackdrop");
      if (bd) {
        // Garantir top real aplicado mesmo se variável não resolver
        bd.style.setProperty("--menu-top", headerH + "px");
        bd.style.top = headerH + "px";
      }
    };
    const openMenu = () => {
      applyOffsets();
      mobileMenu.dataset.hidden = "false";
      navToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      const bd = ensureBackdrop();
      // Recalcular agora que o backdrop existe
      applyOffsets();
      requestAnimationFrame(() => bd.classList.add("show"));
    };
    const closeMenu = () => {
      mobileMenu.dataset.hidden = "true";
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      const bd = document.getElementById("menuBackdrop");
      if (bd) bd.classList.remove("show");
    };
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });
    window.addEventListener("resize", () => {
      if (navToggle.getAttribute("aria-expanded") === "true") applyOffsets();
    });
    mobileMenu
      .querySelectorAll("a,[data-scroll]")
      .forEach((el) => el.addEventListener("click", closeMenu));
    const closeBtn = document.getElementById("closeMobileMenu");
    closeBtn && closeBtn.addEventListener("click", closeMenu);
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        navToggle.getAttribute("aria-expanded") === "true"
      )
        closeMenu();
    });
  }

  // Smooth scroll for [data-scroll] and anchor links
  function smoothTo(target) {
    const el = document.querySelector(target);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", target);
  }
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-scroll]");
    if (trigger) {
      e.preventDefault();
      smoothTo(trigger.getAttribute("data-scroll"));
      return;
    }
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor && anchor.getAttribute("href") !== "#") {
      e.preventDefault();
      smoothTo(anchor.getAttribute("href"));
    }
  });

  // Back to top visibility
  const backToTop = document.getElementById("backToTop");
  const onScroll = () => {
    if (!backToTop) return;
    if (window.scrollY > 600) {
      backToTop.classList.remove("opacity-0", "translate-y-2");
    } else {
      backToTop.classList.add("opacity-0", "translate-y-2");
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Galeria com autoplay infinito
  const galleries = document.querySelectorAll("[data-gallery]");
  galleries.forEach((gallery) => {
    const track = gallery.querySelector("[data-gallery-track]");
    if (!track) return;
    const slides = Array.from(track.children);
    if (slides.length <= 1) return;

    const next = gallery.querySelector("[data-gallery-next]");
    const prev = gallery.querySelector("[data-gallery-prev]");
    const dotsContainer = gallery.querySelector("[data-gallery-dots]");
    let current = 0;
    let timer;
    const interval = 6000;

    const updateDots = () => {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll("button[data-index]").forEach((dot) => {
        const isActive = Number(dot.dataset.index) === current;
        dot.classList.toggle("bg-white", isActive);
        dot.classList.toggle("bg-white/30", !isActive);
        dot.classList.toggle("w-12", isActive);
        dot.classList.toggle("w-8", !isActive);
        dot.classList.toggle("opacity-50", !isActive);
      });
    };

    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      updateDots();
    };

    const stopAuto = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    const startAuto = () => {
      stopAuto();
      timer = window.setInterval(() => {
        goTo(current + 1);
      }, interval);
    };

    if (dotsContainer) {
      slides.forEach((_, idx) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.dataset.index = String(idx);
        dot.className =
          "h-2 w-8 rounded-full bg-white/30 opacity-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/60";
        dot.addEventListener("click", () => {
          goTo(idx);
          startAuto();
        });
        dotsContainer.appendChild(dot);
      });
    }

    next?.addEventListener("click", () => {
      goTo(current + 1);
      startAuto();
    });
    prev?.addEventListener("click", () => {
      goTo(current - 1);
      startAuto();
    });

    gallery.addEventListener("mouseenter", stopAuto);
    gallery.addEventListener("mouseleave", startAuto);
    gallery.addEventListener("touchstart", stopAuto, { passive: true });
    gallery.addEventListener("touchend", startAuto, { passive: true });

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopAuto();
      } else {
        startAuto();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    goTo(0);
    startAuto();

    window.addEventListener("beforeunload", () => {
      stopAuto();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    });
  });

  // Inicializar ícones Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      window.lucide && window.lucide.createIcons();
    });
  }
})();
