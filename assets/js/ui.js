// ui.js: Lógica para componentes generales de la UI como slideshows y formato de inputs.

/**
 * Inicializa todos los listeners de la UI que no pertenecen a un módulo específico.
 */
export function initializeUI() {
    startWelcomeSlideshow();
    setupPhoneInputFormatting();
    setupOtpAutoAdvance();
}

/**
 * Inicia el carrusel de imágenes en la pantalla de bienvenida.
 */
function startWelcomeSlideshow() {
    const slides = document.querySelectorAll('.welcome-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 4000);
}

/**
 * Añade el formato automático (8888 8888) al input del teléfono.
 */
function setupPhoneInputFormatting() {
    const phoneInput = document.getElementById('phone-number');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', () => {
        const digits = phoneInput.value.replace(/\D/g, '').slice(0, 8);
        phoneInput.value = digits.replace(/(\d{4})(\d{0,4})/, '$1 $2').trim();
    });
}

/**
 * Configura el auto-avance y retroceso en los inputs del código OTP.
 */
function setupOtpAutoAdvance() {
    const wrappers = ['otp-wrapper', 'otp-wrapper-email', 'otp-wrapper-auth'];

    wrappers.forEach(wrapperId => {
        const otpWrapper = document.getElementById(wrapperId);
        if (!otpWrapper) return;

        const otpInputs = Array.from(otpWrapper.querySelectorAll('input'));

        otpInputs.forEach((input, idx) => {
            input.addEventListener('input', () => {
                input.value = input.value.replace(/\D/g, '').slice(0, 1);
                if (input.value && idx < otpInputs.length - 1) {
                    otpInputs[idx + 1].focus();
                }
            });

            input.addEventListener('keydown', (ev) => {
                if (ev.key === 'Backspace' && !input.value && idx > 0) {
                    otpInputs[idx - 1].focus();
                }
            });
        });
    });
}

