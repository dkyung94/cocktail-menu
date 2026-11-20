// ==========================================================================
// Fun extras:
//   1. "Can't decide?" → slot-machine pick of a random drink
//   2. Fortune soju cap → twist it for a random fortune
// Text for each language lives in the UI object in menu.js.
// ==========================================================================
(function () {
  const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  const lang = () => (UI[document.documentElement.lang] ? document.documentElement.lang : "en");
  const text = (key) => UI[lang()][key];
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

  // ---- 2. Fortune soju cap ---------------------------------------------------
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
