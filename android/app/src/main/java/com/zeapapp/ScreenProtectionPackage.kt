package com.zeapapp

import android.view.WindowManager
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.uimanager.ViewManager

class ScreenProtectionModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context), LifecycleEventListener {
    private var activeCount = 0

    init {
        context.addLifecycleEventListener(this)
    }

    override fun getName() = "ScreenProtection"

    @ReactMethod fun enable() {
        UiThreadUtil.runOnUiThread {
            activeCount += 1
            apply()
        }
    }

    @ReactMethod fun disable() {
        UiThreadUtil.runOnUiThread {
            if (activeCount > 0) activeCount -= 1
            apply()
        }
    }

    override fun onHostResume() {
        UiThreadUtil.runOnUiThread { apply() }
    }

    override fun onHostPause() {}

    override fun onHostDestroy() {}

    private fun apply() {
        val window = currentActivity?.window ?: return
        if (activeCount > 0) {
            window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
        } else {
            window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
        }
    }
}

class ScreenProtectionPackage : ReactPackage {
    override fun createNativeModules(context: ReactApplicationContext): List<NativeModule> = listOf(ScreenProtectionModule(context))
    override fun createViewManagers(context: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}
