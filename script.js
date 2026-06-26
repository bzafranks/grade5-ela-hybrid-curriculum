/* =====================================================================
   Grade 5 ELA Hybrid Curriculum — interactive behavior
   Vanilla JS, no dependencies. Each component self-initializes from
   data-* attributes so any page includes only what it needs.
   ===================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initNav();
  initActiveNav();
  initTabs();
  initQuizzes();
  initFlashcards();
  initFillInBlank();
  initDragAndDrop();
  initProgressTrackers();
  initReflections();
  initAnnotation();
  initVideoPlayers();
  initTranscriptDownloads();
  initPrintButtons();
  initDashboard();
  initFadeIn();
});

/* ---------- Nav ---------- */
function initNav() {
  var t = document.querySelector(".nav-toggle"), l = document.querySelector(".nav-links");
  if (!t || !l) return;
  t.addEventListener("click", function () {
    var open = l.classList.toggle("open");
    t.setAttribute("aria-expanded", open ? "true" : "false");
  });
}
function initActiveNav() {
  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
}

/* =====================================================================
   Tabs — delivery models, etc.
   <div class="tabs" data-tabs>
     <div class="tab-btns"></div>  (auto-filled)
     <div class="tab-panel" data-tab="Face-to-Face">...</div>
     <div class="tab-panel" data-tab="Synchronous">...</div>
   </div>
   ===================================================================== */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var panels = Array.prototype.slice.call(root.querySelectorAll(".tab-panel"));
    var btnBar = root.querySelector(".tab-btns");
    if (!panels.length || !btnBar) return;
    panels.forEach(function (panel, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tab-btn" + (i === 0 ? " active" : "");
      btn.textContent = panel.getAttribute("data-tab") || ("Tab " + (i + 1));
      btn.addEventListener("click", function () {
        btnBar.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
        panels.forEach(function (p) { p.classList.remove("active"); });
        btn.classList.add("active");
        panel.classList.add("active");
      });
      btnBar.appendChild(btn);
      if (i === 0) panel.classList.add("active");
    });
  });
}

/* =====================================================================
   Multiple-choice quizzes
   ===================================================================== */
function initQuizzes() {
  document.querySelectorAll("[data-quiz]").forEach(function (quiz) {
    var questions = quiz.querySelectorAll(".quiz-q");
    var total = questions.length, answered = 0, correct = 0;
    var scoreBox = document.createElement("div");
    scoreBox.className = "quiz-score";
    scoreBox.style.display = "none";
    scoreBox.setAttribute("aria-live", "polite");
    quiz.appendChild(scoreBox);
    questions.forEach(function (q) {
      var answer = parseInt(q.getAttribute("data-answer"), 10);
      var options = q.querySelectorAll(".quiz-option");
      var fb = q.querySelector(".quiz-feedback");
      var done = false;
      options.forEach(function (opt, idx) {
        opt.addEventListener("click", function () {
          if (done) return;
          done = true; answered++;
          if (idx === answer) {
            opt.classList.add("correct"); correct++;
            if (fb) { fb.textContent = "✅ Correct! " + (q.getAttribute("data-why") || ""); fb.className = "quiz-feedback right"; }
          } else {
            opt.classList.add("incorrect");
            options[answer].classList.add("correct");
            if (fb) { fb.textContent = "❌ Not quite. " + (q.getAttribute("data-why") || ""); fb.className = "quiz-feedback wrong"; }
          }
          options.forEach(function (o) { o.disabled = true; });
          if (answered === total) {
            var pct = Math.round((correct / total) * 100);
            scoreBox.style.display = "block"; scoreBox.classList.add("pop");
            scoreBox.textContent = (pct === 100 ? "🌟 " : pct >= 60 ? "👍 " : "💪 ") + "Score: " + correct + " / " + total + " (" + pct + "%)";
          }
        });
      });
    });
  });
}

/* =====================================================================
   Flashcards
   ===================================================================== */
