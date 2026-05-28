// ==Mod==
// @name ECserver
// @author ECserver
// @version 1.3
// @description Синхронизация баланса и авто-обновление через API ECserver
// ==/Mod==

const API_URL = "https://catflopper.serv00.net/api.php"; 

const SYNC_INTERVAL = 1000; 

async function sendApi(action, extraParams = {}) {
    const body = new URLSearchParams({ action, ...extraParams });
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body
        });
        return await res.json();
    } catch (e) {
        return { error: "Ошибка соединения с сервером" };
    }
}

function syncBalance() {
    const token = localStorage.getItem("api_token");
    if (!token) return;
    
    sendApi("balance", { token }).then(res => {
        if (res.success) {
            clicker.count = res.balance;
            localStorage.setItem("clickCount", res.balance);
            clicker.updateDisplay();
            if (window.storeManager) window.storeManager.updateBalance();
        } else if (res.error === "Неверный токен") {
            logout(true);
        }
    });
}

// Переопределяем логику кликов (строго +1)
clicker.handleClick = function(event) {
    const increment = 1;
    this.count += increment;
    this.playClickSound();
    this.showClickOverlay(event, increment);
    this.animateClick();
    this.updateDisplay();

    const token = localStorage.getItem("api_token");
    if (token) {
        sendApi("click", { token }).then(res => {
            if (res.success) {
                this.count = res.balance;
                localStorage.setItem("clickCount", res.balance);
                this.updateDisplay();
                if (window.storeManager) window.storeManager.updateBalance();
            }
        });
    } else {
        this.saveCount();
        if (window.storeManager) window.storeManager.updateBalance();
    }
};

clicker.getIncrementValue = () => 1;

// Управление интерфейсом авторизации в настройках
function updateAuthUI() {
    const token = localStorage.getItem("api_token");
    const container = document.getElementById("api-auth-container");
    if (!container) return;

    if (token) {
        container.innerHTML = `
            <div class="setting-item" style="flex-direction: column; align-items: stretch; gap: 10px;">
                <span class="setting-label" style="text-align:center; color: var(--success-color); font-weight:bold;">✅ Вошли через ECserver</span>
                <button class="danger-btn" id="api-logout-btn">Выйти из аккаунта</button>
            </div>
        `;
        document.getElementById("api-logout-btn").onclick = () => logout();
    } else {
        container.innerHTML = `
            <div class="setting-item" style="flex-direction: column; align-items: stretch; gap: 10px;">
                <span class="setting-label" style="text-align:center; font-weight:bold;">☁️ Онлайн сохранение</span>
                <input type="text" id="api-login" placeholder="Логин" class="color-picker-input" style="display:block;">
                <input type="password" id="api-pass" placeholder="Пароль" class="color-picker-input" style="display:block;">
                <div style="display: flex; gap: 10px;">
                    <button class="link-btn" id="api-signin-btn" style="flex:1; padding: 0.75rem;">Войти</button>
                    <button class="link-btn" id="api-signup-btn" style="flex:1; padding: 0.75rem; background: linear-gradient(135deg, var(--success-color) 0%, #45a049 100%);">Регистрация</button>
                </div>
            </div>
        `;
        document.getElementById("api-signin-btn").onclick = () => auth("login", "api-login", "api-pass");
        document.getElementById("api-signup-btn").onclick = () => auth("register", "api-login", "api-pass");
    }
}

async function auth(action, loginId, passId, modalToClose = null) {
    const u = document.getElementById(loginId).value.trim();
    const p = document.getElementById(passId).value;
    
    if (!u || !p) return alert("Введите логин и пароль!");

    const res = await sendApi(action, { username: u, password: p });
    if (res.success) {
        localStorage.setItem("api_token", res.token);
        clicker.count = res.balance;
        localStorage.setItem("clickCount", res.balance);
        clicker.updateDisplay();
        updateAuthUI();
        alert("Успешно вошли!");
        
        if (modalToClose) modalToClose.remove();
        const startModal = document.getElementById("auth-modal");
        if (startModal) startModal.remove();
    } else {
        alert("Ошибка: " + res.error);
    }
}

function logout(silent = false) {
    if (silent || confirm("Точно выйти из аккаунта?")) {
        localStorage.removeItem("api_token");
        updateAuthUI();
        const ecModal = document.getElementById("ecserver-modal");
        if (ecModal) ecModal.remove();
    }
}

function createSettingsUI() {
    if (document.getElementById("api-auth-container")) return;
    const target = document.querySelector('[data-category="actions"] .setting-group');
    if (!target) return;

    const wrapper = document.createElement("div");
    wrapper.id = "api-auth-container";
    wrapper.style.marginBottom = "1rem";
    target.prepend(wrapper);
    updateAuthUI();
}

