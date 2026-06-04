const celloxProducts = [
  {
    id: "buds",
    name: "AirLite Buds",
    category: "buds",
    image: "assets/buds.png",
    tag: "Popular",
    desc: "Compact wireless earbuds with clear calls and long battery life.",
    shortDesc: "Compact wireless earbuds for calls, music, and everyday carry.",
    price: "Rs. 4,999",
    featured: true
  },
  {
    id: "headphones",
    name: "Studio Headphones",
    category: "headphones",
    image: "assets/headphones.png",
    tag: "New",
    desc: "Over-ear wireless headphones with soft cushions and deep bass.",
    shortDesc: "Soft over-ear comfort with deep wireless sound.",
    price: "Rs. 7,999",
    featured: true
  },
  {
    id: "speaker",
    name: "Pulse Speaker",
    category: "speaker",
    image: "assets/speaker.png",
    tag: "",
    desc: "Portable Bluetooth speaker with rich room-filling sound.",
    shortDesc: "Portable sound for rooms, desks, and travel.",
    price: "Rs. 3,499",
    featured: false
  },
  {
    id: "cases",
    name: "Flex Phone Case",
    category: "cases",
    image: "assets/phone-cases.png",
    tag: "Best seller",
    desc: "Slim protective cases in clear, matte, and pastel finishes.",
    shortDesc: "Slim protection in clear, matte, and soft color finishes.",
    price: "Rs. 799",
    featured: true
  },
  {
    id: "screen-guard",
    name: "Crystal Screen Guard",
    category: "screen-guard",
    image: "assets/screen-guard.png",
    tag: "",
    desc: "Tempered glass screen protector with smooth touch response.",
    shortDesc: "Clear tempered glass protection for everyday use.",
    price: "Rs. 499",
    featured: false
  },
  {
    id: "cards",
    name: "Smart Access Card",
    category: "cards",
    image: "assets/smart-card.png",
    tag: "Compact",
    desc: "Sleek NFC card accessory for everyday digital convenience.",
    shortDesc: "A slim card accessory for quick digital access.",
    price: "Rs. 1,299",
    featured: false
  }
];

const categoryLabels = {
  buds: "Buds",
  headphones: "Headphones",
  speaker: "Speaker",
  cases: "Cases",
  "screen-guard": "Screen Guard",
  cards: "Cards"
};

function getCartCount() {
  return Number(localStorage.getItem("celloxCartCount") || "0");
}

function setCartCount(count) {
  localStorage.setItem("celloxCartCount", String(count));
  updateCartBadges();
}

function updateCartBadges() {
  const count = getCartCount();
  document.querySelectorAll("#cartCount").forEach((badge) => {
    badge.textContent = count;
    badge.classList.toggle("show", count > 0);
  });
}

function showToast(text = "Added to cart") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1300);
}

function addToCart(button) {
  setCartCount(getCartCount() + 1);
  if (button) {
    button.textContent = "OK";
    window.setTimeout(() => {
      button.textContent = "+";
    }, 1300);
  }
  showToast();
}

function initHomePage() {
  const featuredGrid = document.getElementById("featuredProducts");
  if (!featuredGrid) return;

  const featured = celloxProducts.filter((product) => product.featured).slice(0, 3);
  featuredGrid.innerHTML = featured.map((product) => `
    <article class="home-product">
      <div class="home-product-img">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <h3>${product.name}</h3>
      <p>${product.shortDesc}</p>
      <div class="home-product-foot">
        <span>${product.price}</span>
        <a href="store.html#${product.category}">View</a>
      </div>
    </article>
  `).join("");
}

function productMatches(product, term) {
  const searchable = `${product.name} ${product.desc} ${categoryLabels[product.category]}`.toLowerCase();
  return searchable.includes(term);
}

function initStorePage() {
  const productGrid = document.getElementById("productGrid");
  if (!productGrid) return;

  const productSearch = document.getElementById("productSearch");
  const resultNote = document.getElementById("resultNote");

  function currentCategory() {
    const hash = window.location.hash.replace("#", "");
    return categoryLabels[hash] ? hash : "all";
  }

  function renderProducts() {
    const category = currentCategory();
    const term = (productSearch?.value || "").trim().toLowerCase();
    const visible = celloxProducts.filter((product) => {
      const categoryMatch = category === "all" || product.category === category;
      const searchMatch = !term || productMatches(product, term);
      return categoryMatch && searchMatch;
    });

    if (resultNote) {
      const categoryText = category === "all" ? "All" : categoryLabels[category];
      resultNote.textContent = `${visible.length} ${visible.length === 1 ? "product" : "products"} · ${categoryText}`;
    }

    productGrid.innerHTML = visible.length ? visible.map((product) => `
      <article class="card">
        <p class="tag">${product.tag}</p>
        <div class="product-visual" aria-hidden="true">
          <img src="${product.image}" alt="">
        </div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <div class="product-foot">
          <span class="price">${product.price}</span>
          <button class="add" type="button" aria-label="Add ${product.name} to cart" data-add>+</button>
        </div>
      </article>
    `).join("") : `
      <article class="empty-state">
        <h3>No matching products.</h3>
        <p>Try another search or choose a different category.</p>
      </article>
    `;

    document.querySelectorAll(".category").forEach((item) => {
      item.classList.toggle("active", item.id === category);
    });
  }

  productSearch?.addEventListener("input", renderProducts);
  window.addEventListener("hashchange", renderProducts);
  productGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (button) addToCart(button);
  });

  renderProducts();
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadges();
  initHomePage();
  initStorePage();

  const searchBtn = document.getElementById("searchBtn");
  searchBtn?.addEventListener("click", () => {
    if (document.getElementById("productSearch")) {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
      document.getElementById("productSearch")?.focus();
    } else {
      window.location.href = "store.html";
    }
  });
});
