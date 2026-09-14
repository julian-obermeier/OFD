(() => {
"use strict";
const states={
"baden-wuerttemberg":{name:"Baden-Württemberg",focus:"Starke Kommunen, wirtschaftliche Innovation, bezahlbares Wohnen und verlässliche Infrastruktur."},
"bayern":{name:"Bayern",focus:"Kommunale Eigenständigkeit, Mittelstand, ländliche Räume und moderne Daseinsvorsorge."},
"berlin":{name:"Berlin",focus:"Funktionierende Verwaltung, Sicherheit, bezahlbares Wohnen und leistungsfähige Infrastruktur."},
"brandenburg":{name:"Brandenburg",focus:"Ländliche Entwicklung, Infrastruktur, regionale Wirtschaft und Bevölkerungsschutz."},
"bremen":{name:"Bremen",focus:"Hafenwirtschaft, Bildung, Sicherheit und handlungsfähige Stadtverwaltung."},
"hamburg":{name:"Hamburg",focus:"Hafen und Logistik, bezahlbares Wohnen, Sicherheit und moderne Mobilität."},
"hessen":{name:"Hessen",focus:"Starke Städte und Gemeinden, Ehrenamt, Wirtschaftskraft und verlässliche Infrastruktur."},
"mecklenburg-vorpommern":{name:"Mecklenburg-Vorpommern",focus:"Ländliche Räume, medizinische Versorgung, Tourismus und regionale Wertschöpfung."},
"niedersachsen":{name:"Niedersachsen",focus:"Flächenland-Infrastruktur, Landwirtschaft, Industrie und kommunale Handlungsfähigkeit."},
"nordrhein-westfalen":{name:"Nordrhein-Westfalen",focus:"Strukturwandel, innere Sicherheit, Bildung und starke kommunale Haushalte."},
"rheinland-pfalz":{name:"Rheinland-Pfalz",focus:"Ländliche Regionen, Mittelstand, Bevölkerungsschutz und leistungsfähige Kommunen."},
"saarland":{name:"Saarland",focus:"Wirtschaftlicher Wandel, grenzüberschreitende Zusammenarbeit und kommunale Stärke."},
"sachsen":{name:"Sachsen",focus:"Innovation, wirtschaftliche Entwicklung, regionale Infrastruktur und gesellschaftlicher Zusammenhalt."},
"sachsen-anhalt":{name:"Sachsen-Anhalt",focus:"Demografischer Wandel, Bildung, regionale Wirtschaft und erreichbare Daseinsvorsorge."},
"schleswig-holstein":{name:"Schleswig-Holstein",focus:"Küsten- und Bevölkerungsschutz, Energie, ländliche Räume und maritime Wirtschaft."},
"thueringen":{name:"Thüringen",focus:"Mittelstand, kommunale Selbstverwaltung, Infrastruktur und gleichwertige Lebensverhältnisse."}
};
const slug=new URLSearchParams(location.search).get("land")||"hessen";
const state=states[slug]||states.hessen;
document.title="OfD "+state.name+" | Regionaler Aufbau";
const title=document.querySelector("[data-association-title]");
const intro=document.querySelector("[data-association-intro]");
const focus=document.querySelector("[data-association-focus]");
const contact=document.querySelector("[data-association-contact]");
if(title)title.textContent="OfD "+state.name;
if(intro)intro.textContent="Der geplante Landesbereich "+state.name+" befindet sich im organisatorischen Aufbau.";
if(focus)focus.textContent=state.focus;
if(contact)contact.href="kontakt.html?topic=Regionaler%20Aufbau&region="+encodeURIComponent(state.name);
})();