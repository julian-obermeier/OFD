(() => {
  "use strict";

  const page = document.documentElement.dataset.page || "start";
  const navItems = [
    ["start", "Start", "index.html"],
    ["partei", "Partei", "partei.html"],
    ["programm", "Programm", "programm.html"],
    ["verbaende", "Verbände", "verbaende.html"],
    ["aktuelles", "Aktuelles", "aktuelles.html"],
    ["termine", "Termine", "termine.html"]
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
            <span class="brand-logo-wide" aria-hidden="true"><img src="assets/logos/ofd-horizontal.png" alt=""></span>
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
            <a class="footer-brand-link" href="index.html" aria-label="Ordnung für Deutschland – Startseite">
              <span class="footer-logo-lockup"><img src="assets/logos/ofd-primary-transparent.png" alt="Ordnung für Deutschland (OfD)" loading="lazy"></span>
            </a>
            <p>Eine politische Initiative im Aufbau – für einen handlungsfähigen Staat, starke Kommunen und einen offenen demokratischen Dialog.</p>
            <span class="dev-badge">Gründungsphase 2026</span>
          </div>
          <div><h3>Partei</h3><ul><li><a href="partei.html">Über die OfD</a></li><li><a href="team.html">Team & Verantwortung</a></li><li><a href="programm.html">Programmentwurf</a></li><li><a href="verbaende.html">Verbände</a></li></ul></div>
          <div><h3>Mitgestalten</h3><ul><li><a href="mitmachen.html">Mitmachen</a></li><li><a href="termine.html">Termine</a></li><li><a href="kontakt.html">Kontakt</a></li><li><a href="mitmachen.html#fragen">Häufige Fragen</a></li></ul></div>
          <div><h3>Service & Transparenz</h3><ul><li><a href="aktuelles.html">Aktuelles</a></li><li><a href="presse.html">Presse & Medien</a></li><li><a href="dokumente.html">Dokumente</a></li><li><a href="transparenz.html">Transparenz</a></li></ul></div>
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
    const params = new URLSearchParams(location.search);
    const topicField = contactForm.elements.topic;
    const regionField = contactForm.elements.region;
    const startedField = contactForm.elements.started_at;
    if (params.get("topic") && topicField) topicField.value = params.get("topic");
    if (params.get("region") && regionField) regionField.value = params.get("region");
    if (startedField) startedField.value = String(Math.floor(Date.now() / 1000));

    const makeText = data => [
      "OfD-Kontaktanfrage", "",
      "Name: " + data.get("name"),
      "E-Mail: " + data.get("email"),
      "Thema: " + data.get("topic"),
      "Region: " + (data.get("region") || "–"), "",
      data.get("message")
    ].join("\n");

    const copyFallback = async data => {
      try {
        await navigator.clipboard.writeText(makeText(data));
        return true;
      } catch (_) { return false; }
    };

    contactForm.addEventListener("submit", async event => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      const data = new FormData(contactForm);
      const status = contactForm.querySelector(".form-status");
      const button = contactForm.querySelector('button[type="submit"]');
      const preview = location.protocol === "file:" || /githack|github\.io$/i.test(location.hostname);
      status.className = "form-status show working";
      status.textContent = "Ihre Nachricht wird verarbeitet …";
      button.disabled = true;

      if (preview) {
        const copied = await copyFallback(data);
        status.className = "form-status show";
        status.textContent = copied
          ? "Vorschaumodus: Die Nachricht wurde lokal in die Zwischenablage kopiert."
          : "Vorschaumodus: Es wurden keine Daten übertragen. Der Versand steht auf dem späteren Webhosting zur Verfügung.";
        button.disabled = false;
        status.focus();
        return;
      }

      try {
        const response = await fetch("api/contact.php", { method: "POST", body: data, headers: { "Accept": "application/json" } });
        const result = await response.json().catch(() => ({ ok: false, message: "Ungültige Serverantwort." }));
        if (!response.ok || !result.ok) throw new Error(result.message || "Versand fehlgeschlagen.");
        status.className = "form-status show";
        status.textContent = result.message;
        contactForm.reset();
        if (startedField) startedField.value = String(Math.floor(Date.now() / 1000));
      } catch (error) {
        const copied = await copyFallback(data);
        status.className = "form-status show error";
        status.textContent = (error.message || "Die Nachricht konnte nicht versendet werden.") +
          (copied ? " Der Nachrichtentext wurde deshalb in die Zwischenablage kopiert." : "");
      } finally {
        button.disabled = false;
        status.focus();
      }
    });
  }
})();