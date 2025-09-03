// onboarding.js: Lógica para la selección de sector, subcategoría y configuración del comercio
import { goToScreen } from './navigation.js';

let appState;

// Catálogo de sectores y subcategorías
const CATALOG = {
    retail: {
        key: 'retail', icon: '🛍️', title: 'Comercio Minorista (Retail)', desc: 'Vende productos directamente al consumidor.',
        subcats: ['Abarrotes y Pulperías', 'Moda y Accesorios', 'Ferretería y Hogar', 'Salud y Belleza', 'Tecnología', 'Librería', 'Otros']
    },
    food: {
        key: 'food', icon: '🍔', title: 'Alimentos y Bebidas', desc: 'Preparación y venta de comida y bebida.',
        subcats: ['Restaurantes', 'Comida Rápida', 'Cafeterías', 'Bares']
    },
    services: {
        key: 'services', icon: '💇', title: 'Servicios Personales', desc: 'Ofrecen servicios, no productos físicos.',
        subcats: ['Salones de Belleza', 'Talleres', 'Servicios Profesionales', 'Salud']
    }
};

/**
 * Inicializa el onboarding de sectores y subcategorías
 */
export function initializeOnboarding(state) {
    appState = state;
    const sectorSearch = document.getElementById('sector-search');
    const subcatContinue = document.getElementById('subcat-continue');

    if (sectorSearch) {
        sectorSearch.addEventListener('input', (e) => renderSectors(e.target.value || ''));
    }

    if (subcatContinue) {
        subcatContinue.addEventListener('click', () => {
            console.log(`Sector: ${appState.chosenSectorKey}, Subcategoría: ${appState.chosenSubcat}`);
            goToScreen(getScreenIndexById('screen-setup'));
        });
    }

    // Render inicial de sectores
    renderSectors();
}

/**
 * Muestra las tarjetas de sectores, opcionalmente filtradas por texto
 */
export function renderSectors(filterText = '') {
    const sectorGrid = document.getElementById('sector-grid');
    if (!sectorGrid) return;

    sectorGrid.innerHTML = '';
    Object.values(CATALOG).forEach(item => {
        const fullText = (item.title + ' ' + item.desc).toLowerCase();
        if (filterText && !fullText.includes(filterText.toLowerCase())) {
            return;
        }

        const card = document.createElement('div');
        card.className = 'sector-card';
        card.innerHTML = `<div class="sector-icon">${item.icon}</div>
                          <div>
                            <div class="title">${item.title}</div>
                            <div class="desc">${item.desc}</div>
                          </div>`;

        card.addEventListener('click', () => {
            appState.chosenSectorKey = item.key;
            renderSubcats(item);
            goToScreen(getScreenIndexById('screen-subcategory'));
        });

        sectorGrid.appendChild(card);
    });
}

/**
 * Muestra los chips de subcategorías para un sector dado
 */
function renderSubcats(sector) {
    const chipsContainer = document.getElementById('chips-container');
    const subcatTitle = document.getElementById('subcat-title');
    const subcatContinueBtn = document.getElementById('subcat-continue');

    if (!chipsContainer || !subcatTitle || !subcatContinueBtn) return;

    chipsContainer.innerHTML = '';
    subcatTitle.textContent = `¿Qué categoría describe mejor tu negocio de ${sector.title}?`;
    subcatContinueBtn.disabled = true;

    sector.subcats.forEach(name => {
        const chip = document.createElement('button');
        chip.className = 'chip';
        chip.textContent = name;

        chip.addEventListener('click', () => {
            chipsContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            appState.chosenSubcat = name;
            subcatContinueBtn.disabled = false;
        });

        chipsContainer.appendChild(chip);
    });
}

/**
 * Inicializa la pantalla de setup del comercio
 */
export function initializeSetup(state) {
    appState = state;
    const nameInput = document.getElementById('business-name');
    const addressInput = document.getElementById('business-address');
    const phoneInput = document.getElementById('business-phone');
    const continueBtn = document.getElementById('setup-continue');
    const finalBtn = document.getElementById('final-done');

    if(nameInput && addressInput && phoneInput && continueBtn){
        // Habilitar botón solo si todos los campos tienen valor
        [nameInput, addressInput, phoneInput].forEach(input => {
            input.addEventListener('input', () => {
                continueBtn.disabled = !(nameInput.value && addressInput.value && phoneInput.value);
            });
        });

        continueBtn.addEventListener('click', () => {
            // Guardar datos en appState
            appState.businessName = nameInput.value;
            appState.businessAddress = addressInput.value;
            appState.businessPhone = phoneInput.value;

            goToScreen(getScreenIndexById('screen-final'));
        });
    }

    if(finalBtn){
        finalBtn.addEventListener('click', () => {
            console.log('Datos guardados:', appState);
            // Aquí puedes ir al dashboard real
            goToScreen('screen-home-admin'); 
        });
    }
}

/**
 * Función para obtener índice de pantalla por id
 */
function getScreenIndexById(id){
    const screens = Array.from(document.querySelectorAll('.screen'));
    const index = screens.findIndex(s => s.id === id);
    if(index === -1){
        console.warn(`Pantalla con id "${id}" no encontrada`);
        return 0; // fallback a pantalla inicial
    }
    return index;
}
