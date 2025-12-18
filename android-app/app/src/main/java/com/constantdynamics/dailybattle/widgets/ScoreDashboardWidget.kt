package com.constantdynamics.dailybattle.widgets

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.constantdynamics.dailybattle.BattleDataManager
import com.constantdynamics.dailybattle.MainActivity
import com.constantdynamics.dailybattle.R

/**
 * Widget 2: Score Dashboard (2x2)
 * Shows today's total score across all battles with progress visualization
 */
class ScoreDashboardWidget : AppWidgetProvider() {

    companion object {
        fun updateWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
            val views = RemoteViews(context.packageName, R.layout.widget_score_dashboard)

            // Get total scores
            val (totalGood, totalBad) = BattleDataManager.getTotalTodayScore(context)
            val balance = totalGood - totalBad
            val total = totalGood + totalBad
            val ratio = if (total == 0) 0.5f else totalGood.toFloat() / total

            // Update score display
            views.setTextViewText(R.id.total_score, if (balance >= 0) "+$balance" else "$balance")
            views.setTextViewText(R.id.good_count, "✓ $totalGood")
            views.setTextViewText(R.id.bad_count, "✗ $totalBad")

            // Set color based on ratio
            val color = BattleDataManager.ratioToColor(ratio, total > 0)
            views.setInt(R.id.score_background, "setBackgroundColor", color)

            // Get battle count
            val state = BattleDataManager.loadState(context)
            views.setTextViewText(R.id.battle_count, "${state.battles.size} battles")

            // Calculate overall streak (simplified - days with positive balance)
            var streak = 0
            if (state.battles.isNotEmpty()) {
                // Average streak across battles
                val streaks = state.battles.map { BattleDataManager.calculateStreak(it) }
                streak = streaks.average().toInt()
            }
            views.setTextViewText(R.id.streak_text, "🔥 $streak day streak")

            // Set up click to open app
            val openAppIntent = Intent(context, MainActivity::class.java)
            val pendingIntent = PendingIntent.getActivity(
                context, appWidgetId, openAppIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)

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
}
