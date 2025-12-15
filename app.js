// Daily Battle App - Main JavaScript

const STORAGE_KEY = 'dailyBattle';
const INSTALL_DISMISSED_KEY = 'installDismissed';

// State
let state = {
    habit: null,
    history: {},
    cooldownEnd: null
};

let cooldownInterval = null;
let calendarMonth = new Date();
let deferredPrompt = null;

// Utility Functions
function getDateKey(date = new Date()) {
    return date.toISOString().split('T')[0];
}

function getTodayKey() {
    return getDateKey(new Date());
}

function getYesterdayKey() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return getDateKey(yesterday);
}

function getDayData(dateKey) {
    return state.history[dateKey] || { good: 0, bad: 0, entries: [] };
}

function calculateRatio(good, bad) {
    const total = good + bad;
    if (total === 0) return 0.5;
    return good / total;
}

function calculateBalance(good, bad) {
    return good - bad;
}

function ratioToColor(ratio, hasData = true) {
    if (!hasData) return { r: 128, g: 128, b: 128 };

    // Red (0%) -> Yellow (50%) -> Green (100%)
    let r, g, b;

    if (ratio <= 0.5) {
        // Red to Yellow
        const t = ratio * 2;
        r = 239;
        g = Math.round(68 + (180 - 68) * t);
        b = Math.round(68 + (68 - 68) * t);
    } else {
        // Yellow to Green
        const t = (ratio - 0.5) * 2;
        r = Math.round(239 - (239 - 34) * t);
        g = Math.round(180 + (197 - 180) * t);
        b = Math.round(68 + (94 - 68) * t);
    }

    return { r, g, b };
}

function colorToString(color) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function calculateStreak() {
    let streak = 0;
    const today = new Date();

    // Check today first
    const todayData = getDayData(getTodayKey());
    const todayBalance = calculateBalance(todayData.good, todayData.bad);
    const todayHasData = todayData.good + todayData.bad > 0;

    if (todayHasData && todayBalance > 0) {
        streak = 1;
    } else if (todayHasData && todayBalance <= 0) {
        return 0;
    }
    // If no data today, we can still count previous days

    // Count backwards from yesterday
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1);

    while (true) {
        const dateKey = getDateKey(checkDate);
        const dayData = getDayData(dateKey);
        const hasData = dayData.good + dayData.bad > 0;

        if (!hasData) break;

        const balance = calculateBalance(dayData.good, dayData.bad);
        if (balance <= 0) break;

        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
}

function formatTime(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function vibrate(pattern) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// Storage Functions
function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Failed to save state:', e);
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            state = {
                habit: parsed.habit || null,
                history: parsed.history || {},
                cooldownEnd: parsed.cooldownEnd || null
            };
            return true;
        }
    } catch (e) {
        console.error('Failed to load state:', e);
    }
    return false;
}

function clearState() {
    localStorage.removeItem(STORAGE_KEY);
    state = { habit: null, history: {}, cooldownEnd: null };
}