// Создание кнопки "ECserver" рядом с шестеренкой настроек
function createHeaderButton() {
    if (document.getElementById("ecserverBtn")) return;
    const settingsBtn = document.getElementById("settingsBtn");
    if (!settingsBtn) return;

    const ecBtn = document.createElement("button");
    ecBtn.id = "ecserverBtn";
    ecBtn.className = "icon-btn";
    ecBtn.innerText = "EC";
    ecBtn.title = "ECserver";
    ecBtn.style.marginLeft = "10px";
    ecBtn.style.fontWeight = "bold";
    ecBtn.style.fontSize = "0.9rem";
    ecBtn.style.background = "rgba(103, 80, 164, 0.9)";
    
    settingsBtn.parentNode.insertBefore(ecBtn, settingsBtn.nextSibling);
    ecBtn.onclick = openEcserverModal;
}

// Модальное окно при клике на кнопку "EC"
function openEcserverModal() {
    const existing = document.getElementById("ecserver-modal");
    if (existing) existing.remove();

    const token = localStorage.getItem("api_token");
    const modal = document.createElement("div");
    modal.id = "ecserver-modal";
    modal.className = "confirmation-modal active";
    
    if (token) {
        modal.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-header">
                    <div class="confirmation-icon">☁️</div>
                    <h3 class="confirmation-title">ECserver</h3>
                </div>
                <p class="confirmation-message" style="text-align:center; color: var(--success-color); font-weight:bold;">Вы авторизованы в облаке!</p>
                <div class="confirmation-actions" style="justify-content: center; gap: 10px;">
                    <button class="confirm-btn confirm-no" id="ec-close">Закрыть</button>
                    <button class="confirm-btn confirm-yes" id="ec-logout" style="background: var(--error-color);">Выйти</button>
                </div>
            </div>
        `;
    } else {
        modal.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-header">
                    <div class="confirmation-icon">☁️</div>
                    <h3 class="confirmation-title">Вход в ECserver</h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                    <input type="text" id="ec-login" placeholder="Логин" class="color-picker-input">
                    <input type="password" id="ec-pass" placeholder="Пароль" class="color-picker-input">
                </div>
                <div class="confirmation-actions">
                    <button class="confirm-btn confirm-no" id="ec-close">Отмена</button>
                    <button class="confirm-btn confirm-yes" id="ec-reg" style="background: linear-gradient(135deg, var(--success-color) 0%, #45a049 100%);">Регнуть</button>
                    <button class="confirm-btn confirm-yes" id="ec-auth">Войти</button>
                </div>
            </div>
        `;
    }
    document.body.appendChild(modal);

    document.getElementById("ec-close").onclick = () => {
        modal.classList.remove("active");
        setTimeout(() => modal.remove(), 300);
    };

    if (token) {
        document.getElementById("ec-logout").onclick = () => logout();
    } else {
        document.getElementById("ec-auth").onclick = () => auth("login", "ec-login", "ec-pass", modal);
        document.getElementById("ec-reg").onclick = () => auth("register", "ec-login", "ec-pass", modal);
    }
}

// Окно при старте игры
function showStartupModal() {
    if (localStorage.getItem("api_token") || sessionStorage.getItem("auth_skipped")) return;

    const modal = document.createElement("div");
    modal.id = "auth-modal";
    modal.className = "confirmation-modal active";
    modal.innerHTML = `
        <div class="confirmation-content">
            <div class="confirmation-header">
                <div class="confirmation-icon">☁️</div>
                <h3 class="confirmation-title">ECserver Облако</h3>
            </div>
            <p class="confirmation-message">Войдите или зарегистрируйтесь, чтобы сохранять баланс на сервере!</p>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
                <input type="text" id="modal-login" placeholder="Логин" class="color-picker-input">
                <input type="password" id="modal-pass" placeholder="Пароль" class="color-picker-input">
            </div>
            <div class="confirmation-actions">
                <button class="confirm-btn confirm-no" id="modal-skip">Позже</button>
                <button class="confirm-btn confirm-yes" id="modal-reg" style="background: linear-gradient(135deg, var(--success-color) 0%, #45a049 100%);">Регнуть</button>
                <button class="confirm-btn confirm-yes" id="modal-log">Войти</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("modal-skip").onclick = () => {
        sessionStorage.setItem("auth_skipped", "true");
        modal.classList.remove("active");
        setTimeout(() => modal.remove(), 300);
    };

    document.getElementById("modal-log").onclick = () => auth("login", "modal-login", "modal-pass");
    document.getElementById("modal-reg").onclick = () => auth("register", "modal-login", "modal-pass");
}

// === ИНИЦИАЛИЗАЦИЯ МОДА ===
createHeaderButton();
createSettingsUI();

// Первый запуск синхронизации при загрузке
syncBalance();

// ФИКС: Запуск фонового бесконечного обновления баланса
setInterval(syncBalance, SYNC_INTERVAL);

setTimeout(showStartupModal, 800);

document.getElementById("settingsBtn").addEventListener("click", () => {
    setTimeout(createSettingsUI, 100);
});