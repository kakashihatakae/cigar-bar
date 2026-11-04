(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* ---------- Element refs ---------- */

  const header = $("#siteHead");
  const progressBar = $(".progress span");
  const heroImg = $(".hero__media img");
  const floor = $("#floor");
  const floorLayers = $$(".floor__layer");
  const floorSteps = $$(".floor__step");
  const floorMeter = $$(".floor__meter span");
  const mobileNav = $("#mobileNav");
  const menuToggle = $("#menuToggle");
  const menuToggleLabel = menuToggle ? menuToggle.querySelector(".menu-toggle__label") : null;
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxCaption = $("#lightboxCaption");
  const galleryButtons = $$(".gallery__btn");

  /* ---------- Year + tonight ---------- */

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const NIGHTS = [
    { day: "Sun", label: "Sunday matinee", time: "5pm", tab: "sun" },
    { day: "Mon", label: null, time: null, tab: "tue" },
    { day: "Tue", label: "Rueda de casino", time: "7pm", tab: "tue" },
    { day: "Wed", label: "Tres, bolero, and a slow room", time: "8pm", tab: "wed" },
    { day: "Thu", label: "Salsa suave", time: "9pm", tab: "thu" },
    { day: "Fri", label: "Orquesta Caliente", time: "10pm", tab: "fri" },
    { day: "Sat", label: "La Clave Social", time: "9pm", tab: "sat" },
  ];
  const today = NIGHTS[new Date().getDay()];
  const tonightEl = $("#tonight");
  if (tonightEl) {
    tonightEl.textContent = today.label
      ? `Tonight — ${today.label} · ${today.time}`
      : "Closed tonight — back Tuesday · 7pm";
  }

  /* ---------- Chrome: header, progress ---------- */

  function updateChrome() {
    const y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 20);
    if (progressBar) {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      progressBar.style.transform = `scaleX(${clamp(y / max, 0, 1)})`;
    }
    if (heroImg && !reduced.matches) {
      heroImg.style.transform = `translate3d(0, ${Math.min(y * 0.08, 120)}px, 0) scale(1.02)`;
    }
  }

  /* ---------- Smooth wheel scrolling (desktop, motion allowed) ---------- */

  const smooth = { active: false, target: 0, current: 0, raf: 0 };

  function maxScroll() {
    return Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
  }

  function stopSmooth() {
    if (smooth.raf) cancelAnimationFrame(smooth.raf);
    smooth.raf = 0;
  }

  function smoothTick() {
    const diff = smooth.target - smooth.current;
    if (Math.abs(diff) < 0.5) {
      smooth.current = smooth.target;
      window.scrollTo(0, smooth.current);
      smooth.raf = 0;
      return;
    }
    smooth.current += diff * 0.17;
    window.scrollTo(0, smooth.current);
    smooth.raf = requestAnimationFrame(smoothTick);
  }

  function driveTo(y) {
    smooth.target = clamp(y, 0, maxScroll());
    if (!smooth.raf) smooth.raf = requestAnimationFrame(smoothTick);
  }

  function onWheel(e) {
    if (!smooth.active || e.ctrlKey || e.metaKey) return;
    if (document.body.classList.contains("is-locked")) return;
    if (lightbox && lightbox.open) return;
    if (e.target.closest("select, textarea, [data-native-scroll]")) return;

    const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    const delta = e.deltaY * scale;
    if (!delta) return;

    e.preventDefault();
    const max = maxScroll();
    smooth.target = clamp(smooth.target + delta, 0, max);
    if (!smooth.raf) smooth.raf = requestAnimationFrame(smoothTick);
  }

  function setupSmooth() {
    if (reduced.matches || !finePointer.matches) return;
    smooth.active = true;
    smooth.target = smooth.current = window.scrollY;
    window.addEventListener("wheel", onWheel, { passive: false });
    reduced.addEventListener("change", () => {
      if (reduced.matches) {
        smooth.active = false;
        stopSmooth();
      }
    });
  }

  /* ---------- Anchor navigation ---------- */

  function scrollToSection(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0);
    if (smooth.active) {
      driveTo(top);
    } else {
      window.scrollTo({ top, behavior: reduced.matches ? "auto" : "smooth" });
    }
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    if (!document.querySelector(hash)) return;

    e.preventDefault();
    closeMobileNav();
    if (history.pushState) history.pushState(null, "", hash);
    scrollToSection(hash);
    if (link.classList.contains("skip")) {
      const target = document.querySelector(hash);
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    }
  });

  /* ---------- Mobile navigation ---------- */

  function openMobileNav() {
    if (!mobileNav || !menuToggle) return;
    mobileNav.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    if (menuToggleLabel) menuToggleLabel.textContent = "Close";
    document.body.classList.add("is-locked");
    const firstLink = mobileNav.querySelector("a");
    if (firstLink) firstLink.focus({ preventScroll: true });
  }

  function closeMobileNav() {
    if (!mobileNav || !menuToggle || mobileNav.hidden) return;
    mobileNav.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    if (menuToggleLabel) menuToggleLabel.textContent = "Menu";
    document.body.classList.remove("is-locked");
    menuToggle.focus({ preventScroll: true });
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      if (mobileNav.hidden) openMobileNav();
      else closeMobileNav();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav && !mobileNav.hidden) {
      closeMobileNav();
      return;
    }
    if (e.key === "Tab" && mobileNav && !mobileNav.hidden) {
      const focusables = [...mobileNav.querySelectorAll("a, button")];
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && mobileNav && !mobileNav.hidden) {
      mobileNav.hidden = true;
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      if (menuToggleLabel) menuToggleLabel.textContent = "Menu";
      document.body.classList.remove("is-locked");
    }
  });

  /* ---------- Scroll spy ---------- */

  const navLinks = $$(".site-nav a");
  const sections = navLinks
    .filter((link) => (link.getAttribute("href") || "").startsWith("#"))
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- Reveals ---------- */

  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduced.matches) {
    revealEls.forEach((el, i) => {
      el.style.setProperty("--reveal-delay", `${(i % 3) * 40}ms`);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Pinned floor ---------- */

  function updateFloor() {
    if (!floor || reduced.matches) return;
    const rect = floor.getBoundingClientRect();
    const total = floor.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    const progress = clamp(-rect.top / total, 0, 1);
    const step = progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2;

    floorLayers.forEach((layer, i) => layer.classList.toggle("is-active", i === step));
    floorSteps.forEach((el, i) => el.classList.toggle("is-active", i === step));
    floorMeter.forEach((el, i) => el.classList.toggle("is-on", i <= step));
  }

  /* ---------- Booking tiles ---------- */

  function initBookTiles() {
    const tiles = $$(".book-tile");
    if (!tiles.length) return;

    function setTile(tile, open, returnFocus) {
      tile.classList.toggle("is-open", open);
      if (open) tile.classList.remove("is-dismissed");
      else tile.classList.add("is-dismissed");
      const trigger = $(".book-tile__trigger", tile);
      const title = $(".book-tile__detail h3", tile);
      if (trigger) {
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
        if (title) {
          const name = title.textContent.trim();
          trigger.setAttribute("aria-label", `${open ? "Hide" : "Show"} details for ${name}`);
        }
      }
      if (open) {
        tiles.forEach((other) => {
          if (other !== tile && other.classList.contains("is-open")) setTile(other, false, false);
        });
      } else if (returnFocus && trigger) {
        trigger.focus();
      }
    }

    tiles.forEach((tile) => {
      const trigger = $(".book-tile__trigger", tile);
      const close = $(".book-tile__close", tile);
      tile.addEventListener("pointerenter", () => tile.classList.remove("is-dismissed"));
      if (trigger) {
        trigger.addEventListener("click", () => {
          setTile(tile, !tile.classList.contains("is-open"), false);
        });
      }
      if (close) {
        close.addEventListener("click", (event) => {
          event.stopPropagation();
          setTile(tile, false, true);
        });
      }
    });

    document.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".book-tile")) return;
      tiles.forEach((tile) => {
        if (tile.classList.contains("is-open")) setTile(tile, false, false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const open = tiles.find((tile) => tile.classList.contains("is-open"));
      if (open) setTile(open, false, true);
    });
  }

  /* ---------- Scroll handler ---------- */

  let scrollQueued = false;
  window.addEventListener(
    "scroll",
    () => {
      if (smooth.active && !smooth.raf) {
        smooth.target = smooth.current = window.scrollY;
      }
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        scrollQueued = false;
        updateChrome();
        updateFloor();
      });
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    if (!smooth.active) return;
    stopSmooth();
    smooth.target = smooth.current = window.scrollY;
  });

  /* ---------- Tabs ---------- */

  function initTabs(tabSel, panelSel, onChange) {
    const tabs = $$(tabSel);
    if (!tabs.length) return;

    const activate = (tab, moveFocus) => {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.setAttribute("aria-selected", String(selected));
        t.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
      });
      if (moveFocus) tab.focus();
      if (onChange) onChange(tab);
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(tab, false));
      tab.addEventListener("keydown", (e) => {
        const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
        if (!keys.includes(e.key)) return;
        e.preventDefault();
        let next = i;
        if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = tabs.length - 1;
        activate(tabs[next], true);
      });
    });

    return { activate, tabs };
  }

  const menuTabs = initTabs(".menu-tab", ".menu__panel");

  /* ---------- Calendar ---------- */

  const calList = $("#calList");
  const calCount = $("#calCount");
  const calStatus = $("#calStatus");

  const CAL_EVENTS = [
    {
      id: "rueda",
      weekday: 2,
      start: "19:00",
      hours: 6,
      title: "Rueda de casino",
      type: "Class + social",
      room: "Main floor",
      cover: "$10",
      image: { src: "assets/img/floor-couple.jpg", width: 1200, height: 1800, alt: "A couple dancing in a close hold on the floor" },
      desc: "A circle, a caller, and no partner required. Teachers stay on the floor until it clicks.",
    },
    {
      id: "son-bolero",
      weekday: 3,
      start: "20:00",
      hours: 4,
      title: "Tres y bolero",
      type: "Live music",
      room: "Bar room",
      cover: "$8",
      image: { src: "assets/img/band.jpg", width: 1800, height: 1199, alt: "Guitarists and percussionists playing together" },
      desc: "A trio in the corner, a short first set, and enough space to talk between songs.",
    },
    {
      id: "salsa-suave",
      weekday: 4,
      start: "21:00",
      hours: 4,
      title: "Salsa suave · DJ Marisol",
      type: "DJ set",
      room: "Main floor",
      cover: "$10",
      image: { src: "assets/img/floor-dip.jpg", width: 1200, height: 1800, alt: "A couple in a dramatic dip against a grey wall" },
      desc: "The slow end of the crate: salsa, bachata, and one merengue at midnight to wake the room up.",
    },
    {
      id: "orquesta",
      weekday: 5,
      start: "22:00",
      hours: 4,
      title: "Orquesta Caliente",
      type: "Live music",
      room: "Main floor",
      cover: "$15",
      image: { src: "assets/img/gallery-live.jpg", width: 1800, height: 1199, alt: "A couple dancing in front of a live band" },
      desc: "Nine pieces, two sets, and horns that arrive before you see them.",
    },
    {
      id: "la-clave-social",
      weekday: 6,
      start: "21:00",
      hours: 5,
      title: "La Clave Social",
      type: "Social",
      room: "Whole room",
      cover: "$12",
      image: { src: "assets/img/gallery-havana.jpg", width: 1800, height: 1350, alt: "A couple dancing in a room with a live band behind them" },
      desc: "DJ until eleven, a set from the house team, then the floor stays packed until close.",
    },
    {
      id: "matinee",
      weekday: 0,
      start: "17:00",
      hours: 6,
      title: "Sunday matinee",
      type: "Class + social",
      room: "Main floor",
      cover: "$8",
      image: { src: "assets/img/hero-dance.jpg", width: 1800, height: 1200, alt: "Dancers on the floor at Cigar Bar" },
      desc: "Class at five, social at six, roast in the kitchen until it runs out.",
    },
    {
      id: "son-release",
      inDays: 9,
      start: "21:00",
      hours: 3,
      title: "Son de la Casa — record release",
      type: "Live music",
      room: "Main floor",
      cover: "$15",
      image: { src: "assets/img/band.jpg", width: 1800, height: 1199, alt: "Guitarists and percussionists playing together" },
      desc: "The house trio plays the new record front to back, then hands the floor to DJ Marisol.",
    },
    {
      id: "timba-night",
      inDays: 17,
      start: "20:00",
      hours: 5,
      title: "Timba night with DJ Yema",
      type: "DJ set",
      room: "Main floor",
      cover: "$12",
      image: { src: "assets/img/floor-dip.jpg", width: 1200, height: 1800, alt: "A couple in a dramatic dip against a grey wall" },
      desc: "A guest set from Havana: timba, songo, and no slow songs until the room asks for one.",
    },
    {
      id: "bootcamp",
      inDays: 24,
      start: "19:00",
      hours: 2,
      title: "Beginner bootcamp · week one",
      type: "Workshop",
      room: "Studio",
      cover: "$40",
      image: { src: "assets/img/floor-shoes.jpg", width: 1800, height: 1200, alt: "Close-up of dance shoes on a wooden floor" },
      desc: "Four sessions from the first count. No partner needed; sign up for the full course.",
    },
    {
      id: "lechon",
      inDays: 38,
      start: "18:00",
      hours: 4,
      title: "Noche de cocina: lechón",
      type: "Kitchen takeover",
      room: "Whole room",
      cover: "$45",
      image: { src: "assets/img/tapas.jpg", width: 1200, height: 1800, alt: "Tapas plates and a glass of sangria on a wooden table" },
      desc: "One long table, a whole roast, and the band playing after the plates are cleared.",
    },
  ];

  const pad2 = (n) => String(n).padStart(2, "0");
  const atTime = (date, hhmm) => {
    const d = new Date(date);
    const [h, m] = hhmm.split(":").map(Number);
    d.setHours(h, m, 0, 0);
    return d;
  };
  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };
  const fmtClock = (d) => {
    const h = d.getHours();
    const m = d.getMinutes();
    const suffix = h >= 12 ? "pm" : "am";
    return m ? `${h % 12 || 12}:${pad2(m)}${suffix}` : `${h % 12 || 12}${suffix}`;
  };
  const BOOK_SLOTS = { 18: "6:00pm", 19: "7:00pm", 20: "8:00pm", 21: "9:00pm", 22: "10:00pm" };

  function resolveStart(ev) {
    const now = new Date();
    if (typeof ev.weekday === "number") {
      const delta = (ev.weekday - now.getDay() + 7) % 7;
      let start = atTime(addDays(now, delta), ev.start);
      if (start <= now) start = atTime(addDays(now, delta + 7), ev.start);
      return start;
    }
    return atTime(addDays(now, ev.inDays), ev.start);
  }

  const MONTH_FMT = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
  const DOW_FMT = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const MON_FMT = new Intl.DateTimeFormat("en-US", { month: "short" });

  function prefillBooking(dateValue, timeValue) {
    const form = $("#bookForm");
    const done = $("#bookDone");
    if (form && form.hidden) {
      form.reset();
      form.hidden = false;
      if (done) done.hidden = true;
    }

    const dateField = $("#date");
    const timeField = $("#time");
    if (dateField && dateValue) {
      dateField.value = dateValue;
      dateField.removeAttribute("aria-invalid");
    }
    if (timeField && timeValue) {
      const hasSlot = [...timeField.options].some((option) => option.value === timeValue);
      if (hasSlot) timeField.value = timeValue;
      timeField.removeAttribute("aria-invalid");
    }
    ["date-error", "time-error"].forEach((id) => {
      const err = document.getElementById(id);
      if (err) err.hidden = true;
    });
  }

  function prefillFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const dateValue = params.get("date");
    if (!dateValue || !/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return;
    prefillBooking(dateValue, params.get("time") || "");
  }

  const icsEscape = (value) =>
    String(value).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

  const icsLocal = (date) =>
    `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}T${pad2(date.getHours())}${pad2(date.getMinutes())}00`;

  function downloadIcs(ev, trigger) {
    const stamp = `${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Cigar Bar//Programme//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:cigar-bar-${ev.id}-${icsLocal(ev.start)}@cigarbar.example`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${icsLocal(ev.start)}`,
      `DTEND:${icsLocal(ev.end)}`,
      `SUMMARY:${icsEscape(`Cigar Bar — ${ev.title}`)}`,
      `LOCATION:${icsEscape("Cigar Bar, Calle 8 #214, Centro")}`,
      `DESCRIPTION:${icsEscape(`${ev.desc} ${ev.type}. Cover ${ev.cover}. Doors one hour before.`)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ];

    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cigar-bar-${ev.id}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    const label = trigger ? trigger.querySelector(".cal-ics__label") : null;
    if (label) {
      const original = label.textContent;
      label.textContent = "Calendar file saved";
      window.setTimeout(() => {
        label.textContent = original;
      }, 3000);
    }
    if (calStatus) {
      calStatus.textContent = `Downloaded ${ev.title}. Open the file to add it to your calendar.`;
      window.setTimeout(() => {
        calStatus.textContent = "";
      }, 5000);
    }
  }

  function renderCalendar() {
    if (!calList) return;

    const items = CAL_EVENTS.map((ev) => {
      const start = resolveStart(ev);
      return { ...ev, start, end: new Date(start.getTime() + ev.hours * 3600000) };
    }).sort((a, b) => a.start - b.start);

    calList.textContent = "";

    const groups = new Map();
    items.forEach((ev) => {
      const key = `${ev.start.getFullYear()}-${ev.start.getMonth()}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(ev);
    });

    let position = 0;
    groups.forEach((group, key) => {
      const month = document.createElement("section");
      month.className = "cal-month";
      month.setAttribute("aria-labelledby", `cal-month-${key}`);

      const heading = document.createElement("h3");
      heading.className = "cal-month__label";
      heading.id = `cal-month-${key}`;
      heading.textContent = MONTH_FMT.format(group[0].start);
      month.appendChild(heading);

      const list = document.createElement("ol");
      list.className = "cal-list";

      group.forEach((ev) => {
        const isNext = position === 0;
        const isoDay = `${ev.start.getFullYear()}-${pad2(ev.start.getMonth() + 1)}-${pad2(ev.start.getDate())}`;
        const bookSlot = BOOK_SLOTS[ev.start.getHours()] || "";
        const reserveHref = `index.html?date=${isoDay}${bookSlot ? `&amp;time=${encodeURIComponent(bookSlot)}` : ""}#visit`;
        const li = document.createElement("li");
        li.className = `cal-item${isNext ? " is-next" : ""}`;
        li.innerHTML = `
          <time class="cal-date" datetime="${isoDay}">
            <span class="cal-date__dow">${DOW_FMT.format(ev.start)}</span>
            <span class="cal-date__day">${pad2(ev.start.getDate())}</span>
            <span class="cal-date__mon">${MON_FMT.format(ev.start)}</span>
          </time>
          <div class="cal-item__media">
            <img class="cal-item__image" src="${ev.image.src}" width="${ev.image.width}" height="${ev.image.height}" alt="${ev.image.alt}" loading="lazy" decoding="async">
          </div>
          <div class="cal-item__body">
            <div class="cal-item__tags">
              ${isNext ? '<span class="cal-badge">Next up</span>' : ""}
              <span class="cal-tag">${ev.type}</span>
            </div>
            <h4 class="cal-item__title">${ev.title}</h4>
            <p class="cal-item__desc">${ev.desc}</p>
            <p class="cal-item__meta">
              <span class="od-nowrap">${fmtClock(ev.start)}–${fmtClock(ev.end)}</span>
              <span class="dot" aria-hidden="true">·</span>
              <span>${ev.room}</span>
            </p>
          </div>
          <div class="cal-item__actions">
            <span class="cal-item__cover od-nowrap">${ev.cover}</span>
            <a class="cal-link cal-book" href="${reserveHref}">Reserve
              <svg viewBox="0 0 24 24" class="od-icon" style="--od-icon-size:15px" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
            <button class="cal-ics" type="button">
              <svg viewBox="0 0 24 24" class="od-icon" style="--od-icon-size:16px" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4M12 12.5v4M10 14.5h4"/></svg>
              <span class="cal-ics__label">Add to calendar</span>
            </button>
          </div>`;

        const ics = li.querySelector(".cal-ics");
        if (ics) {
          ics.setAttribute("aria-label", `Add ${ev.title} to your calendar`);
          ics.addEventListener("click", () => downloadIcs(ev, ics));
        }

        list.appendChild(li);
        position += 1;
      });

      month.appendChild(list);
      calList.appendChild(month);
    });

    if (calCount && items.length) {
      const next = items[0];
      calCount.innerHTML = `${items.length} upcoming events <span class="dot">·</span> next up <strong>${DOW_FMT.format(next.start)} ${MON_FMT.format(next.start)} ${next.start.getDate()}</strong>`;
    }
  }

  renderCalendar();

  /* ---------- Lightbox ---------- */

  let lightboxIndex = 0;
  let lastFocus = null;

  function paintLightbox(index) {
    const btn = galleryButtons[index];
    if (!btn) return;
    lightboxIndex = index;
    lightboxImg.src = btn.dataset.full;
    lightboxImg.alt = btn.dataset.alt || "";
    lightboxCaption.textContent = btn.dataset.caption || "";
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    lastFocus = document.activeElement;
    paintLightbox(index);
    lightbox.showModal();
    document.body.classList.add("is-locked");
    const closeBtn = $("#lightboxClose");
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.open) return;
    lightbox.close();
  }

  galleryButtons.forEach((btn, i) => {
    btn.addEventListener("click", () => openLightbox(i));
  });

  if (lightbox) {
    lightbox.addEventListener("close", () => {
      document.body.classList.remove("is-locked");
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("keydown", (e) => {
      if (!galleryButtons.length) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        paintLightbox((lightboxIndex + 1) % galleryButtons.length);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        paintLightbox((lightboxIndex - 1 + galleryButtons.length) % galleryButtons.length);
      }
    });

    const closeBtn = $("#lightboxClose");
    const prevBtn = $("#lightboxPrev");
    const nextBtn = $("#lightboxNext");
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (prevBtn) prevBtn.addEventListener("click", () => paintLightbox((lightboxIndex - 1 + galleryButtons.length) % galleryButtons.length));
    if (nextBtn) nextBtn.addEventListener("click", () => paintLightbox((lightboxIndex + 1) % galleryButtons.length));
  }

  /* ---------- Reservation form ---------- */

  const bookForm = $("#bookForm");
  const bookDone = $("#bookDone");
  const bookSummary = $("#bookSummary");
  const dateInput = $("#date");

  if (dateInput) {
    const now = new Date();
    const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    dateInput.min = iso;
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function fieldError(field, message) {
    const err = document.getElementById(`${field.id}-error`);
    if (!err) return;
    if (message) {
      err.textContent = message;
      err.hidden = false;
      field.setAttribute("aria-invalid", "true");
    } else {
      err.hidden = true;
      field.removeAttribute("aria-invalid");
    }
  }

  function validateBookField(field) {
    const value = field.value.trim();
    if (!value) {
      fieldError(field, "This field is needed.");
      return false;
    }
    if (field.id === "email" && !EMAIL_RE.test(value)) {
      fieldError(field, "That email does not look right — check for a typo.");
      return false;
    }
    if (field.id === "date") {
      const chosen = new Date(`${value}T12:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (chosen < today) {
        fieldError(field, "Pick today or a date still to come.");
        return false;
      }
    }
    fieldError(field, "");
    return true;
  }

  if (bookForm) {
    const fields = ["name", "email", "date", "time", "guests"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const summary = $("#bookErrors");
    const summaryList = summary ? summary.querySelector("ul") : null;

    function labelFor(field) {
      const label = bookForm.querySelector(`label[for="${field.id}"]`);
      if (!label) return field.id;
      return label.textContent.replace("Optional", "").trim();
    }

    function showSummary(invalid) {
      if (!summary || !summaryList) return;
      summaryList.innerHTML = "";
      invalid.forEach((field) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = labelFor(field);
        btn.addEventListener("click", () => field.focus());
        li.appendChild(btn);
        summaryList.appendChild(li);
      });
      summary.hidden = invalid.length === 0;
    }

    fields.forEach((field) => {
      field.addEventListener("blur", () => validateBookField(field));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") validateBookField(field);
      });
      field.addEventListener("change", () => {
        if (field.getAttribute("aria-invalid") === "true") validateBookField(field);
      });
    });

    bookForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const invalid = [];
      fields.forEach((field) => {
        if (!validateBookField(field)) invalid.push(field);
      });
      if (invalid.length) {
        showSummary(invalid);
        if (summary) summary.focus();
        else invalid[0].focus();
        return;
      }
      showSummary([]);

      const name = $("#name").value.trim();
      const date = $("#date").value;
      const time = $("#time").value;
      const guests = $("#guests").value;
      const submit = bookForm.querySelector(".form__submit");
      const label = bookForm.querySelector(".form__submitLabel");
      const status = bookForm.querySelector(".form__status");

      bookForm.classList.add("is-busy");
      if (submit) submit.disabled = true;
      if (label) label.textContent = "Checking availability…";
      if (status) status.textContent = "One moment — we are looking for a table.";

      window.setTimeout(() => {
        bookForm.classList.remove("is-busy");
        if (submit) submit.disabled = false;
        if (label) label.textContent = "Request a table";
        if (status) status.textContent = "";

        const pretty = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });
        if (bookSummary) {
          bookSummary.textContent = `${pretty} at ${time} — a table for ${guests}. We'll email ${$("#email").value.trim()} to confirm, ${name.split(" ")[0]}.`;
        }
        bookForm.hidden = true;
        if (bookDone) {
          bookDone.hidden = false;
          const again = $("#bookAgain");
          if (again) again.focus();
        }
      }, 1000);
    });

    const bookAgain = $("#bookAgain");
    if (bookAgain) {
      bookAgain.addEventListener("click", () => {
        bookForm.reset();
        bookDone.hidden = true;
        bookForm.hidden = false;
        fields.forEach((field) => fieldError(field, ""));
        showSummary([]);
        const first = $("#name");
        if (first) first.focus();
      });
    }
  }

  /* ---------- Newsletter ---------- */

  const newsForm = $("#newsForm");
  if (newsForm) {
    const email = $("#newsEmail");
    const err = $("#news-error");
    const status = $(".news__status");

    function validateNews() {
      const value = email.value.trim();
      if (!EMAIL_RE.test(value)) {
        if (err) {
          err.textContent = "Add a valid email and we'll put you on the list.";
          err.hidden = false;
        }
        email.setAttribute("aria-invalid", "true");
        return false;
      }
      if (err) err.hidden = true;
      email.removeAttribute("aria-invalid");
      return true;
    }

    email.addEventListener("blur", validateNews);
    newsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateNews()) {
        email.focus();
        return;
      }
      if (status) status.textContent = "You're on the list. One email, Sundays.";
      newsForm.reset();
    });
  }

  /* ---------- Init ---------- */

  setupSmooth();
  updateChrome();
  updateFloor();
  initBookTiles();
  prefillFromUrl();

  window.addEventListener("load", () => {
    updateChrome();
    updateFloor();
  });

  if (reduced) {
    reduced.addEventListener("change", () => {
      if (reduced.matches) {
        stopSmooth();
        smooth.active = false;
        if (heroImg) heroImg.style.transform = "none";
        floorSteps.forEach((el) => el.classList.add("is-active"));
      }
    });
  }
})();
