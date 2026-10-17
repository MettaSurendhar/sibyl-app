/**
 * SIBYL — site behaviour
 * Reads SIBYL_DATA (data.js) and renders every dynamic section.
 * No content strings live in this file — edit data.js instead.
 */
(function () {
  "use strict";

  const D = window.SIBYL_DATA;
  const SHOT_DIR = "assets/screenshots/";

  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };

  const useIcon = (name, cls) => `<svg class="icon ${cls || ""}"><use href="#i-${name}"/></svg>`;

  /**
   * Build one "slide" for a phone screen: tries to load `filename` from
   * SHOT_DIR (or, if it already starts with "assets/", from that exact
   * path). Returns a placeholder element immediately and swaps it for a
   * real <img> in place if the file loads. Crucially, the placeholder and
   * the image use DIFFERENT layout classes (is-placeholder / is-image) so
   * an image never inherits the placeholder's padding/flex layout — that
   * mismatch was previously causing screenshots to render shrunk inside
   * the phone frame instead of filling it edge-to-edge.
   */
  function buildSlide(filename, label) {
    const slide = el(
      "div",
      "phone-slide is-placeholder",
      `<img class="ph-mark" src="${D.meta.icon}" alt=""><strong>${label || "Sibyl"}</strong><span>Screenshot coming soon</span>`
    );
    const isAbsolute = filename.indexOf("assets/") === 0;
    const src = isAbsolute ? filename : SHOT_DIR + filename;
    const probe = new Image();
    probe.onload = () => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = label || "Sibyl screenshot";
      img.className = "phone-slide is-image" + (slide.classList.contains("active") ? " active" : "");
      slide.replaceWith(img);
    };
    probe.src = src;
    return slide;
  }

  /* ================= THEME TOGGLE ================= */
  function initTheme() {
    const KEY = "sibyl-theme";
    let saved = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch (e) {
      /* storage inaccessible (e.g. file://, private browsing) — default theme applies */
    }
    if (saved) document.documentElement.setAttribute("data-theme", saved);

    document.getElementById("themeToggle").addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(KEY, next);
      } catch (e) {
        /* storage unavailable — theme still applies for this session */
      }
    });
  }

  /* ================= HEADER / NAV ================= */
  function renderNav() {
    const nav = document.getElementById("chapterNav");
    D.nav.forEach((item) => {
      const a = el("a", null, item.label);
      a.href = "#" + item.id;
      a.dataset.target = item.id;
      nav.appendChild(a);
    });
    // "Star the repo" lives in the header on desktop; on small screens that
    // button is hidden, so it appears as the last item in the open menu.
    const star = el("a", "nav-extra", `${useIcon("star")}<span>Star the repo</span>`);
    star.href = D.meta.repoUrl;
    star.target = "_blank";
    star.rel = "noopener";
    nav.appendChild(star);
  }

  function initHeaderScroll() {
    const header = document.getElementById("siteHeader");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initMobileMenu() {
    const btn = document.getElementById("navToggle");
    btn.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.getElementById("chapterNav").addEventListener("click", (e) => {
      if (e.target.closest("a")) document.body.classList.remove("menu-open");
    });
  }

  function initScrollSpy() {
    const links = Array.from(document.querySelectorAll("#chapterNav a"));
    const sections = D.nav.map((n) => document.getElementById(n.id)).filter(Boolean);
    if (!sections.length) return;
    const spy = () => {
      let current = sections[0].id;
      const line = window.scrollY + window.innerHeight * 0.3;
      sections.forEach((sec) => {
        if (sec.offsetTop <= line) current = sec.id;
      });
      links.forEach((l) => l.classList.toggle("active", l.dataset.target === current));
    };
    spy();
    window.addEventListener("scroll", spy, { passive: true });
  }

  /* ================= HERO ================= */
  function renderHero() {
    document.getElementById("heroTagline").textContent = D.hero.tagline;
    document.getElementById("heroHeadline").textContent = D.hero.headline;
    document.getElementById("heroLede").textContent = D.hero.lede;

    const primary = document.getElementById("heroPrimaryCta");
    primary.href = resolveApkUrl();
    primary.querySelector(".btn-label").textContent = D.hero.ctaPrimary.label;
    primary.querySelector(".btn-sub").textContent = D.hero.ctaPrimary.sublabel;

    const secondary = document.getElementById("heroSecondaryCta");
    secondary.classList.add("btn-row");
    secondary.innerHTML = `${useIcon(D.hero.ctaSecondary.icon || "github")}<span>${D.hero.ctaSecondary.label}</span>`;
    secondary.href = D.hero.ctaSecondary.url;
    secondary.target = "_blank";
    secondary.rel = "noopener";

    const headerCta = document.getElementById("headerCta");
    headerCta.innerHTML = `${useIcon("star")}<span>Star the repo</span>`;
    headerCta.href = D.meta.repoUrl;

    // splash.png (a fixed piece of brand art) always comes first, then the
    // real screenshots cycle in after it. splash.png does not change with
    // the site's light/dark toggle.
    startCycle(
      document.getElementById("heroPhoneScreen"),
      [D.meta.splash, ...(D.hero.screenshots || [])],
      3400
    );
  }

  /**
   * Builds a self-cycling set of phone slides inside `screen`, one at a
   * time (never more than one element present), advancing every
   * `intervalMs`. Paths starting with "assets/" are used as-is; anything
   * else resolves relative to SHOT_DIR. Returns a controller with stop().
   */
  /**
   * Builds a self-cycling, looping set of phone slides inside `screen`.
   * All slides are created up front (each independently resolving from a
   * placeholder to a real <img> the moment its file loads) and kept as
   * siblings the whole time; the interval only ever toggles the `.active`
   * class between them by position. This matters for smoothness: because
   * every slide already exists (and has very likely already finished
   * resolving to a real image) by the time it's activated, each transition
   * is a clean opacity/transform fade between two fully-formed elements —
   * never a jarring "placeholder pops into image" swap mid-fade.
   */
  function startCycle(screen, files, intervalMs) {
    screen.innerHTML = "";
    if (!files || !files.length) return { stop() {} };

    files.forEach((f) => screen.appendChild(buildSlide(f, "Sibyl")));
    screen.children[0].classList.add("active");
    if (files.length === 1) return { stop() {} };

    let idx = 0;
    const timer = setInterval(() => {
      const next = (idx + 1) % files.length;
      const current = screen.children[idx]; // looked up by position: buildSlide
      const upcoming = screen.children[next]; // may swap placeholder->img internally,
      if (current) current.classList.remove("active"); // but never changes position.
      if (upcoming) upcoming.classList.add("active");
      idx = next;
    }, intervalMs);

    return {
      stop() {
        clearInterval(timer);
      }
    };
  }

  function resolveApkUrl() {
    return (D.meta.apkDirectUrl && D.meta.apkDirectUrl.trim()) || D.meta.releasesTagUrl;
  }

  /* ================= PILLARS ================= */
  function renderPillars() {
    const grid = document.getElementById("pillarsGrid");
    D.pillars.forEach((p) => {
      grid.appendChild(
        el(
          "div",
          "pillar",
          `<div class="pillar-value">${p.value}</div><span class="pillar-unit">${p.unit}</span><p class="pillar-label">${p.label}</p>`
        )
      );
    });
  }

  /**
   * Mobile/tablet version of "Why Sibyl": the phone stays completely still
   * while only the cards swipe horizontally (CSS scroll-snap does the
   * swiping natively). Whichever card is nearest the centre of the track is
   * the active one, and the phone cycles through that card's own screens.
   */
  function initMobileWhySibyl(rows) {
    const track = document.getElementById("orbitMobileTrack");
    const dotsWrap = document.getElementById("orbitMobileDots");
    const screen = document.getElementById("orbitMobilePhoneScreen");
    if (!track || !screen) return;

    const cards = rows.map((row, i) => {
      const card = el("div", "orbit-card", orbitCardHTML(row, i + 1));
      track.appendChild(card);
      return card;
    });
    const dots = rows.map((_, i) => {
      const d = el("button", "orbit-dot");
      d.type = "button";
      d.setAttribute("aria-label", `Show card ${i + 1}`);
      d.addEventListener("click", () => {
        pause();
        goTo(i);
        resumeSoon();
      });
      dotsWrap.appendChild(d);
      return d;
    });

    let active = -1;
    let handle = null;
    let timer = null;
    let resumeTimer = null;
    let paused = false;
    let visible = false;

    // how long a card stays up: enough for the phone to play all of its screens once
    const dwell = (i) => Math.max(4200, ((rows[i].screens || []).length || 1) * 2200 + 600);
    function schedule() {
      clearTimeout(timer);
      if (paused || !visible) return;
      timer = setTimeout(() => goTo((active + 1) % cards.length), dwell(active));
    }
    function goTo(i) {
      const c = cards[i];
      track.scrollTo({
        left: c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2,
        // wrapping back to the first card jumps instead of rewinding through every card
        behavior: i === 0 ? "auto" : "smooth"
      });
    }
    // touching/swiping pauses autoplay; it resumes a few seconds after the finger lifts
    function pause() {
      paused = true;
      clearTimeout(timer);
      clearTimeout(resumeTimer);
    }
    function resumeSoon() {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        paused = false;
        schedule();
      }, 4000);
    }
    ["touchstart", "pointerdown", "wheel"].forEach((ev) => track.addEventListener(ev, pause, { passive: true }));
    ["touchend", "touchcancel", "pointerup", "pointercancel"].forEach((ev) => track.addEventListener(ev, resumeSoon, { passive: true }));

    function setActive(i) {
      if (i === active) return;
      if (cards[active]) cards[active].classList.remove("active");
      if (dots[active]) dots[active].classList.remove("active");
      cards[i].classList.add("active");
      dots[i].classList.add("active");
      active = i;
      const files = (rows[i].screens || [])
        .map((k) => D.screenLibrary[k])
        .filter(Boolean)
        .map((s) => s.file);
      if (handle) handle.stop();
      handle = startCycle(screen, files.length ? files : [""], 2200);
      schedule();
    }

    let ticking = false;
    function sync() {
      ticking = false;
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((c, i) => {
        const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    }
    track.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(sync);
        }
      },
      { passive: true }
    );
    // autoplay only while the section is actually on screen
    const host = document.getElementById("orbitMobile");
    if (host && "IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          visible = entries[0].isIntersecting;
          if (visible) schedule();
          else clearTimeout(timer);
        },
        { threshold: 0.35 }
      ).observe(host);
    } else {
      visible = true;
    }
    setActive(0);
  }

  /* ================= DIFFERENCE — orbit layout ================= */
  function orbitCardHTML(row, num) {
    return `<div class="orbit-card-head">
        <span class="orbit-card-icon">${useIcon(row.icon)}</span>
        <div>
          <span class="orbit-card-num">${String(num).padStart(2, "0")}</span>
          <span class="orbit-card-title">${row.capability}</span>
        </div>
      </div>
      <p class="orbit-card-typical">${row.typical}</p>
      <p class="orbit-card-sibyl">${row.sibyl}</p>`;
  }

  function renderDifference() {
    document.getElementById("diffHeading").textContent = D.difference.heading;
    document.getElementById("diffIntro").textContent = D.difference.intro;

    const stage = document.getElementById("orbitArcStage");
    const outer = document.getElementById("orbitStageOuter");
    const phoneScreen = document.getElementById("orbitPhoneScreen");
    const rows = D.difference.rows;

    const cards = rows.map((row, i) => {
      const card = el("div", "orbit-card", orbitCardHTML(row, i + 1));
      stage.appendChild(card);
      return card;
    });

    initMobileWhySibyl(rows);

    // ---- sync the fixed phone to whichever card is centred in the arc ----
    let activeIndex = -1;
    let cycleHandle = null;

    function showRowOnPhone(index) {
      const row = rows[index];
      const files = (row.screens || [])
        .map((key) => D.screenLibrary[key])
        .filter(Boolean)
        .map((s) => s.file);
      if (cycleHandle) cycleHandle.stop();
      cycleHandle = startCycle(phoneScreen, files.length ? files : [""], 2200);
    }

    function setActive(index) {
      if (index === activeIndex) return;
      if (cards[activeIndex]) cards[activeIndex].classList.remove("active");
      cards[index].classList.add("active");
      activeIndex = index;
      showRowOnPhone(index);
    }

    // Tuning knobs for the arc's shape and pacing.
    const CARD_STEP = 128; // vertical distance between consecutive card centres, px
    const CURVE_MAX = 90; // how far a distant card bulges away from the phone, px
    const FADE_SPAN = 3.4; // index-distance at which a card has faded to invisible

    /**
     * Positions every card from a single continuous number (the exact,
     * fractional "reading position" through the list, e.g. 2.35 = more than
     * a third of the way from card 2 to card 3). Because every card's
     * transform is a direct, continuous function of this one value, the
     * phone can stay perfectly still while the arc animates, motion is
     * always smooth, and no card can ever be skipped — each one passes
     * through the centre exactly once as the value sweeps from 0 to
     * rows.length - 1.
     */
    function layoutArc(continuousPosition) {
      cards.forEach((card, i) => {
        const delta = i - continuousPosition;
        const absDelta = Math.abs(delta);
        const y = delta * CARD_STEP;
        const curve = Math.min(absDelta / 3, 1); // 0 at centre, 1 by three cards away
        const x = curve * CURVE_MAX;
        const scale = 1 - Math.min(absDelta, 4) * 0.055;
        const opacity = Math.max(0, 1 - absDelta / FADE_SPAN);
        card.style.transform = `translate(${x.toFixed(1)}px, calc(-50% + ${y.toFixed(1)}px)) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(2);
        card.style.zIndex = String(200 - Math.round(absDelta * 10));
        card.style.pointerEvents = absDelta < 0.5 ? "auto" : "none";
      });
      const nearest = Math.max(0, Math.min(cards.length - 1, Math.round(continuousPosition)));
      setActive(nearest);
    }

    layoutArc(0);

    let ticking = false;
    function syncToScroll() {
      ticking = false;
      if (!outer || getComputedStyle(outer).display === "none") return; // mobile: flat list, no arc

      const outerRect = outer.getBoundingClientRect();
      const outerHeight = outer.offsetHeight;
      const viewportH = window.innerHeight;
      const scrollable = outerHeight - viewportH;
      let progress = scrollable > 0 ? -outerRect.top / scrollable : 0;
      progress = Math.max(0, Math.min(1, progress));

      layoutArc(progress * (rows.length - 1));
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(syncToScroll);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    setTimeout(syncToScroll, 50);
    window.addEventListener("load", syncToScroll, { once: true });

    document.getElementById("orbitPhone").addEventListener("click", () => {
      const row = rows[activeIndex];
      const key = (row.screens || [])[0];
      const s = key && D.screenLibrary[key];
      if (s) openLightbox({ file: s.file, label: s.label, caption: row.sibyl });
    });
  }

  /* ================= BENTO FEATURES — icon + keyword grid ================= */
  function renderFeatures() {
    document.getElementById("featuresHeading").textContent = D.featureGroups.heading;
    document.getElementById("featuresIntro").textContent = D.featureGroups.intro;
    const grid = document.getElementById("bentoGrid");
    D.featureGroups.groups.forEach((g) => {
      const hasIllustration = Boolean(g.illustration);
      const card = el("div", `bento-card size-${g.size || "small"}${hasIllustration ? " has-illustration" : ""}`);

      if (hasIllustration) {
        card.appendChild(
          el("div", "bento-illustration", `<svg viewBox="0 0 220 150"><use href="#${g.illustration}"/></svg>`)
        );
      }

      const body = hasIllustration ? el("div", "bento-body") : card;
      body.appendChild(
        el("div", "fg-head", `<div class="fg-icon">${useIcon(g.icon)}</div><h3 class="fg-title">${g.title}</h3>`)
      );
      body.appendChild(el("p", "fg-blurb", g.blurb));
      const kwGrid = el("div", "kw-grid");
      g.features.forEach((f) => {
        kwGrid.appendChild(
          el("div", "kw-item", `<span class="kw-icon">${useIcon(f.icon)}</span><span class="kw-text">${f.text}</span>`)
        );
      });
      body.appendChild(kwGrid);
      if (hasIllustration) card.appendChild(body);

      // mobile: tiles are compact and tap to reveal their keywords
      // (the chevron and the toggle are inert on desktop via CSS)
      body.querySelector(".fg-head").insertAdjacentHTML("beforeend", `<span class="tile-chevron">${useIcon("chevron")}</span>`);
      card.addEventListener("click", () => card.classList.toggle("open"));

      grid.appendChild(card);
    });
  }

  /* ================= PRIVACY / VOW ================= */
  function renderVow() {
    document.getElementById("vowHeading").textContent = D.privacy.heading;
    document.getElementById("vowIntro").textContent = D.privacy.intro;

    const quote = document.getElementById("vowQuote");
    quote.innerHTML = `\u201C${D.privacy.quote}\u201D<br><span style="font-family:var(--sans); font-style:normal; font-size:0.8rem; color:var(--text-dim);">${D.privacy.quoteSource}</span>`;

    const dg = D.privacy.diagram;
    document.getElementById("flowDeviceLabel").textContent = dg.deviceLabel;
    document.getElementById("flowDeviceNote").textContent = dg.deviceNote;
    document.getElementById("flowCloudLabel").textContent = dg.cloudLabel;
    document.getElementById("flowCloudNote").textContent = dg.cloudNote;
    document.getElementById("flowGroqLabel").textContent = dg.groqLabel;
    document.getElementById("flowGroqNote").textContent = dg.groqNote;

    const points = document.getElementById("vowPoints");
    D.privacy.points.forEach((p) => {
      points.appendChild(
        el(
          "li",
          null,
          `<span class="vow-point-icon">${useIcon(p.icon)}</span><div><h4>${p.title}</h4><p>${p.detail}</p></div>`
        )
      );
    });
  }

  /* ================= DOWNLOAD ================= */
  function renderDownload() {
    document.getElementById("getHeading").textContent = D.download.heading;
    document.getElementById("getIntro").textContent = D.download.intro;

    const primary = document.getElementById("getPrimaryCta");
    primary.href = resolveApkUrl();
    primary.querySelector(".btn-label").textContent = D.download.primary.label;
    primary.querySelector(".btn-sub").textContent = D.download.primary.note;

    const starCta = document.getElementById("getStarCta");
    starCta.innerHTML = `${useIcon("star")}<span>Star the repo</span>`;
    starCta.href = D.meta.repoUrl;

    const badges = document.getElementById("getBadges");
    D.download.badges.forEach((b) => {
      badges.appendChild(el("span", "badge", `<span class="dot"></span>${b.label}: ${b.status}`));
    });

    const steps = document.getElementById("getSteps");
    D.download.steps.forEach((s, i) => {
      steps.appendChild(
        el("div", "get-step", `<span class="get-step-num">${i + 1}</span><h4>${s.title}</h4><p>${s.detail}</p>`)
      );
    });

    const links = document.getElementById("getLinks");
    D.download.secondaryLinks.forEach((l) => {
      const li = el("li");
      const a = el("a", null, `${useIcon(l.icon)}<span>${l.label}</span>`);
      a.href = l.url;
      a.target = "_blank";
      a.rel = "noopener";
      li.appendChild(a);
      links.appendChild(li);
    });
  }

  /* ================= CREATOR ================= */
  function renderCreator() {
    document.getElementById("creatorHeading").textContent = D.creator.heading;
    document.getElementById("creatorName").textContent = D.creator.name;
    document.getElementById("creatorTagline").textContent = D.creator.tagline;

    const avatar = document.getElementById("creatorAvatar");
    if (D.creator.photo) {
      const img = document.createElement("img");
      img.src = D.creator.photo;
      img.alt = D.creator.name;
      img.onerror = () => {
        avatar.textContent = D.creator.initials;
      };
      avatar.appendChild(img);
    } else {
      avatar.textContent = D.creator.initials;
    }

    const links = document.getElementById("creatorLinks");
    D.creator.links.forEach((l) => {
      const a = el("a", "creator-link", `${useIcon(l.icon)}<span>${l.label}</span>`);
      a.href = l.url;
      a.target = "_blank";
      a.rel = "noopener";
      links.appendChild(a);
    });
  }

  /* ================= FOOTER ================= */
  function renderFooter() {
    document.getElementById("footerLine1").textContent = D.footer.line1;
    document.getElementById("footerLine2").textContent = D.footer.line2;
    const links = document.getElementById("footerLinks");
    D.footer.links.forEach((l) => {
      const li = el("li");
      const a = el("a", null, l.label);
      a.href = l.url;
      a.target = "_blank";
      a.rel = "noopener";
      li.appendChild(a);
      links.appendChild(li);
    });
  }

  /* ================= SCROLL REVEAL (one-time, generic) ================= */
  function initRevealAnimations() {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;
    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    targets.forEach((t) => observer.observe(t));
  }

  /* ================= LIGHTBOX ================= */
  function openLightbox(item) {
    const box = document.getElementById("lightbox");
    const img = document.getElementById("lightboxImg");
    const cap = document.getElementById("lightboxCaption");
    const isAbsolute = item.file.indexOf("assets/") === 0;
    const src = isAbsolute ? item.file : SHOT_DIR + item.file;
    const testImg = new Image();
    testImg.onload = () => {
      img.src = src;
      img.style.display = "";
    };
    testImg.onerror = () => {
      img.style.display = "none";
    };
    testImg.src = src;
    img.alt = item.label;
    cap.textContent = item.caption || item.label;
    box.classList.add("open");
    box.setAttribute("aria-hidden", "false");
  }

  function initLightbox() {
    const box = document.getElementById("lightbox");
    const close = () => {
      box.classList.remove("open");
      box.setAttribute("aria-hidden", "true");
    };
    document.getElementById("lightboxClose").addEventListener("click", close);
    box.addEventListener("click", (e) => {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ================= INIT ================= */
  if (!window.SIBYL_DATA) {
    document.body.innerHTML =
      '<div style="padding:60px;font-family:sans-serif;color:#EDE6D6;background:#0B1220;min-height:100vh;">' +
      '<h1 style="color:#C9A661;">Sibyl — content failed to load</h1>' +
      '<p><code>data.js</code> did not load before <code>script.js</code> ran. This almost always means:</p>' +
      '<ul style="line-height:1.8;">' +
      '<li>The file isn\'t actually sitting next to <code>index.html</code> (check the exact filename/case: <code>data.js</code>).</li>' +
      '<li>Serve the folder over a local server (e.g. <code>python3 -m http.server</code>, then visit <code>http://localhost:8000</code>) rather than double-clicking the file.</li>' +
      '<li>Open the browser console (F12) — the exact error there will confirm which file 404\u2019d.</li>' +
      "</ul></div>";
    console.error("SIBYL_DATA is undefined — data.js did not load, or loaded after script.js.");
    return;
  }

  document.title = D.meta.siteTitle;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", D.meta.description);

  function safe(name, fn) {
    try {
      fn();
    } catch (err) {
      console.error(`Sibyl site: "${name}" failed to render —`, err);
    }
  }

  safe("initTheme", initTheme);
  safe("renderNav", renderNav);
  safe("renderHero", renderHero);
  safe("renderPillars", renderPillars);
  safe("renderDifference", renderDifference);
  safe("renderFeatures", renderFeatures);
  safe("renderVow", renderVow);
  safe("renderDownload", renderDownload);
  safe("renderCreator", renderCreator);
  safe("renderFooter", renderFooter);

  safe("initHeaderScroll", initHeaderScroll);
  safe("initMobileMenu", initMobileMenu);
  safe("initScrollSpy", initScrollSpy);
  safe("initLightbox", initLightbox);
  safe("initRevealAnimations", initRevealAnimations);
})();
