# Daily Battle - Android App met Widgets

Android applicatie voor Daily Battle met 3 home screen widgets.

## Widgets

### 1. Quick Battle (2x1)
Compacte widget voor een enkele battle met Yes/No knoppen.
- Selecteer welke battle je wilt tracken bij setup
- Toont huidige score en cooldown status
- Directe interactie zonder app te openen

### 2. Score Dashboard (2x2)
Overzicht van je totale dagelijkse score.
- Totale score over alle battles
- Aantal goede vs slechte entries
- Gemiddelde streak
- Tik om de app te openen

### 3. Multi-Battle Quick Actions (4x2)
Top 3 battles die aandacht nodig hebben.
- Automatisch gesorteerd op slechtste score
- Yes/No knoppen per battle
- Cooldown indicatie
- Totale dag score

## Bouwen

### Vereisten
- Android Studio Hedgehog (2023.1.1) of nieuwer
- JDK 17
- Android SDK 34

### Stappen

1. **Open project in Android Studio**
   ```
   File > Open > Selecteer de android-app folder
   ```

2. **Sync Gradle**
   - Android Studio zal automatisch vragen om Gradle te syncen
   - Klik "Sync Now" als dat niet automatisch gebeurt

3. **Build APK**
   ```
   Build > Build Bundle(s) / APK(s) > Build APK(s)
   ```

   Of via command line:
   ```bash
   ./gradlew assembleDebug
   ```

4. **APK locatie**
   ```
   app/build/outputs/apk/debug/app-debug.apk
   ```

### Installeren op telefoon

**Via USB:**
1. Zet USB debugging aan op je telefoon (Developer Options)
2. Verbind telefoon met USB
3. In Android Studio: Run > Run 'app'

**Via APK:**
1. Kopieer de APK naar je telefoon
2. Open de APK via een file manager
3. Sta installatie van onbekende bronnen toe indien gevraagd

## Data Synchronisatie

De app synchroniseert data met de PWA via SharedPreferences:
- Wanneer je iets in de PWA doet, wordt dit opgeslagen in localStorage
- De Android WebView leest dit en slaat het op in SharedPreferences
- Widgets lezen direct uit SharedPreferences
- Widget acties worden ook naar SharedPreferences geschreven

**Let op:** De synchronisatie werkt alleen als je de PWA via deze app opent, niet via een browser.

## Structuur

```
android-app/
├── app/
│   ├── src/main/
│   │   ├── java/com/constantdynamics/dailybattle/
│   │   │   ├── BattleData.kt          # Data classes en manager
│   │   │   ├── MainActivity.kt         # WebView wrapper
│   │   │   └── widgets/
│   │   │       ├── QuickBattleWidget.kt
│   │   │       ├── ScoreDashboardWidget.kt
│   │   │       ├── MultiBattleWidget.kt
│   │   │       └── WidgetConfigActivity.kt
│   │   ├── res/
│   │   │   ├── layout/                 # Widget en activity layouts
│   │   │   ├── drawable/               # Iconen en achtergronden
│   │   │   ├── values/                 # Strings, kleuren, thema's
│   │   │   └── xml/                    # Widget configuratie
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
├── settings.gradle
└── gradle.properties
```

## Release Build

Voor een gesigneerde release APK:

1. Maak een keystore:
   ```bash
   keytool -genkey -v -keystore daily-battle.keystore -alias dailybattle -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Voeg signing config toe aan `app/build.gradle`:
   ```gradle
   android {
       signingConfigs {
           release {
               storeFile file('daily-battle.keystore')
               storePassword 'your-password'
               keyAlias 'dailybattle'
               keyPassword 'your-password'
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled true
               proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

3. Build release APK:
   ```bash
   ./gradlew assembleRelease
   ```
