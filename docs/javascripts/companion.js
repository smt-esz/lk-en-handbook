/* ==========================================================================
   English LK Handbook — kleine Verbesserungen
   ESZ Bad Düben

   1  Titel im Header und in der Navigation führen zur Startseite
   2  Checklisten sind anklickbar, der Fortschritt bleibt im Browser stehen

   Hinweis zu MkDocs Material: Seitenwechsel laufen über "instant loading",
   der Seiteninhalt wird also ausgetauscht, ohne dass das Dokument neu lädt.
   Deshalb hängt sich alles an document$ (RxJS-Observable von Material) und
   nicht an DOMContentLoaded.
   ========================================================================== */

(function () {
  "use strict";

  /* --- Hilfsfunktionen ------------------------------------------------- */

  /* Pfad zur Startseite aus der Position der aktuellen Seite ableiten.
     Material setzt auf jeder Seite einen Logo-Link, der genau dorthin
     zeigt. Den zu übernehmen ist zuverlässiger als selbst zu rechnen. */
  function homeHref() {
    var logo = document.querySelector("[data-md-component=logo]");
    return logo ? logo.getAttribute("href") : ".";
  }

  /* Eindeutiger Schlüssel je Seite für die gespeicherten Häkchen. */
  function storageKey() {
    return "lk-checklist:" + window.location.pathname;
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(storageKey())) || {};
    } catch (e) {
      return {};
    }
  }

  function save(state) {
    try {
      localStorage.setItem(storageKey(), JSON.stringify(state));
    } catch (e) {
      /* Privater Modus oder voller Speicher: dann eben ohne Speichern. */
    }
  }

  /* --- 1  Titel zur Startseite verlinken -------------------------------- */

  function linkTitles() {
    var href = homeHref();

    /* Header: der erste .md-header__topic trägt den Seitentitel der Site.
       Der zweite wird beim Scrollen eingeblendet und zeigt die aktuelle
       Seite, der bleibt unangetastet. */
    var headerTopic = document.querySelector(
      ".md-header__title .md-header__topic:first-child .md-ellipsis"
    );
    if (headerTopic && !headerTopic.querySelector("a")) {
      wrapInLink(headerTopic, href, "Back to the start page");
    }

    /* Navigation: die Überschrift der linken Spalte beziehungsweise des
       Menüs auf schmalen Bildschirmen. Neben dem Text stehen dort Logo
       und Zurück-Button, deshalb werden nur die Textknoten verlinkt. */
    var navTitle = document.querySelector(".md-nav--primary > .md-nav__title");
    if (navTitle && !navTitle.querySelector("a.md-nav__home")) {
      wrapTextNodesInLink(navTitle, href);
    }
  }

  function wrapInLink(el, href, title) {
    var a = document.createElement("a");
    a.href = href;
    a.title = title;
    a.className = "md-header__home";
    while (el.firstChild) {
      a.appendChild(el.firstChild);
    }
    el.appendChild(a);
  }

  /* In der Navigations-Überschrift stehen neben dem Text auch Logo und
     Zurück-Button. Nur die reinen Textknoten werden verlinkt. */
  function wrapTextNodesInLink(container, href) {
    var nodes = [];
    container.childNodes.forEach(function (n) {
      if (n.nodeType === 3 && n.textContent.trim().length > 0) {
        nodes.push(n);
      }
    });
    nodes.forEach(function (n) {
      var a = document.createElement("a");
      a.href = href;
      a.className = "md-nav__home";
      a.title = "Back to the start page";
      a.textContent = n.textContent.trim();
      n.parentNode.replaceChild(a, n);
    });
  }

  /* --- 2  Anklickbare Checklisten --------------------------------------- */

  function initChecklists() {
    var lists = document.querySelectorAll(".md-typeset .task-list");
    if (!lists.length) return;

    var state = load();
    var index = 0;

    lists.forEach(function (list) {
      list.classList.add("task-list--interactive");

      list.querySelectorAll("input[type=checkbox]").forEach(function (box) {
        var id = "c" + index++;
        var item = box.closest("li");

        box.disabled = false;
        box.removeAttribute("disabled");
        box.dataset.checkId = id;

        /* Der Text des Listenpunkts liegt als nackter Textknoten neben dem
           Label. Zum Durchstreichen braucht er eine eigene Hülle, sonst
           würde die Linie auch durch das Kästchen laufen. */
        wrapItemText(item);

        if (state[id]) {
          box.checked = true;
          item.classList.add("is-done");
        }

        box.addEventListener("change", function () {
          state[id] = box.checked;
          save(state);
          item.classList.toggle("is-done", box.checked);
          updateProgress(list);
        });
      });

      addProgress(list);
      updateProgress(list);
    });
  }

  /* Alles im Listenpunkt außer dem Kontrollkästchen in ein span packen. */
  function wrapItemText(item) {
    if (item.querySelector(".task-list-text")) return;

    var span = document.createElement("span");
    span.className = "task-list-text";

    var moving = [];
    item.childNodes.forEach(function (n) {
      var isControl =
        n.nodeType === 1 && n.classList.contains("task-list-control");
      if (!isControl) moving.push(n);
    });

    moving.forEach(function (n) {
      span.appendChild(n);
    });
    item.appendChild(span);
  }

  function addProgress(list) {
    if (list.previousElementSibling &&
        list.previousElementSibling.classList.contains("checklist-progress")) {
      return;
    }
    var bar = document.createElement("div");
    bar.className = "checklist-progress";
    bar.innerHTML =
      '<span class="checklist-progress__count"></span>' +
      '<span class="checklist-progress__track">' +
      '<span class="checklist-progress__fill"></span></span>' +
      '<button type="button" class="checklist-progress__reset">Reset</button>';
    list.parentNode.insertBefore(bar, list);

    bar.querySelector(".checklist-progress__reset")
      .addEventListener("click", function () {
        var state = load();
        list.querySelectorAll("input[type=checkbox]").forEach(function (box) {
          box.checked = false;
          delete state[box.dataset.checkId];
          box.closest("li").classList.remove("is-done");
        });
        save(state);
        updateProgress(list);
      });
  }

  function updateProgress(list) {
    var bar = list.previousElementSibling;
    if (!bar || !bar.classList.contains("checklist-progress")) return;

    var boxes = list.querySelectorAll("input[type=checkbox]");
    var done = list.querySelectorAll("input[type=checkbox]:checked").length;
    var pct = boxes.length ? Math.round((done / boxes.length) * 100) : 0;

    bar.querySelector(".checklist-progress__count").textContent =
      done + " of " + boxes.length;
    bar.querySelector(".checklist-progress__fill").style.width = pct + "%";
    bar.classList.toggle("is-complete", done === boxes.length && boxes.length > 0);
  }

  /* --- Start ------------------------------------------------------------ */

  function run() {
    linkTitles();
    initChecklists();
  }

  if (typeof document$ !== "undefined") {
    /* Normalfall: Material meldet jeden Seitenwechsel. */
    document$.subscribe(run);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    /* Skript wurde nach dem Laden ausgeführt, also direkt loslegen. */
    run();
  }
})();
