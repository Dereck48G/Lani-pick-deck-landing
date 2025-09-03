// cashier.js: Gestiona la lógica de abrir y cerrar caja, y el conteo de dinero.

export function initializeCashier() {
    const cashFlowForm = document.querySelector('.cash-flow-form');
    if (!cashFlowForm) return;

    // Toggle entre Abrir y Cerrar Caja
    const toggleBtns = cashFlowForm.querySelectorAll('.toggle-btn');
    const openBoxForm = document.getElementById('open-box-form');
    const closeBoxForm = document.getElementById('close-box-form');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const isOpening = btn.dataset.flow === 'open';
            openBoxForm.style.display = isOpening ? 'block' : 'none';
            closeBoxForm.style.display = isOpening ? 'none' : 'block';
        });
    });

    // Toggle para mostrar/ocultar contador de denominaciones
    const denomToggle = document.getElementById('denomination-toggle');
    const denomCounter = document.getElementById('denomination-counter');
    if (denomToggle && denomCounter) {
        denomToggle.addEventListener('click', () => {
            const isVisible = denomCounter.style.display !== 'none';
            denomCounter.style.display = isVisible ? 'none' : 'block';
        });
    }

    // Cálculo de diferencia al cerrar caja
    const countedCashInput = document.getElementById('counted-cash');
    const differenceCashEl = document.getElementById('difference-cash');
    const expectedCashText = document.getElementById('expected-cash')?.textContent || "C$ 0.00";
    const expectedCash = parseFloat(expectedCashText.replace(/C\$|\s/g, ''));
    
    if (countedCashInput && differenceCashEl) {
        countedCashInput.addEventListener('input', () => {
            const countedValue = parseFloat(countedCashInput.value || '0');
            const diff = countedValue - expectedCash;
            const sign = diff >= 0 ? '+' : '-';
            
            differenceCashEl.textContent = `${sign} C$ ${Math.abs(diff).toFixed(2)}`;
            differenceCashEl.classList.toggle('positive', diff >= 0);
            differenceCashEl.classList.toggle('negative', diff < 0);
        });
    }
}