package com.constantdynamics.dailybattle.notifications

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * Reschedules notifications when device boots up
 */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            // Recreate notification channel
            BattleNotificationReceiver.createNotificationChannel(context)

            // Reschedule notifications if enabled
            if (NotificationScheduler.isEnabled(context)) {
                NotificationScheduler.scheduleNextNotification(context)
            }
        }
    }
}
