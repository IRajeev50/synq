import {EventEmitter,requireNativeModule} from 'expo-modules-core';
const Native=requireNativeModule('SynqNearby');const emitter=new EventEmitter(Native);
export const SynqNearby={permissionState:()=>Native.permissionState(),start:token=>Native.start(token),stop:()=>Native.stop(),onEncounter:handler=>emitter.addListener('onEncounter',handler)};
