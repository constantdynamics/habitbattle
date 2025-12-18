package com.constantdynamics.dailybattle

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.text.SimpleDateFormat
import java.util.*

/**
 * Data classes for Daily Battle
 */
data class Habit(
    val name: String,
    val question: String,
    val cooldownMinutes: Int = 5
)

data class DayData(
    val good: Int = 0,
    val bad: Int = 0,
    val entries: List<Entry> = emptyList()
)

data class Entry(
    val time: Long,
    val isGood: Boolean
)

data class Battle(
    val id: String,
    val habit: Habit,
    val history: MutableMap<String, DayData> = mutableMapOf(),
    var cooldownEnd: Long? = null
)

data class AppState(
    val battles: MutableList<Battle> = mutableListOf(),
    var currentBattleId: String? = null
)

/**
 * Data manager for battles - handles storage and retrieval
 */
object BattleDataManager {
    private const val PREFS_NAME = "daily_battle_prefs"
    private const val KEY_STATE = "dailyBattle"

    private val gson = Gson()
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

    fun getTodayKey(): String = dateFormat.format(Date())

    fun loadState(context: Context): AppState {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val json = prefs.getString(KEY_STATE, null)
        return if (json != null) {
            try {
                gson.fromJson(json, AppState::class.java) ?: AppState()
            } catch (e: Exception) {
                AppState()
            }
        } else {
            AppState()
        }
    }

    fun saveState(context: Context, state: AppState) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val json = gson.toJson(state)
        prefs.edit().putString(KEY_STATE, json).apply()
    }

    fun getBattle(context: Context, battleId: String): Battle? {
        val state = loadState(context)
        return state.battles.find { it.id == battleId }
    }

    fun getTodayData(battle: Battle): DayData {
        return battle.history[getTodayKey()] ?: DayData()
    }

    fun recordEntry(context: Context, battleId: String, isGood: Boolean): Boolean {
        val state = loadState(context)
        val battle = state.battles.find { it.id == battleId } ?: return false

        // Check cooldown
        val now = System.currentTimeMillis()
        if (battle.cooldownEnd != null && battle.cooldownEnd!! > now) {
            return false // Still on cooldown
        }

        val todayKey = getTodayKey()
        val currentData = battle.history[todayKey] ?: DayData()

        val newEntry = Entry(time = now, isGood = isGood)
        val newEntries = currentData.entries + newEntry

        val newData = DayData(
            good = if (isGood) currentData.good + 1 else currentData.good,
            bad = if (!isGood) currentData.bad + 1 else currentData.bad,
            entries = newEntries
        )

        battle.history[todayKey] = newData
        battle.cooldownEnd = now + (battle.habit.cooldownMinutes * 60 * 1000)

        saveState(context, state)
        return true
    }

    fun calculateBalance(dayData: DayData): Int = dayData.good - dayData.bad

    fun calculateRatio(dayData: DayData): Float {
        val total = dayData.good + dayData.bad
        return if (total == 0) 0.5f else dayData.good.toFloat() / total
    }

    fun calculateCumulativeScore(battle: Battle): Int {
        return battle.history.values.sumOf { it.good - it.bad }
    }

    fun ratioToColor(ratio: Float, hasData: Boolean): Int {
        if (!hasData) return 0xFF808080.toInt() // Gray

        return when {
            ratio <= 0.25f -> 0xFFEF4444.toInt() // Red
            ratio <= 0.5f -> 0xFFEAB308.toInt()  // Yellow
            ratio <= 0.75f -> 0xFF84CC16.toInt() // Light green
            else -> 0xFF22C55E.toInt()           // Green
        }
    }

    fun calculateStreak(battle: Battle): Int {
        var streak = 0
        val calendar = Calendar.getInstance()

        // Check today
        val todayData = getTodayData(battle)
        val todayBalance = calculateBalance(todayData)
        val todayHasData = todayData.good + todayData.bad > 0

        if (todayHasData && todayBalance > 0) {
            streak = 1
        } else if (todayHasData && todayBalance <= 0) {
            return 0
        }

        // Check previous days
        calendar.add(Calendar.DAY_OF_YEAR, -1)

        while (true) {
            val dateKey = dateFormat.format(calendar.time)
            val dayData = battle.history[dateKey] ?: break

            if (dayData.good + dayData.bad == 0) break
            if (calculateBalance(dayData) <= 0) break

            streak++
            calendar.add(Calendar.DAY_OF_YEAR, -1)
        }

        return streak
    }

    // Get top N battles sorted by cumulative score (worst first for attention)
    fun getTopBattles(context: Context, count: Int, sortByWorst: Boolean = true): List<Battle> {
        val state = loadState(context)
        return if (sortByWorst) {
            state.battles.sortedBy { calculateCumulativeScore(it) }.take(count)
        } else {
            state.battles.sortedByDescending { calculateCumulativeScore(it) }.take(count)
        }
    }

    // Calculate total score across all battles for today
    fun getTotalTodayScore(context: Context): Pair<Int, Int> {
        val state = loadState(context)
        var totalGood = 0
        var totalBad = 0

        for (battle in state.battles) {
            val todayData = getTodayData(battle)
            totalGood += todayData.good
            totalBad += todayData.bad
        }

        return Pair(totalGood, totalBad)
    }
}
