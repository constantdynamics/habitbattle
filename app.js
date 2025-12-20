// Daily Battle App - Multi-Battle Version

const STORAGE_KEY = 'dailyBattle';
const INSTALL_DISMISSED_KEY = 'installDismissed';
const NOTIFICATION_SETTINGS_KEY = 'notificationSettings';
const THEME_KEY = 'dailyBattleTheme';
const SORT_KEY = 'dailyBattleSort';
const ONBOARDING_COMPLETED_KEY = 'dailyBattleOnboardingCompleted';

// Battle Presets - 50 battles organized by category
const BATTLE_PRESETS = [
    // Lichaamshouding & Fysiek (10)
    { category: 'Lichaamshouding', name: 'Goede houding', question: 'Zit of sta je rechtop?' },
    { category: 'Lichaamshouding', name: 'Schouders ontspannen', question: 'Zijn je schouders ontspannen?' },
    { category: 'Lichaamshouding', name: 'Kaak ontspannen', question: 'Is je kaak ontspannen?' },
    { category: 'Lichaamshouding', name: 'Niet onderuit zakken', question: 'Zit je rechtop zonder te hangen?' },
    { category: 'Lichaamshouding', name: 'Rechte rug', question: 'Is je rug recht?' },
    { category: 'Lichaamshouding', name: 'Nek recht', question: 'Is je nek in neutrale positie?' },
    { category: 'Lichaamshouding', name: 'Voeten plat', question: 'Staan je voeten plat op de grond?' },
    { category: 'Lichaamshouding', name: 'Geen gekruiste benen', question: 'Zitten je benen niet gekruist?' },
    { category: 'Lichaamshouding', name: 'Core aangespannen', question: 'Is je core licht aangespannen?' },
    { category: 'Lichaamshouding', name: 'Hoofd omhoog', question: 'Kijk je recht vooruit?' },

    // Ademhaling & Ontspanning (8)
    { category: 'Ademhaling', name: 'Diep ademen', question: 'Adem je diep en rustig?' },
    { category: 'Ademhaling', name: 'Buikademhaling', question: 'Adem je vanuit je buik?' },
    { category: 'Ademhaling', name: 'Langzaam uitademen', question: 'Adem je langzaam uit?' },
    { category: 'Ademhaling', name: 'Bewust ademen', question: 'Ben je bewust van je ademhaling?' },
    { category: 'Ademhaling', name: 'Ontspannen gezicht', question: 'Is je gezicht ontspannen?' },
    { category: 'Ademhaling', name: 'Geen adem inhouden', question: 'Houd je je adem niet in?' },
    { category: 'Ademhaling', name: 'Rustige hartslag', question: 'Voel je je rustig?' },
    { category: 'Ademhaling', name: 'Geen gespannen spieren', question: 'Zijn je spieren ontspannen?' },

    // Focus & Productiviteit (10)
    { category: 'Focus', name: 'Bij de taak blijven', question: 'Ben je gefocust op je huidige taak?' },
    { category: 'Focus', name: 'Geen afleiding', question: 'Laat je je niet afleiden?' },
    { category: 'Focus', name: 'Single-tasking', question: 'Doe je maar één ding tegelijk?' },
    { category: 'Focus', name: 'Telefoon weg', question: 'Is je telefoon uit zicht?' },
    { category: 'Focus', name: 'Notificaties uit', question: 'Zijn afleidende notificaties uit?' },
    { category: 'Focus', name: 'Geen social media', question: 'Zit je niet op social media?' },
    { category: 'Focus', name: 'Belangrijkste eerst', question: 'Werk je aan iets belangrijks?' },
    { category: 'Focus', name: 'Geen uitstelgedrag', question: 'Stel je niets uit?' },
    { category: 'Focus', name: 'Timer aan', question: 'Werk je in gefocuste blokken?' },
    { category: 'Focus', name: 'Duidelijk doel', question: 'Weet je wat je wilt bereiken?' },

    // Mentaal & Mindset (10)
    { category: 'Mentaal', name: 'Positief denken', question: 'Zijn je gedachten positief?' },
    { category: 'Mentaal', name: 'In het nu', question: 'Ben je in het moment?' },
    { category: 'Mentaal', name: 'Geen piekeren', question: 'Pieker je niet?' },
    { category: 'Mentaal', name: 'Dankbaarheid', question: 'Ben je je bewust van iets positiefs?' },
    { category: 'Mentaal', name: 'Geen zelfkritiek', question: 'Ben je aardig voor jezelf?' },
    { category: 'Mentaal', name: 'Acceptatie', question: 'Accepteer je de huidige situatie?' },
    { category: 'Mentaal', name: 'Geen vergelijken', question: 'Vergelijk je jezelf niet met anderen?' },
    { category: 'Mentaal', name: 'Grenzen stellen', question: 'Respecteer je je eigen grenzen?' },
    { category: 'Mentaal', name: 'Loslaten', question: 'Laat je negatieve gedachten los?' },
    { category: 'Mentaal', name: 'Zelfvertrouwen', question: 'Geloof je in jezelf?' },

    // Gezondheid & Leefstijl (7)
    { category: 'Gezondheid', name: 'Water drinken', question: 'Heb je recent water gedronken?' },
    { category: 'Gezondheid', name: 'Gezond eten', question: 'Maak je gezonde keuzes?' },
    { category: 'Gezondheid', name: 'Geen snacken', question: 'Eet je niet ongezond tussendoor?' },
    { category: 'Gezondheid', name: 'Bewegen', question: 'Heb je recent bewogen?' },
    { category: 'Gezondheid', name: 'Pauze nemen', question: 'Neem je genoeg pauzes?' },
    { category: 'Gezondheid', name: 'Ogen rusten', question: 'Gun je je ogen rust van schermen?' },
    { category: 'Gezondheid', name: 'Staan/lopen', question: 'Sta of loop je regelmatig?' },

    // Communicatie & Sociaal (5)
    { category: 'Sociaal', name: 'Actief luisteren', question: 'Luister je echt naar anderen?' },
    { category: 'Sociaal', name: 'Niet onderbreken', question: 'Laat je anderen uitpraten?' },
    { category: 'Sociaal', name: 'Vriendelijk zijn', question: 'Ben je vriendelijk?' },
    { category: 'Sociaal', name: 'Oogcontact', question: 'Maak je oogcontact?' },
    { category: 'Sociaal', name: 'Geduld', question: 'Ben je geduldig?' }
];

// Notification settings
let notificationSettings = {
    enabled: false,
    intervalIndex: 6, // Index in INTERVAL_OPTIONS (default: 1 uur)
    randomTiming: false
};

// Interval options: 5min, 10min, 15min, 30min, 45min, 1h, 2h, 3h, 4h, 6h, 8h, 12h, 24h, 1 week
const INTERVAL_OPTIONS = [
    { hours: 5/60, label: 'Elke 5 min' },
    { hours: 10/60, label: 'Elke 10 min' },
    { hours: 15/60, label: 'Elke 15 min' },
    { hours: 30/60, label: 'Elke 30 min' },
    { hours: 45/60, label: 'Elke 45 min' },
    { hours: 1, label: 'Elk uur' },
    { hours: 2, label: 'Elke 2 uur' },
    { hours: 3, label: 'Elke 3 uur' },
    { hours: 4, label: 'Elke 4 uur' },
    { hours: 6, label: 'Elke 6 uur' },
    { hours: 8, label: 'Elke 8 uur' },
    { hours: 12, label: 'Elke 12 uur' },
    { hours: 24, label: 'Elke 24 uur' },
    { hours: 168, label: '1x per week' }
];

let notificationInterval = null;
let nextNotificationTime = null;
let notificationDebounceTimer = null;

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// State
let state = {
    battles: [], // Array of battle objects
    currentBattleId: null
};

let cooldownInterval = null;
let calendarMonth = new Date();
let calendarOverviewMonth = new Date();
let deferredPrompt = null;
let currentSort = 'recent-desc';
let currentTheme = 'purple';

