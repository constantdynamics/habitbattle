package com.constantdynamics.dailybattle.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.constantdynamics.dailybattle.BattleDataManager
import com.constantdynamics.dailybattle.R

/**
 * Widget 1: Quick Battle (2x1)
 * Simple widget with Yes/No buttons for quick habit tracking
 */
class QuickBattleWidget : AppWidgetProvider() {

    companion object {
        const val ACTION_YES = "com.constantdynamics.dailybattle.ACTION_YES"
        const val ACTION_NO = "com.constantdynamics.dailybattle.ACTION_NO"
        const val EXTRA_WIDGET_ID = "widget_id"
        const val EXTRA_BATTLE_ID = "battle_id"

        fun updateWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
            val prefs = context.getSharedPreferences("widget_config", Context.MODE_PRIVATE)
            val battleId = prefs.getString("widget_${appWidgetId}_battle", null)

            val views = RemoteViews(context.packageName, R.layout.widget_quick_battle)

            if (battleId != null) {
                val battle = BattleDataManager.getBattle(context, battleId)
                if (battle != null) {
                    val todayData = BattleDataManager.getTodayData(battle)
                    val balance = BattleDataManager.calculateBalance(todayData)
                    val ratio = BattleDataManager.calculateRatio(todayData)
                    val hasData = todayData.good + todayData.bad > 0

                    // Update UI
                    views.setTextViewText(R.id.battle_name, battle.habit.name)
                    views.setTextViewText(R.id.score_text, if (balance >= 0) "+$balance" else "$balance")
                    views.setInt(R.id.score_indicator, "setBackgroundColor",
                        BattleDataManager.ratioToColor(ratio, hasData))

                    // Check cooldown
                    val now = System.currentTimeMillis()
                    val onCooldown = battle.cooldownEnd != null && battle.cooldownEnd!! > now

                    if (onCooldown) {
                        views.setTextViewText(R.id.cooldown_text, "⏳")
                        views.setViewVisibility(R.id.cooldown_text, android.view.View.VISIBLE)
                    } else {
                        views.setViewVisibility(R.id.cooldown_text, android.view.View.GONE)
                    }

                    // Set up click intents
                    val yesIntent = Intent(context, QuickBattleWidget::class.java).apply {
                        action = ACTION_YES
                        putExtra(EXTRA_WIDGET_ID, appWidgetId)
                        putExtra(EXTRA_BATTLE_ID, battleId)
                    }
                    val yesPending = PendingIntent.getBroadcast(
                        context, appWidgetId * 2, yesIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                    views.setOnClickPendingIntent(R.id.btn_yes, yesPending)

                    val noIntent = Intent(context, QuickBattleWidget::class.java).apply {
                        action = ACTION_NO
                        putExtra(EXTRA_WIDGET_ID, appWidgetId)
                        putExtra(EXTRA_BATTLE_ID, battleId)
                    }
                    val noPending = PendingIntent.getBroadcast(
                        context, appWidgetId * 2 + 1, noIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                    )
                    views.setOnClickPendingIntent(R.id.btn_no, noPending)
                } else {
                    views.setTextViewText(R.id.battle_name, "Battle not found")
                }
            } else {
                views.setTextViewText(R.id.battle_name, "Tap to configure")
            }

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
            ACTION_YES, ACTION_NO -> {
                val battleId = intent.getStringExtra(EXTRA_BATTLE_ID) ?: return
                val widgetId = intent.getIntExtra(EXTRA_WIDGET_ID, -1)
                val isGood = intent.action == ACTION_YES

                BattleDataManager.recordEntry(context, battleId, isGood)

                // Update widget
                val appWidgetManager = AppWidgetManager.getInstance(context)
                updateWidget(context, appWidgetManager, widgetId)
            }
        }
    }

    override fun onDeleted(context: Context, appWidgetIds: IntArray) {
        val prefs = context.getSharedPreferences("widget_config", Context.MODE_PRIVATE)
        val editor = prefs.edit()
        for (widgetId in appWidgetIds) {
            editor.remove("widget_${widgetId}_battle")
        }
        editor.apply()
    }
}
