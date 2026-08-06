# Vorschau und Deployment

Zwei Teile: erst lokal anschauen, dann online stellen.

---

## Teil 1: Die Seite anschauen, ohne etwas zu veröffentlichen

### Weg A: fertig gebaute Dateien anklicken (kein Setup nötig)

Im Ordner liegt jetzt ein Unterordner `site/`. Darin `index.html` doppelklicken, der Browser öffnet die Seite.

Das funktioniert, weil das `offline`-Plugin in der `mkdocs.yml` dafür sorgt, dass alle Links relativ sind und der Suchindex mitgebaut wird. Suche, Navigation und der Hell-Dunkel-Umschalter laufen also auch direkt von der Festplatte.

Was in dieser Vorschau **nicht** funktioniert:

- der Service Worker, also das "zur Startseite hinzufügen" als App. Das braucht eine echte Adresse mit https
- die Adresszeile zeigt einen Pfad statt einer URL, das ist normal

`site/` steht in der `.gitignore`, wird also nie mit hochgeladen. Wenn du den Ordner löschst, passiert nichts. Er wird beim nächsten Build neu erzeugt.

### Weg B: lokaler Server mit Live-Aktualisierung

Wenn du selbst an Texten schreiben willst und sofort sehen möchtest, wie es aussieht:

```
pip install "mkdocs-material~=9.7"
mkdocs serve
```

Dann `http://127.0.0.1:8000` im Browser öffnen. Jede gespeicherte Änderung an einer `.md`-Datei erscheint sofort. Beenden mit `Strg + C`.

Voraussetzung ist Python auf dem Rechner. Falls `pip` unbekannt ist, fehlt Python noch.

---

## Teil 2: Über GitHub Pages online stellen

### Warum das überhaupt Schritte braucht

GitHub Pages zeigt keine Markdown-Dateien an. Es kann nur HTML, CSS und Bilder ausliefern. Aus den `.md`-Dateien im Ordner `docs/` muss also erst eine Webseite gebaut werden, und genau das macht MkDocs.

Der Ablauf, einmal eingerichtet, sieht so aus:

```
docs/*.md   →   du pushst zu GitHub   →   GitHub Action baut mit MkDocs
            →   Ergebnis landet im Branch gh-pages   →   Pages liefert es aus
```

Die Action liegt schon fertig in `.github/workflows/deploy.yml`. Du musst sie nicht anfassen.

### Vorher entscheiden: Sichtbarkeit

Wichtig, weil es sich nicht nachträglich einfach ändern lässt:

- Mit einem kostenlosen GitHub-Konto funktioniert Pages **nur aus einem öffentlichen Repository**. Der Quelltext ist dann für jeden lesbar
- Mit GitHub Pro oder Team darf das Repository privat sein, **die Seite selbst bleibt trotzdem öffentlich erreichbar**. Wer die URL kennt, kommt rein
- Wirklich zugriffsbeschränkte Pages gibt es nur über GitHub Enterprise Cloud

Für die Praxis heißt das: was hier im Wiki steht, steht im Internet. Selbst geschriebene Erklärungen sind unproblematisch, eingescannte Verlagsseiten oder abgetippte Aufgaben aus Lehrwerken haben hier nichts zu suchen. (Stand Juli 2026, bitte im Zweifel in der GitHub-Dokumentation nachsehen, die Konditionen ändern sich gelegentlich.)

### Schritt 1: Konto und Repository