// Get current battle
function getCurrentBattle() {
    return state.battles.find(b => b.id === state.currentBattleId);
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

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

function getDayData(battle, dateKey) {
    if (!battle || !battle.history) return { good: 0, bad: 0, entries: [] };
    return battle.history[dateKey] || { good: 0, bad: 0, entries: [] };
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

    let r, g, b;

    if (ratio <= 0.5) {
        const t = ratio * 2;
        r = 239;
        g = Math.round(68 + (180 - 68) * t);
        b = Math.round(68 + (68 - 68) * t);
    } else {
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

function calculateStreak(battle) {
    if (!battle) return 0;

    let streak = 0;
    const today = new Date();

    const todayData = getDayData(battle, getTodayKey());
    const todayBalance = calculateBalance(todayData.good, todayData.bad);
    const todayHasData = todayData.good + todayData.bad > 0;

    // If today has data with negative balance, streak is broken
    if (todayHasData && todayBalance <= 0) {
        return 0;
    }

    // If today has positive data, count it
    if (todayHasData && todayBalance > 0) {
        streak = 1;
    }

    // Check previous days
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1);

    while (true) {
        const dateKey = getDateKey(checkDate);
        const dayData = getDayData(battle, dateKey);
        const hasData = dayData.good + dayData.bad > 0;

        // Skip days without data (don't break streak)
        if (!hasData) {
            // But don't go back more than 7 days without data
            const daysSinceToday = Math.floor((today - checkDate) / (1000 * 60 * 60 * 24));
            if (daysSinceToday > 7) break;
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
        }

        const balance = calculateBalance(dayData.good, dayData.bad);
        // Negative balance breaks streak
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

function validateBattle(battle) {
    // Validate battle structure
    if (!battle || typeof battle !== 'object') return null;
    if (!battle.id || typeof battle.id !== 'string') return null;
    if (!battle.habit || typeof battle.habit !== 'object') return null;
    if (!battle.habit.name || typeof battle.habit.name !== 'string') return null;
    if (!battle.habit.question || typeof battle.habit.question !== 'string') return null;

    // Return sanitized battle
    return {
        id: battle.id,
        habit: {
            name: battle.habit.name,
            question: battle.habit.question,
            cooldownMinutes: typeof battle.habit.cooldownMinutes === 'number' ? battle.habit.cooldownMinutes : 5
        },
        history: battle.history && typeof battle.history === 'object' ? battle.history : {},
        cooldownEnd: typeof battle.cooldownEnd === 'number' ? battle.cooldownEnd : null
    };
}

function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);

            // Migration from old single-battle format
            if (parsed.habit && !parsed.battles) {
                const oldBattle = validateBattle({
                    id: generateId(),
                    habit: parsed.habit,
                    history: parsed.history || {},
                    cooldownEnd: parsed.cooldownEnd || null
                });
                if (oldBattle) {
                    state = {
                        battles: [oldBattle],
                        currentBattleId: null
                    };
                    saveState();
                    return true;
                }
            }

            // Validate and filter battles
            const validBattles = (parsed.battles || [])
                .map(validateBattle)
                .filter(Boolean);

            state = {
                battles: validBattles,
                currentBattleId: parsed.currentBattleId || null
            };

            // Verify currentBattleId exists
            if (state.currentBattleId && !state.battles.find(b => b.id === state.currentBattleId)) {
                state.currentBattleId = null;
            }

            return validBattles.length > 0;
        }
    } catch (e) {
        console.error('Failed to load state:', e);
        // Reset to clean state on error
        state = { battles: [], currentBattleId: null };
    }
    return false;
}

function clearState() {
    localStorage.removeItem(STORAGE_KEY);
    state = { battles: [], currentBattleId: null };
}

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

function showOverview() {
    state.currentBattleId = null;
    showScreen('overview-screen');
    renderBattlesList();
    checkInstallPrompt();
}

function showSetup(isNewBattle = false) {
    showScreen('setup-screen');

    // Reset form
    document.getElementById('habit-name').value = '';
    document.getElementById('habit-question').value = '';
    document.querySelectorAll('#setup-screen .cooldown-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.minutes === '5');
    });
    document.getElementById('start-battle-btn').disabled = true;

    // Show cancel button if adding new battle (not first time)
    const cancelBtn = document.getElementById('cancel-setup-btn');
    cancelBtn.classList.toggle('hidden', state.battles.length === 0);
}

function showBattle(battleId) {
    // Clear any existing cooldown timer before switching battles
    if (cooldownInterval) {
        clearInterval(cooldownInterval);
        cooldownInterval = null;
    }

    state.currentBattleId = battleId;
    showScreen('main-app');

    // Reset to battle tab
    handleTabSwitch('battle');

    updateMainUI();
}

// Overview Screen
function getSortedBattles() {
    const battles = [...state.battles];

    switch (currentSort) {
        case 'recent-desc':
            // Newest first (by id which is timestamp-based)
            return battles.sort((a, b) => b.id.localeCompare(a.id));
        case 'recent-asc':
            // Oldest first
            return battles.sort((a, b) => a.id.localeCompare(b.id));
        case 'score-desc':
            // Best cumulative score first
            return battles.sort((a, b) => calculateCumulativeScore(b) - calculateCumulativeScore(a));
        case 'score-asc':
            // Worst cumulative score first
            return battles.sort((a, b) => calculateCumulativeScore(a) - calculateCumulativeScore(b));
        default:
            return battles;
    }
}