function initFlashcards() {
  document.querySelectorAll("[data-flashcards]").forEach(function (deck) {
    var cards = Array.prototype.slice.call(deck.querySelectorAll(".flashcard"));
    if (!cards.length) return;
    var current = 0;
    cards.forEach(function (card, i) {
      card.style.display = i === 0 ? "block" : "none";
      card.tabIndex = 0; card.setAttribute("role", "button"); card.setAttribute("aria-label", "Flashcard, activate to flip");
      function flip() { card.classList.toggle("flipped"); }
      card.addEventListener("click", flip);
      card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
    });
    var controls = document.createElement("div");
    controls.className = "flashcard-controls";
    var prev = mkBtn("◀ Prev", "btn ghost small"), counter = document.createElement("span"), next = mkBtn("Next ▶", "btn small");
    counter.className = "flashcard-counter";
    controls.appendChild(prev); controls.appendChild(counter); controls.appendChild(next);
    deck.appendChild(controls);
    function show(i) {
      cards[current].style.display = "none"; cards[current].classList.remove("flipped");
      current = (i + cards.length) % cards.length;
      cards[current].style.display = "block";
      counter.textContent = "Card " + (current + 1) + " of " + cards.length;
    }
    prev.addEventListener("click", function () { show(current - 1); });
    next.addEventListener("click", function () { show(current + 1); });
    counter.textContent = "Card 1 of " + cards.length;
  });
}

/* =====================================================================
   Fill in the blank
   ===================================================================== */
function initFillInBlank() {
  document.querySelectorAll("[data-fitb]").forEach(function (box) {
    var inputs = box.querySelectorAll("input[data-accept]");
    var check = box.querySelector("[data-check]");
    var fb = box.querySelector(".fitb-feedback");
    if (!check) return;
    check.addEventListener("click", function () {
      var right = 0;
      inputs.forEach(function (input) {
        var accepted = input.getAttribute("data-accept").toLowerCase().split("|").map(function (s) { return s.trim(); });
        var val = input.value.trim().toLowerCase();
        input.classList.remove("correct", "incorrect");
        if (val !== "" && accepted.indexOf(val) !== -1) { input.classList.add("correct"); right++; }
        else input.classList.add("incorrect");
      });
      if (fb) { var all = right === inputs.length; fb.textContent = (all ? "🌟 " : "💪 ") + "You got " + right + " of " + inputs.length + " correct" + (all ? "!" : ". Try the red ones again."); fb.style.color = all ? "#2e6b4a" : "#b14a30"; }
    });
  });
}

/* =====================================================================
   Drag & drop matching (with tap fallback)
   ===================================================================== */
function initDragAndDrop() {
  document.querySelectorAll("[data-dnd]").forEach(function (board) {
    var dragging = null;
    var items = board.querySelectorAll(".drag-item");
    var zones = board.querySelectorAll(".drop-zone");
    items.forEach(function (item) {
      item.addEventListener("dragstart", function () { dragging = item; item.classList.add("dragging"); });
      item.addEventListener("dragend", function () { item.classList.remove("dragging"); dragging = null; });
      item.addEventListener("click", function () {
        items.forEach(function (i) { i.style.outline = ""; });
        if (dragging === item) { dragging = null; return; }
        dragging = item; item.style.outline = "3px solid var(--navy)";
      });
    });
    zones.forEach(function (zone) {
      zone.addEventListener("dragover", function (e) { e.preventDefault(); zone.classList.add("over"); });
      zone.addEventListener("dragleave", function () { zone.classList.remove("over"); });
      zone.addEventListener("drop", function (e) { e.preventDefault(); zone.classList.remove("over"); place(zone); });
      zone.addEventListener("click", function () { if (dragging) place(zone); });
    });
    function place(zone) {
      if (!dragging || zone.classList.contains("matched")) return;
      if (dragging.getAttribute("data-key") === zone.getAttribute("data-key")) {
        zone.classList.add("matched"); zone.classList.remove("wrong");
        var tag = document.createElement("span"); tag.textContent = " ✅ " + dragging.textContent; tag.style.fontWeight = "700";
        zone.appendChild(tag); dragging.style.display = "none"; dragging.style.outline = ""; dragging = null;
        if (board.querySelectorAll(".drop-zone.matched").length === zones.length) {
          var msg = board.querySelector(".dnd-done");
          if (!msg) { msg = document.createElement("p"); msg.className = "dnd-done quiz-score pop"; msg.style.gridColumn = "1 / -1"; board.appendChild(msg); }
          msg.textContent = "🌟 All matched! Great work.";
        }
      } else {
        zone.classList.add("wrong"); setTimeout(function () { zone.classList.remove("wrong"); }, 700);
        dragging.style.outline = ""; dragging = null;
      }
    }
  });
}

