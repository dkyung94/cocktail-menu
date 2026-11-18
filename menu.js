// ==========================================================================
// MENU DATA — edit this to change what's on the menu.
//   sections: [{ title, ko: { title }, drinks: [...] }]
//   drink:    { name, ingredients: [], description, tag?, ko: { ...same fields } }
//   `tag` is optional (e.g. "Signature", "Zero-proof", "Spicy").
//   `ko` holds the Korean version. Any field missing from `ko` falls back to
//   English, which is why drink names (puns!) stay English in both languages.
//   To give a drink a Korean name, add `name: "..."` inside its `ko` block.
// ==========================================================================
const MENU = {
  sections: [
    {
      title: "Cocktails",
      ko: { title: "칵테일" },
      drinks: [
        {
          name: "Cider Effects",
          ingredients: ["Soju", "Apple cider", "Lemon"],
          description: "Perfect for the Sweater Season.",
          tag: "Seasonal",
          ko: {
            ingredients: ["소주", "사과즙", "레몬"],
            description: "니트 입는 계절에 딱이에요.",
            tag: "시즌 한정",
          },
        },
        {
          name: "Blood, Sweat & Soju",
          ingredients: ["Soju", "Lorina sparkling blood orange", "Lime"],
          description: "Bright, tart, and a little bittersweet.",
          ko: {
            ingredients: ["소주", "로리나 스파클링 블러드 오렌지", "라임"],
            description: "상큼하고 새콤하면서 살짝 쌉싸름해요.",
          },
        },
        {
          name: "When Life Gives You Soju",
          ingredients: ["Soju", "French sparkling lemonade"],
          description: "Crisp and refreshing, the easy one to keep sipping.",
          ko: {
            ingredients: ["소주", "프렌치 스파클링 레모네이드"],
            description: "깔끔하고 청량해서 자꾸 손이 가는 한 잔.",
          },
        },
        {
          name: "Espresso Yo Self",
          ingredients: ["Soju", "Cold brew", "Oat latte"],
          description:
            "Shaken and topped with a creamy layer of latte. Your nightcap and your morning coffee in one glass.",
          ko: {
            ingredients: ["소주", "콜드브루", "오트 라떼"],
            description: "셰이크한 뒤 부드러운 라떼를 한 층 올렸어요. 자기 전 한 잔과 모닝커피를 한 잔에.",
          },
        },
        {
          name: "Piña Sojulada",
          ingredients: ["Soju", "Pineapple Coconut water", "Sparkling lemonade"],
          description: "Light and tropical.",
          ko: {
            ingredients: ["소주", "파인애플 코코넛 워터", "스파클링 레모네이드"],
            description: "가볍고 트로피컬해요.",
          },
        },
      ],
    },
  ],
};

// Page text outside the menu (header, footer, labels), per language.
const UI = {
  en: {
    pageTitle: "Girls' Night Bar",
    title: "Girls' Night Bar",
    tagline: "Pick your poison",
    footer: "Cheers! 🥂",
    menuLabel: "Cocktail menu",
    ingredientsLabel: "Ingredients",
    bartenderButton: "Request Bartender",
    bartenderCalling: "Calling the bartender…",
    bartenderTitle: "Go up yourself bro",
    bartenderSub: "The bartender is off the clock.",
    bartenderClose: "Fine 🙄",
  },
  ko: {
    pageTitle: "Girls' Night Bar",
    title: "Girls' Night Bar",
    tagline: "취향대로 골라 보세요",
    footer: "건배! 🥂",
    menuLabel: "칵테일 메뉴",
    ingredientsLabel: "재료",
    bartenderButton: "바텐더 호출",
    bartenderCalling: "바텐더 부르는 중…",
    bartenderTitle: "직접 가세요, 브로",
    bartenderSub: "바텐더는 오늘 퇴근했어요.",
    bartenderClose: "알겠어 🙄",
  },
};

// ==========================================================================
// Rendering — you shouldn't need to touch this unless you change the markup.
// ==========================================================================

/** Escape text before inserting it into HTML. */
function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** The field in the chosen language, falling back to English. */
function pickLang(item, field, lang) {
  return (lang !== "en" && item[lang]?.[field]) || item[field];
}

function renderDrink(drink, lang) {
  const tagText = pickLang(drink, "tag", lang);
  const tag = tagText ? `<span class="drink-tag">${escapeHTML(tagText)}</span>` : "";
  const ingredients = (pickLang(drink, "ingredients", lang) || [])
    .map((item) => `<li>${escapeHTML(item)}</li>`)
    .join("");

  return `
    <li class="drink">
      <h3 class="drink-name">${escapeHTML(pickLang(drink, "name", lang))} ${tag}</h3>
      <ul class="drink-ingredients" aria-label="${escapeHTML(UI[lang].ingredientsLabel)}">${ingredients}</ul>
      <p class="drink-description">${escapeHTML(pickLang(drink, "description", lang))}</p>
    </li>`;
}

function renderSection(section, lang) {
  const drinks = (section.drinks || []).map((drink) => renderDrink(drink, lang)).join("");
  return `
    <section class="menu-section">
      <h2 class="menu-section-title">${escapeHTML(pickLang(section, "title", lang))}</h2>
      <ul class="drink-list">${drinks}</ul>
    </section>`;
}

function renderMenu(menu, container, lang = "en") {
  container.innerHTML = (menu.sections || []).map((s) => renderSection(s, lang)).join("");
  // Lets effects.js animate the freshly rendered drinks.
  document.dispatchEvent(new CustomEvent("menu:rendered"));
}

// ==========================================================================
// Language toggle
// ==========================================================================
const LANG_KEY = "menu-lang";

function initialLanguage() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && UI[saved]) return saved;
  } catch (e) {
    /* storage blocked: fall through */
  }
  // First visit: use Korean if the phone is set to Korean.
  const phoneLangs = navigator.languages || [navigator.language];
  return phoneLangs.some((l) => String(l).toLowerCase().startsWith("ko")) ? "ko" : "en";
}

function setLanguage(lang, { save = false } = {}) {
  const text = UI[lang];
  document.documentElement.lang = lang;
  document.title = text.pageTitle;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = text[el.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", text[el.dataset.i18nAria]);
  });
  document.querySelectorAll(".lang-toggle [data-lang]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  });

  renderMenu(MENU, document.getElementById("menu"), lang);

  if (save) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      /* storage blocked: the choice just won't be remembered */
    }
  }
}

document.querySelectorAll(".lang-toggle [data-lang]").forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang, { save: true }));
});

setLanguage(initialLanguage());