function renderBattlesList() {
    const list = document.getElementById('battles-list');

    if (state.battles.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="grid-column: span 2;">
                <div class="empty-state-icon">⚔️</div>
                <div class="empty-state-title">Geen battles nog</div>
                <div class="empty-state-text">Start je eerste battle tegen een slechte gewoonte!</div>
            </div>
        `;
        return;
    }

    const sortedBattles = getSortedBattles();

    list.innerHTML = sortedBattles.map(battle => {
        const todayData = getDayData(battle, getTodayKey());
        const ratio = calculateRatio(todayData.good, todayData.bad);
        const hasData = todayData.good + todayData.bad > 0;
        const color = ratioToColor(ratio, hasData);
        const streak = calculateStreak(battle);

        return `
            <div class="battle-card" data-id="${battle.id}">
                <div class="battle-card-color" style="background-color: ${colorToString(color)}"></div>
                <div class="battle-card-header">
                    <span class="battle-card-title">${escapeHtml(battle.habit.name)}</span>
                    ${streak > 0 ? `<span class="battle-card-streak">${streak}🔥</span>` : ''}
                </div>
                <div class="battle-card-question">${escapeHtml(battle.habit.question)}</div>
                <div class="battle-card-stats">
                    <div class="battle-card-score">
                        <span class="good">${todayData.good}</span>
                        <span class="vs">vs</span>
                        <span class="bad">${todayData.bad}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Add click listeners
    list.querySelectorAll('.battle-card').forEach(card => {
        card.addEventListener('click', () => {
            showBattle(card.dataset.id);
        });
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// UI Update Functions
function updateMainUI() {
    const battle = getCurrentBattle();
    if (!battle) return;

    const todayData = getDayData(battle, getTodayKey());
    const yesterdayData = getDayData(battle, getYesterdayKey());

    // Header
    document.getElementById('header-habit-name').textContent = battle.habit.name;
    document.getElementById('header-streak').textContent = `Streak: ${calculateStreak(battle)} 🔥`;

    // Question
    document.getElementById('battle-question').textContent = battle.habit.question;

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
    const battle = getCurrentBattle();
    if (!battle) return;

    const now = Date.now();
    const isOnCooldown = battle.cooldownEnd && battle.cooldownEnd > now;

    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const cooldownDisplay = document.getElementById('cooldown-display');
    const cooldownTimer = document.getElementById('cooldown-timer');

    yesBtn.disabled = isOnCooldown;
    noBtn.disabled = isOnCooldown;
    cooldownDisplay.classList.toggle('hidden', !isOnCooldown);

    if (isOnCooldown) {
        const remaining = battle.cooldownEnd - now;
        cooldownTimer.textContent = formatTime(remaining);

        if (!cooldownInterval) {
            cooldownInterval = setInterval(() => {
                const currentBattle = getCurrentBattle();
                if (!currentBattle) {
                    clearInterval(cooldownInterval);
                    cooldownInterval = null;
                    return;
                }

                const newRemaining = currentBattle.cooldownEnd - Date.now();
                if (newRemaining <= 0) {
                    clearInterval(cooldownInterval);
                    cooldownInterval = null;
                    currentBattle.cooldownEnd = null;
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
    const battle = getCurrentBattle();
    if (!battle) return;

    // Streak
    document.getElementById('streak-count').textContent = calculateStreak(battle);

    // Week grid
    updateWeekGrid();

    // Calendar
    updateCalendar();
}

function updateWeekGrid() {
    const battle = getCurrentBattle();
    if (!battle) return;

    const weekGrid = document.getElementById('week-grid');
    weekGrid.innerHTML = '';

    const dayNames = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = getDateKey(date);
        const dayData = getDayData(battle, dateKey);
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
    const battle = getCurrentBattle();
    if (!battle) return;

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

    for (let i = 0; i < startDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateKey = getDateKey(date);
        const dayData = getDayData(battle, dateKey);
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
    const battle = getCurrentBattle();
    if (!battle) return;
    if (battle.cooldownEnd && battle.cooldownEnd > Date.now()) return;

    vibrate(50);
    recordEntry(true);
}

function handleNoClick() {
    const battle = getCurrentBattle();
    if (!battle) return;
    if (battle.cooldownEnd && battle.cooldownEnd > Date.now()) return;

    vibrate([50, 50, 50, 50, 50]);
    recordEntry(false);
}

function recordEntry(isGood) {
    const battle = getCurrentBattle();
    if (!battle) return;

    const todayKey = getTodayKey();

    if (!battle.history[todayKey]) {
        battle.history[todayKey] = { good: 0, bad: 0, entries: [] };
    }

    const entry = {
        time: Date.now(),
        isGood: isGood
    };

    battle.history[todayKey].entries.push(entry);

    if (isGood) {
        battle.history[todayKey].good++;
    } else {
        battle.history[todayKey].bad++;
    }

    // Set cooldown
    battle.cooldownEnd = Date.now() + (battle.habit.cooldownMinutes * 60 * 1000);

    // Show burst animation
    showBurstAnimation(isGood);

    saveState();
    updateMainUI();

    // Check if this is the first action and pauzetijd is not configured
    if (!battle.pauzetijdConfigured) {
        // Show pauzetijd modal after a short delay
        setTimeout(() => {
            showPauzetijdModal(battle);
        }, 1500);
    }
}

// Battle Burst Animation
function showBurstAnimation(isGood) {
    const burst = document.getElementById('battle-burst');
    const cloud = burst.querySelector('.burst-cloud');
    const text = burst.querySelector('.burst-text');

    // Set the type
    const type = isGood ? 'yeah' : 'damn';
    cloud.className = 'burst-cloud ' + type;
    text.className = 'burst-text ' + type;
    text.textContent = isGood ? 'YEAH!' : 'DAMN!';

    // Show the burst
    burst.classList.remove('hidden');

    // Force reflow to restart animations
    void burst.offsetWidth;

    // Hide after animation completes
    setTimeout(() => {
        burst.classList.add('hidden');
    }, 1200);
}

function handleUndo() {
    const battle = getCurrentBattle();
    if (!battle) return;

    const todayKey = getTodayKey();
    const todayData = battle.history[todayKey];

    if (!todayData || todayData.entries.length === 0) return;

    const lastEntry = todayData.entries.pop();

    if (lastEntry.isGood) {
        todayData.good--;
    } else {
        todayData.bad--;
    }

    // Reset cooldown
    battle.cooldownEnd = null;

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
        // Reset calendar to current month when switching to stats
        calendarMonth = new Date();
        updateStatsUI();
    }
}

function handleCalendarNav(direction) {
    calendarMonth.setMonth(calendarMonth.getMonth() + direction);
    updateCalendar();
}

// Pauzetijd Modal
function showPauzetijdModal(battle) {
    const modal = document.getElementById('pauzetijd-modal');
    const slider = document.getElementById('pauzetijd-slider');
    const valueDisplay = document.getElementById('pauzetijd-value');
    const saveBtn = document.getElementById('pauzetijd-save-btn');

    if (!modal || !slider || !saveBtn) return;

    // Set initial value
    slider.value = battle.habit.cooldownMinutes || 10;
    updatePauzetijdValue(slider.value, valueDisplay);

    // Update display on slider change
    slider.oninput = () => {
        updatePauzetijdValue(slider.value, valueDisplay);
    };

    // Save button
    saveBtn.onclick = () => {
        battle.habit.cooldownMinutes = parseInt(slider.value);
        battle.pauzetijdConfigured = true;

        // Recalculate current cooldown if active
        if (battle.cooldownEnd) {
            const now = Date.now();
            const elapsed = now - (battle.cooldownEnd - (10 * 60 * 1000)); // Approximate start time
            battle.cooldownEnd = now + (battle.habit.cooldownMinutes * 60 * 1000) - elapsed;
            if (battle.cooldownEnd < now) {
                battle.cooldownEnd = null;
            }
        }

        saveState();
        updateMainUI();
        closeModal(modal);
    };

    openModal(modal);
}

function updatePauzetijdValue(value, displayEl) {
    if (displayEl) {
        displayEl.textContent = value == 1 ? '1 minuut' : `${value} minuten`;
    }
}

function initPauzetijdModal() {
    const modal = document.getElementById('pauzetijd-modal');
    const slider = document.getElementById('pauzetijd-slider');
    const valueDisplay = document.getElementById('pauzetijd-value');

    if (slider && valueDisplay) {
        slider.addEventListener('input', () => {
            updatePauzetijdValue(slider.value, valueDisplay);
        });
    }

    // Close on background click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                // Don't close on background click for this modal
                // User must click save
            }
        });
    }
}

// Setup Flow
function initSetup() {
    const nameInput = document.getElementById('habit-name');
    const questionInput = document.getElementById('habit-question');
    const startBtn = document.getElementById('start-battle-btn');
    const cancelBtn = document.getElementById('cancel-setup-btn');
    const pauzetijdSlider = document.getElementById('setup-pauzetijd-slider');
    const pauzetijdValue = document.getElementById('setup-pauzetijd-value');

    function validateForm() {
        startBtn.disabled = !nameInput.value.trim() || !questionInput.value.trim();
    }

    nameInput.addEventListener('input', validateForm);
    questionInput.addEventListener('input', validateForm);

    // Pauzetijd slider
    if (pauzetijdSlider && pauzetijdValue) {
        pauzetijdSlider.addEventListener('input', () => {
            updatePauzetijdValue(pauzetijdSlider.value, pauzetijdValue);
        });
    }

    startBtn.addEventListener('click', () => {
        const pauzetijd = pauzetijdSlider ? parseInt(pauzetijdSlider.value) : 10;

        const newBattle = {
            id: generateId(),
            habit: {
                name: nameInput.value.trim(),
                question: questionInput.value.trim(),
                cooldownMinutes: pauzetijd
            },
            history: {},
            cooldownEnd: null,
            pauzetijdConfigured: true
        };

        state.battles.push(newBattle);
        saveState();
        showBattle(newBattle.id);
    });

    cancelBtn.addEventListener('click', () => {
        showOverview();
    });
}

// Focus management for modals
let lastFocusedElement = null;

function openModal(modal) {
    lastFocusedElement = document.activeElement;
    modal.classList.remove('hidden');
    // Focus first focusable element
    const focusable = modal.querySelector('input, button, [tabindex]:not([tabindex="-1"])');
    if (focusable) {
        setTimeout(() => focusable.focus(), 100);
    }
}

function closeModal(modal) {
    modal.classList.add('hidden');
    // Return focus to last focused element
    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
}

// Settings
function initSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const overviewSettingsBtn = document.getElementById('overview-settings-btn');
    const closeBtn = document.getElementById('close-settings');
    const modal = document.getElementById('settings-modal');
    const saveBtn = document.getElementById('save-settings');
    const exportBtn = document.getElementById('export-data');
    const importInput = document.getElementById('import-data');
    const deleteBtn = document.getElementById('delete-battle');
    const clearBtn = document.getElementById('clear-data');
    const pauzetijdSlider = document.getElementById('settings-pauzetijd-slider');
    const pauzetijdValue = document.getElementById('settings-pauzetijd-value');

    function openSettings() {
        const battle = getCurrentBattle();

        if (battle) {
            document.getElementById('settings-name').value = battle.habit.name;
            document.getElementById('settings-question').value = battle.habit.question;

            // Set pauzetijd slider
            if (pauzetijdSlider && pauzetijdValue) {
                pauzetijdSlider.value = battle.habit.cooldownMinutes || 10;
                updatePauzetijdValue(pauzetijdSlider.value, pauzetijdValue);
            }

            deleteBtn.style.display = 'flex';
        } else {
            document.getElementById('settings-name').value = '';
            document.getElementById('settings-question').value = '';

            if (pauzetijdSlider && pauzetijdValue) {
                pauzetijdSlider.value = 10;
                updatePauzetijdValue(10, pauzetijdValue);
            }

            deleteBtn.style.display = 'none';
        }

        openModal(modal);
    }

    settingsBtn.addEventListener('click', openSettings);
    overviewSettingsBtn.addEventListener('click', openSettings);

    closeBtn.addEventListener('click', () => {
        closeModal(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    // Escape key to close
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(modal);
        }
    });

    // Pauzetijd slider
    if (pauzetijdSlider && pauzetijdValue) {
        pauzetijdSlider.addEventListener('input', () => {
            updatePauzetijdValue(pauzetijdSlider.value, pauzetijdValue);
        });
    }

    saveBtn.addEventListener('click', () => {
        const battle = getCurrentBattle();
        if (!battle) {
            modal.classList.add('hidden');
            return;
        }

        const name = document.getElementById('settings-name').value.trim();
        const question = document.getElementById('settings-question').value.trim();
        const newPauzetijd = pauzetijdSlider ? parseInt(pauzetijdSlider.value) : 10;

        if (name && question) {
            const oldCooldownMinutes = battle.habit.cooldownMinutes;

            battle.habit.name = name;
            battle.habit.question = question;
            battle.habit.cooldownMinutes = newPauzetijd;

            // If pauzetijd changed and there's an active timer, recalculate end time
            if (oldCooldownMinutes !== newPauzetijd && battle.cooldownEnd) {
                const oldEndTime = new Date(battle.cooldownEnd);
                const oldStartTime = new Date(oldEndTime.getTime() - oldCooldownMinutes * 60 * 1000);
                // Calculate new end time based on original start time
                battle.cooldownEnd = new Date(oldStartTime.getTime() + newPauzetijd * 60 * 1000).toISOString();
            }

            saveState();
            updateMainUI();
            closeModal(modal);
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

                // Support both old and new format
                if (imported.battles) {
                    // Validate imported battles
                    const validBattles = imported.battles
                        .map(validateBattle)
                        .filter(Boolean);

                    if (validBattles.length === 0) {
                        alert('Geen geldige battles gevonden in bestand');
                        return;
                    }

                    state = {
                        battles: validBattles,
                        currentBattleId: null
                    };
                } else if (imported.habit) {
                    // Old single-battle format - validate it
                    const oldBattle = validateBattle({
                        id: generateId(),
                        habit: imported.habit,
                        history: imported.history || {},
                        cooldownEnd: imported.cooldownEnd || null
                    });

                    if (!oldBattle) {
                        alert('Ongeldig bestandsformaat');
                        return;
                    }

                    state.battles.push(oldBattle);
                } else {
                    alert('Ongeldig bestandsformaat');
                    return;
                }

                saveState();
                closeModal(modal);
                showOverview();
                alert('Data succesvol geïmporteerd!');
            } catch (err) {
                alert('Fout bij importeren: ' + err.message);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    });

    deleteBtn.addEventListener('click', () => {
        const battle = getCurrentBattle();
        if (!battle) return;

        if (confirm(`Weet je zeker dat je "${battle.habit.name}" wilt verwijderen?`)) {
            state.battles = state.battles.filter(b => b.id !== battle.id);
            state.currentBattleId = null;
            saveState();
            closeModal(modal);
            showOverview();
        }
    });

    clearBtn.addEventListener('click', () => {
        if (confirm('Weet je zeker dat je ALLE data wilt wissen?')) {
            if (confirm('Dit kan niet ongedaan worden gemaakt. Doorgaan?')) {
                clearState();
                location.reload();
            }
        }
    });

    // Show onboarding button (for testing/review)
    const showOnboardingBtn = document.getElementById('show-onboarding-btn');
    if (showOnboardingBtn) {
        showOnboardingBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            // Reset onboarding state
            onboardingState.currentScreen = 1;
            onboardingState.demoGood = 0;
            onboardingState.demoBad = 0;
            onboardingState.demoClicks = 0;
            onboardingState.screen5Animated = false;
            // Reset demo display
            const demoLiveGood = document.getElementById('demo-live-good');
            const demoLiveBad = document.getElementById('demo-live-bad');
            const demoSuccess = document.getElementById('demo-success');
            if (demoLiveGood) demoLiveGood.textContent = '0';
            if (demoLiveBad) demoLiveBad.textContent = '0';
            if (demoSuccess) {
                demoSuccess.classList.add('hidden');
                demoSuccess.classList.remove('show');
            }
            // Show onboarding
            showOnboarding();
            goToScreen(1);
        });
    }
}

// PWA Install
function checkInstallPrompt() {
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY);
    if (dismissed) return;

    setTimeout(() => {
        const banner = document.getElementById('install-banner');
        banner.classList.remove('hidden');
    }, 5000);
}

function initInstallPrompt() {
    const banner = document.getElementById('install-banner');
    const laterBtn = document.getElementById('install-later');
    const installBtn = document.getElementById('install-now');

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
            alert('Om de app te installeren:\n\n1. Tik op het deel-icoon\n2. Kies "Zet op beginscherm"');
            banner.classList.add('hidden');
        }
    });
}

