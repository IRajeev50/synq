const MAX_TOKEN_BYTES=4;
export function makeEpochToken(now=Date.now(),random=Math.random){const salt=Math.floor(random()*1679616).toString(36).padStart(4,'0');return salt}
export function isValidEpochToken(token){return typeof token==='string'&&/^[a-z0-9]{1,4}$/.test(token)}
export function normalizeEncounter(event){if(!event||!isValidEpochToken(event.epochToken))return null;return {id:event.epochToken,epochToken:event.epochToken,rssiBucket:event.rssiBucket==='likely-near'?'likely-near':'uncertain',observedAt:Number(event.observedAt)||Date.now()}}
export function upsertEncounter(items,event){const next=normalizeEncounter(event);if(!next)return items;return [next,...items.filter(item=>item.epochToken!==next.epochToken)].slice(0,20)}
export {MAX_TOKEN_BYTES};
