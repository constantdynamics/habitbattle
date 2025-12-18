package com.constantdynamics.dailybattle.widgets

import android.appwidget.AppWidgetManager
import android.content.Intent
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.ListView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.constantdynamics.dailybattle.BattleDataManager
import com.constantdynamics.dailybattle.R

/**
 * Configuration activity for Quick Battle widget
 * Lets user select which battle to track in the widget
 */
class WidgetConfigActivity : AppCompatActivity() {

    private var appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_widget_config)

        // Set result to canceled in case user backs out
        setResult(RESULT_CANCELED)

        // Get widget ID from intent
        appWidgetId = intent?.extras?.getInt(
            AppWidgetManager.EXTRA_APPWIDGET_ID,
            AppWidgetManager.INVALID_APPWIDGET_ID
        ) ?: AppWidgetManager.INVALID_APPWIDGET_ID

        if (appWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish()
            return
        }

        // Load battles
        val state = BattleDataManager.loadState(this)
        val battles = state.battles

        if (battles.isEmpty()) {
            findViewById<TextView>(R.id.config_title).text = "No battles found.\nCreate battles in the app first."
            return
        }

        // Create list of battle names
        val battleNames = battles.map { it.habit.name }
        val adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, battleNames)

        val listView = findViewById<ListView>(R.id.battle_list)
        listView.adapter = adapter

        listView.setOnItemClickListener { _, _, position, _ ->
            val selectedBattle = battles[position]
            saveWidgetConfig(selectedBattle.id)
        }
    }

    private fun saveWidgetConfig(battleId: String) {
        // Save selected battle for this widget
        val prefs = getSharedPreferences("widget_config", MODE_PRIVATE)
        prefs.edit().putString("widget_${appWidgetId}_battle", battleId).apply()

        // Update widget
        val appWidgetManager = AppWidgetManager.getInstance(this)
        QuickBattleWidget.updateWidget(this, appWidgetManager, appWidgetId)

        // Return success
        val resultValue = Intent().putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
        setResult(RESULT_OK, resultValue)
        finish()
    }
}
