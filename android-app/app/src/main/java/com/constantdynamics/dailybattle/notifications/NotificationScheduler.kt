package com.constantdynamics.dailybattle.notifications

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import com.constantdynamics.dailybattle.BattleDataManager
import java.util.*

/**
 * Schedules battle reminder notifications based on PWA settings
 */
object NotificationScheduler {
    private const val PREFS_NAME = "notification_settings"
    private const val KEY_ENABLED = "notifications_enabled"
    private const val KEY_INTERVAL_MINUTES = "notification_interval"
    private const val KEY_START_HOUR = "start_hour"
    private const val KEY_END_HOUR = "end_hour"
    private const val KEY_RANDOM_TIMING = "random_timing"

    fun isEnabled(context: Context): Boolean {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getBoolean(KEY_ENABLED, false)
    }

    fun setEnabled(context: Context, enabled: Boolean) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit().putBoolean(KEY_ENABLED, enabled).apply()

        if (enabled) {
            scheduleNextNotification(context)
        } else {
            cancelAllNotifications(context)
        }
    }

    fun setSettings(context: Context, intervalMinutes: Int, startHour: Int, endHour: Int, randomTiming: Boolean) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.edit()
            .putInt(KEY_INTERVAL_MINUTES, intervalMinutes)
            .putInt(KEY_START_HOUR, startHour)
            .putInt(KEY_END_HOUR, endHour)
            .putBoolean(KEY_RANDOM_TIMING, randomTiming)
            .apply()

        if (isEnabled(context)) {
            scheduleNextNotification(context)
        }
    }

    fun getSettings(context: Context): NotificationSettings {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return NotificationSettings(
            enabled = prefs.getBoolean(KEY_ENABLED, false),
            intervalMinutes = prefs.getInt(KEY_INTERVAL_MINUTES, 30),
            startHour = prefs.getInt(KEY_START_HOUR, 8),
            endHour = prefs.getInt(KEY_END_HOUR, 22),
            randomTiming = prefs.getBoolean(KEY_RANDOM_TIMING, false)
        )
    }

    fun scheduleNextNotification(context: Context) {
        if (!isEnabled(context)) return

        val settings = getSettings(context)
        val state = BattleDataManager.loadState(context)

        // Need at least one battle to show notifications
        if (state.battles.isEmpty()) return

        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        // Pick a random battle for the notification
        val battle = state.battles.random()

        val intent = Intent(context, BattleNotificationReceiver::class.java).apply {
            action = BattleNotificationReceiver.ACTION_SHOW_NOTIFICATION
            putExtra(BattleNotificationReceiver.EXTRA_BATTLE_ID, battle.id)
            putExtra(BattleNotificationReceiver.EXTRA_NOTIFICATION_ID, System.currentTimeMillis().toInt())
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Calculate next notification time
        val triggerTime = calculateNextTriggerTime(settings)

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (alarmManager.canScheduleExactAlarms()) {
                    alarmManager.setExactAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        triggerTime,
                        pendingIntent
                    )
                } else {
                    // Fall back to inexact alarm
                    alarmManager.setAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        triggerTime,
                        pendingIntent
                    )
                }
            } else {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    triggerTime,
                    pendingIntent
                )
            }
        } catch (e: SecurityException) {
            // Permission not granted, use inexact alarm
            alarmManager.setAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                triggerTime,
                pendingIntent
            )
        }
    }

    private fun calculateNextTriggerTime(settings: NotificationSettings): Long {
        val now = Calendar.getInstance()
        val currentHour = now.get(Calendar.HOUR_OF_DAY)

        var baseTime = now.timeInMillis + (settings.intervalMinutes * 60 * 1000)

        if (settings.randomTiming) {
            // Add random variation of +/- 25% of the interval
            val variation = (settings.intervalMinutes * 60 * 1000 * 0.25).toLong()
            baseTime += Random().nextLong() % (variation * 2) - variation
        }

        val triggerCalendar = Calendar.getInstance().apply { timeInMillis = baseTime }
        val triggerHour = triggerCalendar.get(Calendar.HOUR_OF_DAY)

        // Check if within allowed hours
        if (triggerHour < settings.startHour) {
            // Too early, schedule for start hour
            triggerCalendar.set(Calendar.HOUR_OF_DAY, settings.startHour)
            triggerCalendar.set(Calendar.MINUTE, 0)
            return triggerCalendar.timeInMillis
        }

        if (triggerHour >= settings.endHour) {
            // Too late, schedule for next day start hour
            triggerCalendar.add(Calendar.DAY_OF_YEAR, 1)
            triggerCalendar.set(Calendar.HOUR_OF_DAY, settings.startHour)
            triggerCalendar.set(Calendar.MINUTE, 0)
            return triggerCalendar.timeInMillis
        }

        return triggerCalendar.timeInMillis
    }

    fun cancelAllNotifications(context: Context) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, BattleNotificationReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        alarmManager.cancel(pendingIntent)
    }
}

data class NotificationSettings(
    val enabled: Boolean,
    val intervalMinutes: Int,
    val startHour: Int,
    val endHour: Int,
    val randomTiming: Boolean
)
