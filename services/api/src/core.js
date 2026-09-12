import crypto from 'node:crypto';

const id = () => crypto.randomUUID();
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const clamp = (n,min,max) => Math.max(min,Math.min(max,n));

export class SynqCore {
  constructor({now=()=>Date.now(), secret='development-only-change-me'}={}) {
    this.now=now; this.secret=secret;
    this.users=new Map(); this.sessions=new Map(); this.tokens=new Map(); this.candidates=new Map(); this.connections=new Map(); this.messages=[]; this.blocks=new Set(); this.reports=[]; this.events=[];
  }
  audit(type, actor, data={}) { this.events.push({id:id(),type,actor,at:new Date(this.now()).toISOString(),data}); }
  createUser({username,adult=true,inviteCode}) {
    if(!adult) throw Object.assign(new Error('Adult pilot only'),{status:403});
    if(!inviteCode) throw Object.assign(new Error('Invite required'),{status:400});
    if([...this.users.values()].some(u=>u.username.toLowerCase()===username.toLowerCase())) throw Object.assign(new Error('Username unavailable'),{status:409});
    const user={id:id(),username,adult:true,track:null,artist:null,discovery:false}; this.users.set(user.id,user); this.audit('user.created',user.id); return user;
  }
  selectTrack(userId,{canonicalId,title,artist}) { const u=this.mustUser(userId); u.track={canonicalId,title}; u.artist=artist; this.audit('music.selected',userId,{canonicalId}); return u.track; }
  startDiscovery(userId) {
    const u=this.mustUser(userId); if(!u.track) throw Object.assign(new Error('Select a track first'),{status:409});
    const session={id:id(),userId,startedAt:this.now(),expiresAt:this.now()+15*60_000,active:true}; this.sessions.set(session.id,session); u.discovery=true;
    const epoch=Math.floor(this.now()/(5*60_000)); const raw=crypto.randomBytes(18).toString('base64url');
    const token=crypto.createHmac('sha256',this.secret).update(`${raw}.${epoch}`).digest('base64url').slice(0,22); this.tokens.set(token,{sessionId:session.id,expiresAt:this.now()+10*60_000});
    this.audit('discovery.enabled',userId,{sessionId:session.id}); return {...session,epochToken:token};
  }
  stopDiscovery(userId,sessionId) { const s=this.sessions.get(sessionId); if(!s||s.userId!==userId) return; s.active=false; this.mustUser(userId).discovery=false; this.audit('discovery.disabled',userId,{sessionId}); }
  encounter(observerId,{sessionId,epochToken,nonce,rssiBucket='uncertain'}) {
    const own=this.validSession(sessionId,observerId); const seen=this.tokens.get(epochToken); if(!seen||seen.expiresAt<this.now()) throw Object.assign(new Error('Expired encounter token'),{status:410});
    const other=this.validSession(seen.sessionId); if(other.userId===observerId) throw Object.assign(new Error('Self encounter'),{status:400});
    if(this.isBlocked(observerId,other.userId)) throw Object.assign(new Error('Not eligible'),{status:404});
    const replayKey=hash(`${observerId}.${nonce}`); if(this.tokens.has(replayKey)) throw Object.assign(new Error('Replay'),{status:409}); this.tokens.set(replayKey,{expiresAt:this.now()+10*60_000});
    const a=this.mustUser(observerId), b=this.mustUser(other.userId); const exact=a.track?.canonicalId===b.track?.canonicalId; const sameArtist=!!a.artist&&a.artist===b.artist;
    if(!exact&&!sameArtist) return {eligible:false};
    const c={id:id(),userIds:[observerId,other.userId],score:clamp(exact?70+(sameArtist?15:0):15,0,100),category:exact?'exact':'strong',explanation:exact?'Same track right now':'You share this artist',rssiBucket,status:'candidate',expiresAt:this.now()+24*60*60_000}; this.candidates.set(c.id,c); this.audit('match.created',observerId,{candidateId:c.id,category:c.category}); return {eligible:true,candidate:c};
  }
  request(actor,candidateId) { const c=this.mustCandidate(actor,candidateId); if(c.status!=='candidate') throw Object.assign(new Error('Invalid transition'),{status:409}); c.status='requested'; c.requestedBy=actor; this.audit('connection.requested',actor,{candidateId}); return c; }
  accept(actor,candidateId) { const c=this.mustCandidate(actor,candidateId); if(c.status!=='requested'||c.requestedBy===actor) throw Object.assign(new Error('Invalid transition'),{status:409}); c.status='connected'; const connection={id:id(),userIds:c.userIds,state:'connected',createdAt:this.now()}; this.connections.set(connection.id,connection); this.audit('connection.accepted',actor,{connectionId:connection.id}); return connection; }
  sendMessage(actor,connectionId,text) { const c=this.connections.get(connectionId); if(!c||c.state!=='connected'||!c.userIds.includes(actor)||this.isBlocked(...c.userIds)) throw Object.assign(new Error('Forbidden'),{status:403}); if(!text?.trim()||text.length>1000) throw Object.assign(new Error('Invalid message'),{status:400}); const m={id:id(),connectionId,senderId:actor,text:text.trim(),createdAt:this.now()}; this.messages.push(m); this.audit('message.sent',actor,{connectionId,messageId:m.id}); return m; }
  block(actor,targetId) { this.mustUser(actor); this.mustUser(targetId); this.blocks.add(`${actor}:${targetId}`); for(const c of this.connections.values()) if(c.userIds.includes(actor)&&c.userIds.includes(targetId)) c.state='blocked'; for(const x of this.candidates.values()) if(x.userIds.includes(actor)&&x.userIds.includes(targetId)) x.status='blocked'; this.audit('user.blocked',actor,{targetId}); }
  report(actor,{targetId,reason,messageId}) { this.mustUser(actor); this.mustUser(targetId); const r={id:id(),actor,targetId,reason,messageId,status:'open',createdAt:this.now()}; this.reports.push(r); this.audit('report.created',actor,{reportId:r.id}); return r; }
  isBlocked(a,b){ return this.blocks.has(`${a}:${b}`)||this.blocks.has(`${b}:${a}`); }
  validSession(sid,uid){ const s=this.sessions.get(sid); if(!s||!s.active||s.expiresAt<this.now()||(uid&&s.userId!==uid)) throw Object.assign(new Error('Discovery inactive'),{status:410}); return s; }
  mustUser(uid){ const u=this.users.get(uid); if(!u) throw Object.assign(new Error('User not found'),{status:404}); return u; }
  mustCandidate(uid,cid){ const c=this.candidates.get(cid); if(!c||!c.userIds.includes(uid)||c.expiresAt<this.now()) throw Object.assign(new Error('Candidate unavailable'),{status:404}); return c; }
}
