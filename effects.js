// ==========================================================================
// Fun stuff: scroll-in animations + falling leaves.
// Everything here is skipped for guests whose phone has "Reduce Motion" on.
// Tweak the numbers in SETTINGS to change how many leaves fall and how often.
// ==========================================================================
(function () {
  const SETTINGS = {
    leavesOnOpen: 22,        // leaves when the menu is first opened
    leavesOnOverscroll: 14,  // leaves when someone tries to scroll past the end
    overscrollCooldownMs: 3500,
    maxLeavesOnScreen: 40,
  };

  const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  if (!motionOK) return;

  // ---- Reveal drinks and footer as they scroll into view ------------------
  // Anything whose top is above ~92% of the screen gets revealed, including
  // things already scrolled past, so a fast flick can never leave a drink hidden.
  let pending = new Set();
  document.documentElement.classList.add("anim-ready");

  function revealInView() {
    const cutoff = window.innerHeight * 0.92;
    let i = 0;
    for (const el of pending) {
      if (el.getBoundingClientRect().top < cutoff) {
        // Items that appear together come in one after another.
        el.style.setProperty("--reveal-delay", `${i++ * 110}ms`);
        el.classList.add("is-visible");
        pending.delete(el);
      }
    }
    if (pending.size === 0) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      revealInView();
    });
  }

  function trackReveal() {
    pending = new Set(document.querySelectorAll(".drink:not(.is-visible), .site-footer:not(.is-visible)"));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    revealInView();
  }

  trackReveal();
  // menu.js re-renders the drinks when the language is switched.
  document.addEventListener("menu:rendered", trackReveal);

  // ---- Falling leaves ------------------------------------------------------
  const LEAF_SHAPES = [
    // maple
    `<svg viewBox="0 0 24 24"><path fill="currentColor" stroke="currentColor" stroke-width="0.8" stroke-linejoin="round"
      d="M12 1 13.6 5.6 17 4.2 16 8.6 21.5 8 19 11.6 22 13 16.6 15.4 17.4 18 12.8 16.8 12.8 22.5 11.2 22.5 11.2 16.8 6.6 18 7.4 15.4 2 13 5 11.6 2.5 8 8 8.6 7 4.2 10.4 5.6Z"/></svg>`,
    // simple oval leaf with a vein
    `<svg viewBox="0 0 24 24"><path fill="currentColor"
      d="M12 2C17 5 20 10 18 15c-1.4 3.5-4 5.5-6 7-2-1.5-4.6-3.5-6-7C4 10 7 5 12 2z"/>
      <path d="M12 6v17" stroke="var(--color-bg)" stroke-opacity="0.45" stroke-width="1.1" stroke-linecap="round"/></svg>`,
  ];

  const layer = document.createElement("div");
  layer.className = "leaf-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  function dropLeaves(count, spreadSeconds) {
    const room = SETTINGS.maxLeavesOnScreen - layer.childElementCount;
    for (let n = 0; n < Math.min(count, room); n++) {
      const leaf = document.createElement("span");
      leaf.className = "leaf";
      leaf.innerHTML = pick(LEAF_SHAPES);
      const s = leaf.style;
      s.setProperty("--x", `${rand(-4, 98)}vw`);
      s.setProperty("--size", `${rand(16, 30).toFixed(1)}px`);
      s.setProperty("--dur", `${rand(5.5, 9).toFixed(2)}s`);
      s.setProperty("--delay", `${rand(0, spreadSeconds).toFixed(2)}s`);
      s.setProperty("--sway", `${rand(15, 45).toFixed(0)}px`);
      s.setProperty("--spin", `${rand(-200, 200).toFixed(0)}deg`);
      s.color = `var(--leaf-${1 + Math.floor(Math.random() * 4)})`;
      leaf.addEventListener("animationend", (e) => {
        if (e.target === leaf) leaf.remove();
      });
      layer.appendChild(leaf);
    }
  }

  // First open (once per visit; reloading the same tab won't replay it).
  let alreadyShown = false;
  try {
    alreadyShown = sessionStorage.getItem("leaves-shown") === "1";
    sessionStorage.setItem("leaves-shown", "1");
  } catch (e) {
    /* storage blocked (e.g. private mode): just show the leaves */
  }
  if (!alreadyShown) setTimeout(() => dropLeaves(SETTINGS.leavesOnOpen, 3), 400);

  // Trying to scroll past the end of the menu.
  let lastBurst = 0;
  const atBottom = () =>
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

  function overscrollBurst() {
    const now = Date.now();
    if (now - lastBurst < SETTINGS.overscrollCooldownMs) return;
    lastBurst = now;
    dropLeaves(SETTINGS.leavesOnOverscroll, 1.5);
  }

  // Phones: a swipe up (scrolling down) while already at the bottom.
  let touchStartY = null;
  window.addEventListener("touchstart", (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (touchStartY === null) return;
    if (touchStartY - e.touches[0].clientY > 40 && atBottom()) {
      overscrollBurst();
      touchStartY = null;
    }
  }, { passive: true });
  window.addEventListener("touchend", () => { touchStartY = null; }, { passive: true });

  // Laptops: scroll wheel / trackpad down while at the bottom.
  window.addEventListener("wheel", (e) => {
    if (e.deltaY > 0 && atBottom()) overscrollBurst();
  }, { passive: true });
})();
