// ==========================================================================
// Footer pranks:
//   1. "Request Bartender" → fake call → "Go up yourself :)"
//   2. "Pay Tab" → a very official receipt → fake payment → "jk"
// Text for each language lives in the UI object in menu.js.
// ==========================================================================
(function () {
  // The prank tab. Prices in dollars; `food: true` items also get food tax.
  const TAB = {
    items: [
      { key: "itemBartender", price: 500 },
      { key: "itemCocktails", price: 100 },
      { key: "itemStew", price: 40, food: true },
    ],
    salesTaxRate: 0.08875,
    foodTaxRate: 0.03,
    gratuityRate: 0.2,
  };

  const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  const lang = () => (UI[document.documentElement.lang] ? document.documentElement.lang : "en");
  const text = (key) => UI[lang()][key];
  const $ = (id) => document.getElementById(id);

  /** Close a modal when the dimmed area around it is tapped. */
  function closeOnBackdrop(dialog, close = () => dialog.close()) {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) close();
    });
  }

  // ---- 1. Request Bartender ------------------------------------------------
  const bartenderBtn = $("bartender-btn");
  const bartenderLabel = bartenderBtn.querySelector(".footer-btn-label");
  const bartenderDialog = $("bartender-dialog");

  bartenderBtn.addEventListener("click", () => {
    if (bartenderBtn.classList.contains("is-calling")) return;
    bartenderBtn.classList.add("is-calling");
    bartenderBtn.disabled = true;
    bartenderLabel.textContent = text("bartenderCalling");

    setTimeout(() => {
      bartenderBtn.classList.remove("is-calling");
      bartenderBtn.disabled = false;
      bartenderLabel.textContent = text("bartenderButton");
      bartenderDialog.showModal();
    }, motionOK ? 1500 : 600);
  });

  $("bartender-close").addEventListener("click", () => bartenderDialog.close());
  closeOnBackdrop(bartenderDialog);

  // ---- 2. Pay Tab ------------------------------------------------------------
  const receiptDialog = $("receipt-dialog");
  const receiptBody = $("receipt-body");
  const payButtons = receiptDialog.querySelectorAll(".pay-btn");
  const jkDialog = $("jk-dialog");

  const round2 = (n) => Math.round(n * 100) / 100;
  const money = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  const percent = (rate) => `${+(rate * 100).toFixed(3)}%`;

  const row = (label, value, cls = "") =>
    `<div class="r-row ${cls}"><span>${escapeHTML(label)}</span><span>${escapeHTML(value)}</span></div>`;

  /** A realistic-looking (random) barcode. */
  function barcodeSVG(seed) {
    let s = seed;
    const next = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    let x = 0;
    let bars = "";
    while (x < 196) {
      const w = 1 + Math.floor(next() * 3);
      bars += `<rect x="${x}" y="0" width="${w}" height="40"/>`;
      x += w + 1 + Math.floor(next() * 3);
    }
    return `<svg viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">${bars}</svg>`;
  }

  function receiptHTML() {
    const locale = lang() === "ko" ? "ko-KR" : "en-US";
    const now = new Date();
    const date = now.toLocaleDateString(locale, { year: "numeric", month: "2-digit", day: "2-digit" });
    const time = now.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
    const check = 1000 + Math.floor(Math.random() * 9000);

    const subtotal = TAB.items.reduce((sum, item) => sum + item.price, 0);
    const foodSubtotal = TAB.items.filter((i) => i.food).reduce((sum, i) => sum + i.price, 0);
    const salesTax = round2(subtotal * TAB.salesTaxRate);
    const foodTax = round2(foodSubtotal * TAB.foodTaxRate);
    const gratuity = round2(subtotal * TAB.gratuityRate);
    const total = round2(subtotal + salesTax + foodTax + gratuity);

    const items = TAB.items
      .map((item) => row(`1  ${text(item.key)}`, money(item.price), "r-item"))
      .join("");

    return `
      <div class="r-head">
        <h2 id="receipt-title">${escapeHTML(text("title"))}</h2>
        <p>${escapeHTML(text("receiptAddress"))}</p>
      </div>
      <div class="r-rule"></div>
      ${row(`${text("receiptDate")}: ${date}`, `${text("receiptTime")}: ${time}`)}
      ${row(`${text("receiptServer")}: ${text("receiptServerName")}`, `${text("receiptTable")}: ${text("receiptTableName")}`)}
      ${row(`${text("receiptCheck")} #${check}`, "")}
      <div class="r-rule"></div>
      ${items}
      <div class="r-rule"></div>
      ${row(text("subtotal"), money(subtotal))}
      ${row(`${text("salesTax")} (${percent(TAB.salesTaxRate)})`, money(salesTax))}
      ${row(`${text("foodTax")} (${percent(TAB.foodTaxRate)})`, money(foodTax))}
      ${row(`${text("gratuity")} (${percent(TAB.gratuityRate)})*`, money(gratuity))}
      <div class="r-rule double"></div>
      ${row(text("total"), money(total), "r-total")}
      <p class="r-note">${escapeHTML(text("gratuityNote"))}</p>
      <div class="r-barcode">${barcodeSVG(check)}</div>
      <p class="r-barcode-num">${check} ${String(now.getTime()).slice(-8)}</p>
      <p class="r-thanks">${escapeHTML(text("receiptThanks"))}</p>`;
  }

  $("tab-btn").addEventListener("click", () => {
    receiptBody.innerHTML = receiptHTML(); // fresh date/time and check # each time
    receiptDialog.showModal();
    receiptDialog.scrollTop = 0;
  });

  $("receipt-x").addEventListener("click", () => receiptDialog.close());
  closeOnBackdrop(receiptDialog);

  // Fake payment: spinner, then the reveal.
  payButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (receiptDialog.dataset.busy) return;
      receiptDialog.dataset.busy = "1";
      payButtons.forEach((b) => (b.disabled = true));
      btn.innerHTML = `<span class="spinner" aria-hidden="true"></span>${escapeHTML(text("processing"))}`;

      setTimeout(() => {
        delete receiptDialog.dataset.busy;
        payButtons.forEach((b) => {
          b.disabled = false;
          b.textContent = text(b.dataset.i18n);
        });
        jkDialog.showModal();
      }, motionOK ? 1600 : 700);
    });
  });

  // "Phew": close everything and celebrate with leaves.
  function finishPrank() {
    jkDialog.close();
    receiptDialog.close();
    window.menuEffects?.dropLeaves(30, 1.5);
  }
  $("jk-close").addEventListener("click", finishPrank);
  closeOnBackdrop(jkDialog, finishPrank);
})();
