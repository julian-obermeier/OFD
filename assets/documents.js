(() => {
  "use strict";
  const root = document.querySelector("[data-document-register]");
  if (!root) return;
  const docs = [
    {status:"draft",label:"Entwurf",tone:"draft",version:"v0.3",stand:"September 2026",owner:"Programmarbeit",title:"Politischer Programmentwurf",text:"50 Themenpunkte als offene Grundlage für die weitere Beratung.",action:"Online lesen",href:"programm.html",history:[["v0.3","September 2026","50 Punkte strukturiert und Suchfunktion ergänzt"],["v0.2","September 2026","Themenfelder redaktionell zusammengeführt"],["v0.1","September 2026","Erster Arbeitsstand"]]},
    {status:"planned",label:"In Vorbereitung",tone:"planned",version:"v0.1",stand:"Arbeitsstand",owner:"Gründungsversammlung",title:"Satzungsentwurf",text:"Mitgliedschaft, Gliederungen, Organe, Wahlen, Rechte und Pflichten.",action:"Noch nicht veröffentlicht",history:[["v0.1","Arbeitsstand","Struktur für die Gründungsberatung vorbereitet"]]},
    {status:"planned",label:"In Vorbereitung",tone:"planned",version:"v0.1",stand:"Arbeitsstand",owner:"Finanzkommission",title:"Beitrags- und Finanzordnung",text:"Beiträge, Haushaltsführung, Zeichnungsrechte, Prüfung und Rechenschaft.",action:"Noch nicht veröffentlicht",history:[["v0.1","Arbeitsstand","Themenumfang für die Beratung abgegrenzt"]]},
    {status:"planned",label:"In Vorbereitung",tone:"planned",version:"v0.1",stand:"Arbeitsstand",owner:"Organisationskommission",title:"Geschäfts- und Wahlordnung",text:"Faire Beratung, Antragsverfahren, Redezeiten, Abstimmungen und Wahlen.",action:"Noch nicht veröffentlicht",history:[["v0.1","Arbeitsstand","Verfahrensbereiche für die Gründungsversammlung gesammelt"]]},
    {status:"planned",label:"In Vorbereitung",tone:"planned",version:"v0.1",stand:"Arbeitsstand",owner:"Rechtskommission",title:"Schiedsgerichtsordnung",text:"Unabhängige innerparteiliche Streitbeilegung und rechtsstaatliche Verfahren.",action:"Noch nicht veröffentlicht",history:[["v0.1","Arbeitsstand","Grundlagen für ein faires Verfahren definiert"]]},
    {status:"planned",label:"In Vorbereitung",tone:"planned",version:"v0.1",stand:"Arbeitsstand",owner:"Bundesorganisation",title:"Verhaltens- und Beteiligungsgrundsätze",text:"Respektvoller Dialog, klare Zuständigkeiten und nachvollziehbare Beteiligung.",action:"Noch nicht veröffentlicht",history:[["v0.1","Arbeitsstand","Leitlinien für die Aufbauphase skizziert"]]},
    {status:"planned",label:"In Vorbereitung",tone:"planned",version:"v0.1",stand:"Arbeitsstand",owner:"Bundesorganisation",title:"Datenschutz- und Kommunikationsstandard",text:"Datensparsame Prozesse und ein verlässlicher Umgang mit Anfragen und Veröffentlichungen.",action:"Noch nicht veröffentlicht",history:[["v0.1","Arbeitsstand","Anforderungen für Website und Beteiligung erfasst"]]},
    {status:"archive",label:"Archiv",tone:"archive",version:"VfD-Archiv",stand:"Historischer Arbeitsstand",owner:"Archivbestand",title:"Übernommene Arbeitsgrundlagen",text:"Redigierte historische Arbeitsmaterialien werden nur nach inhaltlicher Prüfung und mit neuem OfD-Status übernommen.",action:"Nur nach Prüfung",history:[["Archiv","vor OfD","Nicht automatisch gültig; Prüfung und redaktionelle Anpassung erforderlich"]]}
  ];
  const list = root.querySelector("[data-document-list]");
  const search = root.querySelector("[data-document-search]");
  const filters = [...root.querySelectorAll("[data-document-filter]")];
  const count = root.querySelector("[data-document-count]");
  const empty = root.querySelector("[data-document-empty]");
  let active = "all";
  const esc = value => String(value).replace(/[&<>\"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;", "'":"&#39;"}[char]));
  const icon = `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3.5h8l4 4V20.5H6z"></path><path d="M14 3.5v4h4M9 12h6M9 15.5h6"></path></svg>`;
  if (list) {
    list.innerHTML = docs.map((doc, index) => `<details class="document-item" data-document-item data-status="${doc.status}" data-reveal${index === 0 ? " open" : ""}><summary><span class="document-icon">${icon}</span><span class="document-main"><small class="document-status ${doc.tone}"><i></i>${esc(doc.label)}</small><b>${esc(doc.title)}</b><em>${esc(doc.text)}</em></span><span class="document-field"><small>Version</small><strong>${esc(doc.version)}</strong></span><span class="document-field"><small>Stand</small><strong>${esc(doc.stand)}</strong></span><span class="document-field"><small>Zuständig</small><strong>${esc(doc.owner)}</strong></span><span class="document-action">${doc.href ? `<a href="${doc.href}">${esc(doc.action)} <span aria-hidden="true">→</span></a>` : `<span>${esc(doc.action)}</span>`}</span><i class="document-chevron" aria-hidden="true"></i></summary><div class="document-history"><div><strong>Versionsverlauf</strong><p>Änderungen und frühere öffentliche Fassungen werden hier nachvollziehbar gehalten.</p></div><ol>${doc.history.map(row => `<li><b>${esc(row[0])}</b><span>${esc(row[1])}</span><em>${esc(row[2])}</em></li>`).join("")}</ol></div></details>`).join("");
  }
  const items = [...root.querySelectorAll("[data-document-item]")];
  const update = () => {
    const query = (search?.value || "").trim().toLocaleLowerCase("de");
    let visible = 0;
    items.forEach(item => {
      const show = (active === "all" || item.dataset.status === active) && (!query || item.textContent.toLocaleLowerCase("de").includes(query));
      item.hidden = !show;
      if (show) visible += 1;
    });
    if (count) count.textContent = `${visible} ${visible === 1 ? "Dokument" : "Dokumente"} im Register`;
    if (empty) empty.hidden = visible !== 0;
  };
  filters.forEach(filter => filter.addEventListener("click", () => { active = filter.dataset.documentFilter || "all"; filters.forEach(item => item.setAttribute("aria-pressed", String(item === filter))); update(); }));
  search?.addEventListener("input", update);
  items.forEach(item => item.addEventListener("toggle", () => { if (item.open) items.forEach(other => { if (other !== item) other.open = false; }); }));
  update();
})();
