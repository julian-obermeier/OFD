(() => {
  "use strict";
  const form = document.querySelector("[data-interest-form]");
  if (!form) return;
  const modes = {
    general: {title:"Allgemeine Anfrage", kicker:"Kontaktstelle", intro:"Für Fragen, Hinweise und sonstige Anliegen rund um die OfD.", topic:["Allgemeine Frage","Programmarbeit","Presseanfrage"], button:"Nachricht sicher senden"},
    founding: {title:"Gründung mitgestalten", kicker:"Gründungsinitiative", intro:"Erzählen Sie uns, welche Erfahrung, Idee oder Zeit Sie in die Vorbereitung einbringen möchten.", topic:["Programmarbeit","Organisation & Mitarbeit","Veranstaltungen","Recht & Satzung","Technik & Website"], button:"Interesse unverbindlich senden"},
    region: {title:"Regionaler Aufbau", kicker:"Föderale Struktur", intro:"Nennen Sie Bundesland und Region, in der Sie den Aufbau unterstützen möchten.", topic:["Regionaler Aufbau","Organisation & Mitarbeit","Veranstaltungen","Kommunikation & Presse"], button:"Regionalinteresse unverbindlich senden"}
  };
  const buttons = [...document.querySelectorAll("[data-interest-mode]")];
  const title = document.querySelector("[data-interest-title]");
  const kicker = document.querySelector("[data-interest-kicker]");
  const intro = document.querySelector("[data-interest-intro]");
  const intent = form.querySelector("[data-interest-intent]");
  const topic = form.querySelector("[data-interest-topic]");
  const region = form.querySelector("[data-interest-region]");
  const submit = form.querySelector("[data-interest-submit]");
  const params = new URLSearchParams(location.search);
  let active = params.get("weg") === "region" ? "region" : "founding";
  const selectMode = mode => {
    const data = modes[mode] || modes.founding;
    active = modes[mode] ? mode : "founding";
    buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.interestMode === active)));
    if (title) title.textContent = data.title;
    if (kicker) kicker.textContent = data.kicker;
    if (intro) intro.textContent = data.intro;
    if (intent) intent.value = active;
    if (submit) submit.firstChild.textContent = `${data.button} `;
    if (topic) {
      const selected = topic.value;
      topic.innerHTML = `<option value="">Bitte auswählen</option>${data.topic.map(item => `<option>${item}</option>`).join("")}`;
      if (data.topic.includes(selected)) topic.value = selected;
    }
    if (region) region.required = active === "region";
    const label = form.querySelector('label[for="interest-region"]');
    if (label) label.innerHTML = active === "region" ? 'Bundesland / Region <span class="required-mark">*</span>' : 'Bundesland / Region <span class="optional">(optional)</span>';
  };
  buttons.forEach(button => button.addEventListener("click", () => {
    if (button.dataset.interestMode === "general") { location.assign("kontakt.html"); return; }
    selectMode(button.dataset.interestMode);
  }));
  selectMode(active);
  if (params.get("land") && region) region.value = params.get("land");
  if (params.get("weg") === "programm" && topic) topic.value = "Programmarbeit";
  form.addEventListener("reset", () => { queueMicrotask(() => selectMode(active)); });
})();
