// Валюта: Польский злотый (PLN)
// API: https://www.cbr-xml-daily.ru/

let currentRate = 0; // Текущий курс (сколько рублей за 1 PLN)

// Функция загрузки текущего курса
async function loadCurrentRate() {
    try {
        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
        const data = await response.json();

        // Курс PLN к RUB
        const plnRate = data.Valute.PLN.Value;
        const plnNominal = data.Valute.PLN.Nominal;
        currentRate = plnRate / plnNominal;

        // Обновляем отображение
        document.getElementById('current-rate').innerHTML = `Текущий курс: 1 PLN = ${currentRate.toFixed(4)} ₽`;
        document.getElementById('rub-per-pln').textContent = currentRate.toFixed(4);

        // Обновляем калькулятор
        updateCalculator();

        return currentRate;
    } catch (error) {
        console.error('Ошибка загрузки курса:', error);
        document.getElementById('current-rate').innerHTML = '❌ Ошибка загрузки курса. Обновите страницу.';
        return null;
    }
}

// Калькулятор
function updateCalculator() {
    const rubInput = document.getElementById('rub-input');
    const plnInput = document.getElementById('pln-input');

    if (rubInput === document.activeElement) {
        // Если пользователь вводит рубли
        const rubles = parseFloat(rubInput.value) || 0;
        const pln = rubles / currentRate;
        plnInput.value = pln.toFixed(2);
    } else {
        // Если пользователь вводит злотые
        const pln = parseFloat(plnInput.value) || 0;
        const rubles = pln * currentRate;
        rubInput.value = rubles.toFixed(2);
    }
}

// Обработчики для калькулятора
function setupCalculator() {
    const rubInput = document.getElementById('rub-input');
    const plnInput = document.getElementById('pln-input');

    rubInput.addEventListener('input', function () {
        const rubles = parseFloat(rubInput.value) || 0;
        const pln = rubles / currentRate;
        plnInput.value = pln.toFixed(2);
    });

    plnInput.addEventListener('input', function () {
        const pln = parseFloat(plnInput.value) || 0;
        const rubles = pln * currentRate;
        rubInput.value = rubles.toFixed(2);
    });
}

// Генерация случайных данных для диаграммы (за 30 дней)
function generateChartData() {
    const data = [];
    const today = new Date();

    // Базовая цена (текущий курс)
    const baseRate = currentRate;

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        // Генерируем изменение от -5% до +5% относительно текущего курса
        const change = (Math.random() - 0.5) * 0.1;
        let rate = baseRate * (1 + change);

        // Ограничиваем, чтобы курс был в разумных пределах
        rate = Math.max(rate, baseRate * 0.85);
        rate = Math.min(rate, baseRate * 1.15);

        data.push({
            date: date,
            rate: rate,
            dateStr: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
        });
    }

    return data;
}

// Отрисовка диаграммы
let chartData = [];

function drawChart() {
    const chartContainer = document.getElementById('chart');
    if (!chartContainer) return;

    chartContainer.innerHTML = '';

    const maxRate = Math.max(...chartData.map(d => d.rate));
    const minRate = Math.min(...chartData.map(d => d.rate));
    const range = maxRate - minRate;

    chartData.forEach((item, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';

        // Высота столбца (от 10% до 95% высоты контейнера)
        let heightPercent = 10;
        if (range > 0) {
            heightPercent = 10 + ((item.rate - minRate) / range) * 85;
        }
        bar.style.height = `${heightPercent}%`;

        // Подпись над столбцом (дата)
        bar.setAttribute('data-date', item.dateStr);
        bar.setAttribute('data-rate', item.rate.toFixed(4));

        bar.addEventListener('mouseenter', function () {
            const info = document.getElementById('chart-info');
            info.innerHTML = `📅 ${this.getAttribute('data-date')} | Курс: ${this.getAttribute('data-rate')} ₽ за 1 PLN`;
        });

        bar.addEventListener('click', function () {
            // Убираем выделение со всех столбцов
            document.querySelectorAll('.bar').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');

            const info = document.getElementById('chart-info');
            info.innerHTML = `📅 ${this.getAttribute('data-date')} | Курс: ${this.getAttribute('data-rate')} ₽ за 1 PLN | ✅ Выбран`;
        });

        chartContainer.appendChild(bar);
    });
}

// Инициализация страницы
async function initCurrency() {
    await loadCurrentRate();
    setupCalculator();

    // Генерируем данные для диаграммы
    chartData = generateChartData();
    drawChart();
}

// Запускаем после загрузки страницы
document.addEventListener('DOMContentLoaded', initCurrency);