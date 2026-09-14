# Ordnung für Deutschland (OfD) – Website

Professionelle, responsive statische Website für die Gründungsinitiative **Ordnung für Deutschland (OfD)**.

## Enthaltene Seiten

- Startseite mit Positionierung, Themen, Verbandsmodell und aktuellen Arbeitsständen
- Partei und demokratischer Gründungsweg
- transparenter Programmentwurf mit zwölf Themenfeldern
- geplante Verbandsstruktur und Übersicht aller 16 Bundesländer
- Gründungsjournal / Aktuelles
- Mitmachen mit FAQ
- datenschutzfreundliche Kontaktvorbereitung
- Impressum, Datenschutz und 404-Seite

## Technik

Reines HTML, CSS und JavaScript ohne Build-Prozess, Frameworks, Cookies, Tracker oder externe Schriftarten. Die Dateien können direkt auf klassischem Webhosting oder über GitHub Pages bereitgestellt werden.

## Lokale Vorschau

Repository herunterladen und `index.html` im Browser öffnen. Für eine realistische Vorschau empfiehlt sich ein einfacher lokaler HTTP-Server.

## Vor öffentlicher Veröffentlichung zwingend erledigen

- vollständige Anbieterkennzeichnung mit ladungsfähiger Anschrift ergänzen
- vertretungsberechtigte und redaktionell verantwortliche Person benennen
- zentrale E-Mail-Adresse und gegebenenfalls Telefonnummer eintragen
- Datenschutzerklärung an den tatsächlich eingesetzten Hostinganbieter anpassen
- endgültig beschlossene Satzungs-, Programm- und Verbandsangaben übernehmen
- rechtliche Prüfung durchführen
- erst anschließend `noindex` in allen HTML-Dateien entfernen und `robots.txt` anpassen

## Projektstruktur

```
/
├── index.html
├── partei.html
├── programm.html
├── verbaende.html
├── aktuelles.html
├── mitmachen.html
├── kontakt.html
├── impressum.html
├── datenschutz.html
├── 404.html
└── assets/
    ├── styles.css
    ├── app.js
    ├── logo.svg
    └── favicon.svg
```

## Inhaltsstatus

Alle politischen Inhalte sind ausdrücklich als Arbeitsstand bzw. Programmentwurf gekennzeichnet. Formale Funktionen, gegründete Verbände und verbindliche Beschlüsse werden nicht vorgetäuscht.
