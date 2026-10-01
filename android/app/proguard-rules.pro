# Project-specific ProGuard/R8 rules.
# Most libraries ship their own consumer rules; these cover the reflection-heavy
# paths in this app that R8 cannot see statically.

# ---- React Native core ----
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class * { *; }
-keepclassmembers class * { @com.facebook.proguard.annotations.DoNotStrip *; }
-keepclassmembers class * { @com.facebook.react.uimanager.annotations.ReactProp <methods>; }
-keepclassmembers class * { @com.facebook.react.bridge.ReactMethod <methods>; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class * extends com.facebook.react.bridge.NativeModule { *; }
-keep class * implements com.facebook.react.ReactPackage { *; }

# ---- Hermes ----
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# ---- Firebase (auth / messaging) ----
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# ---- Payments (Paystack webview, Stripe) ----
-keep class com.stripe.android.** { *; }
-dontwarn com.stripe.android.**
-keepclassmembers class * { @android.webkit.JavascriptInterface <methods>; }

# ---- Misc native modules that resolve classes reflectively ----
-keep class com.horcrux.svg.** { *; }
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.gesturehandler.** { *; }

# Keep source line numbers so QA crash reports stay readable.
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod
