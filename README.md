# English LK Handbook

Digitales Handbuch für den Leistungskurs Englisch (ESZ Bad Düben).
Gebaut mit MkDocs Material, deployt auf GitHub Pages, offline nutzbar als PWA.

Ausführliche Anleitung für Vorschau und Veröffentlichung: **[DEPLOY.md](DEPLOY.md)**

## Lokal testen

Ohne Installation: `site/index.html` doppelklicken, falls der Ordner vorhanden ist.
Der Build ist dank `offline`-Plugin auch direkt von der Festplatte nutzbar, Suche inklusive.

Mit Live-Aktualisierung:

```
pip install "mkdocs-material~=9.7"
mkdocs serve
```

Die Version ist bewusst auf 9.x festgepinnt: Für MkDocs 2.0 sind inkompatible Änderungen angekündigt, mit 9.x läuft alles stabil.

Dann http://127.0.0.1:8000 öffnen.

## Deployment (einmalig einrichten)

1. Neues Repo auf GitHub anlegen (z.B. `lk-english-companion`).
2. In `mkdocs.yml` die Zeile `site_url` anpassen (USERNAME ersetzen).
3. Diesen Ordner pushen:
   ```
   git init
   git add .
   git commit -m "Initial version"
   git branch -M main
   git remote add origin https://github.com/USERNAME/lk-english-companion.git
   git push -u origin main
   ```
4. Die GitHub Action baut die Seite und legt sie auf den Branch `gh-pages`.
5. Auf GitHub unter Settings > Pages als Source den Branch `gh-pages` wählen (falls nicht automatisch gesetzt).

Danach reicht für jede Änderung: committen und pushen. Die Seite baut sich selbst neu.

## Inhalte pflegen

Jede Seite ist eine Markdown-Datei unter `docs/`. Neue Seiten in `mkdocs.yml` unter `nav:` eintragen.

## Hinweise

- Keine Schülernamen, keine Schülerarbeiten, keine eingescannten Verlagsmaterialien in dieses Repo. Es ist öffentlich.
- Die PWA-Funktion (offline, installierbar) nach dem ersten Deployment einmal am Handy testen: Seite öffnen, Flugmodus an, neu laden.
