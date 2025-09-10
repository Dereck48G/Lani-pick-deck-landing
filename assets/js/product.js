import { goToScreen } from './navigation.js';

let appData = { categories: [], products: [] };

export async function initializeProducts() {
  const res = await fetch('assets/data/products.json');
  appData = await res.json();
  renderCategoriesAccordion();
}

function renderCategoriesAccordion() {
  const container = document.getElementById('categories-list');
  container.innerHTML = '';

  appData.categories.forEach(cat => {
    const acc = document.createElement('button');
    acc.classList.add('accordion-btn');
    acc.innerHTML = `<span>${cat.name}</span><button class="add-product-btn" style="margin-left:10px">+ Producto</button>`;

    const panel = document.createElement('div');
    panel.classList.add('panel');

    // Render productos existentes
    renderProducts(panel, cat.id);

    // Toggle panel
    acc.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') {
        acc.classList.toggle('active');
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
      }
    });

    // Botón + Producto → pantalla 15
    const addBtn = acc.querySelector('.add-product-btn');
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sessionStorage.setItem('newProductCategoryId', cat.id);
      sessionStorage.setItem('newProductCategoryName', cat.name);
      goToScreen(12);
    });

    container.appendChild(acc);
    container.appendChild(panel);
  });
}

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
