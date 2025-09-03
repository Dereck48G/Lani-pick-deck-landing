// navigation.js — Controla el carrusel de pantallas y el historial de navegación.

let sliderWrapper;
let appState;
let currentScreen = 0;
let navigationHistory = [];

/**
 * Obtiene todas las pantallas actuales en el DOM.
 */
function getScreens() {
    const screens = Array.from(document.querySelectorAll('.screen'));
    return screens;
}

/**
 * Inicializa el módulo de navegación con el estado de la app.
 * Debe llamarse **después de cargar las pantallas** en el DOM.
 */
export function initializeNavigation(state) {
    sliderWrapper = document.querySelector('.slider-wrapper');
    if (!sliderWrapper) {
        console.error("No se encontró el contenedor .slider-wrapper");
        return;
    }

    appState = state;

    setupScreenSizes();
    window.addEventListener('resize', setupScreenSizes);

    // Delegación de eventos para todo el body
    document.body.addEventListener('click', (e) => {
        // Botones con data-screen
        const screenTarget = e.target.closest('[data-screen]');
        if (screenTarget) {
            const idx = parseInt(screenTarget.dataset.screen, 10);
            if (!isNaN(idx)) goToScreen(idx);
            return;
        }

        // Botones de "Atrás"
        const backTarget = e.target.closest('.go-back');
        if (backTarget) {
            e.preventDefault();
            goBack();
            return;
        }

        // Botones para cambiar entre Admin y Cajero
        const switchTarget = e.target.closest('[data-switch]');
        if (switchTarget) {
            const mode = switchTarget.dataset.switch;
            if (mode === 'toCashier') {
                appState.isAdminView = false;
                navigationHistory = [10]; // guarda home admin en historial
                goToScreen(12);           // home cajero
            } else if (mode === 'toAdmin') {
                appState.isAdminView = true;
                navigationHistory = [12]; // guarda home cajero en historial
                goToScreen(10);           // home admin
            }
        }
    });
}

/**
 * Ajusta el ancho del carrusel y de cada pantalla.
 */
function setupScreenSizes() {
    if (!sliderWrapper) return;
    const screens = getScreens();
    if (!screens.length) return;

    const numScreens = screens.length;
    sliderWrapper.style.width = `${numScreens * 100}%`;
    screens.forEach(s => {
        s.style.width = `${100 / numScreens}%`;
    });
}

/**
 * Mueve el carrusel a la pantalla indicada por su índice o id.
 */
export function goToScreen(target, pushToHistory = true) {
    const screens = getScreens();
    if (!screens.length) return;

    let screenIndex;

    if (typeof target === 'string') {
        screenIndex = screens.findIndex(s => s.id === target);
        if (screenIndex === -1) {
            console.warn(`No se encontró la pantalla con id "${target}"`);
            return;
        }
    } else {
        screenIndex = Number(target);
        if (isNaN(screenIndex) || screenIndex < 0 || screenIndex >= screens.length) return;
    }

    if (screenIndex === currentScreen) return;

    if (pushToHistory) navigationHistory.push(currentScreen);
    currentScreen = screenIndex;

    const percentage = currentScreen * (100 / screens.length);
    sliderWrapper.style.transform = `translateX(-${percentage}%)`;
}

/**
 * Regresa a la pantalla anterior en el historial.
 */
export function goBack() {
    if (navigationHistory.length > 0) {
        const previousScreen = navigationHistory.pop();
        goToScreen(previousScreen, false);
    } else {
        // Si no hay historial, regresa al home correcto
        const homeScreen = appState.isAdminView ? 10 : 12;
        goToScreen(homeScreen, false);
    }
}