// Navigation
function initNavigation() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            handleTabSwitch(tab.dataset.tab);
        });
    });

    // Calendar navigation
    document.getElementById('prev-month').addEventListener('click', () => handleCalendarNav(-1));
    document.getElementById('next-month').addEventListener('click', () => handleCalendarNav(1));

    // Header home link (logo + text)
    document.getElementById('header-home-link').addEventListener('click', () => {
        if (cooldownInterval) {
            clearInterval(cooldownInterval);
            cooldownInterval = null;
        }
        showOverview();
    });

    // Add battle button
    document.getElementById('add-battle-btn').addEventListener('click', () => {
        showSetup(true);
    });
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

// Presets
function initPresets() {
    const showPresetsBtn = document.getElementById('show-presets-btn');
    const presetsModal = document.getElementById('presets-modal');
    const closePresetsBtn = document.getElementById('close-presets');
    const searchInput = document.getElementById('presets-search-input');
    const presetsList = document.getElementById('presets-list');

    function renderPresets(filter = '') {
        const filtered = filter
            ? BATTLE_PRESETS.filter(p =>
                p.name.toLowerCase().includes(filter.toLowerCase()) ||
                p.question.toLowerCase().includes(filter.toLowerCase()) ||
                p.category.toLowerCase().includes(filter.toLowerCase())
            )
            : BATTLE_PRESETS;

        // Group by category
        const grouped = {};
        filtered.forEach(preset => {
            if (!grouped[preset.category]) {
                grouped[preset.category] = [];
            }
            grouped[preset.category].push(preset);
        });

        let html = '';
        for (const [category, presets] of Object.entries(grouped)) {
            html += `<div class="preset-category">${category}</div>`;
            presets.forEach(preset => {
                html += `
                    <div class="preset-item" data-name="${escapeHtml(preset.name)}" data-question="${escapeHtml(preset.question)}">
                        <div class="preset-item-name">${escapeHtml(preset.name)}</div>
                        <div class="preset-item-question">${escapeHtml(preset.question)}</div>
                    </div>
                `;
            });
        }

        presetsList.innerHTML = html || '<p style="text-align:center;color:var(--text-muted)">Geen resultaten</p>';

        // Add click listeners
        presetsList.querySelectorAll('.preset-item').forEach(item => {
            item.addEventListener('click', () => {
                document.getElementById('habit-name').value = item.dataset.name;
                document.getElementById('habit-question').value = item.dataset.question;
                document.getElementById('start-battle-btn').disabled = false;
                closeModal(presetsModal);
            });
        });
    }

    showPresetsBtn.addEventListener('click', () => {
        searchInput.value = '';
        renderPresets();
        openModal(presetsModal);
    });

    closePresetsBtn.addEventListener('click', () => {
        closeModal(presetsModal);
    });

    presetsModal.addEventListener('click', (e) => {
        if (e.target === presetsModal) {
            closeModal(presetsModal);
        }
    });

    // Escape key to close
    presetsModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(presetsModal);
        }
    });

    searchInput.addEventListener('input', () => {
        renderPresets(searchInput.value);
    });

    // Enter key selects first result
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const firstItem = presetsList.querySelector('.preset-item');
            if (firstItem) {
                firstItem.click();
            }
        }
    });
}

