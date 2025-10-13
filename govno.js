// ==Mod==
// @name много говна
// @author AFGAN Store
// @description говно
// @version 1.0
// ==/Mod==

(function() {
    'use strict';
    
    // Создаем стили для анимаций
    const poopStyles = `
        @keyframes poopFloat {
            0%, 100% { 
                transform: translate(0, 0) rotate(0deg) scale(1); 
            }
            25% { 
                transform: translate(10px, -15px) rotate(5deg) scale(1.1); 
            }
            50% { 
                transform: translate(-5px, -25px) rotate(-3deg) scale(1.05); 
            }
            75% { 
                transform: translate(8px, -18px) rotate(2deg) scale(1.08); 
            }
        }
        
        @keyframes poopSpin {
            0% { 
                transform: rotate(0deg) scale(1); 
            }
            50% { 
                transform: rotate(180deg) scale(1.2); 
            }
            100% { 
                transform: rotate(360deg) scale(1); 
            }
        }
        
        @keyframes poopBounce {
            0%, 100% { 
                transform: translateY(0px) scale(1); 
            }
            25% { 
                transform: translateY(-30px) scale(1.3); 
            }
            50% { 
                transform: translateY(0px) scale(0.9); 
            }
            75% { 
                transform: translateY(-15px) scale(1.1); 
            }
        }
        
        @keyframes poopDrift {
            0% { 
                transform: translateX(0px) rotate(0deg); 
            }
            33% { 
                transform: translateX(50px) rotate(120deg); 
            }
            66% { 
                transform: translateX(-30px) rotate(240deg); 
            }
            100% { 
                transform: translateX(0px) rotate(360deg); 
            }
        }
        
        @keyframes poopWiggle {
            0%, 100% { 
                transform: rotate(-8deg) scale(1); 
            }
            25% { 
                transform: rotate(8deg) scale(1.1); 
            }
            50% { 
                transform: rotate(-5deg) scale(1.05); 
            }
            75% { 
                transform: rotate(5deg) scale(1.08); 
            }
        }
        
        @keyframes poopPulse {
            0%, 100% { 
                transform: scale(1); 
                opacity: 1;
            }
            50% { 
                transform: scale(1.4); 
                opacity: 0.8;
            }
        }
        
        .poop-emoji {
            position: fixed;
            z-index: 9999;
            pointer-events: none;
            user-select: none;
            cursor: default;
            text-shadow: 
                2px 2px 4px rgba(0,0,0,0.7),
                0 0 10px rgba(139, 69, 19, 0.5);
            filter: drop-shadow(0 0 8px rgba(139, 69, 19, 0.6));
            transition: transform 0.3s ease;
        }
        
        .poop-emoji:hover {
            transform: scale(1.3) !important;
            filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)) brightness(1.2);
            z-index: 10000 !important;
        }
    `;
    
    // Добавляем стили в документ
    const styleSheet = document.createElement('style');
    styleSheet.textContent = poopStyles;
    document.head.appendChild(styleSheet);
    
    // Массив анимаций
    const animations = ['poopFloat', 'poopSpin', 'poopBounce', 'poopDrift', 'poopWiggle', 'poopPulse'];
    
    // Счетчик созданных какашек
    let poopCount = 0;
    let spawnInterval;
    
    // Функция создания какашки
    function createPoop() {
        // Случайная позиция на экране
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 100);
        
        // Случайный размер от 25px до 70px
        const size = Math.random() * 45 + 25;
        
        // Случайная анимация
        const animation = animations[Math.floor(Math.random() * animations.length)];
        
        // Случайная длительность анимации от 3 до 8 секунд
        const duration = Math.random() * 5 + 3;
        
        // Случайный оттенок коричневого
        const hue = Math.random() * 30 + 20; // 20-50 градусов hue rotate
        const saturation = Math.random() * 50 + 80; // 80-130% saturation
        const brightness = Math.random() * 30 + 70; // 70-100% brightness
        
        // Создаем элемент какашки
        const poop = document.createElement('div');
        poop.className = 'poop-emoji';
        poop.innerHTML = '💩';
        poop.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            font-size: ${size}px;
            animation: ${animation} ${duration}s infinite ease-in-out;
            filter: hue-rotate(${hue}deg) saturate(${saturation}%) brightness(${brightness}%) 
                    drop-shadow(0 0 8px rgba(139, 69, 19, 0.6));
            transform: rotate(${Math.random() * 360}deg);
        `;
        
        // Добавляем на страницу
        document.body.appendChild(poop);
        
        // Увеличиваем счетчик
        poopCount++;
        
        // Обновляем заголовок страницы с количеством какашек
        updateTitle();
        
        // Случайное изменение каждые 10-30 секунд
        setTimeout(() => {
            if (poop.parentNode) {
                changePoopAnimation(poop);
            }
        }, Math.random() * 20000 + 10000);
        
        return poop;
    }
    
    // Функция изменения анимации какашки
    function changePoopAnimation(poop) {
        if (!poop.parentNode) return;
        
        const newAnimation = animations[Math.floor(Math.random() * animations.length)];
        const newDuration = Math.random() * 5 + 3;
        const newHue = Math.random() * 30 + 20;
        
        poop.style.animation = `${newAnimation} ${newDuration}s infinite ease-in-out`;
        poop.style.filter = `hue-rotate(${newHue}deg) saturate(${Math.random() * 50 + 80}%) brightness(${Math.random() * 30 + 70}%) 
                            drop-shadow(0 0 8px rgba(139, 69, 19, 0.6))`;
    }
    
    // Функция обновления заголовка страницы
    function updateTitle() {
        const baseTitle = document.title.replace(/💩\s*\d+\s*\|?\s*/, '');
        document.title = `💩 ${poopCount} | ${baseTitle}`;
    }
    
    // Функция массового спавна
    function massSpawnPoops(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                createPoop();
            }, i * 50); // Небольшая задержка между созданием
        }
    }
    
    // Функция создания какашки вокруг курсора
    function spawnAroundCursor(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const offsetX = (Math.random() - 0.5) * 300;
                const offsetY = (Math.random() - 0.5) * 300;
                createPoopAt(x + offsetX, y + offsetY);
            }, i * 100);
        }
    }
    
    // Функция создания какашки в конкретной позиции
    function createPoopAt(x, y) {
        const size = Math.random() * 45 + 25;
        const animation = animations[Math.floor(Math.random() * animations.length)];
        const duration = Math.random() * 5 + 3;
        const hue = Math.random() * 30 + 20;
        
        const poop = document.createElement('div');
        poop.className = 'poop-emoji';
        poop.innerHTML = '💩';
        poop.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            font-size: ${size}px;
            animation: ${animation} ${duration}s infinite ease-in-out;
            filter: hue-rotate(${hue}deg) saturate(${Math.random() * 50 + 80}%) brightness(${Math.random() * 30 + 70}%) 
                    drop-shadow(0 0 8px rgba(139, 69, 19, 0.6));
        `;
        
        document.body.appendChild(poop);
        poopCount++;
        updateTitle();
        
        return poop;
    }
    
    // Обработчики событий для интерактивности
    function setupInteractivity() {
        // Спавн какашек при клике
        document.addEventListener('click', (e) => {
            spawnAroundCursor(e.clientX, e.clientY, 3);
        });
        
        // Спавн какашек при движении мыши (с ограничением частоты)
        let lastMouseSpawn = 0;
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastMouseSpawn > 500) { // Не чаще чем раз в 500ms
                if (Math.random() < 0.3) { // 30% шанс
                    createPoopAt(e.clientX + (Math.random() - 0.5) * 100, 
                                e.clientY + (Math.random() - 0.5) * 100);
                    lastMouseSpawn = now;
                }
            }
        });
        
        // Спавн какашек при прокрутке
        let lastScrollSpawn = 0;
        window.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastScrollSpawn > 200) { // Не чаще чем раз в 200ms
                if (Math.random() < 0.4) { // 40% шанс
                    createPoop();
                    lastScrollSpawn = now;
                }
            }
        });
        
        // Спавн какашек при изменении размера окна
        window.addEventListener('resize', () => {
            massSpawnPoops(3);
        });
        
        // Спавн какашек при нажатии клавиш
        document.addEventListener('keydown', (e) => {
            if (Math.random() < 0.5) {
                massSpawnPoops(2);
            }
        });
    }
    
    // Запуск бесконечного спавна
    function startInfiniteSpawning() {
        // Начальный массовый спавн
        massSpawnPoops(15);
        
        // Быстрый интервал спавна
        spawnInterval = setInterval(() => {
            // Спавним от 1 до 3 какашек за раз
            const spawnCount = Math.floor(Math.random() * 3) + 1;
            massSpawnPoops(spawnCount);
        }, 300); // Очень быстро - каждые 300ms
        
        // Дополнительный случайный массовый спавн
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% шанс каждые 5 секунд
                massSpawnPoops(10 + Math.floor(Math.random() * 15));
            }
        }, 5000);
    }
    
    // Инициализация
    function init() {
        console.log('💩 Запуск бесконечного спавна какашек...');
        
        setupInteractivity();
        startInfiniteSpawning();
        
        console.log('✅ Бесконечные какашки активированы!');
        
        // Показываем стартовое сообщение в консоли
        setTimeout(() => {
            console.log('💩 Какашки будут появляться ВЕЧНО!');
            console.log('💩 Кликайте, двигайте мышью, скроллите для большего количества какашек!');
        }, 1000);
    }
    
    // Запускаем когда страница загружена
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Экспортируем функции для глобального доступа (на всякий случай)
    window.poopArmy = {
        createPoop,
        massSpawnPoops,
        spawnAroundCursor,
        getPoopCount: () => poopCount
    };
    
})();
