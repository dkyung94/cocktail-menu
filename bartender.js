// ==========================================================================
// "Request Bartender" gag: fake call, then a modal telling you to go yourself.
// The text for each language lives in the UI object in menu.js.
// ==========================================================================
(function () {
  const button = document.getElementById("bartender-btn");
  const label = button.querySelector(".bartender-label");
  const dialog = document.getElementById("bartender-dialog");
  const closeButton = document.getElementById("bartender-close");

  const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  const SUSPENSE_MS = motionOK ? 1500 : 600; // how long "Calling the bartender…" shows

  const text = (key) => (UI[document.documentElement.lang] || UI.en)[key];

  button.addEventListener("click", () => {
    if (button.classList.contains("is-calling")) return;

    button.classList.add("is-calling");
    button.disabled = true;
    label.textContent = text("bartenderCalling");

    setTimeout(() => {
      button.classList.remove("is-calling");
      button.disabled = false;
      label.textContent = text("bartenderButton");
      dialog.showModal();
    }, SUSPENSE_MS);
  });

  closeButton.addEventListener("click", () => dialog.close());

  // Tapping the dimmed area outside the card also closes it.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
})();
