// auth.js: Gestiona el flujo de registro e inicio de sesión.
import { goToScreen } from './navigation.js';
import { renderSectors } from './onboarding.js';

let appState;

export function initializeAuth(state) {
    appState = state;
    setupAuthListeners();
}

/**
 * Habilita o deshabilita el botón de continuar en la pantalla del teléfono.
 */
function updateContinueButton() {
    const phoneInput = document.getElementById('phone-number');
    const termsCheck = document.getElementById('terms');
    const phoneContinueBtn = document.getElementById('phone-continue-btn');

    const digits = (phoneInput.value || '').replace(/\D/g, '');
    const isPhoneValid = digits.length === 8;

    if (isPhoneValid && termsCheck.checked) {
        phoneContinueBtn.disabled = false;
        phoneContinueBtn.classList.add('enabled');
    } else {
        phoneContinueBtn.disabled = true;
        phoneContinueBtn.classList.remove('enabled');
    }
}

/**
 * Configura los listeners para el flujo de autenticación.
 */
function setupAuthListeners() {
    const phoneInput = document.getElementById('phone-number');
    const termsCheck = document.getElementById('terms');
    const phoneContinueBtn = document.getElementById('phone-continue-btn');
    const countrySelect = document.getElementById('country-select');

    if (countrySelect) {
        countrySelect.addEventListener('change', () => {
            const selected = countrySelect.options[countrySelect.selectedIndex];
            // Actualiza placeholder con el código seleccionado
            phoneInput.placeholder = "8888 8888"; // opcional, solo para mantener ejemplo
            // Si quieres mostrar el valor en otro lugar, podrías usar un span adicional
        });
    }
    // Listener para botones de "Crear cuenta" vs "Ya tengo cuenta"
    document.body.addEventListener('click', (e) => {
        const authBtn = e.target.closest('[data-auth]');
        if (authBtn) {
            const mode = authBtn.getAttribute('data-auth');
            appState.isReturning = (mode === 'existing');
            updatePhoneScreenCopy(appState.isReturning);
        }
    });

    if (phoneInput) phoneInput.addEventListener('input', updateContinueButton);
    if (termsCheck) termsCheck.addEventListener('change', updateContinueButton);

    // Al continuar, muestra el número en la pantalla de OTP
    if (phoneContinueBtn) {
        phoneContinueBtn.addEventListener('click', () => {
            const phoneNumberDisplay = document.getElementById('display-phone-number');
            if (phoneNumberDisplay && phoneInput) {
                phoneNumberDisplay.textContent = `+505 ${phoneInput.value}`;
            }
        });
    }

    // Lógica post-verificación de código (simulada)
    const verifyBtn = document.getElementById('verify-code-btn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', () => {
            // En un caso real, aquí iría la llamada al backend.
            // Como es una simulación, vamos directo al siguiente paso.
            handlePostVerification();
        });
    }

    // Lógica de 2FA
    const btn2faContinue = document.getElementById('btn-2fa-continue');
    const skip2fa = document.getElementById('skip-2fa');
    if (btn2faContinue) btn2faContinue.addEventListener('click', () => {
        renderSectors();
        goToScreen(4); // Pantalla de sector
    });
    if (skip2fa) skip2fa.addEventListener('click', (e) => {
        e.preventDefault();
        renderSectors();
         goToScreen(6); // Pantalla de sector
    });

     // Pantallas de 2FA
    const optEmail = document.getElementById('opt-email');
    const optAuth = document.getElementById('opt-auth');

    if (optEmail) {
        optEmail.addEventListener('click', () => {
            goToScreen(4); // 03a_2fa_email (posición en screenFiles)
        });
    }

    if (optAuth) {
        optAuth.addEventListener('click', () => {
            goToScreen(5); // 03b_2fa_authenticator
        });
    }

    // Botones de verificación en cada método 2FA
    const verifyEmailBtn = document.getElementById('verify-email-btn');
    const verifyAuthBtn = document.getElementById('verify-auth-btn');

    if (verifyEmailBtn) {
        verifyEmailBtn.addEventListener('click', () => {
            renderSectors();
            goToScreen(6); // sector
        });
    }

    if (verifyAuthBtn) {
        verifyAuthBtn.addEventListener('click', () => {
            renderSectors();
            goToScreen(6); // sector
        });
    }
}

/**
 * Actualiza los textos de la pantalla de teléfono según si el usuario es nuevo o recurrente.
 */
function updatePhoneScreenCopy(isReturning) {
    const phoneTitle = document.getElementById('phone-title');
    const phoneSub = document.getElementById('phone-sub');
    if (isReturning) {
        phoneTitle.textContent = 'Ingresa a tu cuenta';
        phoneSub.textContent = 'Escribe tu celular para enviarte un código de acceso.';
    } else {
        phoneTitle.textContent = 'Crea tu cuenta en minutos.';
        phoneSub.textContent = 'Ingresa tu celular y te enviaremos un código. Sin contraseñas.';
    }
}

/**
 * Decide a qué pantalla ir después de la verificación del código OTP/2FA.
 */
function handlePostVerification() {
      if (appState.isReturning) {
        // Usuario existente va al arqueo de caja o a su home.
        goToScreen(9);
    } else {
        // Usuario nuevo → ir a la pantalla de 2FA por correo
        goToScreen(3); // Pantalla 2FA
        showEmailStep(); // 👈 Aquí debes llamar la función
    }
}

function showEmailStep() {
  const registerView = document.getElementById("register-email-view");
  const verifyView = document.getElementById("verify-email-view");

  if (!appState.userEmail) {
    // Usuario nuevo → registrar correo
    registerView.style.display = "block";
    verifyView.style.display = "none";

    const saveBtn = document.getElementById("save-email-btn");
    saveBtn.addEventListener("click", () => {
      const emailInput = document.getElementById("email-input").value.trim();
      if (emailInput) {
        appState.userEmail = emailInput;
        // Aquí podrías enviar el correo al backend para guardarlo
        registerView.style.display = "none";
        verifyView.style.display = "block";
      }
    });
  } else {
    // Usuario recurrente → verificar con OTP
    registerView.style.display = "none";
    verifyView.style.display = "block";
  }
}
