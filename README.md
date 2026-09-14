# Ordnung für Deutschland (OfD) – Website

Professionelle, responsive statische Website für die Gründungsinitiative **Ordnung für Deutschland (OfD)**.

## Enthaltene Seiten

- Startseite mit Positionierung, Themen, Verbandsmodell und aktuellen Arbeitsständen
- Partei und demokratischer Gründungsweg
- durchsuchbares Programm mit 50 Punkten in neun Themenbereichen
- interaktive, ausdrücklich als geplant gekennzeichnete Verbandsstruktur für alle 16 Bundesländer
- Gründungszentrum mit vier Phasen, Checkliste und FAQ
- getrennte Interessenten- und Kontaktwege für Programm, Gründung und Regionalaufbau
- Gründungsjournal / Aktuelles
- Mitmachen mit FAQ
- datenschutzfreundliche Kontaktvorbereitung und versioniertes Dokumentenregister
- Team, Termine, Presse- und Transparenzportal
- dynamische regionale Bereiche für alle 16 Bundesländer
- sicher vorbereitetes PHP-Kontaktformular für klassisches Webhosting
- Social-Media-Vorschaubild, optimierte WebP-Logos und XML-Sitemap
- Impressum, Datenschutz und 404-Seite

## Technik

Reines HTML, CSS und JavaScript ohne Build-Prozess, Frameworks, Cookies, Tracker oder externe Schriftarten. Die Dateien können direkt auf klassischem Webhosting oder über GitHub Pages bereitgestellt werden.

Die kanonischen URLs, Open-Graph-Daten und die Sitemap verwenden derzeit
`https://julian-obermeier.github.io/OFD/`. Bei einem späteren eigenen Domainnamen
müssen diese Werte gesammelt angepasst werden.

## Lokale Vorschau

Repository herunterladen und `index.html` im Browser öffnen. Für eine realistische Vorschau empfiehlt sich ein einfacher lokaler HTTP-Server.

## GitHub-Pages-Deployment

Der Workflow liegt unter `.github/workflows/pages.yml` und veröffentlicht die
statische Website nach jedem Push auf `main`. Beim ersten Einsatz muss die
Pages-Site einmal im Repository aktiviert werden:

1. GitHub-Repository öffnen: **Settings → Pages**.
2. Unter **Build and deployment** als Quelle **GitHub Actions** auswählen und speichern.
3. Den Workflow unter **Actions → Deploy OfD website to GitHub Pages** erneut starten.
4. Die Vorschau ist anschließend unter `https://julian-obermeier.github.io/OFD/` erreichbar.

Der Workflow kann die Pages-Site aus Sicherheitsgründen nicht selbst für ein
Repository anlegen, in dem sie noch deaktiviert ist. Ein fehlgeschlagener erster
Lauf mit `Resource not accessible by integration` bedeutet daher nur, dass
Schritt 1–2 noch fehlen.

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
├── dokumente.html
├── gruendung.html
├── interesse.html
├── verbaende.html
├── verband.html
├── aktuelles.html
├── mitmachen.html
├── kontakt.html
├── impressum.html
├── datenschutz.html
├── 404.html
└── assets/
    ├── styles.css
    ├── app.js
    ├── program.js
    ├── documents.js
    ├── associations.js
    ├── interest.js
    ├── favicon.svg
    ├── social-share.png
    └── logos/ (offizielle OfD-Varianten, PNG und WebP)
```

## Inhaltsstatus

Alle politischen Inhalte sind ausdrücklich als Arbeitsstand bzw. Programmentwurf gekennzeichnet. Formale Funktionen, gegründete Verbände und verbindliche Beschlüsse werden nicht vorgetäuscht.

Die öffentliche Verbändekarte nennt deshalb aktuell ausschließlich den Status
„Geplant“. Erst nach einer tatsächlich erfolgten Gründung dürfen diese Angaben
auf „Gegründet“ geändert werden.


## PHP-Kontaktversand auf dem Webhosting

1. `api/contact-config.example.php` als `api/contact-config.php` kopieren.
2. Empfänger- und Absenderadresse eintragen.
3. Prüfen, ob PHP `mail()` beim Hosting aktiviert ist.
4. Datenschutz- und Impressumsangaben vervollständigen.
5. Formular testen; die echte Konfigurationsdatei wird nicht in Git eingecheckt.

Das Formular übergibt zusätzlich den ausgewählten Kontaktweg (`general`,
`founding` oder `region`) an `api/contact.php`. Vor dem Livegang auf dem
Hosting einmal `php -l api/contact.php` ausführen und den Versand mit einer
Testadresse prüfen.

Die mitgelieferte `.htaccess` aktiviert HTTPS-Weiterleitung, Sicherheitsheader, Caching und Verzeichnisschutz auf kompatiblem Apache-Webhosting.
