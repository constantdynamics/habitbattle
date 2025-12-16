// Daily Battle App - Multi-Battle Version

const STORAGE_KEY = 'dailyBattle';
const INSTALL_DISMISSED_KEY = 'installDismissed';
const NOTIFICATION_SETTINGS_KEY = 'notificationSettings';

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
    intervalIndex: 2, // Index in INTERVAL_OPTIONS
    randomTiming: false
};

// Interval options: 1h, 2h, 3h, 4h, 6h, 8h, 12h, 24h, 3 days, 1 week
const INTERVAL_OPTIONS = [
    { hours: 1, label: 'Elk uur' },
    { hours: 2, label: 'Elke 2 uur' },
    { hours: 3, label: 'Elke 3 uur' },
    { hours: 4, label: 'Elke 4 uur' },
    { hours: 6, label: 'Elke 6 uur' },
    { hours: 8, label: 'Elke 8 uur' },
    { hours: 12, label: 'Elke 12 uur' },
    { hours: 24, label: 'Elke 24 uur' },
    { hours: 72, label: 'Elke 3 dagen' },
    { hours: 168, label: '1x per week' }
];

let notificationInterval = null;
let nextNotificationTime = null;

// State
let state = {
    battles: [], // Array of battle objects
    currentBattleId: null
};

let cooldownInterval = null;
let calendarMonth = new Date();
let deferredPrompt = null;

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

    if (todayHasData && todayBalance > 0) {
        streak = 1;
    } else if (todayHasData && todayBalance <= 0) {
        return 0;
    }

    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - 1);

    while (true) {
        const dateKey = getDateKey(checkDate);
        const dayData = getDayData(battle, dateKey);
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

            // Migration from old single-battle format
            if (parsed.habit && !parsed.battles) {
                const oldBattle = {
                    id: generateId(),
                    habit: parsed.habit,
                    history: parsed.history || {},
                    cooldownEnd: parsed.cooldownEnd || null
                };
                state = {
                    battles: [oldBattle],
                    currentBattleId: null
                };
                saveState();
                return true;
            }

            state = {
                battles: parsed.battles || [],
                currentBattleId: parsed.currentBattleId || null
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
    state.currentBattleId = battleId;
    showScreen('main-app');

    // Reset to battle tab
    handleTabSwitch('battle');

    updateMainUI();
}

// Overview Screen
function renderBattlesList() {
    const list = document.getElementById('battles-list');

    if (state.battles.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚔️</div>
                <div class="empty-state-title">Geen battles nog</div>
                <div class="empty-state-text">Start je eerste battle tegen een slechte gewoonte!</div>
            </div>
        `;
        return;
    }

    list.innerHTML = state.battles.map(battle => {
        const todayData = getDayData(battle, getTodayKey());
        const ratio = calculateRatio(todayData.good, todayData.bad);
        const hasData = todayData.good + todayData.bad > 0;
        const color = ratioToColor(ratio, hasData);
        const streak = calculateStreak(battle);

        return `
            <div class="battle-card" data-id="${battle.id}">
                <div class="battle-card-header">
                    <span class="battle-card-title">${escapeHtml(battle.habit.name)}</span>
                    ${streak > 0 ? `<span class="battle-card-streak">${streak} 🔥</span>` : ''}
                </div>
                <div class="battle-card-question">${escapeHtml(battle.habit.question)}</div>
                <div class="battle-card-stats">
                    <div class="battle-card-score">
                        <span class="good">${todayData.good}</span>
                        <span class="vs">vs</span>
                        <span class="bad">${todayData.bad}</span>
                    </div>
                    <div class="battle-card-color" style="background-color: ${colorToString(color)}"></div>
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
    }, 600);
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
    const cancelBtn = document.getElementById('cancel-setup-btn');
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
        const newBattle = {
            id: generateId(),
            habit: {
                name: nameInput.value.trim(),
                question: questionInput.value.trim(),
                cooldownMinutes: selectedCooldown
            },
            history: {},
            cooldownEnd: null
        };

        state.battles.push(newBattle);
        saveState();
        showBattle(newBattle.id);
    });

    cancelBtn.addEventListener('click', () => {
        showOverview();
    });
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
    const cooldownBtns = document.querySelectorAll('#settings-cooldown .cooldown-btn');

    let settingsCooldown = 5;

    function openSettings() {
        const battle = getCurrentBattle();

        if (battle) {
            document.getElementById('settings-name').value = battle.habit.name;
            document.getElementById('settings-question').value = battle.habit.question;
            settingsCooldown = battle.habit.cooldownMinutes;
            deleteBtn.style.display = 'flex';
        } else {
            document.getElementById('settings-name').value = '';
            document.getElementById('settings-question').value = '';
            settingsCooldown = 5;
            deleteBtn.style.display = 'none';
        }

        cooldownBtns.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.minutes) === settingsCooldown);
        });

        modal.classList.remove('hidden');
    }

    settingsBtn.addEventListener('click', openSettings);
    overviewSettingsBtn.addEventListener('click', openSettings);

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
        const battle = getCurrentBattle();
        if (!battle) {
            modal.classList.add('hidden');
            return;
        }

        const name = document.getElementById('settings-name').value.trim();
        const question = document.getElementById('settings-question').value.trim();

        if (name && question) {
            battle.habit.name = name;
            battle.habit.question = question;
            battle.habit.cooldownMinutes = settingsCooldown;
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

                // Support both old and new format
                if (imported.battles) {
                    state = {
                        battles: imported.battles,
                        currentBattleId: null
                    };
                } else if (imported.habit) {
                    // Old single-battle format
                    const oldBattle = {
                        id: generateId(),
                        habit: imported.habit,
                        history: imported.history || {},
                        cooldownEnd: imported.cooldownEnd || null
                    };
                    state.battles.push(oldBattle);
                } else {
                    alert('Ongeldig bestandsformaat');
                    return;
                }

                saveState();
                modal.classList.add('hidden');
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
            modal.classList.add('hidden');
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
                presetsModal.classList.add('hidden');
            });
        });
    }

    showPresetsBtn.addEventListener('click', () => {
        searchInput.value = '';
        renderPresets();
        presetsModal.classList.remove('hidden');
    });

    closePresetsBtn.addEventListener('click', () => {
        presetsModal.classList.add('hidden');
    });

    presetsModal.addEventListener('click', (e) => {
        if (e.target === presetsModal) {
            presetsModal.classList.add('hidden');
        }
    });

    searchInput.addEventListener('input', () => {
        renderPresets(searchInput.value);
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
    } catch (e) {
        console.error('Failed to save notification settings:', e);
    }
}

async function requestNotificationPermission() {
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

function getNextNotificationDelay() {
    const option = INTERVAL_OPTIONS[notificationSettings.intervalIndex];
    const baseMs = option.hours * 60 * 60 * 1000;

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
    scheduleNextNotification();
}

function updateSliderLabel() {
    const slider = document.getElementById('notification-slider');
    const label = document.getElementById('slider-value');
    if (slider && label) {
        const option = INTERVAL_OPTIONS[slider.value];
        label.textContent = option.label;
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

    if (hasData && state.battles.length > 0) {
        showOverview();
    } else {
        showSetup();
    }

    initSetup();
    initEventListeners();
    initPresets();
    initNotifications();
}

// Start
document.addEventListener('DOMContentLoaded', init);
