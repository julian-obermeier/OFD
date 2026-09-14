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
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[char]));

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
  const districtExplorer = root.querySelector("[data-district-explorer]");
  const districtList = districtExplorer?.querySelector("[data-district-list]");
  const districtSearch = districtExplorer?.querySelector("[data-district-search]");
  const districtCount = districtExplorer?.querySelector("[data-district-count]");
  const districtTitle = districtExplorer?.querySelector(".district-heading");
  const districtSelected = districtExplorer?.querySelector("[data-district-selected]");
  const districtEmpty = districtExplorer?.querySelector("[data-district-empty]");
  const keys = Object.keys(states);
  let selected = new URLSearchParams(location.search).get("land") || "hessen";
  let selectedDistrict = new URLSearchParams(location.search).get("kreis") || "";
  let mapStage = root.querySelector("[data-germany-map]");
  let mapStates = [];
  let mapDistricts = [];
  let mapLabels = [];
  let items = [];

  if (list) list.innerHTML = keys.map(slug => `<a class="state-index-item" data-association-item data-state="${slug}" href="verband.html?land=${slug}"><i aria-hidden="true"></i><span>${esc(states[slug].name)}</span><small>Geplant</small><b aria-hidden="true">→</b></a>`).join("");
  items = [...root.querySelectorAll("[data-association-item]")];

  const setUrl = () => {
    const url = new URL(location.href);
    url.searchParams.set("land", selected);
    if (selectedDistrict) url.searchParams.set("kreis", selectedDistrict); else url.searchParams.delete("kreis");
    history.replaceState({}, "", url);
  };

  const districtLabel = type => /stadt|city/i.test(type || "") ? "kreisfreie Stadt" : "Landkreis";
  const renderDistricts = () => {
    if (!districtExplorer || !districtList) return;
    const query = (districtSearch?.value || "").trim().toLocaleLowerCase("de");
    const own = mapDistricts.filter(item => item.dataset.stateKey === selected);
    const visible = own.filter(item => !query || item.dataset.districtName.toLocaleLowerCase("de").includes(query));
    districtList.innerHTML = visible.map(item => `<button class="district-item${item.dataset.districtKey === selectedDistrict ? " selected" : ""}" type="button" data-district-item="${esc(item.dataset.districtKey)}"><span><b>${esc(item.dataset.districtName)}</b><small>${esc(districtLabel(item.dataset.districtType))}</small></span><i aria-hidden="true">→</i></button>`).join("");
    districtList.querySelectorAll("[data-district-item]").forEach(button => button.addEventListener("click", () => selectDistrict(button.dataset.districtItem)));
    if (districtTitle) districtTitle.textContent = `Kreise in ${states[selected].name}`;
    if (districtCount) districtCount.textContent = `${visible.length} von ${own.length} Kreisen sichtbar`;
    if (districtEmpty) districtEmpty.hidden = visible.length !== 0;
    if (districtSelected && !selectedDistrict) districtSelected.textContent = "Wählen Sie einen Kreis auf der Karte oder in der Liste aus.";
  };

  const selectDistrict = key => {
    const district = mapDistricts.find(item => item.dataset.districtKey === key);
    if (!district) return;
    selectedDistrict = key;
    const stateKey = district.dataset.stateKey;
    if (stateKey !== selected) {
      selected = stateKey;
      updateState(false);
    }
    mapDistricts.forEach(item => item.classList.toggle("map-district-selected", item === district));
    districtList?.querySelectorAll("[data-district-item]").forEach(item => item.classList.toggle("selected", item.dataset.districtItem === selectedDistrict));
    if (districtSelected) districtSelected.innerHTML = `<strong>${esc(district.dataset.districtName)}</strong><span>${esc(districtLabel(district.dataset.districtType))} · ${esc(states[stateKey].name)}</span>`;
    setUrl();
  };

  const updateState = (writeUrl = true) => {
    if (!states[selected]) selected = "hessen";
    const state = states[selected];
    mapStates.forEach(item => item.classList.toggle("map-state-selected", item.dataset.mapState === selected));
    mapLabels.forEach(item => item.classList.toggle("map-state-label-selected", item.dataset.stateLabel === selected));
    mapDistricts.forEach(item => item.classList.toggle("map-district-selected", Boolean(selectedDistrict) && item.dataset.districtKey === selectedDistrict));
    mapDistricts.forEach(item => item.classList.toggle("map-state-district", item.dataset.stateKey === selected));
    items.forEach(item => item.classList.toggle("selected", item.dataset.state === selected));
    if (title) title.textContent = state.name;
    if (intro) intro.textContent = `Der geplante Landesbereich ${state.name} ist noch nicht formal gegründet. Hier können Sie Interesse am regionalen Aufbau unverbindlich mitteilen.`;
    if (focus) focus.textContent = state.focus;
    if (contact) contact.href = `interesse.html?weg=region&land=${encodeURIComponent(state.name)}`;
    renderDistricts();
    if (writeUrl) setUrl();
  };

  const filterStates = () => {
    const query = (search?.value || "").trim().toLocaleLowerCase("de");
    let visible = 0;
    items.forEach(item => { const show = !query || states[item.dataset.state].name.toLocaleLowerCase("de").includes(query); item.hidden = !show; if (show) visible += 1; });
    mapStates.forEach(item => { const name = states[item.dataset.mapState]?.name || ""; item.classList.toggle("map-dimmed", Boolean(query) && !name.toLocaleLowerCase("de").includes(query)); });
    if (count) count.textContent = `${visible} von ${keys.length} Bundesländern sichtbar`;
  };

  const wireMap = () => {
    mapStates = [...root.querySelectorAll("[data-map-state]")];
    mapDistricts = [...root.querySelectorAll("[data-district-key]")];
    mapLabels = [...root.querySelectorAll("[data-state-label]")];
    mapStates.forEach(item => {
      item.addEventListener("click", () => { selected = item.dataset.mapState; selectedDistrict = ""; updateState(); });
      item.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selected = item.dataset.mapState; selectedDistrict = ""; updateState(); } });
    });
    mapDistricts.forEach(item => {
      item.addEventListener("click", () => selectDistrict(item.dataset.districtKey));
      item.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectDistrict(item.dataset.districtKey); } });
    });
    updateState(false);
    filterStates();
    if (selectedDistrict) selectDistrict(selectedDistrict);
  };

  const loadMap = async () => {
    if (!mapStage) return;
    try {
      const response = await fetch("assets/germany-map.svg", {headers:{Accept:"image/svg+xml"}});
      if (!response.ok) throw new Error(`Map ${response.status}`);
      mapStage.innerHTML = await response.text();
      wireMap();
    } catch (_) {
      mapStage.innerHTML = `<div class="map-error" role="alert"><strong>Deutschlandkarte konnte nicht geladen werden.</strong><span>Bitte die Seite über einen Webserver aufrufen, nicht als lokale Datei.</span></div>`;
    }
  };

  search?.addEventListener("input", filterStates);
  districtSearch?.addEventListener("input", renderDistricts);
  loadMap();
})();
