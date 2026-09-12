import {PermissionsAndroid,Platform} from 'react-native';
let native=null;try{native=require('synq-nearby').SynqNearby}catch{}
export class NearbyTransport {
 isNativeAvailable(){return Boolean(native)}
 async permissionState(){if(!native)return 'development-build-required';if(Platform.OS!=='android')return native.permissionState();const wanted=Number(Platform.Version)>=31?[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]:[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];return (await Promise.all(wanted.map(p=>PermissionsAndroid.check(p)))).every(Boolean)?'granted':'undetermined'}
 async requestPermission(){if(!native)return 'development-build-required';if(Platform.OS!=='android')return native.permissionState();const wanted=Number(Platform.Version)>=31?[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]:[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];const result=await PermissionsAndroid.requestMultiple(wanted);return wanted.every(p=>result[p]===PermissionsAndroid.RESULTS.GRANTED)?'granted':'denied'}
 async start(epochToken){if(!native)throw new Error('Native BLE module is missing. Install the current SYNQ preview APK, not Expo Go.');return native.start(epochToken)}
 async stop(){return native?.stop()}
 onEncounter(handler){return native?native.onEncounter(handler):{remove(){}}}
 onState(handler){return native?native.onState(handler):{remove(){}}}
}