// Notifications
function loadNotificationSettings() {
    try {
        const saved = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Migration from old format
            if (parsed.intervalHours !== undefined && parsed.intervalIndex === undefined) {
                const oldHours = parsed.intervalHours;
                const idx = INTERVAL_OPTIONS.findIndex(o => o.hours === oldHours);
                notificationSettings = {
                    enabled: parsed.enabled || false,
                    intervalIndex: idx >= 0 ? idx : 2,
                    randomTiming: false
                };
                saveNotificationSettings();
            } else {
                notificationSettings = parsed;
            }
        }
    } catch (e) {
        console.error('Failed to load notification settings:', e);
    }
}

function saveNotificationSettings() {
    try {
        localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(notificationSettings));

        // Sync with Android app if available
        if (window.AndroidBridge) {
            window.AndroidBridge.setNotificationsEnabled(notificationSettings.enabled);
            const option = INTERVAL_OPTIONS[notificationSettings.intervalIndex];
            const intervalMinutes = Math.round(option.hours * 60);
            window.AndroidBridge.setNotificationSettings(intervalMinutes, 8, 22, notificationSettings.randomTiming);
        }
    } catch (e) {
        console.error('Failed to save notification settings:', e);
    }
}

async function requestNotificationPermission() {
    // Check if running in Android app with native notifications
    if (window.AndroidBridge) {
        // Android app handles notifications natively
        return true;
    }

    if (!('Notification' in window)) {
        alert('Deze browser ondersteunt geen notificaties');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
}

function showNotification(battle) {
    if (Notification.permission !== 'granted') return;

    const notification = new Notification('Daily Battle', {
        body: battle ? `Hoe gaat "${battle.habit.name}"? ${battle.habit.question}` : 'Tijd voor een check-in!',
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-72.png',
        tag: 'daily-battle-reminder',
        requireInteraction: true
    });

    notification.onclick = () => {
        window.focus();
        if (battle) {
            showBattle(battle.id);
        }
        notification.close();
    };
}

function calculateCumulativeScore(battle) {
    if (!battle || !battle.history) return 0;
    let total = 0;
    for (const dateKey in battle.history) {
        const day = battle.history[dateKey];
        total += (day.good || 0) - (day.bad || 0);
    }
    return total;
}

function getSmartReminderMultiplier() {
    // Calculate average cumulative score across all battles
    if (state.battles.length === 0) return 1;

    let totalScore = 0;
    for (const battle of state.battles) {
        totalScore += calculateCumulativeScore(battle);
    }
    const avgScore = totalScore / state.battles.length;

    // If score is very negative, increase frequency (lower multiplier)
    // If score is positive, decrease frequency (higher multiplier)
    // Range: 0.25x (4x faster) to 2x (half as frequent)
    if (avgScore <= -20) return 0.25;
    if (avgScore <= -10) return 0.5;
    if (avgScore <= -5) return 0.75;
    if (avgScore < 0) return 0.9;
    if (avgScore >= 20) return 2;
    if (avgScore >= 10) return 1.5;
    if (avgScore >= 5) return 1.25;
    return 1;
}

function getNextNotificationDelay() {
    const option = INTERVAL_OPTIONS[notificationSettings.intervalIndex];
    let baseMs = option.hours * 60 * 60 * 1000;

    // Apply smart multiplier based on cumulative scores
    const multiplier = getSmartReminderMultiplier();
    baseMs = baseMs * multiplier;

    if (notificationSettings.randomTiming) {
        // Random time between 0 and the full interval
        return Math.random() * baseMs;
    }

    return baseMs;
}

function scheduleNextNotification() {
    if (notificationInterval) {
        clearTimeout(notificationInterval);
        notificationInterval = null;
    }

    if (!notificationSettings.enabled || state.battles.length === 0) return;

    const delay = getNextNotificationDelay();
    nextNotificationTime = Date.now() + delay;

    notificationInterval = setTimeout(() => {
        // Pick a random battle
        const battle = state.battles[Math.floor(Math.random() * state.battles.length)];
        showNotification(battle);

        // Schedule next notification
        scheduleNextNotification();
    }, delay);
}

function startNotificationScheduler() {
    // Debounce to prevent multiple rapid restarts
    if (notificationDebounceTimer) {
        clearTimeout(notificationDebounceTimer);
    }
    notificationDebounceTimer = setTimeout(() => {
        scheduleNextNotification();
        notificationDebounceTimer = null;
    }, 300);
}

function updateSliderLabel() {
    const slider = document.getElementById('notification-slider');
    const label = document.getElementById('slider-value');
    const randomHint = document.getElementById('random-hint');
    if (slider && label) {
        const option = INTERVAL_OPTIONS[slider.value];
        label.textContent = option.label;

        // Update random timing hint with current interval
        if (randomHint) {
            const periodText = option.label.replace('Elke ', '').replace('Elk ', '').replace('1x per ', '');
            randomHint.textContent = `Notificatie komt op een willekeurig moment binnen elke ${periodText}`;
        }
    }
}

function initNotifications() {
    loadNotificationSettings();

    const enabledCheckbox = document.getElementById('notifications-enabled');
    const slider = document.getElementById('notification-slider');
    const randomCheckbox = document.getElementById('random-timing');

    // Set initial state
    if (enabledCheckbox) {
        enabledCheckbox.checked = notificationSettings.enabled;
    }

    if (slider) {
        slider.value = notificationSettings.intervalIndex;
        updateSliderLabel();

        slider.addEventListener('input', () => {
            updateSliderLabel();
        });

        slider.addEventListener('change', () => {
            notificationSettings.intervalIndex = parseInt(slider.value);
            saveNotificationSettings();
            startNotificationScheduler();
        });
    }

    if (randomCheckbox) {
        randomCheckbox.checked = notificationSettings.randomTiming;

        randomCheckbox.addEventListener('change', () => {
            notificationSettings.randomTiming = randomCheckbox.checked;
            saveNotificationSettings();
            startNotificationScheduler();
        });
    }

    if (enabledCheckbox) {
        enabledCheckbox.addEventListener('change', async () => {
            if (enabledCheckbox.checked) {
                const granted = await requestNotificationPermission();
                if (!granted) {
                    enabledCheckbox.checked = false;
                    alert('Notificaties zijn geblokkeerd. Schakel ze in via je browserinstellingen.');
                    return;
                }
            }

            notificationSettings.enabled = enabledCheckbox.checked;
            saveNotificationSettings();
            startNotificationScheduler();
        });
    }

    // Start scheduler if enabled
    startNotificationScheduler();
}

// Sort functionality
function initSort() {
    const sortBtn = document.getElementById('sort-btn');
    const sortMenu = document.getElementById('sort-menu');
    const sortOptions = document.querySelectorAll('.sort-option');

    // Load saved sort preference
    const savedSort = localStorage.getItem(SORT_KEY);
    if (savedSort) {
        currentSort = savedSort;
        sortOptions.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.sort === currentSort);
        });
    }

    sortBtn.addEventListener('click', () => {
        sortMenu.classList.toggle('hidden');
    });

    sortOptions.forEach(option => {
        option.addEventListener('click', () => {
            currentSort = option.dataset.sort;
            localStorage.setItem(SORT_KEY, currentSort);

            sortOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            renderBattlesList();
            sortMenu.classList.add('hidden');
        });
    });

    // Close sort menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!sortBtn.contains(e.target) && !sortMenu.contains(e.target)) {
            sortMenu.classList.add('hidden');
        }
    });
}

// Theme functionality
function initTheme() {
    const themeBtn = document.getElementById('theme-btn');
    const themeModal = document.getElementById('theme-modal');
    const closeTheme = document.getElementById('close-theme');
    const themeOptions = document.querySelectorAll('.theme-option');

    // Load saved theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
        currentTheme = savedTheme;
        applyTheme(currentTheme);
    }

    themeBtn.addEventListener('click', () => {
        updateThemeSelection();
        openModal(themeModal);
    });

    closeTheme.addEventListener('click', () => {
        closeModal(themeModal);
    });

    themeModal.addEventListener('click', (e) => {
        if (e.target === themeModal) {
            closeModal(themeModal);
        }
    });

    // Escape key to close
    themeModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(themeModal);
        }
    });

    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            currentTheme = option.dataset.theme;
            localStorage.setItem(THEME_KEY, currentTheme);
            applyTheme(currentTheme);
            updateThemeSelection();
        });
    });
}

