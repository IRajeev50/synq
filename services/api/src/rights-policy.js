export const Capability=Object.freeze({REFERENCE:'reference',STREAM:'stream',OFFLINE_CACHE:'offline_cache',SESSION_CONTROL:'session_control',P2P_AUDIO:'p2p_audio'});
export class RightsPolicy {
 constructor({now=()=>Date.now()}={}){this.now=now;}
 authorize(manifest,{capability,territory}){
  if(capability===Capability.REFERENCE||capability===Capability.SESSION_CONTROL)return {allowed:true,reason:'non-audio product capability'};
  if(!manifest)return {allowed:false,reason:'missing rights manifest'};
  if(!manifest.recordingRight||!manifest.compositionRight)return {allowed:false,reason:'incomplete chain of title'};
  if(!manifest.territories?.includes(territory))return {allowed:false,reason:'territory not licensed'};
  if(this.now()<Date.parse(manifest.startsAt)||this.now()>=Date.parse(manifest.endsAt))return {allowed:false,reason:'licence inactive'};
  if(!manifest.capabilities?.includes(capability))return {allowed:false,reason:`${capability} not licensed`};
  return {allowed:true,reason:'manifest permits exact capability'};
 }
}
export class LicensedCatalogue {
 constructor(policy){this.policy=policy;this.assets=new Map();}
 addAsset(asset){if(!asset.manifest)throw new Error('Rights manifest required');this.assets.set(asset.id,asset);}
 offlineGrant(assetId,territory){const a=this.assets.get(assetId);const decision=this.policy.authorize(a?.manifest,{capability:Capability.OFFLINE_CACHE,territory});if(!decision.allowed)throw Object.assign(new Error(decision.reason),{status:403});return {assetId,encrypted:true,exportable:false,expiresAt:a.manifest.endsAt};}
}
