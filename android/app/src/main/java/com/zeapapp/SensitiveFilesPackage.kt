package com.zeapapp

import android.net.Uri
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.ViewManager
import java.io.File
import java.util.UUID

class SensitiveFilesModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    override fun getName() = "SensitiveFiles"
    private val directory get() = File(context.cacheDir, "zeap-sensitive")
    @ReactMethod fun stage(uri: String, promise: Promise) {
        val destination = File(directory, UUID.randomUUID().toString())
        try {
            directory.mkdirs()
            context.contentResolver.openInputStream(Uri.parse(uri)).use { input ->
                requireNotNull(input) { "Document unavailable" }
                destination.outputStream().use { output -> input.copyTo(output) }
            }
            if (uri.startsWith("file:")) {
                val source = File(requireNotNull(Uri.parse(uri).path)).canonicalFile
                if (source.path.startsWith(context.cacheDir.canonicalPath + File.separator) && source != destination) source.delete()
            }
            promise.resolve(Uri.fromFile(destination).toString())
        } catch (error: Exception) {
            destination.delete()
            promise.reject("STAGE_FAILED", "Unable to prepare document")
        }
    }
    @ReactMethod fun remove(uri: String, promise: Promise) {
        try {
            val target = File(requireNotNull(Uri.parse(uri).path)).canonicalFile
            require(target.path.startsWith(directory.canonicalPath + File.separator))
            check(!target.exists() || target.delete())
            promise.resolve(null)
        } catch (error: Exception) { promise.reject("CLEANUP_FAILED", "Unable to remove document") }
    }
    @ReactMethod fun clear(promise: Promise) {
        if (!directory.exists() || directory.deleteRecursively()) promise.resolve(null)
        else promise.reject("CLEANUP_FAILED", "Unable to clear documents")
    }
}
class SensitiveFilesPackage : ReactPackage {
    override fun createNativeModules(context: ReactApplicationContext): List<NativeModule> = listOf(SensitiveFilesModule(context))
    override fun createViewManagers(context: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}
