// main.js: Punto de entrada de la aplicación. Carga las pantallas e inicializa los módulos.

import { initializeNavigation, goToScreen } from './navigation.js';
import { initializeUI } from './ui.js';
import { initializeAuth } from './auth.js';
import { initializeOnboarding } from './onboarding.js';
import { initializeCashier } from './cashier.js';
import { initializePromo } from './promo.js';
import { initializeAdmin } from './admin.js';
import { initializeProducts } from './product.js';

// Lista de todos los archivos HTML de las pantallas en el orden correcto.
const screenFiles = [
    '00_welcome.html',       // 0
    '01_phone.html',         // 1
    '02_otp.html',           // 2
    '03_2fa.html',           // 3
    '03a_2fa_email.html',    // 4
    '03b_2fa_authenticator.html', // 5
    '04_sector.html',        // 6
    '05_subcategory.html',   // 7
    'screen-setup.html',     // 8
    'screen-final.html',     // 9
    '06_home_admin.html',    // 10 
    '11_product.html'   ,      // 11
    '15_ProductData.html',    // 12 → nueva pantalla de registro de producto
   // '07_branch_detail.html', // 11
    '08_home_cashier.html',  // 13
//    '09_cash_flow.html',     // 13
  //  '10_expense.html',       // 14
//    '11_product.html',       // 15
     '12_scanner.html'       // 14
//    '13_invoice.html',       // 17
//    '14_promo.html'          // 18
];
/**
 * Carga el contenido HTML de todas las pantallas y lo inyecta en el DOM.
 */
async function loadScreens() {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    if (!sliderWrapper) return;

    try {
        const fetchPromises = screenFiles.map(file => fetch(`screens/${file}`));
        const responses = await Promise.all(fetchPromises);

        for (const response of responses) {
            if (!response.ok) throw new Error(`Error al cargar ${response.url}`);
        }

        const htmlPromises = responses.map(response => response.text());
        const screenHTMLs = await Promise.all(htmlPromises);

        sliderWrapper.innerHTML = screenHTMLs.join('');

    } catch (error) {
        sliderWrapper.innerHTML = `<div style="color:var(--danger-color); text-align:center; padding: 20px;">Error al cargar las pantallas. Por favor, usa un servidor local como "Live Server".</div>`;
        console.error("Error cargando pantallas:", error);
    }
}

// -- Inicialización de la Aplicación --
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Cargar todo el HTML de las pantallas.
    await loadScreens();

    // 2. Estado global de la aplicación.
    const appState = {
        isReturning: false,
        isAdminView: true,
        ownerName: 'Ana',          // por ejemplo
        businessName: 'LANI S.A.', // por ejemplo
    };

    // 3. Inicializar todos los módulos.
    initializeNavigation(appState);
    initializeUI();
    initializeAuth(appState);
    initializeOnboarding(appState);
    initializeCashier();
    initializePromo();
      initializeAdmin(appState);
          initializeProducts();
     // Inicializa setup solo si existen los elementos
    const setupScreenExists = document.getElementById('screen-setup');
    if (setupScreenExists) {
        import('./onboarding.js').then(module => {
            module.initializeSetup(appState);
        });
    }

    // 4. Ir a la pantalla de bienvenida para empezar.
    goToScreen(0, false);
});