// UI Update Functions
function updateMainUI() {
    const todayData = getDayData(getTodayKey());
    const yesterdayData = getDayData(getYesterdayKey());

    // Header
    document.getElementById('header-habit-name').textContent = state.habit.name;
    document.getElementById('header-streak').textContent = `Streak: ${calculateStreak()} 🔥`;

    // Question
    document.getElementById('battle-question').textContent = state.habit.question;

    // Scores
    document.getElementById('good-count').textContent = todayData.good;
    document.getElementById('bad-count').textContent = todayData.bad;

    // Balance
    const balance = calculateBalance(todayData.good, todayData.bad);
    const balanceEl = document.getElementById('balance-display');
    const balanceValue = document.getElementById('balance-value');

    balanceValue.textContent = balance > 0 ? `+${balance}` : balance.toString();
    balanceEl.className = 'balance ' + (balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'neutral');

    // Progress bar
    const ratio = calculateRatio(todayData.good, todayData.bad);
    const hasData = todayData.good + todayData.bad > 0;
    const progressFill = document.getElementById('progress-fill');
    progressFill.style.width = `${ratio * 100}%`;
    progressFill.style.backgroundPosition = `${(1 - ratio) * 100}% 0`;

    if (!hasData) {
        progressFill.style.background = '#808080';
    } else {
        progressFill.style.background = 'linear-gradient(90deg, #ef4444, #eab308, #22c55e)';
        progressFill.style.backgroundSize = '200% 100%';
    }

    // Comparison
    const todayRatio = calculateRatio(todayData.good, todayData.bad);
    const todayBalance = calculateBalance(todayData.good, todayData.bad);
    const todayHasData = todayData.good + todayData.bad > 0;
    const todayColor = ratioToColor(todayRatio, todayHasData);

    document.getElementById('today-color').style.backgroundColor = colorToString(todayColor);
    const todayBalanceEl = document.getElementById('today-balance');
    todayBalanceEl.textContent = todayBalance > 0 ? `+${todayBalance}` : todayBalance.toString();
    todayBalanceEl.className = 'comparison-value ' + (todayBalance > 0 ? 'positive' : todayBalance < 0 ? 'negative' : 'neutral');

    const yesterdayRatio = calculateRatio(yesterdayData.good, yesterdayData.bad);
    const yesterdayBalance = calculateBalance(yesterdayData.good, yesterdayData.bad);
    const yesterdayHasData = yesterdayData.good + yesterdayData.bad > 0;
    const yesterdayColor = ratioToColor(yesterdayRatio, yesterdayHasData);

    document.getElementById('yesterday-color').style.backgroundColor = colorToString(yesterdayColor);
    const yesterdayBalanceEl = document.getElementById('yesterday-balance');
    yesterdayBalanceEl.textContent = yesterdayBalance > 0 ? `+${yesterdayBalance}` : yesterdayBalance.toString();
    yesterdayBalanceEl.className = 'comparison-value ' + (yesterdayBalance > 0 ? 'positive' : yesterdayBalance < 0 ? 'negative' : 'neutral');

    // Undo button visibility
    const undoBtn = document.getElementById('undo-btn');
    undoBtn.classList.toggle('hidden', todayData.entries.length === 0);

    // Update cooldown state
    updateCooldownUI();
}

function updateCooldownUI() {
    const now = Date.now();
    const isOnCooldown = state.cooldownEnd && state.cooldownEnd > now;

    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const cooldownDisplay = document.getElementById('cooldown-display');
    const cooldownTimer = document.getElementById('cooldown-timer');

    yesBtn.disabled = isOnCooldown;
    noBtn.disabled = isOnCooldown;
    cooldownDisplay.classList.toggle('hidden', !isOnCooldown);

    if (isOnCooldown) {
        const remaining = state.cooldownEnd - now;
        cooldownTimer.textContent = formatTime(remaining);

        if (!cooldownInterval) {
            cooldownInterval = setInterval(() => {
                const newRemaining = state.cooldownEnd - Date.now();
                if (newRemaining <= 0) {
                    clearInterval(cooldownInterval);
                    cooldownInterval = null;
                    state.cooldownEnd = null;
                    saveState();
                    updateCooldownUI();
                } else {
                    cooldownTimer.textContent = formatTime(newRemaining);
                }
            }, 1000);
        }
    } else {
        if (cooldownInterval) {
            clearInterval(cooldownInterval);
            cooldownInterval = null;
        }
    }
}

function updateStatsUI() {
    // Streak
    document.getElementById('streak-count').textContent = calculateStreak();

    // Week grid
    updateWeekGrid();

    // Calendar
    updateCalendar();
}

function updateWeekGrid() {
    const weekGrid = document.getElementById('week-grid');
    weekGrid.innerHTML = '';

    const dayNames = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = getDateKey(date);
        const dayData = getDayData(dateKey);
        const hasData = dayData.good + dayData.bad > 0;

        const ratio = calculateRatio(dayData.good, dayData.bad);
        const balance = calculateBalance(dayData.good, dayData.bad);
        const color = ratioToColor(ratio, hasData);

        const dayEl = document.createElement('div');
        dayEl.className = 'week-day';
        dayEl.innerHTML = `
            <span class="week-day-label">${dayNames[date.getDay()]}</span>
            <div class="week-day-box" style="background-color: ${colorToString(color)}"></div>
            <span class="week-day-value" style="color: ${balance > 0 ? 'var(--good-color)' : balance < 0 ? 'var(--bad-color)' : 'var(--text-muted)'}">${hasData ? (balance > 0 ? '+' + balance : balance) : '-'}</span>
        `;
        weekGrid.appendChild(dayEl);
    }
}

