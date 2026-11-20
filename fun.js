// ==========================================================================
// Fun extras:
//   1. "Can't decide?" → slot-machine pick of a random drink
//   2. Soju-meter → "+1 🍶" on each drink, a running count, silly milestones
//      (saved on each guest's own phone only; resets after 12 hours)
//   3. Fortune soju cap → twist it for a random fortune
// Text for each language lives in the UI object in menu.js.
// ==========================================================================
(function () {
  const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  const lang = () => (UI[document.documentElement.lang] ? document.documentElement.lang : "en");
  const text = (key) => UI[lang()][key];
  const fill = (key, n) => text(key).replace("{n}", n);
  const $ = (id) => document.getElementById(id);
  const randomItem = (list) => list[Math.floor(Math.random() * list.length)];
  const leaves = (count, spread) => window.menuEffects?.dropLeaves(count, spread);

  /** Restart a one-shot CSS animation class on an element. */
  function replay(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth; // force a reflow so the animation starts again
    el.classList.add(cls);
  }

  function closeOnBackdrop(dialog, close = () => dialog.close()) {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) close();
    });
  }

  /** The drink's name, without its tag pill. */
  const drinkName = (drink) => drink.querySelector(".drink-name").firstChild.textContent.trim();

  // ---- Toast (little message at the bottom) --------------------------------
  const toastEl = $("fun-toast");
  let toastTimer;
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-shown"), 2600);
  }

  // ---- 1. "Can't decide?" ----------------------------------------------------
  const pickBtn = $("pick-btn");
  let spinning = false;
  let pickedTimer;

  pickBtn.addEventListener("click", () => {
    const drinks = [...document.querySelectorAll(".drink")];
    if (spinning || drinks.length === 0) return;
    spinning = true;
    pickBtn.classList.add("is-spinning");
    clearTimeout(pickedTimer);
    drinks.forEach((d) => {
      d.classList.add("is-visible"); // never leave a drink hidden by the scroll-reveal
      d.classList.remove("is-picked", "is-picking");
    });

    const winner = Math.floor(Math.random() * drinks.length);
    const steps = motionOK ? 14 : 0;
    let current = -1;
    let step = 0;

    function tick() {
      drinks[current]?.classList.remove("is-picking");
      if (step === steps) return land(winner);
      // Flash a different drink each step, slowing down like a slot machine.
      const previous = current;
      do current = Math.floor(Math.random() * drinks.length);
      while (drinks.length > 1 && current === previous);
      drinks[current].classList.add("is-picking");
      pickBtn.textContent = `🎲 ${drinkName(drinks[current])}`;
      step++;
      setTimeout(tick, 70 + 190 * (step / steps) ** 2);
    }
    tick();
  });

  function land(index) {
    // Re-query in case the language was switched mid-spin (the menu re-renders).
    const drink = document.querySelectorAll(".drink")[index];
    spinning = false;
    pickBtn.classList.remove("is-spinning");
    pickBtn.textContent = text("pickButton");
    if (!drink) return;
    drink.classList.add("is-visible", "is-picked");
    drink.scrollIntoView({ behavior: motionOK ? "smooth" : "auto", block: "center" });
    toast(`${drinkName(drink)} · ${randomItem(text("pickLines"))}`);
    pickedTimer = setTimeout(() => drink.classList.remove("is-picked"), 4500);
  }

  // ---- 2. Soju-meter --------------------------------------------------------
  const METER_KEY = "soju-meter";
  const RESET_AFTER_MS = 12 * 60 * 60 * 1000; // next party starts fresh
  const badge = $("meter-badge");
  const badgeCount = $("meter-count");
  const meterDialog = $("meter-dialog");

  function loadMeter() {
    try {
      const saved = JSON.parse(localStorage.getItem(METER_KEY));
      if (saved && Number.isFinite(saved.count) && Date.now() - saved.startedAt < RESET_AFTER_MS) {
        return saved;
      }
    } catch (e) {
      /* storage blocked or bad data: start over */
    }
    return { count: 0, startedAt: Date.now() };
  }

  const meter = loadMeter();

  function setCount(n) {
    if (meter.count === 0 && n > 0) meter.startedAt = Date.now();
    meter.count = Math.max(0, n);
    try {
      localStorage.setItem(METER_KEY, JSON.stringify(meter));
    } catch (e) {
      /* storage blocked: still counts for this visit */
    }
    updateBadge();
  }

  function updateBadge() {
    badge.hidden = meter.count === 0;
    badgeCount.textContent = meter.count;
    badge.setAttribute("aria-label", fill("meterCount", meter.count));
    document.body.classList.toggle("has-meter", meter.count > 0);
  }

  /** Latest milestone line reached so far (for the meter dialog). */
  function currentMilestone() {
    const milestones = text("meterMilestones");
    const reached = Object.keys(milestones).map(Number).filter((k) => k <= meter.count);
    return reached.length ? milestones[Math.max(...reached)] : text("meterZero");
  }

  function addSipButtons() {
    document.querySelectorAll(".drink").forEach((drink) => {
      const body = drink.querySelector(".drink-body");
      if (!body || body.querySelector(".sip-btn")) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sip-btn";
      btn.textContent = "+1 🍶";
      btn.setAttribute("aria-label", `${text("sipLabel")}: ${drinkName(drink)}`);
      btn.addEventListener("click", () => {
        setCount(meter.count + 1);
        replay(btn, "is-clinked");
        replay(badge, "is-bumped");
        const milestone = text("meterMilestones")[meter.count];
        if (milestone) leaves(8, 1);
        toast(milestone || `+1 · ${fill("meterCount", meter.count)}`);
      });
      body.appendChild(btn);
    });
    updateBadge(); // refresh its label in the current language
  }

  function showMeter() {
    $("meter-title").textContent = fill("meterCount", meter.count);
    $("meter-line").textContent = currentMilestone();
    $("meter-undo").disabled = meter.count === 0;
  }

  badge.addEventListener("click", () => {
    showMeter();
    meterDialog.showModal();
  });
  $("meter-undo").addEventListener("click", () => {
    setCount(meter.count - 1);
    showMeter();
  });
  $("meter-close").addEventListener("click", () => meterDialog.close());
  closeOnBackdrop(meterDialog);

  addSipButtons();
  // menu.js re-renders the drinks when the language is switched.
  document.addEventListener("menu:rendered", addSipButtons);

  // ---- 3. Fortune soju cap ---------------------------------------------------
  const fortuneBtn = $("fortune-btn");
  const fortuneDialog = $("fortune-dialog");
  const fortuneText = $("fortune-text");
  let lastFortune = -1;

  function nextFortune() {
    const list = text("fortunes");
    let i;
    do i = Math.floor(Math.random() * list.length);
    while (list.length > 1 && i === lastFortune);
    lastFortune = i;
    fortuneText.textContent = list[i];
    replay(fortuneText, "is-new");
  }

  fortuneBtn.addEventListener("click", () => {
    if (fortuneBtn.classList.contains("is-twisting")) return;
    fortuneBtn.classList.add("is-twisting");
    setTimeout(() => {
      fortuneBtn.classList.remove("is-twisting");
      nextFortune();
      fortuneDialog.showModal();
    }, motionOK ? 650 : 0);
  });

  function closeFortune() {
    fortuneDialog.close();
    leaves(12, 1);
  }
  $("fortune-again").addEventListener("click", nextFortune);
  $("fortune-close").addEventListener("click", closeFortune);
  closeOnBackdrop(fortuneDialog, closeFortune);
})();
