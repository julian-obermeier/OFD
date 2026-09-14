(() => {
  "use strict";
  const root = document.querySelector("[data-association-explorer]");
  const detailPage = document.querySelector("[data-association-head]");
  const states = {
    "baden-wuerttemberg": {name:"Baden-Württemberg", focus:"Kommunen, wirtschaftliche Innovation, bezahlbares Wohnen und verlässliche Infrastruktur."},
    bayern: {name:"Bayern", focus:"Kommunale Eigenständigkeit, Mittelstand, ländliche Räume und moderne Daseinsvorsorge."},
    berlin: {name:"Berlin", focus:"Funktionierende Verwaltung, Sicherheit, bezahlbares Wohnen und moderne Infrastruktur."},
    brandenburg: {name:"Brandenburg", focus:"Ländliche Entwicklung, Infrastruktur, regionale Wirtschaft und Bevölkerungsschutz."},
    bremen: {name:"Bremen", focus:"Hafenwirtschaft, Bildung, Sicherheit und handlungsfähige Stadtverwaltung."},
    hamburg: {name:"Hamburg", focus:"Hafen und Logistik, bezahlbares Wohnen, Sicherheit und moderne Mobilität."},
    hessen: {name:"Hessen", focus:"Starke Städte und Gemeinden, Ehrenamt, Wirtschaftskraft und verlässliche Infrastruktur."},
    "mecklenburg-vorpommern": {name:"Mecklenburg-Vorpommern", focus:"Ländliche Räume, medizinische Versorgung, Tourismus und regionale Wertschöpfung."},
    niedersachsen: {name:"Niedersachsen", focus:"Flächenland-Infrastruktur, Landwirtschaft, Industrie und kommunale Handlungsfähigkeit."},
    "nordrhein-westfalen": {name:"Nordrhein-Westfalen", focus:"Strukturwandel, innere Sicherheit, Bildung und starke kommunale Haushalte."},
    "rheinland-pfalz": {name:"Rheinland-Pfalz", focus:"Ländliche Regionen, Mittelstand, Bevölkerungsschutz und leistungsfähige Kommunen."},
    saarland: {name:"Saarland", focus:"Wirtschaftlicher Wandel, grenzüberschreitende Zusammenarbeit und kommunale Stärke."},
    sachsen: {name:"Sachsen", focus:"Innovation, wirtschaftliche Entwicklung, regionale Infrastruktur und gesellschaftlicher Zusammenhalt."},
    "sachsen-anhalt": {name:"Sachsen-Anhalt", focus:"Demografischer Wandel, Bildung, regionale Wirtschaft und erreichbare Daseinsvorsorge."},
    "schleswig-holstein": {name:"Schleswig-Holstein", focus:"Küsten- und Bevölkerungsschutz, Energie, ländliche Räume und maritime Wirtschaft."},
    thueringen: {name:"Thüringen", focus:"Mittelstand, kommunale Selbstverwaltung, Infrastruktur und gleichwertige Lebensverhältnisse."}
  };
  const esc = value => String(value).replace(/[&<>\"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;", "'":"&#39;"}[char]));

  if (detailPage) {
    const slug = new URLSearchParams(location.search).get("land") || "hessen";
    const state = states[slug] || states.hessen;
    document.title = `OfD ${state.name} | Regionaler Aufbau`;
    const title = document.querySelector("[data-association-title]");
    const intro = document.querySelector("[data-association-intro]");
    const focus = document.querySelector("[data-association-focus]");
    const contact = document.querySelector("[data-association-contact]");
    const status = document.querySelector("[data-association-status]");
    if (title) title.textContent = `OfD ${state.name}`;
    if (intro) intro.textContent = `Der geplante Landesbereich ${state.name} ist noch nicht formal gegründet. Informationen und Ansprechpartner werden erst nach überprüfbarer Beschlusslage veröffentlicht.`;
    if (focus) focus.textContent = state.focus;
    if (status) status.textContent = "Geplant";
    if (contact) contact.href = `interesse.html?weg=region&land=${encodeURIComponent(state.name)}`;
    return;
  }
  if (!root) return;
  const list = root.querySelector("[data-association-list]");
  const search = root.querySelector("[data-association-search]");
  const count = root.querySelector("[data-association-count]");
  const title = root.querySelector("[data-association-title]");
  const intro = root.querySelector("[data-association-intro]");
  const focus = root.querySelector("[data-association-focus]");
  const contact = root.querySelector("[data-association-contact]");
  const keys = Object.keys(states);
  if (list) list.innerHTML = keys.map(slug => `<a class="state-index-item" data-association-item data-state="${slug}" href="verband.html?land=${slug}"><i aria-hidden="true"></i><span>${esc(states[slug].name)}</span><small>Geplant</small><b aria-hidden="true">→</b></a>`).join("");
  const mapStates = [...root.querySelectorAll("[data-map-state]")];
  const items = [...root.querySelectorAll("[data-association-item]")];
  let selected = new URLSearchParams(location.search).get("land") || "hessen";
  const select = slug => {
    const state = states[slug] || states.hessen;
    selected = states[slug] ? slug : "hessen";
    mapStates.forEach(item => item.classList.toggle("map-selected", item.dataset.mapState === selected));
    items.forEach(item => item.classList.toggle("selected", item.dataset.state === selected));
    if (title) title.textContent = state.name;
    if (intro) intro.textContent = `Der geplante Landesbereich ${state.name} ist noch nicht formal gegründet. Hier können Sie Interesse am regionalen Aufbau unverbindlich mitteilen.`;
    if (focus) focus.textContent = state.focus;
    if (contact) contact.href = `interesse.html?weg=region&land=${encodeURIComponent(state.name)}`;
    const url = new URL(location.href); url.searchParams.set("land", selected); history.replaceState({}, "", url);
  };
  const filter = () => {
    const query = (search?.value || "").trim().toLocaleLowerCase("de");
    let visible = 0;
    items.forEach(item => { const show = !query || item.dataset.state && states[item.dataset.state].name.toLocaleLowerCase("de").includes(query); item.hidden = !show; if (show) visible += 1; });
    mapStates.forEach(item => { const name = states[item.dataset.mapState]?.name || ""; item.classList.toggle("map-dimmed", Boolean(query) && !name.toLocaleLowerCase("de").includes(query)); });
    if (count) count.textContent = `${visible} von ${keys.length} Bundesländern sichtbar`;
  };
  mapStates.forEach(item => { item.addEventListener("click", () => select(item.dataset.mapState)); item.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(item.dataset.mapState); } }); });
  items.forEach(item => item.addEventListener("click", () => select(item.dataset.state)));
  search?.addEventListener("input", filter);
  select(selected); filter();
})();
