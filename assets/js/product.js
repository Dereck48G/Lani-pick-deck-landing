import { goToScreen } from './navigation.js';

let appData = { categories: [], products: [] };

export async function initializeProducts() {
  const res = await fetch('assets/data/products.json');
  appData = await res.json();
  renderCategoriesAccordion();
}

// Renderiza categorías como accordion
function renderCategoriesAccordion() {
  const container = document.getElementById('categories-list');
  container.innerHTML = '';

  appData.categories.forEach(cat => {
    const acc = document.createElement('button');
    acc.classList.add('accordion-btn');
    acc.textContent = cat.name;

    const panel = document.createElement('div');
    panel.classList.add('panel');

    acc.addEventListener('click', () => {
      acc.classList.toggle('active');
      if (panel.style.display === 'block') {
        panel.style.display = 'none';
      } else {
        panel.style.display = 'block';
        renderProducts(panel, cat.id);
      }
    });

    container.appendChild(acc);
    container.appendChild(panel);
  });
}

// Renderiza productos dentro del panel
function renderProducts(panel, categoryId) {
  const products = appData.products.filter(p => p.categoryId === categoryId);
  const msg = document.getElementById('no-products-message');

  panel.innerHTML = '';

  if (products.length === 0) {
    msg.classList.remove('hidden');
    return;
  } else {
    msg.classList.add('hidden');
  }

  products.forEach(p => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <div class="product-info">
        <strong>${p.name}</strong>
        <p>Disponible: ${p.available}</p>
      </div>
      <button class="add-product-btn" onclick="alert('Agregar al inventario: ${p.name}')">Agregar</button>
    `;
    panel.appendChild(card);
  });
}

// Evento volver al admin
const backBtn = document.getElementById('back-to-admin');
if(backBtn) backBtn.addEventListener('click', () => goToScreen(10));