function applyTheme(theme) {
    if (theme === 'purple') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

function updateThemeSelection() {
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === currentTheme);
    });
}

// Calendar Overview functionality
function initCalendarOverview() {
    const calendarBtn = document.getElementById('calendar-overview-btn');
    const calendarModal = document.getElementById('calendar-overview-modal');
    const closeCalendar = document.getElementById('close-calendar-overview');
    const prevBtn = document.getElementById('prev-overview-month');
    const nextBtn = document.getElementById('next-overview-month');

    calendarBtn.addEventListener('click', () => {
        calendarOverviewMonth = new Date();
        updateCalendarOverview();
        openModal(calendarModal);
    });

    closeCalendar.addEventListener('click', () => {
        closeModal(calendarModal);
    });

    calendarModal.addEventListener('click', (e) => {
        if (e.target === calendarModal) {
            closeModal(calendarModal);
        }
    });

    // Escape key to close
    calendarModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(calendarModal);
        }
    });

    prevBtn.addEventListener('click', () => {
        calendarOverviewMonth.setMonth(calendarOverviewMonth.getMonth() - 1);
        updateCalendarOverview();
    });

    nextBtn.addEventListener('click', () => {
        calendarOverviewMonth.setMonth(calendarOverviewMonth.getMonth() + 1);
        updateCalendarOverview();
    });
}

function getCumulativeDayData(dateKey) {
    // Get combined data for all battles on a specific day
    let totalGood = 0;
    let totalBad = 0;

    for (const battle of state.battles) {
        const dayData = getDayData(battle, dateKey);
        totalGood += dayData.good;
        totalBad += dayData.bad;
    }

    return { good: totalGood, bad: totalBad };
}

function updateCalendarOverview() {
    const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
                       'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

    document.getElementById('calendar-overview-title').textContent =
        `${monthNames[calendarOverviewMonth.getMonth()]} ${calendarOverviewMonth.getFullYear()}`;

    const grid = document.getElementById('calendar-overview-grid');
    grid.innerHTML = '';

    const year = calendarOverviewMonth.getFullYear();
    const month = calendarOverviewMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();

    const today = new Date();
    const todayKey = getTodayKey();

    // Empty cells for days before first of month
    for (let i = 0; i < startDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-overview-day empty';
        grid.appendChild(emptyDay);
    }

    // Days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateKey = getDateKey(date);
        const dayData = getCumulativeDayData(dateKey);
        const hasData = dayData.good + dayData.bad > 0;

        const ratio = calculateRatio(dayData.good, dayData.bad);
        const balance = calculateBalance(dayData.good, dayData.bad);
        const color = ratioToColor(ratio, hasData);

        const isToday = dateKey === todayKey;
        const isFuture = date > today;

        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-overview-day' + (isToday ? ' today' : '');

        if (isFuture) {
            dayEl.classList.add('empty');
        } else if (hasData) {
            dayEl.style.backgroundColor = colorToString(color);
        } else {
            dayEl.style.backgroundColor = 'rgba(128, 128, 128, 0.3)';
        }

        dayEl.innerHTML = `
            <span class="day-number">${day}</span>
            ${hasData ? `<span class="day-score">${balance > 0 ? '+' + balance : balance}</span>` : ''}
        `;
        grid.appendChild(dayEl);
    }
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
    addConfettiStyles();

    // Load theme first for immediate visual
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
        currentTheme = savedTheme;
        applyTheme(currentTheme);
    }

    const hasData = loadState();

    // Always initialize onboarding (sets up event listeners, hides if not needed)
    initOnboarding();

    // Show appropriate screen if onboarding is not active
    if (!shouldShowOnboarding()) {
        if (hasData && state.battles.length > 0) {
            showOverview();
        } else {
            showSetup();
        }
    }

    // Initialize all other components
    initSetup();
    initEventListeners();
    initPresets();
    initNotifications();
    initSort();
    initTheme();
    initCalendarOverview();
    initPauzetijdModal();
}

// ============================================
// ONBOARDING SYSTEM
// ============================================

const ONBOARDING_EXAMPLES = [
    "Telefoon te vaak checken",
    "Onderuit zakken",
    "Nagels bijten",
    "Te snel eten",
    "Piekeren",
    "Uitstelgedrag",
    "Social media scrollen",
    "Ongezond snacken"
];

// Diverse floating examples for screen 2 - extremely varied categories
const FLOATING_EXAMPLES = [
    // Houding & Lichaam
    { text: "Rechtop zitten", color: "purple" },
    { text: "Schouders ontspannen", color: "blue" },
    { text: "Niet voorover leunen", color: "green" },
    { text: "Benen niet kruisen", color: "teal" },

    // Digitaal gedrag
    { text: "Minder telefoon", color: "orange" },
    { text: "Geen social media", color: "pink" },
    { text: "E-mail beperken", color: "red" },
    { text: "Niet endless scrollen", color: "purple" },
    { text: "Notificaties negeren", color: "blue" },

    // Eten & Drinken
    { text: "Meer water drinken", color: "teal" },
    { text: "Minder snacken", color: "green" },
    { text: "Rustiger eten", color: "orange" },
    { text: "Minder koffie", color: "pink" },
    { text: "Geen suiker", color: "red" },
    { text: "Gezonder kiezen", color: "yellow" },

    // Mentaal & Emotie
    { text: "Niet piekeren", color: "purple" },
    { text: "Positief blijven", color: "blue" },
    { text: "Niet klagen", color: "green" },
    { text: "Dankbaar zijn", color: "teal" },
    { text: "Minder vergelijken", color: "orange" },
    { text: "Niet oordelen", color: "pink" },

    // Productiviteit
    { text: "Niet uitstellen", color: "red" },
    { text: "Focus houden", color: "purple" },
    { text: "Niet multitasken", color: "blue" },
    { text: "Taken afmaken", color: "green" },
    { text: "Beter plannen", color: "yellow" },

    // Communicatie
    { text: "Beter luisteren", color: "teal" },
    { text: "Niet onderbreken", color: "orange" },
    { text: "Duidelijker praten", color: "pink" },
    { text: "Nee zeggen", color: "red" },
    { text: "Grenzen stellen", color: "purple" },

    // Gewoontes stoppen
    { text: "Nagels niet bijten", color: "blue" },
    { text: "Niet vloeken", color: "green" },
    { text: "Minder roken", color: "orange" },
    { text: "Niet friemelen", color: "pink" },
    { text: "Haar niet trekken", color: "red" },

    // Beweging & Activiteit
    { text: "Meer stappen", color: "teal" },
    { text: "Vaker opstaan", color: "purple" },
    { text: "Traplopen", color: "blue" },
    { text: "Stretchen", color: "green" },
    { text: "Buiten wandelen", color: "yellow" },

    // Slaap & Rust
    { text: "Vroeger naar bed", color: "orange" },
    { text: "Pauzes nemen", color: "pink" },
    { text: "Niet overwerken", color: "red" },
    { text: "Relaxen", color: "purple" },

    // Mindfulness
    { text: "Bewust ademen", color: "teal" },
    { text: "In het moment zijn", color: "blue" },
    { text: "Rustig blijven", color: "green" },
    { text: "Geduld hebben", color: "yellow" },

    // Financieel
    { text: "Minder kopen", color: "orange" },
    { text: "Budget volgen", color: "pink" },
    { text: "Impulsen weerstaan", color: "red" },

    // Relaties
    { text: "Aandacht geven", color: "purple" },
    { text: "Vaker bellen", color: "teal" },
    { text: "Complimenten geven", color: "blue" },
    { text: "Geduldig zijn", color: "green" }
];

let onboardingState = {
    currentScreen: 1,
    totalScreens: 6,
    touchStartX: 0,
    touchEndX: 0,
    isDragging: false,
    swipeHintShown: false,
    listenersAttached: false,
    floatingBubblesInitialized: false
};

// Check if onboarding should be shown
function shouldShowOnboarding() {
    const completed = localStorage.getItem(ONBOARDING_COMPLETED_KEY);
    const hasData = localStorage.getItem(STORAGE_KEY);
    return !completed && !hasData;
}

// Mark onboarding as completed
function completeOnboarding() {
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
}

