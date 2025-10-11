// ==Mod==
// @name много деняг брад обещаю
// @author PM Example Mods
// @description добавляет дохуя денег!!!!!!1!
// @version 1.0
// ==/Mod==

(function() {
    'use strict';
    
    try {
        const input = prompt('Введите количество для добавления:', '1000');
        
        if (input === null) {
            storeManager.showNotification('❌ Отменено', 'info', 2000);
            return;
        }
        
        if (input.trim() === '') {
            storeManager.showNotification('❌ Введите число', 'error', 3000);
            return;
        }
        
        const amount = Number(input.trim());
        
        if (isNaN(amount) || amount <= 0) {
            storeManager.showNotification('❌ Введите положительное число', 'error', 3000);
            return;
        }
        
        const oldBalance = clicker.count;
        clicker.count += amount;
        
        clicker.saveCount();
        clicker.updateDisplay();
        
        if (window.storeManager) {
            storeManager.updateBalance();
        }
        
        const formattedAmount = clicker.formatNumber ? clicker.formatNumber(amount) : amount.toLocaleString();
        const formattedNewBalance = clicker.formatNumber ? clicker.formatNumber(clicker.count) : clicker.count.toLocaleString();
        
        storeManager.showNotification(`✅ Готово!`, 'success', 4000);
        
    } catch (error) {
        storeManager.showNotification('❌ Ошибка', 'error', 3000);
    }
})();