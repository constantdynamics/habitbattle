package com.constantdynamics.dailybattle.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.constantdynamics.dailybattle.BattleDataManager
import com.constantdynamics.dailybattle.MainActivity
import com.constantdynamics.dailybattle.R

/**
 * Handles battle reminder notifications with Yes/No action buttons
 */
class BattleNotificationReceiver : BroadcastReceiver() {

    companion object {
        const val CHANNEL_ID = "daily_battle_reminders"
        const val ACTION_SHOW_NOTIFICATION = "com.constantdynamics.dailybattle.SHOW_NOTIFICATION"
        const val ACTION_NOTIFICATION_YES = "com.constantdynamics.dailybattle.NOTIFICATION_YES"
        const val ACTION_NOTIFICATION_NO = "com.constantdynamics.dailybattle.NOTIFICATION_NO"
        const val EXTRA_BATTLE_ID = "battle_id"
        const val EXTRA_NOTIFICATION_ID = "notification_id"

        fun createNotificationChannel(context: Context) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val name = "Battle Herinneringen"
                val descriptionText = "Herinneringen om je battles in te vullen"
                val importance = NotificationManager.IMPORTANCE_HIGH
                val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                    description = descriptionText
                    enableVibration(true)
                }
                val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                notificationManager.createNotificationChannel(channel)
            }
        }

        fun showBattleNotification(context: Context, battleId: String, notificationId: Int) {
            val battle = BattleDataManager.getBattle(context, battleId) ?: return

            createNotificationChannel(context)

            // Intent to open app
            val openAppIntent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
            val openAppPending = PendingIntent.getActivity(
                context, notificationId, openAppIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // Yes button intent
            val yesIntent = Intent(context, BattleNotificationReceiver::class.java).apply {
                action = ACTION_NOTIFICATION_YES
                putExtra(EXTRA_BATTLE_ID, battleId)
                putExtra(EXTRA_NOTIFICATION_ID, notificationId)
            }
            val yesPending = PendingIntent.getBroadcast(
                context, notificationId * 2, yesIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // No button intent
            val noIntent = Intent(context, BattleNotificationReceiver::class.java).apply {
                action = ACTION_NOTIFICATION_NO
                putExtra(EXTRA_BATTLE_ID, battleId)
                putExtra(EXTRA_NOTIFICATION_ID, notificationId)
            }
            val noPending = PendingIntent.getBroadcast(
                context, notificationId * 2 + 1, noIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // Get current score for context
            val todayData = BattleDataManager.getTodayData(battle)
            val balance = BattleDataManager.calculateBalance(todayData)
            val scoreText = if (balance >= 0) "+$balance" else "$balance"

            val notification = NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle("⚔️ ${battle.habit.name}")
                .setContentText(battle.habit.question)
                .setSubText("Score: $scoreText")
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setContentIntent(openAppPending)
                .setAutoCancel(true)
                .addAction(0, "✓ JA", yesPending)
                .addAction(0, "✗ NEE", noPending)
                .setCategory(NotificationCompat.CATEGORY_REMINDER)
                .build()

            try {
                NotificationManagerCompat.from(context).notify(notificationId, notification)
            } catch (e: SecurityException) {
                // Notification permission not granted
            }
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        when (intent.action) {
            ACTION_NOTIFICATION_YES, ACTION_NOTIFICATION_NO -> {
                val battleId = intent.getStringExtra(EXTRA_BATTLE_ID) ?: return
                val notificationId = intent.getIntExtra(EXTRA_NOTIFICATION_ID, 0)
                val isGood = intent.action == ACTION_NOTIFICATION_YES

                // Record the entry
                val success = BattleDataManager.recordEntry(context, battleId, isGood)

                // Cancel the notification
                NotificationManagerCompat.from(context).cancel(notificationId)

                // Show feedback notification
                if (success) {
                    showFeedbackNotification(context, isGood, notificationId + 1000)
                }

                // Schedule next notification
                NotificationScheduler.scheduleNextNotification(context)

                // Update widgets
                updateWidgets(context)
            }

            ACTION_SHOW_NOTIFICATION -> {
                val battleId = intent.getStringExtra(EXTRA_BATTLE_ID) ?: return
                val notificationId = intent.getIntExtra(EXTRA_NOTIFICATION_ID, System.currentTimeMillis().toInt())
                showBattleNotification(context, battleId, notificationId)

                // Schedule next notification
                NotificationScheduler.scheduleNextNotification(context)
            }
        }
    }

    private fun updateWidgets(context: Context) {
        // Broadcast to update all widgets
        val updateIntent = Intent("com.constantdynamics.dailybattle.WIDGET_UPDATE")
        context.sendBroadcast(updateIntent)
    }

    private fun showFeedbackNotification(context: Context, isGood: Boolean, notificationId: Int) {
        createNotificationChannel(context)

        val title = if (isGood) "YEAH! ✓" else "DAMN! ✗"
        val text = if (isGood) "Goed bezig! Keep going!" else "Volgende keer beter!"

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(text)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setAutoCancel(true)
            .setTimeoutAfter(3000) // Auto-dismiss after 3 seconds
            .build()

        try {
            NotificationManagerCompat.from(context).notify(notificationId, notification)
        } catch (e: SecurityException) {
            // Permission not granted
        }
    }
}
