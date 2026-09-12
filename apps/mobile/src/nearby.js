export class NearbyTransport { async permissionState(){throw new Error('not implemented')} async start(_epochToken){throw new Error('not implemented')} async stop(){} onEncounter(_handler){return()=>{}} }
export class PilotCodeTransport extends NearbyTransport { constructor(code){super();this.code=code} async permissionState(){return 'not-required'} async start(token){return {mode:'pilot-code',code:this.code,token}} }
// Production development builds inject native CoreBluetooth/Android BLE implementations. Expo Go must never report BLE discovery as active.
