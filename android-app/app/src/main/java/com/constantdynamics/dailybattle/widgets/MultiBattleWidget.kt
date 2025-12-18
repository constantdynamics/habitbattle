package com.constantdynamics.dailybattle.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.view.View
import android.widget.RemoteViews
import com.constantdynamics.dailybattle.BattleDataManager
import com.constantdynamics.dailybattle.MainActivity
import com.constantdynamics.dailybattle.R

/**
 * Widget 3: Multi-Battle Quick Actions (4x2)
 * Shows top 3 battles that need attention with quick Yes/No buttons
 */
class MultiBattleWidget : AppWidgetProvider() {

    companion object {
        const val ACTION_BATTLE_YES = "com.constantdynamics.dailybattle.ACTION_BATTLE_YES"
        const val ACTION_BATTLE_NO = "com.constantdynamics.dailybattle.ACTION_BATTLE_NO"
        const val EXTRA_WIDGET_ID = "widget_id"
        const val EXTRA_BATTLE_ID = "battle_id"
        const val EXTRA_SLOT = "slot"

        fun updateWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
            val views = RemoteViews(context.packageName, R.layout.widget_multi_battle)

            // Get top 3 battles sorted by worst score (need most attention)
            val topBattles = BattleDataManager.getTopBattles(context, 3, sortByWorst = true)

            // Battle slot view IDs
            val slotContainers = listOf(R.id.battle_slot_1, R.id.battle_slot_2, R.id.battle_slot_3)
            val slotNames = listOf(R.id.battle_1_name, R.id.battle_2_name, R.id.battle_3_name)
            val slotScores = listOf(R.id.battle_1_score, R.id.battle_2_score, R.id.battle_3_score)
            val slotIndicators = listOf(R.id.battle_1_indicator, R.id.battle_2_indicator, R.id.battle_3_indicator)
            val slotYesButtons = listOf(R.id.battle_1_yes, R.id.battle_2_yes, R.id.battle_3_yes)
            val slotNoButtons = listOf(R.id.battle_1_no, R.id.battle_2_no, R.id.battle_3_no)

            for (i in 0..2) {
                if (i < topBattles.size) {
                    val battle = topBattles[i]
                    val todayData = BattleDataManager.getTodayData(battle)
                    val balance = BattleDataManager.calculateBalance(todayData)
                    val ratio = BattleDataManager.calculateRatio(todayData)
                    val hasData = todayData.good + todayData.bad > 0

                    views.setViewVisibility(slotContainers[i], View.VISIBLE)
                    views.setTextViewText(slotNames[i], battle.habit.name)
                    views.setTextViewText(slotScores[i], if (balance >= 0) "+$balance" else "$balance")
                    views.setInt(slotIndicators[i], "setBackgroundColor",
                        BattleDataManager.ratioToColor(ratio, hasData))

                    // Check cooldown
                    val now = System.currentTimeMillis()
                    val onCooldown = battle.cooldownEnd != null && battle.cooldownEnd!! > now

                    // Set button alpha based on cooldown
                    views.setFloat(slotYesButtons[i], "setAlpha", if (onCooldown) 0.4f else 1.0f)
                    views.setFloat(slotNoButtons[i], "setAlpha", if (onCooldown) 0.4f else 1.0f)

                    // Yes button intent
                    val yesIntent = Intent(context, MultiBattleWidget::class.java).apply {
                        action = ACTION_BATTLE_YES
                        putExtra(EXTRA_WIDGET_ID, appWidgetId)
                        putExtra(EXTRA_BATTLE_ID, battle.id)
                        putExtra(EXTRA_SLOT, i)
                    }
                    val yesPending = PendingIntent.getBroadcast(
                        context, appWidgetId * 10 + i * 2, yesIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                    views.setOnClickPendingIntent(slotYesButtons[i], yesPending)

                    // No button intent
                    val noIntent = Intent(context, MultiBattleWidget::class.java).apply {
                        action = ACTION_BATTLE_NO
                        putExtra(EXTRA_WIDGET_ID, appWidgetId)
                        putExtra(EXTRA_BATTLE_ID, battle.id)
                        putExtra(EXTRA_SLOT, i)
                    }
                    val noPending = PendingIntent.getBroadcast(
                        context, appWidgetId * 10 + i * 2 + 1, noIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                    views.setOnClickPendingIntent(slotNoButtons[i], noPending)
                } else {
                    views.setViewVisibility(slotContainers[i], View.GONE)
                }
            }

            // Open app button
            val openAppIntent = Intent(context, MainActivity::class.java)
            val pendingIntent = PendingIntent.getActivity(
                context, appWidgetId, openAppIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.header_container, pendingIntent)

            // Show total score
            val (totalGood, totalBad) = BattleDataManager.getTotalTodayScore(context)
            val totalBalance = totalGood - totalBad
            views.setTextViewText(R.id.total_score_text,
                "Today: ${if (totalBalance >= 0) "+$totalBalance" else totalBalance}")

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)

        when (intent.action) {
            ACTION_BATTLE_YES, ACTION_BATTLE_NO -> {
                val battleId = intent.getStringExtra(EXTRA_BATTLE_ID) ?: return
                val widgetId = intent.getIntExtra(EXTRA_WIDGET_ID, -1)
                val isGood = intent.action == ACTION_BATTLE_YES

                BattleDataManager.recordEntry(context, battleId, isGood)

                // Update widget
                val appWidgetManager = AppWidgetManager.getInstance(context)
                updateWidget(context, appWidgetManager, widgetId)
            }
        }
    }
}
