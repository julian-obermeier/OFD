(() => {
  "use strict";

  const page = document.documentElement.dataset.page || "start";
  const navItems = [
    ["start", "Start", "index.html"],
    ["partei", "Partei", "partei.html"],
    ["programm", "Programm", "programm.html"],
    ["verbaende", "Verbände", "verbaende.html"],
    ["aktuelles", "Aktuelles", "aktuelles.html"],
    ["mitmachen", "Mitmachen", "mitmachen.html"]
  ];
  const serviceItems = [["termine", "Termine", "termine.html"], ["gruendung", "Gründung", "gruendung.html"], ["dokumente", "Dokumente", "dokumente.html"], ["kontakt", "Kontakt", "kontakt.html"]];
  const darkHeader = ["dokumente", "kontakt", "interesse"].includes(page);

  const navLinks = (mobile = false) => [...navItems, ...(mobile ? serviceItems : page === "kontakt" || page === "interesse" ? [["kontakt", "Kontakt", "kontakt.html"]] : [])].map(([id, label, href]) =>
    `<a href="${href}" data-nav-item="${id}"${page === id ? ' class="active" aria-current="page"' : page === "interesse" && id === "mitmachen" ? ' class="active"' : ""}>${label}</a>`
  ).join("");
  const reversedBrand = `<span class="brand-wordmark" aria-hidden="true"><img src="assets/logos/ofd-wordmark-transparent.png" alt=""></span><span class="brand-name">Ordnung für<br>Deutschland</span>`;

  const headerMotto = page === "verbaende"
    ? "Starke Regionen.<br>Ein gemeinsames Deutschland."
    : "Für ein<br>starkes Morgen.";

  const header = document.querySelector("[data-site-header]");
  if (header) {
    header.innerHTML = `
      <header class="site-header${darkHeader ? " site-header-dark" : ""}">
        <div class="shell nav-wrap">
          <a class="brand" href="index.html" aria-label="Ordnung für Deutschland – Startseite">
            ${darkHeader ? reversedBrand : '<span class="brand-logo-wide" aria-hidden="true"><picture><source srcset="assets/logos/ofd-horizontal.webp" type="image/webp"><img src="assets/logos/ofd-horizontal.png" alt=""></picture></span>'}
          </a>
          <nav class="main-nav" aria-label="Hauptnavigation">${navLinks()}</nav>
          ${page === "dokumente" ? '<a class="nav-cta" href="mitmachen.html">Mitmachen</a>' : ""}
          <a class="nav-search" href="programm.html#program-search" aria-label="Programm durchsuchen"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.8"></circle><path d="m16.2 16.2 4.4 4.4"></path></svg></a>
          <span class="header-motto">${headerMotto}</span>
          <button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Menü öffnen"><span></span><span></span><span></span></button>
        </div>
        <nav class="mobile-nav" id="mobile-menu" aria-label="Mobile Navigation">${navLinks(true)}</nav>
      </header>`;
  }

  const footer = document.querySelector("[data-site-footer]");
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="shell footer-compact">
          <a class="footer-brand" href="index.html" aria-label="Ordnung für Deutschland – Startseite">${reversedBrand}</a>
          <nav class="footer-links" aria-label="Service und Rechtliches"><a href="transparenz.html">Transparenz</a><a href="dokumente.html">Dokumente</a><a href="kontakt.html">Kontakt</a><a href="impressum.html">Impressum</a><a href="datenschutz.html">Datenschutz</a></nav>
        </div>
        <div class="shell footer-bottom">
          <span>© <span data-year></span> Ordnung für Deutschland (OfD) · Gründungsinitiative</span>
          <details class="footer-directory"><summary>Alle Seiten</summary><nav aria-label="Weitere Seiten">${navLinks(true)}<a href="team.html">Team & Verantwortung</a><a href="presse.html">Presse & Medien</a><a href="interesse.html">Interesse mitteilen</a><a href="mitmachen.html#fragen">Häufige Fragen</a></nav></details>
        </div>
      </footer>`;
  }

    document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  const menuButton = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector(".mobile-nav");
  if (menuButton) {
    mobileMenu.inert = true;
    const closeMenu = () => {
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Menü öffnen");
      mobileMenu.inert = true;
    };
    menuButton.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      mobileMenu.inert = !open;
    });
    document.querySelectorAll(".mobile-nav a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => { if (event.key === "Escape" && document.body.classList.contains("menu-open")) { closeMenu(); menuButton.focus(); } });
    matchMedia("(min-width: 1001px)").addEventListener("change", event => { if (event.matches) closeMenu(); });
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
    const messageField = contactForm.elements.message;
    const characterCount = contactForm.querySelector("[data-character-count]");
    const messageLimit = Number(messageField?.getAttribute("maxlength")) || 5000;
    const updateCharacterCount = () => { if (characterCount && messageField) characterCount.textContent = `${messageField.value.length} / ${messageLimit.toLocaleString("de")} Zeichen`; };
    messageField?.addEventListener("input", updateCharacterCount);
    contactForm.addEventListener("reset", () => { if (characterCount) characterCount.textContent = `0 / ${messageLimit.toLocaleString("de")} Zeichen`; });
    updateCharacterCount();
    const params = new URLSearchParams(location.search);
    const topicField = contactForm.elements.topic;
    const regionField = contactForm.elements.region;
    const startedField = contactForm.elements.started_at;
    if (params.get("topic") && topicField) topicField.value = params.get("topic");
    if (params.get("region") && regionField) regionField.value = params.get("region");
    if (startedField) startedField.value = String(Math.floor(Date.now() / 1000));

    const makeText = data => [
      "OfD-Kontaktanfrage", "",
      "Kontaktweg: " + (data.get("intent") || "general"),
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
