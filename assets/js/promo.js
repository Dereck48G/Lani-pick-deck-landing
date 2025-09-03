// promo.js: Lógica para la selección de planes de promoción.

const planData = {
    '10': { text: 'Tu producto se mostrará a personas en tu ciudad en:', icons: ['facebook'] },
    '25': { text: 'Llegarás a más personas en tu región a través de:', icons: ['facebook', 'instagram'] },
    '50': { text: 'Máximo alcance en todo el país. Aparecerás en:', icons: ['facebook', 'instagram', 'tiktok'] }
};

const socialIconsSVG = {
    facebook: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06c0 5.52 4.5 10.02 10 10.02s10-4.5 10-10.02C22 6.53 17.5 2.04 12 2.04zM16.5 8.25h-2.25c-.2 0-.45.1-.45.5v1.5h2.7l-.45 2.25h-2.25V18h-3v-5.5H9V8.25h1.5v-1.5c0-1.5.9-2.7 2.7-2.7h2.1v2.7z"/></svg>',
    instagram: '<svg width="22" height="22" viewBox="0 0 24 24"><defs><radialGradient id="ig" cx="0.3" cy="1" r="1"><stop offset="0" stop-color="#FDCB52"/><stop offset="0.5" stop-color="#FD8D32"/><stop offset="1" stop-color="#D13184"/></radialGradient></defs><path fill="url(#ig)" d="M12 2c2.7 0 3 .01 4.05.07c1.06.05 1.8.22 2.42.47c.65.25.9.5.47 2.42c.25.62.42 1.36.47 2.42c.06 1.05.07 1.35.07 4.05s-.01 3-.07 4.05c-.05 1.06-.22 1.8-.47 2.42c-.25.65-.5.9-.47-2.42c-.62.25-1.36.42-2.42.47c-1.05.06-1.35.07-4.05.07s-3-.01-4.05-.07c-1.06-.05-1.8-.22-2.42-.47c-.65-.25-.9-.5-.47-2.42c-.25-.62-.42-1.36-.47-2.42c-.06-1.05-.07-1.35-.07-4.05s.01-3 .07-4.05c.05-1.06.22-1.8.47-2.42c.25-.65.5-.9 2.42-.47c.62-.25 1.36-.42 2.42-.47C9 2.01 9.3 2 12 2zm0 6.49a4.35 4.35 0 1 0 0 8.7a4.35 4.35 0 0 0 0-8.7zM18.95 6.79a1.1 1.1 0 1 1-2.2 0a1.1 1.1 0 0 1 2.2 0z"/></svg>',
    tiktok: '<svg width="22" height="22" viewBox="0 0 24 24" fill="#000"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17c1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97c-.62-.29-1.2-.65-1.74-1.17v-3.1c-2.1.2-3.8.85-5.23 1.78v4.3c.21.7.55 1.36 1.02 1.94c.47.58.98 1.12 1.57 1.58c.59.46 1.22.86 1.9 1.18c.68.32 1.39.56 2.12.72v4.4c-2.9-.22-5.54-1.33-7.55-3.44c-2.01-2.1-3.01-4.7-3-7.5c.01-2.8 1.01-5.4 3-7.5c2-2.1 4.64-3.2 7.55-3.4z"/></svg>'
};

export function initializePromo() {
    const promoPlans = document.querySelectorAll('.promo-plan');
    if (promoPlans.length === 0) return;

    promoPlans.forEach(plan => {
        plan.addEventListener('click', () => {
            promoPlans.forEach(p => p.classList.remove('selected'));
            plan.classList.add('selected');
            updatePromoDetails(plan.dataset.price);
        });
    });
    // Inicia con el plan recomendado
    updatePromoDetails('25');
}

function updatePromoDetails(price) {
    const promoDetails = document.getElementById('promo-details');
    const launchPromoBtn = document.getElementById('launch-promo');
    if (!promoDetails || !launchPromoBtn) return;
    
    const data = planData[price] || planData['25'];
    const iconsHTML = data.icons.map(i => socialIconsSVG[i]).join('');
    
    promoDetails.innerHTML = `
        <p style="font-size:13px; color:#475569; margin: 0 0 8px;">${data.text}</p>
        <div class="social-icons">${iconsHTML}</div>
    `;
    launchPromoBtn.textContent = `Lanzar Promoción (C$ ${price})`;
}