// Initialize onboarding
function initOnboarding() {
    // Always setup event listeners so they work when onboarding is reopened
    setupOnboardingEventListeners();
    initScreen2FloatingBubbles();
    initScreen6Form();

    if (!shouldShowOnboarding()) {
        hideOnboarding();
        return;
    }

    showOnboarding();
}

function showOnboarding() {
    const onboarding = document.getElementById('onboarding');
    if (onboarding) {
        onboarding.classList.remove('hidden');
        onboarding.style.display = 'block';
    }
}

function hideOnboarding() {
    const onboarding = document.getElementById('onboarding');
    if (onboarding) {
        onboarding.classList.add('hidden');
        onboarding.style.display = 'none';
    }
}

// Setup all event listeners for onboarding
function setupOnboardingEventListeners() {
    // Prevent adding listeners multiple times
    if (onboardingState.listenersAttached) return;

    const screensContainer = document.getElementById('onboarding-screens');
    const skipBtn = document.getElementById('onboarding-skip');
    const progressDots = document.querySelectorAll('.progress-dot');
    const prevBtn = document.getElementById('onboarding-prev');
    const nextBtn = document.getElementById('onboarding-next');

    if (!screensContainer) return;

    onboardingState.listenersAttached = true;

    // Touch events for swipe
    screensContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    screensContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    screensContainer.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Mouse events for desktop
    screensContainer.addEventListener('mousedown', handleMouseDown);
    screensContainer.addEventListener('mousemove', handleMouseMove);
    screensContainer.addEventListener('mouseup', handleMouseUp);
    screensContainer.addEventListener('mouseleave', handleMouseUp);

    // Skip button
    if (skipBtn) {
        skipBtn.addEventListener('click', handleSkipOnboarding);
    }

    // Navigation arrows
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onboardingState.currentScreen > 1) {
                goToScreen(onboardingState.currentScreen - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onboardingState.currentScreen < onboardingState.totalScreens) {
                goToScreen(onboardingState.currentScreen + 1);
            }
        });
    }

    // Progress dots click
    progressDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const screen = parseInt(dot.dataset.screen);
            if (screen) {
                goToScreen(screen);
            }
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleOnboardingKeydown);
}

// Touch handlers
function handleTouchStart(e) {
    // Don't capture touch on buttons or inputs
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;

    onboardingState.touchStartX = e.touches[0].clientX;
    onboardingState.isDragging = true;
}

function handleTouchMove(e) {
    if (!onboardingState.isDragging) return;

    // Don't capture touch on demo buttons or setup form
    if (onboardingState.currentScreen === 2 || onboardingState.currentScreen === 3 || onboardingState.currentScreen === 4) {
        const target = e.target;
        if (target.closest('.demo-card') || target.closest('.setup-card')) {
            return;
        }
    }

    onboardingState.touchEndX = e.touches[0].clientX;

    // Calculate drag distance for visual feedback
    const diff = onboardingState.touchStartX - onboardingState.touchEndX;
    const screenWidth = window.innerWidth;
    const currentOffset = (onboardingState.currentScreen - 1) * -100;
    const dragOffset = (diff / screenWidth) * 100;

    // Limit drag at edges
    const maxOffset = (onboardingState.totalScreens - 1) * -100;
    let newOffset = currentOffset - dragOffset;
    newOffset = Math.max(maxOffset - 10, Math.min(10, newOffset));

    const container = document.getElementById('onboarding-screens');
    if (container) {
        container.style.transition = 'none';
        container.style.transform = `translateX(${newOffset}%)`;
    }
}

function handleTouchEnd(e) {
    if (!onboardingState.isDragging) return;
    onboardingState.isDragging = false;

    const container = document.getElementById('onboarding-screens');
    if (container) {
        container.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
    }

    const diff = onboardingState.touchStartX - onboardingState.touchEndX;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diff) > threshold) {
        if (diff > 0 && onboardingState.currentScreen < onboardingState.totalScreens) {
            // Swipe left - next screen
            goToScreen(onboardingState.currentScreen + 1);
        } else if (diff < 0 && onboardingState.currentScreen > 1) {
            // Swipe right - previous screen
            goToScreen(onboardingState.currentScreen - 1);
        } else {
            // Snap back
            goToScreen(onboardingState.currentScreen);
        }
    } else {
        // Snap back if not enough swipe
        goToScreen(onboardingState.currentScreen);
    }

    // Hide swipe hint after first swipe
    if (!onboardingState.swipeHintShown && diff > threshold) {
        onboardingState.swipeHintShown = true;
        const hint = document.getElementById('swipe-hint');
        if (hint) {
            hint.style.opacity = '0';
            setTimeout(() => hint.style.display = 'none', 300);
        }
    }
}

// Mouse handlers (for desktop)
function handleMouseDown(e) {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
    onboardingState.touchStartX = e.clientX;
    onboardingState.isDragging = true;
}

function handleMouseMove(e) {
    if (!onboardingState.isDragging) return;
    e.preventDefault();
    onboardingState.touchEndX = e.clientX;
}

function handleMouseUp(e) {
    if (!onboardingState.isDragging) return;

    const diff = onboardingState.touchStartX - onboardingState.touchEndX;
    const threshold = 50;

    onboardingState.isDragging = false;

    if (Math.abs(diff) > threshold) {
        if (diff > 0 && onboardingState.currentScreen < onboardingState.totalScreens) {
            goToScreen(onboardingState.currentScreen + 1);
        } else if (diff < 0 && onboardingState.currentScreen > 1) {
            goToScreen(onboardingState.currentScreen - 1);
        }
    }
}

// Keyboard handler
function handleOnboardingKeydown(e) {
    const onboarding = document.getElementById('onboarding');
    if (!onboarding || onboarding.classList.contains('hidden')) return;

    if (e.key === 'ArrowRight' && onboardingState.currentScreen < onboardingState.totalScreens) {
        goToScreen(onboardingState.currentScreen + 1);
    } else if (e.key === 'ArrowLeft' && onboardingState.currentScreen > 1) {
        goToScreen(onboardingState.currentScreen - 1);
    } else if (e.key === 'Escape') {
        handleSkipOnboarding();
    }
}

// Navigate to specific screen
function goToScreen(screenNumber) {
    if (screenNumber < 1 || screenNumber > onboardingState.totalScreens) return;

    onboardingState.currentScreen = screenNumber;

    // Update screen position
    const container = document.getElementById('onboarding-screens');
    if (container) {
        container.style.transition = 'transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
        container.style.transform = `translateX(${(screenNumber - 1) * -100}%)`;
    }

    // Update progress dots
    updateProgressDots();

    // Update navigation arrows
    updateNavigationArrows();

    // Update skip button visibility
    updateSkipButton();

    // Trigger screen-specific animations
    triggerScreenAnimations(screenNumber);
}

// Update navigation arrows visibility
function updateNavigationArrows() {
    const prevBtn = document.getElementById('onboarding-prev');
    const nextBtn = document.getElementById('onboarding-next');

    if (prevBtn) {
        prevBtn.style.display = onboardingState.currentScreen > 1 ? 'flex' : 'none';
    }

    if (nextBtn) {
        nextBtn.style.display = onboardingState.currentScreen < onboardingState.totalScreens ? 'flex' : 'none';
    }
}

function updateProgressDots() {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach(dot => {
        const screen = parseInt(dot.dataset.screen);
        dot.classList.remove('active', 'completed');

        if (screen === onboardingState.currentScreen) {
            dot.classList.add('active');
        } else if (screen < onboardingState.currentScreen) {
            dot.classList.add('completed');
        }
    });
}

function updateSkipButton() {
    const skipBtn = document.getElementById('onboarding-skip');
    if (skipBtn) {
        // Hide skip button on setup screens (3 and 4)
        const hideOnScreens = onboardingState.currentScreen >= 3;
        skipBtn.style.opacity = hideOnScreens ? '0' : '1';
        skipBtn.style.pointerEvents = hideOnScreens ? 'none' : 'auto';
    }
}

function triggerScreenAnimations(screenNumber) {
    // Clean up screen 2 rotation interval when leaving screen 2
    if (screenNumber !== 2 && onboardingState.screen2RotationInterval) {
        clearInterval(onboardingState.screen2RotationInterval);
        onboardingState.screen2RotationInterval = null;
    }
}

