package expo.modules.synqnearby
import android.Manifest
import android.bluetooth.*
import android.bluetooth.le.*
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.ParcelUuid
import androidx.core.content.ContextCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.UUID

class SynqNearbyModule: Module() {
 private val uuid=ParcelUuid(UUID.fromString("A7C10001-86B4-4E0A-9CA1-6D88F23A1B31")); private var token=""; private var callback:ScanCallback?=null; private var advertiseCallback:AdvertiseCallback?=null
 override fun definition()=ModuleDefinition {
  Name("SynqNearby"); Events("onEncounter","onState")
  AsyncFunction("permissionState") { if(Build.VERSION.SDK_INT<31 || listOf(Manifest.permission.BLUETOOTH_SCAN,Manifest.permission.BLUETOOTH_ADVERTISE,Manifest.permission.BLUETOOTH_CONNECT).all{ContextCompat.checkSelfPermission(context,it)==PackageManager.PERMISSION_GRANTED}) "granted" else "undetermined" }
  AsyncFunction("start") { epochToken:String -> require(epochToken.toByteArray().size in 1..4);token=epochToken;startBle() }
  AsyncFunction("stop") { stopBle() }
  OnDestroy { stopBle() }
 }
 private val context get()=appContext.reactContext ?: throw IllegalStateException("No React context")
 private fun adapter()=(context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager).adapter
 private fun startBle(){val a=adapter();if(!a.isEnabled){sendEvent("onState",mapOf("state" to "bluetooth-unavailable"));return};val data=token.toByteArray();val advertiser=a.bluetoothLeAdvertiser;if(advertiser==null){sendEvent("onState",mapOf("state" to "advertising-unsupported"));return};advertiseCallback=object:AdvertiseCallback(){override fun onStartFailure(code:Int){sendEvent("onState",mapOf("state" to "advertise-failed","code" to code))}};try{advertiser.startAdvertising(AdvertiseSettings.Builder().setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_POWER).setConnectable(false).build(),AdvertiseData.Builder().addServiceData(uuid,data).build(),advertiseCallback)}catch(e:SecurityException){sendEvent("onState",mapOf("state" to "permission-denied"));return};callback=object:ScanCallback(){override fun onScanResult(t:Int,r:ScanResult){val found=r.scanRecord?.getServiceData(uuid)?.toString(Charsets.UTF_8)?:return;if(found==token)return;sendEvent("onEncounter",mapOf("epochToken" to found,"rssiBucket" to if(r.rssi>-65)"likely-near" else "uncertain","observedAt" to System.currentTimeMillis()))}};val scanner=a.bluetoothLeScanner;if(scanner==null){sendEvent("onState",mapOf("state" to "scanning-unsupported"));return};try{scanner.startScan(emptyList(),ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_POWER).build(),callback);sendEvent("onState",mapOf("state" to "active"))}catch(e:SecurityException){sendEvent("onState",mapOf("state" to "permission-denied"))}}
 private fun stopBle(){val a=adapter();callback?.let{a.bluetoothLeScanner?.stopScan(it)};advertiseCallback?.let{a.bluetoothLeAdvertiser?.stopAdvertising(it)};callback=null;advertiseCallback=null}
}