function updateCalendar() {
    const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
                       'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

    document.getElementById('calendar-title').textContent =
        `${monthNames[calendarMonth.getMonth()]} ${calendarMonth.getFullYear()}`;

    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';

    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();

    const today = new Date();
    const todayKey = getTodayKey();

    // Empty cells before first day
    for (let i = 0; i < startDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }

    // Days of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateKey = getDateKey(date);
        const dayData = getDayData(dateKey);
        const hasData = dayData.good + dayData.bad > 0;

        const ratio = calculateRatio(dayData.good, dayData.bad);
        const balance = calculateBalance(dayData.good, dayData.bad);
        const color = ratioToColor(ratio, hasData);

        const isToday = dateKey === todayKey;
        const isFuture = date > today;

        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day' + (isToday ? ' today' : '') + (hasData ? ' has-data' : '');

        if (isFuture) {
            dayEl.classList.add('empty');
        } else {
            dayEl.style.backgroundColor = colorToString(color);
        }

        dayEl.innerHTML = `
            <span class="calendar-day-number">${day}</span>
            ${hasData ? `<span style="color: ${balance > 0 ? 'white' : balance < 0 ? 'white' : 'rgba(255,255,255,0.7)'}">${balance > 0 ? '+' + balance : balance}</span>` : ''}
        `;
        calendarGrid.appendChild(dayEl);
    }
}

// Event Handlers
function handleYesClick() {
    if (state.cooldownEnd && state.cooldownEnd > Date.now()) return;

    vibrate(50);
    recordEntry(true);
}

function handleNoClick() {
    if (state.cooldownEnd && state.cooldownEnd > Date.now()) return;

    vibrate([50, 50, 50, 50, 50]);
    recordEntry(false);
}

function recordEntry(isGood) {
    const todayKey = getTodayKey();

    if (!state.history[todayKey]) {
        state.history[todayKey] = { good: 0, bad: 0, entries: [] };
    }

    const entry = {
        time: Date.now(),
        isGood: isGood
    };

    state.history[todayKey].entries.push(entry);

    if (isGood) {
        state.history[todayKey].good++;
    } else {
        state.history[todayKey].bad++;
    }

    // Set cooldown
    state.cooldownEnd = Date.now() + (state.habit.cooldownMinutes * 60 * 1000);

    saveState();
    updateMainUI();
}

function handleUndo() {
    const todayKey = getTodayKey();
    const todayData = state.history[todayKey];

    if (!todayData || todayData.entries.length === 0) return;

    const lastEntry = todayData.entries.pop();

    if (lastEntry.isGood) {
        todayData.good--;
    } else {
        todayData.bad--;
    }

    // Reset cooldown
    state.cooldownEnd = null;

    saveState();
    updateMainUI();
}

function handleTabSwitch(tabName) {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    document.getElementById('battle-tab').classList.toggle('hidden', tabName !== 'battle');
    document.getElementById('stats-tab').classList.toggle('hidden', tabName !== 'stats');

    if (tabName === 'stats') {
        updateStatsUI();
    }
}

function handleCalendarNav(direction) {
    calendarMonth.setMonth(calendarMonth.getMonth() + direction);
    updateCalendar();
}

// Setup Flow
function initSetup() {
    const nameInput = document.getElementById('habit-name');
    const questionInput = document.getElementById('habit-question');
    const startBtn = document.getElementById('start-battle-btn');
    const cooldownBtns = document.querySelectorAll('#setup-screen .cooldown-btn');

    let selectedCooldown = 5;

    function validateForm() {
        startBtn.disabled = !nameInput.value.trim() || !questionInput.value.trim();
    }

    nameInput.addEventListener('input', validateForm);
    questionInput.addEventListener('input', validateForm);

    cooldownBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            cooldownBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCooldown = parseInt(btn.dataset.minutes);
        });
    });

    startBtn.addEventListener('click', () => {
        state.habit = {
            name: nameInput.value.trim(),
            question: questionInput.value.trim(),
            cooldownMinutes: selectedCooldown
        };
        saveState();
        showMainApp();
    });
}

