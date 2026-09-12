export const AudioCapability=Object.freeze({REFERENCE:'reference',STREAM:'stream',OFFLINE_CACHE:'offline_cache',SESSION_CONTROL:'session_control',P2P_AUDIO:'p2p_audio'});
export function canUse(rights,capability,{country,at=Date.now()}={}){return !!rights&&rights.capabilities?.includes(capability)&&rights.territories?.includes(country)&&Date.parse(rights.startsAt)<=at&&at<Date.parse(rights.endsAt)}
export function playlistSharePayload(playlist){return {version:1,playlistId:playlist.id,revision:playlist.revision,signature:playlist.signature};}
