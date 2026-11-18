// ==========================================================================
// MENU DATA — edit this to change what's on the menu.
//   sections: [{ title, drinks: [{ name, ingredients: [], description, tag? }] }]
//   `tag` is optional (e.g. "Signature", "Zero-proof", "Spicy").
// ==========================================================================
const MENU = {
  sections: [
    {
      title: "[Section title, e.g. Signatures]",
      drinks: [
        {
          name: "[Placeholder Drink One]",
          ingredients: ["Ingredient A", "Ingredient B", "Ingredient C"],
          description: "[Short description of the drink.]",
          tag: "Signature",
        },
        {
          name: "[Placeholder Drink Two]",
          ingredients: ["Ingredient A", "Ingredient D"],
          description: "[Short description of the drink.]",
        },
      ],
    },
    {
      title: "[Section title, e.g. Zero-proof]",
      drinks: [
        {
          name: "[Placeholder Mocktail]",
          ingredients: ["Ingredient E", "Ingredient F"],
          description: "[Short description of the drink.]",
          tag: "Zero-proof",
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
      <p class="drink-description">${escapeHTML(drink.description)}</p>
      <ul class="drink-ingredients" aria-label="Ingredients">${ingredients}</ul>
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