function showSetup() {
    document.getElementById('setup-screen').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
}

function showMainApp() {
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    updateMainUI();
    checkInstallPrompt();
}

// Settings
function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const closeBtn = document.getElementById('close-settings');
    const modal = document.getElementById('settings-modal');
    const saveBtn = document.getElementById('save-settings');
    const exportBtn = document.getElementById('export-data');
    const importInput = document.getElementById('import-data');
    const clearBtn = document.getElementById('clear-data');
    const cooldownBtns = document.querySelectorAll('#settings-cooldown .cooldown-btn');

    let settingsCooldown = 5;

    settingsBtn.addEventListener('click', () => {
        // Populate fields
        document.getElementById('settings-name').value = state.habit.name;
        document.getElementById('settings-question').value = state.habit.question;
        settingsCooldown = state.habit.cooldownMinutes;

        cooldownBtns.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.minutes) === settingsCooldown);
        });

        modal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    cooldownBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            cooldownBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            settingsCooldown = parseInt(btn.dataset.minutes);
        });
    });

    saveBtn.addEventListener('click', () => {
        const name = document.getElementById('settings-name').value.trim();
        const question = document.getElementById('settings-question').value.trim();

        if (name && question) {
            state.habit.name = name;
            state.habit.question = question;
            state.habit.cooldownMinutes = settingsCooldown;
            saveState();
            updateMainUI();
            modal.classList.add('hidden');
        }
    });

    exportBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(state, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `daily-battle-${getTodayKey()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);

                if (!imported.habit || !imported.habit.name || !imported.habit.question) {
                    alert('Ongeldig bestandsformaat');
                    return;
                }

                state = {
                    habit: imported.habit,
                    history: imported.history || {},
                    cooldownEnd: imported.cooldownEnd || null
                };

                saveState();
                modal.classList.add('hidden');
                updateMainUI();
                alert('Data succesvol geïmporteerd!');
            } catch (err) {
                alert('Fout bij importeren: ' + err.message);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    });

    clearBtn.addEventListener('click', () => {
        if (confirm('Weet je zeker dat je alle data wilt wissen?')) {
            if (confirm('Dit kan niet ongedaan worden gemaakt. Doorgaan?')) {
                clearState();
                location.reload();
            }
        }
    });
}

// PWA Install
function checkInstallPrompt() {
    // Don't show in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Check if user dismissed before
    const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY);
    if (dismissed) return;

    // Show after 5 seconds
    setTimeout(() => {
        const banner = document.getElementById('install-banner');
        banner.classList.remove('hidden');
    }, 5000);
}

function initInstallPrompt() {
    const banner = document.getElementById('install-banner');
    const laterBtn = document.getElementById('install-later');
    const installBtn = document.getElementById('install-now');

    // Capture install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });

    laterBtn.addEventListener('click', () => {
        banner.classList.add('hidden');
        localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
    });

    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const result = await deferredPrompt.userChoice;
            if (result.outcome === 'accepted') {
                banner.classList.add('hidden');
            }
            deferredPrompt = null;
        } else {
            // Fallback instructions for iOS
            alert('Om de app te installeren:\n\n1. Tik op het deel-icoon\n2. Kies "Zet op beginscherm"');
            banner.classList.add('hidden');
        }
    });
}

// Navigation
function initNavigation() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            handleTabSwitch(tab.dataset.tab);
        });
    });

    document.getElementById('prev-month').addEventListener('click', () => handleCalendarNav(-1));
    document.getElementById('next-month').addEventListener('click', () => handleCalendarNav(1));
}

// Main Event Listeners
function initEventListeners() {
    document.getElementById('yes-btn').addEventListener('click', handleYesClick);
    document.getElementById('no-btn').addEventListener('click', handleNoClick);
    document.getElementById('undo-btn').addEventListener('click', handleUndo);

    initNavigation();
    initSettings();
    initInstallPrompt();
}

// Service Worker Registration
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    }
}

// Initialize App
function init() {
    registerServiceWorker();

    const hasData = loadState();

    if (hasData && state.habit) {
        showMainApp();
    } else {
        showSetup();
    }

    initSetup();
    initEventListeners();
}

// Start
document.addEventListener('DOMContentLoaded', init);