/* =====================================================================
   Progress trackers (localStorage) + dispatches "progresschange"
   ===================================================================== */
function initProgressTrackers() {
  document.querySelectorAll("[data-progress]").forEach(function (tracker) {
    var key = "g5ela:" + tracker.getAttribute("data-progress");
    var boxes = tracker.querySelectorAll('input[type="checkbox"]');
    var fill = tracker.querySelector(".progress-fill");
    var label = tracker.querySelector(".progress-label");
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || "{}"); } catch (e) {}
    function update() {
      var done = 0, state = {};
      boxes.forEach(function (b) { state[b.value] = b.checked; if (b.checked) done++; });
      try { localStorage.setItem(key, JSON.stringify(state)); } catch (e) {}
      var pct = boxes.length ? Math.round((done / boxes.length) * 100) : 0;
      if (fill) fill.style.width = pct + "%";
      if (label) label.textContent = done + " of " + boxes.length + " complete (" + pct + "%)" + (pct === 100 ? " 🎉" : "");
      document.dispatchEvent(new CustomEvent("progresschange"));
    }
    boxes.forEach(function (b) { if (saved[b.value]) b.checked = true; b.addEventListener("change", update); });
    update();
  });
}

/* =====================================================================
   Reflection boxes (localStorage)
   ===================================================================== */
function initReflections() {
  document.querySelectorAll("[data-reflection]").forEach(function (box) {
    var key = "g5refl:" + box.getAttribute("data-reflection");
    var ta = box.querySelector("textarea");
    var save = box.querySelector("[data-save]");
    var status = box.querySelector(".save-status");
    if (!ta) return;
    try { ta.value = localStorage.getItem(key) || ""; } catch (e) {}
    if (save) save.addEventListener("click", function () {
      try { localStorage.setItem(key, ta.value); } catch (e) {}
      if (status) { status.textContent = "✓ Saved on this device."; setTimeout(function () { status.textContent = ""; }, 4000); }
    });
  });
}

/* =====================================================================
   Reading annotation — click words to highlight
   <p class="annotate" data-annotate>Text here</p>
   ===================================================================== */
function initAnnotation() {
  document.querySelectorAll("[data-annotate]").forEach(function (el) {
    var text = el.textContent;
    el.textContent = "";
    text.split(/(\s+)/).forEach(function (tok) {
      if (/^\s+$/.test(tok) || tok === "") { el.appendChild(document.createTextNode(tok)); return; }
      var span = document.createElement("span");
      span.className = "word"; span.textContent = tok;
      span.addEventListener("click", function () { span.classList.toggle("hl"); });
      el.appendChild(span);
    });
    var hint = document.createElement("p");
    hint.className = "muted"; hint.style.fontSize = "0.9rem"; hint.style.marginTop = "0.6rem";
    hint.textContent = "💡 Tip: click any word to highlight evidence. Click again to remove.";
    el.parentNode.insertBefore(hint, el.nextSibling);
  });
}

/* =====================================================================
   Instructional video player (animated slideshow + narration + captions
   + interaction points). See lesson markup for structure.
   ===================================================================== */
