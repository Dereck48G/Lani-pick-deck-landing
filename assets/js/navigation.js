// navigation.js — Manejo de pantallas

let currentScreen = 0;
let navigationHistory = [];
let sliderWrapper = null;

export function initializeNavigation() {
    sliderWrapper = document.querySelector('.slider-wrapper');
    if (!sliderWrapper) return;

    const screens = getScreens();
    if (!screens.length) return;

    // Colocar todas las pantallas en fila horizontal
    sliderWrapper.style.display = 'flex';
    sliderWrapper.style.transition = 'transform 0.3s ease-in-out';
    sliderWrapper.style.width = `${screens.length * 100}%`;

    screens.forEach(screen => {
        screen.style.width = `${100 / screens.length}%`;
        screen.style.flexShrink = '0';
    });

    goToScreen(0, false);

    // Delegar clicks para navegación
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('[data-screen], [data-switch]');
        if (!target) return;

        if (target.dataset.screen) {
            goToScreen(Number(target.dataset.screen));
        } else if (target.dataset.switch) {
            handleSwitch(target.dataset.switch);
        }
    });
}

function getScreens() {
    return Array.from(document.querySelectorAll('.screen'));
}

function handleSwitch(action) {
    switch (action) {
        case 'back':
            goBack();
            break;
        case 'toCashier':
            goToScreen('screen-home-cashier');
            break;
        case 'toAdmin':
            goToScreen('screen-home-admin');
            break;
        default:
            console.warn(`Acción desconocida: ${action}`);
    }
}

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

    // 👇 Manejar visibilidad del bottom-nav solo en admin
    const allBottomNavs = document.querySelectorAll('.bottom-nav');
    allBottomNavs.forEach(nav => nav.style.display = 'none'); // ocultar todos

    const currentNav = screens[currentScreen].querySelector('.bottom-nav');
    if (currentNav) currentNav.style.display = 'flex';
}

export function goBack() {
    if (!navigationHistory.length) return;

    const lastScreen = navigationHistory.pop();
    if (lastScreen !== undefined) {
        goToScreen(lastScreen, false);
    }
}
