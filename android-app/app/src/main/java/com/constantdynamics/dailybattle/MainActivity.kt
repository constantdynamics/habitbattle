package com.constantdynamics.dailybattle

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

/**
 * Main Activity - WebView wrapper for the Daily Battle PWA
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            useWideViewPort = true
            loadWithOverviewMode = true
        }

        // Add JavaScript interface for data sync
        webView.addJavascriptInterface(DataSyncInterface(this), "AndroidBridge")

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // Inject sync script after page loads
                injectSyncScript()
            }
        }

        // Load the PWA
        webView.loadUrl("https://constantdynamics.github.io/habitbattle/")
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

        private fun updateAllWidgets() {
            val intent = android.content.Intent(context, widgets.QuickBattleWidget::class.java)
            intent.action = android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE
            context.sendBroadcast(intent)

            val intent2 = android.content.Intent(context, widgets.ScoreDashboardWidget::class.java)
            intent2.action = android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE
            context.sendBroadcast(intent2)

            val intent3 = android.content.Intent(context, widgets.MultiBattleWidget::class.java)
            intent3.action = android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE
            context.sendBroadcast(intent3)
        }
    }
}
