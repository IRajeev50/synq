import ExpoModulesCore
import CoreBluetooth

public final class SynqNearbyModule: Module, CBCentralManagerDelegate, CBPeripheralManagerDelegate {
  private let serviceUUID = CBUUID(string: "A7C10001-86B4-4E0A-9CA1-6D88F23A1B31")
  private var central: CBCentralManager?
  private var peripheral: CBPeripheralManager?
  private var token = ""

  public func definition() -> ModuleDefinition {
    Name("SynqNearby")
    Events("onEncounter", "onState")
    AsyncFunction("permissionState") { () -> String in
      switch CBManager.authorization { case .allowedAlways: return "granted"; case .denied, .restricted: return "denied"; default: return "undetermined" }
    }
    AsyncFunction("start") { (epochToken: String) in
      guard epochToken.utf8.count <= 20 else { throw InvalidTokenException() }
      self.token = epochToken
      self.central = CBCentralManager(delegate: self, queue: nil)
      self.peripheral = CBPeripheralManager(delegate: self, queue: nil)
    }
    AsyncFunction("stop") { self.central?.stopScan(); self.peripheral?.stopAdvertising(); self.central=nil; self.peripheral=nil }
    OnAppEntersBackground { self.sendEvent("onState", ["state":"degraded-background"]) }
  }
  public func centralManagerDidUpdateState(_ central: CBCentralManager) {
    guard central.state == .poweredOn else { sendEvent("onState", ["state":"bluetooth-unavailable"]); return }
    central.scanForPeripherals(withServices: [serviceUUID], options: [CBCentralManagerScanOptionAllowDuplicatesKey:false])
  }
  public func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String:Any], rssi RSSI: NSNumber) {
    guard let data=advertisementData[CBAdvertisementDataServiceDataKey] as? [CBUUID:Data], let payload=data[serviceUUID], let observed=String(data:payload,encoding:.utf8), observed != token else { return }
    sendEvent("onEncounter", ["epochToken":observed,"rssiBucket":RSSI.intValue > -65 ? "likely-near":"uncertain","observedAt":ISO8601DateFormatter().string(from:Date())])
  }
  public func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
    guard peripheral.state == .poweredOn else { return }
    peripheral.startAdvertising([CBAdvertisementDataServiceUUIDsKey:[serviceUUID],CBAdvertisementDataServiceDataKey:[serviceUUID:Data(token.utf8)]])
  }
}
private class InvalidTokenException: Exception { override var reason: String { "Epoch token must be at most 20 UTF-8 bytes" } }
