# ProGuard rules for Daily Battle

# Keep Gson serialization classes
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.constantdynamics.dailybattle.** { *; }
-keep class com.google.gson.** { *; }

# Keep JavaScript interface
-keepclassmembers class com.constantdynamics.dailybattle.MainActivity$DataSyncInterface {
    public *;
}
