/* ============================================================
   CYB3RLUCSXW7.EXE — app.js
   Boot sequence, chuva de código, navegação, posts e shell.
   ============================================================ */

(function () {
  "use strict";

  /* -------------------- HELPERS -------------------- */
  const $ = (sel) => document.querySelector(sel);
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ================================================================
     1. CHUVA DE CÓDIGO (canvas)
     ================================================================ */
  function startRain() {
    const canvas = $("#rain");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, cols, drops;
    const glyphs = "アイウエオカキクケコサシスセソ01アイウエオ01<>/=+*#%$&lucsxw7".split("");

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cols = Math.floor(w / 16);
      drops = new Array(cols).fill(0).map(() => Math.random() * -50);
    }
    window.addEventListener("resize", resize);
    resize();

    function frame() {
      ctx.fillStyle = "rgba(4, 6, 4, 0.08)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#00ff41";
      ctx.font = "14px 'Share Tech Mono', monospace";
      for (let i = 0; i < cols; i++) {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = i * 16;
        const y = drops[i] * 16;
        ctx.fillText(char, x, y);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      setTimeout(() => requestAnimationFrame(frame), 60);
    }
    requestAnimationFrame(frame);
  }

  /* ================================================================
     2. BOOT SEQUENCE (Velocidade Ajustada para Mobile)
     ================================================================ */
  function runBoot() {
    return new Promise((resolve) => {
      const boot = $("#boot");
      const lines = $("#boot-lines");
      let skipped = false;

      function finish() {
        if (skipped) return;
        skipped = true;
        boot.style.display = "none";
        document.removeEventListener("keydown", onSkip);
        boot.removeEventListener("click", onSkip);
        resolve();
      }
      function onSkip() { finish(); }

      document.addEventListener("keydown", onSkip);
      boot.addEventListener("click", onSkip);

      // Velocidade do boot no mobile ajustada para ficar mais cadenciada/lenta
      const isMobile = window.innerWidth <= 768;
      const lineSpeed = isMobile ? 60 : 90;
      const emptySpeed = isMobile ? 40 : 50;

      (async () => {
        for (const line of BOOT_LINES) {
          if (skipped) return;
          const row = el("div", "boot-line");
          if (line.length === 0) {
            row.innerHTML = "&nbsp;";
          } else {
            line.forEach((seg) => {
              row.appendChild(el("span", seg.cls || "", seg.text));
            });
          }
          lines.appendChild(row);
          await sleep(line.length ? lineSpeed : emptySpeed);
        }
        await sleep(isMobile ? 400 : 600);
        finish();
      })();
    });
  }

  /* ================================================================
     3. NAV
     ================================================================ */
  function buildNav() {
    const nav = $("#nav");
    if (!nav) return;
    const items = [
      { label: "HOME", section: "home" },
      { label: "SHELL", section: "shell" }
    ];
    items.forEach(({ label, section }) => {
      const btn = el("button", "nav-link", label);
      btn.addEventListener("click", () => showSection(section));
      nav.appendChild(btn);
    });
  }

  function showSection(name) {
    ["home", "post", "shell"].forEach((id) => {
      const s = $("#" + id);
      if (!s) return;
      s.classList.toggle("hidden", id !== name);
    });
    if (name === "shell") {
      const input = $("#shell-input");
      if (input) input.focus();
    }
  }

  /* ================================================================
     4. HERO TYPING EFFECT
     ================================================================ */
  async function runHero() {
    const target = $("#hero-text");
    if (!target) return;
    let phraseIndex = 0;

    while (true) {
      const phrase = HERO_PHRASES[phraseIndex % HERO_PHRASES.length];
      // digitar
      for (let i = 0; i <= phrase.length; i++) {
        target.textContent = phrase.slice(0, i);
        await sleep(35);
      }
      await sleep(1600);
      // apagar
      for (let i = phrase.length; i >= 0; i--) {
        target.textContent = phrase.slice(0, i);
        await sleep(18);
      }
      await sleep(400);
      phraseIndex++;
    }
  }

  /* ================================================================
     5. LISTA DE POSTS (home)
     ================================================================ */
  function buildPostList() {
    const list = $("#post-list");
    const count = $("#post-count");
    if (!list || !count) return;

    count.textContent = String(POSTS.length);
    POSTS.forEach((post) => {
      const row = el("div", "post-row");
      const size = (post.body.join(" ").length / 1000).toFixed(1) + "K";
      row.innerHTML =
        '<span class="post-perm dim">-rw-r--r--</span>' +
        '<span class="post-size dim">' + size + '</span>' +
        '<span class="post-date dim">' + post.date + '</span>' +
        '<span class="post-file-line"><span class="post-name">' + post.file + '</span> — <span class="post-desc">' + post.desc + '</span></span>';
      row.addEventListener("click", () => openPost(post));
      list.appendChild(row);
    });
  }

  function openPost(post) {
    $("#post-file").textContent = post.file;
    $("#post-title").textContent = post.title;
    $("#post-date").textContent = post.date;
    $("#post-size").textContent = String(post.body.join(" ").length);

    const body = $("#post-body");
    body.innerHTML = "";
    post.body.forEach((paragraph) => {
      body.appendChild(el("p", "post-paragraph", paragraph));
    });

    showSection("post");
  }

  /* ================================================================
     6. SHELL INTERATIVO
     ================================================================ */
  function initShell() {
    const input = $("#shell-input");
    const history = $("#shell-history");
    if (!input || !history) return;

    function printLine(text, cls) {
      history.appendChild(el("div", cls || "", text));
      history.scrollTop = history.scrollHeight;
    }

    function runCommand(raw) {
      const trimmed = raw.trim();
      printLine("lucsxw7@matrix:~$ " + trimmed, "shell-echo");
      if (!trimmed) return;

      const [cmd, ...args] = trimmed.split(/\s+/);
      const handler = SHELL_COMMANDS[cmd.toLowerCase()];

      if (!handler) {
        printLine("command not found: " + cmd + " (tente 'help')", "dim");
        return;
      }

      const result = handler(args);

      if (result && result.clear) {
        history.innerHTML = "";
        return;
      }
      if (result && result.exit) {
        showSection("home");
        return;
      }
      (result || []).forEach((line) => printLine(line));
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        runCommand(input.value);
        input.value = "";
      }
    });
  }

  /* ================================================================
     7. BACK BUTTON DO POST
     ================================================================ */
  function initPostBack() {
    const btn = $("#post-back");
    if (!btn) return;
    btn.addEventListener("click", () => showSection("home"));
  }

  /* ================================================================
     BOOT DA APLICAÇÃO
     ================================================================ */
  async function main() {
    startRain();
    buildNav();
    buildPostList();
    initPostBack();
    initShell();
    showSection("home");

    await runBoot();
    runHero(); // roda em loop, não precisa await
  }

  document.addEventListener("DOMContentLoaded", main);
})();
