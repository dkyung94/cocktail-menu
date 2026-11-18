// ==========================================================================
// MENU DATA — edit this to change what's on the menu.
//   sections: [{ title, drinks: [{ name, ingredients: [], description, tag? }] }]
//   `tag` is optional (e.g. "Signature", "Zero-proof", "Spicy").
// ==========================================================================
const MENU = {
  sections: [
    {
      title: "Cocktails",
      drinks: [
        {
          name: "Blood, Sweat & Soju",
          ingredients: ["Soju", "Lorina sparkling blood orange", "Lime"],
          description: "Bright, tart, and a little bittersweet.",
        },
        {
          name: "When Life Gives You Soju",
          ingredients: ["Soju", "French sparkling lemonade"],
          description: "Crisp and refreshing, the easy one to keep sipping.",
        },
        {
          name: "Espresso Yo Self",
          ingredients: ["Soju", "Cold brew", "Latte"],
          description:
            "Shaken and topped with a creamy layer of latte. Your nightcap and your morning coffee in one glass.",
        },
        {
          name: "Cider Effects",
          ingredients: ["Soju", "Apple cider", "Lemon", "Cinnamon stick"],
          description: "Perfect for the Sweater Season.",
        },
        {
          name: "Soju-gria",
          ingredients: ["Red wine", "Soju", "Fresh oranges", "Apples", "Sparkling blood orange"],
          description: "Fruity and dangerously easy to drink.",
        },
        {
          name: "Piña Seoulada",
          ingredients: ["Soju", "Pineapple", "Coconut water", "Sparkling lemonade"],
          description: "Light and tropical.",
        },
      ],
    },
  ],
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

function renderDrink(drink) {
  const tag = drink.tag
    ? `<span class="drink-tag">${escapeHTML(drink.tag)}</span>`
    : "";
  const ingredients = (drink.ingredients || [])
    .map((item) => `<li>${escapeHTML(item)}</li>`)
    .join("");

  return `
    <li class="drink">
      <h3 class="drink-name">${escapeHTML(drink.name)} ${tag}</h3>
      <ul class="drink-ingredients" aria-label="Ingredients">${ingredients}</ul>
      <p class="drink-description">${escapeHTML(drink.description)}</p>
    </li>`;
}

function renderSection(section) {
  return `
    <section class="menu-section">
      <h2 class="menu-section-title">${escapeHTML(section.title)}</h2>
      <ul class="drink-list">${(section.drinks || []).map(renderDrink).join("")}</ul>
    </section>`;
}

function renderMenu(menu, container) {
  container.innerHTML = (menu.sections || []).map(renderSection).join("");
}

renderMenu(MENU, document.getElementById("menu"));