function initVideoPlayers() {
  var roots = document.querySelectorAll(".video-player");
  if (!roots.length) return;
  var supportsTTS = "speechSynthesis" in window;
  var players = [];
  if (supportsTTS) {
    try { window.speechSynthesis.getVoices(); } catch (e) {}
    if (typeof window.speechSynthesis.addEventListener === "function")
      window.speechSynthesis.addEventListener("voiceschanged", function () { try { window.speechSynthesis.getVoices(); } catch (e) {} });
  }

  roots.forEach(function (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".video-slide"));
    if (!slides.length) return;
    var caption = root.querySelector(".video-caption");
    var interaction = root.querySelector(".video-interaction");
    var bar = root.querySelector(".video-progress-fill");
    var counter = root.querySelector(".video-counter");
    var playBtn = root.querySelector("[data-play]");
    var prevBtn = root.querySelector("[data-prev]");
    var nextBtn = root.querySelector("[data-next]");
    var restartBtn = root.querySelector("[data-restart]");
    var soundBtn = root.querySelector("[data-sound]");
    var idx = 0, playing = false, soundOn = supportsTTS, timer = null, token = 0;
    var api = { stop: function () { pause(); } };
    players.push(api);

    function durationFor(s) {
      var d = parseFloat(s.getAttribute("data-duration"));
      if (!isNaN(d)) return d * 1000;
      var w = (s.getAttribute("data-narration") || "").split(/\s+/).length;
      return Math.max(3500, w * 360 + 1200);
    }
    // young, clear female English voice ("friendly teacher")
    function pickVoice(u) {
      try {
        var v = window.speechSynthesis.getVoices(); if (!v || !v.length) return;
        var pref = ["samantha","aria","jenny","zira","michelle","ava","allison","susan","karen","catherine","fiona","tessa","serena","moira","hazel","heera","google us english","google uk english female","female"];
        var en = v.filter(function (x) { return /^en[-_]/i.test(x.lang); });
        var pool = en.length ? en : v;
        for (var p = 0; p < pref.length; p++) for (var i = 0; i < pool.length; i++) if (pool[i].name.toLowerCase().indexOf(pref[p]) !== -1) { u.voice = pool[i]; return; }
        for (var j = 0; j < pool.length; j++) if (/female/i.test(pool[j].name)) { u.voice = pool[j]; return; }
        if (en.length) u.voice = en[0];
      } catch (e) {}
    }
    function show(i) {
      idx = i;
      slides.forEach(function (s, n) { s.classList.toggle("active", n === i); });
      var s = slides[i];
      if (caption) caption.textContent = s.getAttribute("data-narration") || "";
      if (interaction) {
        var act = s.getAttribute("data-interaction");
        if (act) { interaction.textContent = "✋ " + act; interaction.classList.add("show"); }
        else interaction.classList.remove("show");
      }
      if (counter) counter.textContent = (i + 1) + " / " + slides.length;
      if (bar) bar.style.width = Math.round(((i + 1) / slides.length) * 100) + "%";
    }
    function clearT() { if (timer) { clearTimeout(timer); timer = null; } }
    function run() {
      clearT(); var my = ++token; var s = slides[idx]; var text = s.getAttribute("data-narration") || "";
      if (soundOn && supportsTTS && text) {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text); u.rate = 0.98; u.pitch = 1.15; pickVoice(u);
        u.onend = function () { if (playing && my === token) advance(); };
        window.speechSynthesis.speak(u);
        timer = setTimeout(function () { if (playing && my === token) advance(); }, durationFor(s) + 4500);
      } else { timer = setTimeout(function () { if (playing && my === token) advance(); }, durationFor(s)); }
    }
    function advance() { if (idx < slides.length - 1) { show(idx + 1); run(); } else pause(); }
    function play() {
      players.forEach(function (p) { if (p !== api) p.stop(); });
      if (idx >= slides.length - 1) show(0);
      playing = true; label(); run();
    }
    function pause() { playing = false; token++; clearT(); if (supportsTTS) try { window.speechSynthesis.cancel(); } catch (e) {} label(); }
    function label() { if (playBtn) playBtn.innerHTML = playing ? "⏸ Pause" : "▶ Play"; }
    if (playBtn) playBtn.addEventListener("click", function () { playing ? pause() : play(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { pause(); show(Math.max(0, idx - 1)); });
    if (nextBtn) nextBtn.addEventListener("click", function () { pause(); show(Math.min(slides.length - 1, idx + 1)); });
    if (restartBtn) restartBtn.addEventListener("click", function () { pause(); show(0); });
    if (soundBtn) {
      if (!supportsTTS) soundBtn.style.display = "none";
      else { soundBtn.innerHTML = "🔊 Sound on"; soundBtn.addEventListener("click", function () {
        soundOn = !soundOn; soundBtn.innerHTML = soundOn ? "🔊 Sound on" : "🔇 Captions only"; soundBtn.setAttribute("aria-pressed", soundOn); if (playing) run();
      }); }
    }
    show(0);
  });
  window.addEventListener("beforeunload", function () { if (supportsTTS) try { window.speechSynthesis.cancel(); } catch (e) {} });
  document.addEventListener("visibilitychange", function () { if (document.hidden) players.forEach(function (p) { p.stop(); }); });
}