1. Auf [github.com](https://github.com) ein Konto anlegen, falls noch keins da ist
2. Oben rechts auf **+** und dann **New repository**
3. Name: `lk-english-companion`
4. Sichtbarkeit wählen, siehe oben
5. Kein README, keine `.gitignore`, keine Lizenz mit anlegen. Der Ordner bringt alles mit
6. **Create repository**

### Schritt 2: `site_url` anpassen

In der `mkdocs.yml` steht noch ein Platzhalter:

```yaml
site_url: https://USERNAME.github.io/lk-english-companion/
```

`USERNAME` durch deinen GitHub-Benutzernamen ersetzen, exakt so geschrieben wie dort. Diese Adresse ist später die URL der Seite.

### Schritt 3: Dateien hochladen

**Variante mit GitHub Desktop, empfohlen wenn du keine Kommandozeile magst**

1. [GitHub Desktop](https://desktop.github.com) installieren und mit dem Konto anmelden
2. `File` → `Add local repository` → diesen Ordner wählen. Die Meldung, dass es kein Repository ist, mit **create a repository** bestätigen
3. Unten links eine Beschreibung eintippen, zum Beispiel `Erste Version`, dann **Commit to main**
4. Oben auf **Publish repository**. Häkchen bei "Keep this code private" so setzen, wie du in Schritt 1 entschieden hast

**Variante Kommandozeile**

Git für Windows muss installiert sein. Im Ordner ein Terminal öffnen und:

```
git init
git add .
git commit -m "Erste Version"
git branch -M main
git remote add origin https://github.com/USERNAME/lk-english-companion.git
git push -u origin main
```

Nicht über die Web-Oberfläche hochladen. Der Ordner `.github` beginnt mit einem Punkt, ist im Windows-Explorer standardmäßig unsichtbar und fehlt dann beim Ziehen in den Browser. Ohne diesen Ordner läuft die Action nicht.

### Schritt 4: Auf die Action warten

Im Repository auf den Tab **Actions**. Dort läuft jetzt "Deploy to GitHub Pages", das dauert eine bis zwei Minuten.

- Grüner Haken: gebaut, es entsteht ein neuer Branch `gh-pages`
- Rotes Kreuz: draufklicken, das Log zeigt in der Regel recht deutlich, welche Datei oder welcher Link Probleme macht

### Schritt 5: Pages einschalten

**Settings** → in der linken Spalte **Pages**:

- Source: **Deploy from a branch**
- Branch: **gh-pages**, Ordner: **/ (root)**
- **Save**

Nach ein bis zwei Minuten ist die Seite unter `https://USERNAME.github.io/lk-english-companion/` erreichbar. Die Oberfläche von GitHub wird gelegentlich umgebaut, die Bezeichnungen können also leicht abweichen. Der Punkt, den du suchst, heißt immer Source oder Build and deployment.

### Ab jetzt: Änderungen veröffentlichen

1. Text in einer `.md`-Datei ändern
2. Vorher lokal prüfen: `mkdocs serve` oder neu bauen mit `mkdocs build` und `site/index.html` öffnen
3. Committen und pushen, mit GitHub Desktop oder `git add . && git commit -m "..." && git push`
4. Die Action baut, nach zwei Minuten ist die Änderung online

Bei SuS, die die Seite schon als App auf dem Homescreen haben, kann eine alte Version aus dem Cache kommen. Deshalb bei größeren Updates die Zeile `const CACHE = "lk-companion-vN"` in `docs/sw.js` um eins hochzählen.

---

## Wenn du wirklich nur eine einzelne Markdown-Seite zeigen willst

Für den Fall, dass es mal nicht um das ganze Wiki geht:

- **Einfachste Lösung:** die `.md`-Datei ins Repository legen und einfach auf GitHub anklicken. GitHub zeigt Markdown im Repository-Browser formatiert an, ohne jedes Deployment. Keine schöne URL, aber sofort lesbar und teilbar
- **Über Pages ohne MkDocs:** Pages benutzt im Hintergrund Jekyll. Eine `index.md` im Repository-Wurzelverzeichnis mit einem Kopf aus drei Bindestrichen, `layout: default`, drei Bindestrichen wird zu HTML gerendert, wenn du unter Settings → Pages als Source den Branch `main` und `/ (root)` einstellst. Das reicht für eine einzelne Seite, sieht aber schlichter aus und hat weder Suche noch Navigation
- Für das Handbook-Wiki bleibt MkDocs die bessere Wahl, weil Suche, Offline-Nutzung und Navigation daran hängen

---

## Häufige Stolpersteine

| Symptom | Ursache |
|---|---|
| Seite lädt, aber ohne Farben und Schrift | `site_url` falsch, oder als Pages-Source `main` statt `gh-pages` eingestellt |
| 404 nach dem ersten Deployment | Zu früh geschaut. Pages braucht nach dem Einschalten ein paar Minuten |
| Action schlägt fehl mit "Config value 'nav'" | Eine Datei ist in `mkdocs.yml` eingetragen, existiert aber nicht, oder umgekehrt |
| Änderungen kommen nicht an | Auf dem Rechner committet, aber nicht gepusht. Oder alter Cache, siehe `sw.js` |
| Git meckert über Änderungen, die du nicht gemacht hast | Der Ordner liegt in OneDrive. Beim Arbeiten warten, bis die Synchronisierung durch ist |
