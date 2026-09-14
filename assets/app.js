(() => {
  "use strict";

  const page = document.documentElement.dataset.page || "start";
  const navItems = [
    ["start", "Start", "index.html"],
    ["partei", "Partei", "partei.html"],
    ["programm", "Programm", "programm.html"],
    ["verbaende", "Verbände", "verbaende.html"],
    ["aktuelles", "Aktuelles", "aktuelles.html"]
  ];

  const navLinks = (mobile = false) => navItems.map(([id, label, href]) =>
    `<a href="${href}"${page === id ? ' class="active" aria-current="page"' : ""}>${label}</a>`
  ).join("") + (mobile ? '<a class="button button-primary" href="mitmachen.html">Mitmachen</a>' : "");

  const header = document.querySelector("[data-site-header]");
  if (header) {
    header.innerHTML = `
      <header class="site-header">
        <div class="shell nav-wrap">
          <a class="brand" href="index.html" aria-label="Ordnung für Deutschland – Startseite">
            <img src="assets/logo.svg" alt="">
            <span class="brand-copy"><b>Ordnung für Deutschland</b><small>OfD · Verantwortung verbindet</small></span>
          </a>
          <nav class="main-nav" aria-label="Hauptnavigation">${navLinks()}</nav>
          <a class="nav-cta" href="mitmachen.html">Mitmachen</a>
          <button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Menü öffnen"><span></span><span></span><span></span></button>
        </div>
        <nav class="mobile-nav" id="mobile-menu" aria-label="Mobile Navigation">${navLinks(true)}</nav>
      </header>`;
  }

  const footer = document.querySelector("[data-site-footer]");
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="shell footer-main">
          <div>
            <a class="brand footer-brand" href="index.html">
              <img src="assets/logo.svg" alt="">
              <span class="brand-copy"><b>Ordnung für Deutschland</b><small>OfD · Verantwortung verbindet</small></span>
            </a>
            <p>Eine politische Initiative im Aufbau – für einen handlungsfähigen Staat, starke Kommunen und einen offenen demokratischen Dialog.</p>
            <span class="dev-badge">Gründungsphase 2026</span>
          </div>
          <div><h3>Partei</h3><ul><li><a href="partei.html">Über die OfD</a></li><li><a href="programm.html">Programmentwurf</a></li><li><a href="verbaende.html">Verbände</a></li><li><a href="aktuelles.html">Aktuelles</a></li></ul></div>
          <div><h3>Mitgestalten</h3><ul><li><a href="mitmachen.html">Mitmachen</a></li><li><a href="kontakt.html">Kontakt</a></li><li><a href="mitmachen.html#fragen">Häufige Fragen</a></li></ul></div>
          <div><h3>Rechtliches</h3><ul><li><a href="impressum.html">Impressum</a></li><li><a href="datenschutz.html">Datenschutz</a></li><li><a href="kontakt.html">Kontaktstelle</a></li></ul></div>
        </div>
        <div class="shell footer-bottom">
          <span>© <span data-year></span> Ordnung für Deutschland (OfD)</span>
          <div><a href="impressum.html">Impressum</a><a href="datenschutz.html">Datenschutz</a></div>
        </div>
      </footer>`;
  }

  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  const menuButton = document.querySelector(".menu-button");
  if (menuButton) {
    menuButton.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });
    document.querySelectorAll(".mobile-nav a").forEach(link => link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  const progress = document.querySelector(".page-progress span");
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + "%";
  };
  addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  const revealElements = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: .08, rootMargin: "0px 0px -30px" });
    revealElements.forEach((el, index) => {
      el.style.transitionDelay = Math.min(index % 4 * 70, 210) + "ms";
      observer.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add("visible"));
  }

  const stateSearch = document.querySelector("[data-state-search]");
  if (stateSearch) {
    const cards = [...document.querySelectorAll("[data-state]")];
    stateSearch.addEventListener("input", () => {
      const query = stateSearch.value.trim().toLocaleLowerCase("de");
      cards.forEach(card => card.hidden = !card.dataset.state.toLocaleLowerCase("de").includes(query));
    });
  }

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", async event => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      const data = new FormData(contactForm);
      const text = [
        "OfD-Kontaktanfrage",
        "",
        "Name: " + data.get("name"),
        "E-Mail: " + data.get("email"),
        "Thema: " + data.get("topic"),
        "",
        data.get("message")
      ].join("\n");
      let copied = false;
      try { await navigator.clipboard.writeText(text); copied = true; } catch (_) {}
      const status = contactForm.querySelector(".form-status");
      status.textContent = copied
        ? "Ihre Anfrage wurde als Text kopiert. Die zentrale Kontaktadresse wird nach der formalen Gründung veröffentlicht; Sie können den Text dann direkt verwenden."
        : "Ihre Anfrage ist vorbereitet. Die zentrale Kontaktadresse wird nach der formalen Gründung veröffentlicht.";
      status.classList.add("show");
      status.focus();
    });
  }
})();