// Skip onboarding
function handleSkipOnboarding() {
    // Go to screen 6 (setup form)
    goToScreen(6);
}

// Screen 1: Floating examples
function initScreen1FloatingExamples() {
    const container = document.getElementById('floating-examples-1');
    if (!container) return;

    ONBOARDING_EXAMPLES.forEach((example, index) => {
        const bubble = document.createElement('div');
        bubble.className = 'floating-bubble';
        bubble.textContent = example;
        bubble.style.animationDelay = `${index * 0.5}s`;

        // Random positioning
        const angle = (index / ONBOARDING_EXAMPLES.length) * 2 * Math.PI;
        const radius = 30 + Math.random() * 20;
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;

        bubble.style.left = `${x}%`;
        bubble.style.top = `${y}%`;

        container.appendChild(bubble);
    });
}

// Screen 2: Floating bubbles from top to bottom
function initScreen2FloatingBubbles() {
    if (onboardingState.floatingBubblesInitialized) return;

    const container = document.getElementById('floating-examples');
    if (!container) return;

    onboardingState.floatingBubblesInitialized = true;

    // Shuffle array helper
    function shuffleArray(arr) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    const shuffledExamples = shuffleArray(FLOATING_EXAMPLES);
    let currentIndex = 0;

    // Create a floating bubble
    function createFloatingBubble() {
        const example = shuffledExamples[currentIndex % shuffledExamples.length];
        currentIndex++;

        const bubble = document.createElement('div');
        bubble.className = `floating-bubble color-${example.color}`;
        bubble.textContent = example.text;

        // Random horizontal position (5% to 85% to avoid edges)
        const leftPos = 5 + Math.random() * 80;
        bubble.style.left = `${leftPos}%`;

        // Random animation duration (10-16 seconds)
        const duration = 10 + Math.random() * 6;
        bubble.style.animationDuration = `${duration}s`;

        // Random delay for initial stagger
        const delay = Math.random() * 2;
        bubble.style.animationDelay = `${delay}s`;

        container.appendChild(bubble);

        // Remove after animation completes
        setTimeout(() => {
            bubble.remove();
        }, (duration + delay) * 1000);
    }

    // Create initial batch of bubbles
    const isDesktop = window.innerWidth > 768;
    const initialCount = isDesktop ? 12 : 8;

    for (let i = 0; i < initialCount; i++) {
        setTimeout(() => createFloatingBubble(), i * 400);
    }

    // Continuously create new bubbles
    setInterval(() => {
        createFloatingBubble();
    }, 1500);
}

// Screen 5: Animated score demo
function animateScreen5() {
    const goodEl = document.getElementById('demo-good');
    const badEl = document.getElementById('demo-bad');
    const balanceEl = document.getElementById('demo-balance');
    const colorbarEl = document.getElementById('demo-colorbar-fill');

    if (!goodEl || !badEl || !balanceEl || !colorbarEl) return;

    // Animation sequence: simulate a day of tracking
    const sequence = [
        { good: 1, bad: 0, delay: 500 },
        { good: 1, bad: 1, delay: 800 },
        { good: 2, bad: 1, delay: 600 },
        { good: 2, bad: 2, delay: 700 },
        { good: 3, bad: 2, delay: 500 },
        { good: 4, bad: 2, delay: 600 },
        { good: 5, bad: 2, delay: 500 },
        { good: 6, bad: 3, delay: 700 },
        { good: 7, bad: 3, delay: 600 },
        { good: 8, bad: 3, delay: 500 }
    ];

    let totalDelay = 0;

    sequence.forEach((step, index) => {
        totalDelay += step.delay;

        setTimeout(() => {
            goodEl.textContent = step.good;
            badEl.textContent = step.bad;

            const balance = step.good - step.bad;
            balanceEl.textContent = balance > 0 ? `+${balance}` : balance.toString();
            balanceEl.className = 'demo-balance ' + (balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'neutral');

            // Update color bar
            const ratio = step.good / (step.good + step.bad);
            colorbarEl.style.width = `${ratio * 100}%`;
            colorbarEl.style.backgroundPosition = `${(1 - ratio) * 100}% 0`;

            // Add pop animation
            goodEl.classList.add('pop');
            setTimeout(() => goodEl.classList.remove('pop'), 200);
        }, totalDelay);
    });
}

// Screen 6: Setup form with presets and green button
function initScreen6Form() {
    const nameInput = document.getElementById('onboard-habit-name');
    const questionInput = document.getElementById('onboard-habit-question');
    const startBtn = document.getElementById('onboard-start-btn');
    const presetsBtn = document.getElementById('onboard-presets-btn');

    function validateForm() {
        if (startBtn) {
            startBtn.disabled = !nameInput?.value.trim() || !questionInput?.value.trim();
        }
    }

    if (nameInput) {
        nameInput.addEventListener('input', validateForm);
    }

    if (questionInput) {
        questionInput.addEventListener('input', validateForm);
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (!nameInput?.value.trim() || !questionInput?.value.trim()) return;

            // Create the battle with default 10 min pauzetijd
            const newBattle = {
                id: generateId(),
                habit: {
                    name: nameInput.value.trim(),
                    question: questionInput.value.trim(),
                    cooldownMinutes: 10 // Default, will be set after first action
                },
                history: {},
                cooldownEnd: null,
                pauzetijdConfigured: false // Flag to show pauzetijd modal after first action
            };

            state.battles.push(newBattle);
            saveState();
            completeOnboarding();

            // Show confetti
            showConfetti();

            // Hide onboarding and show battle
            setTimeout(() => {
                hideOnboarding();
                showBattle(newBattle.id);
            }, 1500);
        });
    }

    if (presetsBtn) {
        presetsBtn.addEventListener('click', () => {
            // Open presets modal
            const presetsModal = document.getElementById('presets-modal');

            if (presetsModal) {
                // Render presets for onboarding
                renderPresetsForOnboarding();
                openModal(presetsModal);
            }
        });
    }
}

function renderPresetsForOnboarding() {
    const presetsList = document.getElementById('presets-list');
    const nameInput = document.getElementById('onboard-habit-name');
    const questionInput = document.getElementById('onboard-habit-question');
    const startBtn = document.getElementById('onboard-start-btn');
    const presetsModal = document.getElementById('presets-modal');

    if (!presetsList) return;

    // Group by category
    const grouped = {};
    BATTLE_PRESETS.forEach(preset => {
        if (!grouped[preset.category]) {
            grouped[preset.category] = [];
        }
        grouped[preset.category].push(preset);
    });

    let html = '';
    for (const [category, presets] of Object.entries(grouped)) {
        html += `<div class="preset-category">${category}</div>`;
        presets.forEach(preset => {
            html += `
                <div class="preset-item" data-name="${escapeHtml(preset.name)}" data-question="${escapeHtml(preset.question)}">
                    <div class="preset-item-name">${escapeHtml(preset.name)}</div>
                    <div class="preset-item-question">${escapeHtml(preset.question)}</div>
                </div>
            `;
        });
    }

    presetsList.innerHTML = html;

    // Add click listeners
    presetsList.querySelectorAll('.preset-item').forEach(item => {
        item.addEventListener('click', () => {
            if (nameInput) nameInput.value = item.dataset.name;
            if (questionInput) questionInput.value = item.dataset.question;
            if (startBtn) startBtn.disabled = false;
            if (presetsModal) closeModal(presetsModal);
        });
    });
}

// Confetti animation
function showConfetti() {
    const colors = ['#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#3b82f6'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -20px;
            opacity: 1;
            z-index: 10001;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
            animation-delay: ${Math.random() * 0.5}s;
        `;

        document.body.appendChild(confetti);

        // Remove after animation
        setTimeout(() => confetti.remove(), 4000);
    }
}

// Add confetti keyframes dynamically
function addConfettiStyles() {
    if (document.getElementById('confetti-styles')) return;

    const style = document.createElement('style');
    style.id = 'confetti-styles';
    style.textContent = `
        @keyframes confetti-fall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }

        .pop {
            animation: pop-scale 0.2s ease-out;
        }

        @keyframes pop-scale {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }

        .demo-balance.positive { color: var(--good-color); }
        .demo-balance.negative { color: var(--bad-color); }
        .demo-balance.neutral { color: var(--text-muted); }

        .demo-success.show {
            animation: slide-up-fade 0.4s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
}

// Start
document.addEventListener('DOMContentLoaded', init);
