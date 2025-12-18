package com.constantdynamics.dailybattle

import android.Manifest
import android.annotation.SuppressLint
import android.appwidget.AppWidgetManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebResourceRequest
import android.webkit.WebViewClient
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import java.net.URI
import com.constantdynamics.dailybattle.widgets.QuickBattleWidget
import com.constantdynamics.dailybattle.widgets.ScoreDashboardWidget
import com.constantdynamics.dailybattle.widgets.MultiBattleWidget
import com.constantdynamics.dailybattle.notifications.BattleNotificationReceiver
import com.constantdynamics.dailybattle.notifications.NotificationScheduler

/**
 * Main Activity - WebView wrapper for the Daily Battle PWA
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    // Alleen deze domeinen zijn toegestaan (beveiliging)
    private val allowedHosts = listOf(
        "constantdynamics.github.io"
    )

    // Permission request launcher for notifications
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            // Permission granted, create notification channel
            BattleNotificationReceiver.createNotificationChannel(this)
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Request notification permission on Android 13+
        requestNotificationPermission()

        webView = findViewById(R.id.webview)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = false  // Beveiligd: geen toegang tot lokale bestanden
            useWideViewPort = true
            loadWithOverviewMode = true
            // Extra beveiliging
            allowContentAccess = false
            setSupportMultipleWindows(false)
        }

        // Add JavaScript interface for data sync
        webView.addJavascriptInterface(DataSyncInterface(this), "AndroidBridge")

        webView.webViewClient = object : WebViewClient() {

            // Blokkeer alle URLs behalve toegestane domeinen
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return true
                return !isUrlAllowed(url)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // Inject sync script after page loads
                injectSyncScript()
            }
        }

        // Load the PWA
        webView.loadUrl("https://constantdynamics.github.io/habitbattle/")
    }

    // Controleer of URL is toegestaan
    private fun isUrlAllowed(url: String): Boolean {
        return try {
            val uri = URI(url)
            val host = uri.host ?: return false
            // Moet HTTPS zijn en op toegestaan domein
            uri.scheme == "https" && allowedHosts.any { host.endsWith(it) }
        } catch (e: Exception) {
            false
        }
    }

    private fun injectSyncScript() {
        val syncScript = """
            (function() {
                // Save original setItem
                const originalSetItem = localStorage.setItem.bind(localStorage);

                // Override to sync with Android
                localStorage.setItem = function(key, value) {
                    originalSetItem(key, value);
                    if (key === 'dailyBattle' && window.AndroidBridge) {
                        window.AndroidBridge.syncData(value);
                    }
                };

                // Initial sync from Android to web if Android has data
                if (window.AndroidBridge) {
                    const androidData = window.AndroidBridge.getData();
                    if (androidData && androidData !== 'null') {
                        const webData = localStorage.getItem('dailyBattle');
                        // Merge logic - Android data takes precedence for widget updates
                        if (!webData || androidData.length > webData.length) {
                            localStorage.setItem('dailyBattle', androidData);
                            location.reload();
                        }
                    }
                }
            })();
        """.trimIndent()

        webView.evaluateJavascript(syncScript, null)
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    private fun requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            when {
                ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.POST_NOTIFICATIONS
                ) == PackageManager.PERMISSION_GRANTED -> {
                    // Permission already granted
                    BattleNotificationReceiver.createNotificationChannel(this)
                }
                else -> {
                    // Request permission
                    requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                }
            }
        } else {
            // No permission needed on older versions
            BattleNotificationReceiver.createNotificationChannel(this)
        }
    }

    /**
     * JavaScript interface for syncing data between WebView and native Android
     */
    inner class DataSyncInterface(private val context: android.content.Context) {

        @JavascriptInterface
        fun syncData(jsonData: String) {
            // Save to SharedPreferences so widgets can access it
            val prefs = context.getSharedPreferences("daily_battle_prefs", MODE_PRIVATE)
            prefs.edit().putString("dailyBattle", jsonData).apply()

            // Update all widgets
            updateAllWidgets()
        }

        @JavascriptInterface
        fun getData(): String? {
            val prefs = context.getSharedPreferences("daily_battle_prefs", MODE_PRIVATE)
            return prefs.getString("dailyBattle", null)
        }

        @JavascriptInterface
        fun setNotificationsEnabled(enabled: Boolean) {
            NotificationScheduler.setEnabled(context, enabled)
        }

        @JavascriptInterface
        fun setNotificationSettings(intervalMinutes: Int, startHour: Int, endHour: Int, randomTiming: Boolean) {
            NotificationScheduler.setSettings(context, intervalMinutes, startHour, endHour, randomTiming)
        }

        @JavascriptInterface
        fun areNotificationsEnabled(): Boolean {
            return NotificationScheduler.isEnabled(context)
        }

        @JavascriptInterface
        fun testNotification() {
            // Show a test notification for the first battle
            val state = BattleDataManager.loadState(context)
            if (state.battles.isNotEmpty()) {
                val battle = state.battles[0]
                BattleNotificationReceiver.showBattleNotification(
                    context,
                    battle.id,
                    System.currentTimeMillis().toInt()
                )
            }
        }

        private fun updateAllWidgets() {
            // Run on main thread since JavaScript interface runs on background thread
            Handler(Looper.getMainLooper()).post {
                val appWidgetManager = AppWidgetManager.getInstance(context)
                val componentName1 = android.content.ComponentName(context, QuickBattleWidget::class.java)
                val componentName2 = android.content.ComponentName(context, ScoreDashboardWidget::class.java)
                val componentName3 = android.content.ComponentName(context, MultiBattleWidget::class.java)

                // Get all widget IDs and update each one
                val widgetIds1 = appWidgetManager.getAppWidgetIds(componentName1)
                val widgetIds2 = appWidgetManager.getAppWidgetIds(componentName2)
                val widgetIds3 = appWidgetManager.getAppWidgetIds(componentName3)

                // Update Quick Battle widgets
                for (widgetId in widgetIds1) {
                    QuickBattleWidget.updateWidget(context, appWidgetManager, widgetId)
                }

                // Update Score Dashboard widgets
                for (widgetId in widgetIds2) {
                    ScoreDashboardWidget.updateWidget(context, appWidgetManager, widgetId)
                }

                // Update Multi-Battle widgets
                for (widgetId in widgetIds3) {
                    MultiBattleWidget.updateWidget(context, appWidgetManager, widgetId)
                }
            }
        }
    }
}