/* =====================================================================
   Download transcript — builds a .txt from a video's narration
   <button data-download-transcript="#videoId" data-title="Lesson 1">Download Transcript</button>
   ===================================================================== */
function initTranscriptDownloads() {
  document.querySelectorAll("[data-download-transcript]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var sel = btn.getAttribute("data-download-transcript");
      var player = document.querySelector(sel);
      if (!player) return;
      var title = btn.getAttribute("data-title") || "Lesson";
      var lines = [title + " — Narration Transcript", "Grade 5 ELA Hybrid Curriculum", "".padEnd ? "".padEnd(50, "=") : "==================================================", ""];
      player.querySelectorAll(".video-slide").forEach(function (s, i) {
        var slideTitle = s.querySelector("h3") ? s.querySelector("h3").textContent : "Slide " + (i + 1);
        lines.push("[Slide " + (i + 1) + "] " + slideTitle);
        lines.push(s.getAttribute("data-narration") || "");
        lines.push("");
      });
      downloadText(title.replace(/[^a-z0-9]+/gi, "_") + "_transcript.txt", lines.join("\n"));
    });
  });
}
function downloadText(filename, text) {
  var blob = new Blob([text], { type: "text/plain" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 100);
}

/* ---------- Print buttons ---------- */
function initPrintButtons() {
  document.querySelectorAll("[data-print]").forEach(function (btn) {
    btn.addEventListener("click", function () { window.print(); });
  });
}

/* =====================================================================
   Student dashboard — aggregates all progress trackers + awards badges
   <div class="dashboard" data-dashboard>
     <div class="progress-fill" ...> via .dash-bar
   ===================================================================== */
function initDashboard() {
  var dash = document.querySelector("[data-dashboard]");
  if (!dash) return;
  var fill = dash.querySelector(".progress-fill");
  var label = dash.querySelector(".dash-label");
  var badges = dash.querySelectorAll(".ach-badge");
  function scan() {
    var total = 0, done = 0;
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf("g5ela:") === 0) {
        try { var st = JSON.parse(localStorage.getItem(k)); for (var key in st) { total++; if (st[key]) done++; } } catch (e) {}
      }
    }
    var pct = total ? Math.round((done / total) * 100) : 0;
    if (fill) fill.style.width = pct + "%";
    if (label) label.textContent = done + " learning steps completed across all lessons" + (total ? " (" + pct + "%)" : "");
    badges.forEach(function (b) {
      var need = parseInt(b.getAttribute("data-threshold"), 10) || 0;
      b.classList.toggle("earned", done >= need);
    });
  }
  document.addEventListener("progresschange", scan);
  scan();
}

/* ---------- Fade-in ---------- */
function initFadeIn() {
  if (!("IntersectionObserver" in window)) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("fade-up"); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll("[data-fade]").forEach(function (el) { obs.observe(el); });
}

/* ---------- helper ---------- */
function mkBtn(text, cls) { var b = document.createElement("button"); b.type = "button"; b.className = cls; b.textContent = text; return b; }
