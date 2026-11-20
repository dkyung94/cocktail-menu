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
      title: "Soju Cocktails",
      ko: { title: "소주 칵테일" },
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
          ingredients: ["Soju", "French sparkling lemonade", "Mint"],
          description: "Crisp and refreshing, the easy one to keep sipping.",
          ko: {
            ingredients: ["소주", "프렌치 스파클링 레모네이드", "민트"],
            description: "깔끔하고 청량해서 자꾸 손이 가는 한 잔.",
          },
        },
        {
          name: "Espresso Yo Self",
          ingredients: ["Soju", "Cold brew", "Oat latte", "Coffee Bean"],
          description:
            "Shaken and topped with a creamy layer of latte. Your nightcap and your morning coffee in one glass.",
          ko: {
            ingredients: ["소주", "콜드브루", "오트 라떼", "커피 원두"],
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
    bartenderTitle: "Go up yourself :)",
    bartenderSub: "Don't be shy",
    bartenderClose: "Fine 🙄",
    close: "Close",
    payTabButton: "Pay Tab",
    receiptAddress: "123 Soju St · Living Room",
    receiptDate: "Date",
    receiptTime: "Time",
    receiptServer: "Server",
    receiptServerName: "Danny",
    receiptTable: "Table",
    receiptTableName: "The Couch",
    receiptCheck: "Check",
    itemBartender: "Danny's Bartender Service",
    itemCocktails: "Bottomless Cocktails",
    itemStew: "Korean Army Stew",
    subtotal: "Subtotal",
    salesTax: "Sales Tax",
    foodTax: "Food Tax",
    gratuity: "Gratuity",
    total: "Total",
    gratuityNote: "*Gratuity automatically added for parties of 1 or more.",
    receiptThanks: "Thank you! Please come again",
    payApple: "Apple Pay",
    payCash: "Pay with Cash",
    processing: "Processing…",
    jkTitle: "jk just have a good time",
    jkClose: "Phew 😮‍💨",

    // ---- fun.js: "Pick for me" ----
    pickButton: "🎲 Can't decide?",
    pickLines: [
      "The menu has spoken.",
      "Fate says this one.",
      "No take-backs.",
      "Trust the process.",
      "Great choice. You're welcome.",
    ],

    // ---- fun.js: Fortune soju cap ----
    fortuneButton: "Twist for a fortune",
    fortuneHeading: "Your soju fortune",
    fortuneAgain: "Another one",
    fortuneClose: "Cheers 🥂",
    fortunes: [
      "You will send a risky text tonight. Don't.",
      "A stranger will compliment your outfit. It's us.",
      "To friends who know too much.",
      "Your next drink will taste better than this one.",
      "Great things are coming. Mostly snacks.",
      "Tonight's forecast: 100% chance of oversharing.",
      "You are the main character tonight. Act like it.",
      "Someone here has a crush. Look around.",
      "Tomorrow's group chat will be legendary.",
      "Lucky number: however many drinks you've had.",
      "Say yes to the next song request.",
      "Drink water now. Tomorrow-you says thanks.",
    ],
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
    bartenderTitle: "직접 가세요 :)",
    bartenderSub: "쑥스러워하지 마세요",
    bartenderClose: "알겠어 🙄",
    close: "닫기",
    payTabButton: "계산하기",
    receiptAddress: "소주로 123 · 거실",
    receiptDate: "날짜",
    receiptTime: "시간",
    receiptServer: "담당",
    receiptServerName: "대니",
    receiptTable: "테이블",
    receiptTableName: "소파",
    receiptCheck: "영수증",
    itemBartender: "대니의 바텐더 서비스",
    itemCocktails: "무제한 칵테일",
    itemStew: "부대찌개",
    subtotal: "소계",
    salesTax: "판매세",
    foodTax: "음식세",
    gratuity: "봉사료",
    total: "합계",
    gratuityNote: "*1인 이상 테이블은 봉사료가 자동 추가됩니다.",
    receiptThanks: "감사합니다! 또 오세요",
    payApple: "Apple Pay",
    payCash: "현금 결제",
    processing: "결제 중…",
    jkTitle: "장난이야 ㅋㅋ 그냥 즐겁게 놀아요!",
    jkClose: "휴 😮‍💨",

    pickButton: "🎲 고민되세요?",
    pickLines: [
      "메뉴의 뜻이에요.",
      "운명이 골랐어요.",
      "무르기 없기.",
      "믿고 마셔 봐요.",
      "탁월한 선택. 천만에요.",
    ],

    fortuneButton: "뚜껑 따고 운세 보기",
    fortuneHeading: "오늘의 소주 운세",
    fortuneAgain: "하나 더",
    fortuneClose: "짠 🥂",
    fortunes: [
      "오늘 밤, 보내면 안 될 문자를 보내고 싶어질 거예요. 참아요.",
      "누군가 오늘 옷 예쁘다고 칭찬할 거예요. 바로 우리요.",
      "너무 많은 걸 알고 있는 친구들을 위하여.",
      "다음 잔은 이번 잔보다 더 맛있을 거예요.",
      "좋은 일이 다가오고 있어요. 주로 안주요.",
      "오늘의 예보: TMI 확률 100%.",
      "오늘 밤 주인공은 당신. 주인공답게 놀아요.",
      "여기 누군가 썸 타는 중. 주위를 둘러봐요.",
      "내일 단톡방 난리 날 예정.",
      "행운의 숫자: 지금까지 마신 잔 수.",
      "다음 노래 신청엔 무조건 예스.",
      "지금 물 한 잔 마시면 내일의 내가 고마워해요.",
    ],
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
      <div class="drink-body">
        <h3 class="drink-name">${escapeHTML(pickLang(drink, "name", lang))} ${tag}</h3>
        <ul class="drink-ingredients" aria-label="${escapeHTML(UI[lang].ingredientsLabel)}">${ingredients}</ul>
        <p class="drink-description">${escapeHTML(pickLang(drink, "description", lang))}</p>
      </div>
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
