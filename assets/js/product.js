import { goToScreen } from './navigation.js';

let appData = { categories: [], products: [] };
let filteredProducts = [];

export async function initializeProducts() {
  const res = await fetch('assets/data/products.json');
  appData = await res.json();
  renderCategoriesList();
  setupEventListeners();
}

// Renderiza lista de categorías tipo nav acordeón
function renderCategoriesList() {
  const container = document.getElementById('categories-list');
  container.innerHTML = '';

  appData.categories.forEach(cat => {
    const div = document.createElement('div');
    div.classList.add('category-item');

    // Header con título + botón agregar producto
    const header = document.createElement('div');
    header.classList.add('category-header');
    header.innerHTML = `
      <span>${cat.name}</span>
      <button class="add-product-btn" data-cat="${cat.id}">➕</button>
    `;
    div.appendChild(header);

    // Contenedor de productos (oculto inicialmente)
    const productsContainer = document.createElement('div');
    productsContainer.classList.add('products-container', 'hidden');
    div.appendChild(productsContainer);

    // Mostrar/ocultar productos al hacer click en header (no botón)
    header.addEventListener('click', e => {
      if (!e.target.classList.contains('add-product-btn')) {
        productsContainer.classList.toggle('hidden');
        renderProducts(cat.id, productsContainer);
      }
    });

    // Click en botón ➕ agregar producto
    header.querySelector('.add-product-btn').addEventListener('click', e => {
      e.stopPropagation();
      alert(`Abrir pantalla para agregar producto en categoría: ${cat.name}`);
    });

    container.appendChild(div);
  });
}

// Renderiza productos en contenedor de categoría
function renderProducts(categoryId, container) {
  const products = appData.products.filter(p => p.categoryId === categoryId);
  container.innerHTML = '';

  if (products.length === 0) {
    container.innerHTML = `<p style="color:var(--secondary-color); padding:10px;">No hay productos en esta categoría.</p>`;
    return;
  }

  products.forEach(p => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <img src="${p.image || 'https://via.placeholder.com/100'}" alt="${p.name}">
      <div class="product-info">
        <strong>${p.name}</strong>
        <p>Disponible: ${p.available}</p>
      </div>
      <button class="btn-secondary" onclick="alert('Agregar al inventario: ${p.name}')">Agregar</button>
    `;
    container.appendChild(card);
  });
}

function setupEventListeners() {
  document.getElementById('back-to-admin').addEventListener('click', () => goToScreen(10));
}
