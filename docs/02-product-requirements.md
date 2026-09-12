# Product requirements

## Product objective
Validate whether a shared, nearby musical moment creates enough curiosity for two adults to mutually connect and begin a meaningful conversation. The pilot is not a dating product and does not promise continuous discovery.

## Roles
- **Consumer:** adult invitee who controls discovery, profile, music data and connections.
- **Moderator:** least-privilege reviewer of queued reports and limited evidence.
- **Admin:** manages pilot cohorts, flags and operations; cannot browse private messages without an audited safety reason.
- **Event partner (post-MVP):** manages one scoped activation, never global user data.

## Pilot guardrails
Adult-only, invite-only, one controlled campus/event, explicit 15-minute discovery sessions, no public search, no exact distance/location, no minors, no anonymous chat, no media uploads, and chat only after mutual acceptance.

## Core flows and acceptance criteria

### Registration
Invite code -> age gate -> verified identity seam -> username -> profile -> terms/privacy consent -> optional track/provider connection -> progressive Nearby Devices permission.

- Reject under-18 and reused/expired invite codes.
- Username is unique, normalized and rate-limited.
- Permissions are requested only after an education screen and can be skipped.
- Every consent has policy version, purpose and timestamp.

### Discovery
Home shows ON/OFF, expiry and candidate count. Starting discovery creates a 15-minute presence. BLE permission denied routes to event QR/code fallback. Background/killed apps visibly degrade or expire.

- Stable identifiers, exact coordinates and raw RSSI never reach another user.
- Blocked users and users outside pilot/age/risk rules cannot become candidates.
- Presence expires server-side even if the client disappears.

### Music match
User chooses a track in SYNQ or authorizes a supported adapter. Metadata is normalized. The first algorithm ranks exact track, then artist/taste overlap; weights are feature-configured.

- UI explains a match with minimal shared facts, e.g. "Same track right now".
- Raw listening history is not shown.
- Unsupported provider produces manual search, never fake detection.

### Mutual connection state machine
`candidate -> requested -> connected`, with `candidate -> dismissed`, `requested -> rejected|expired`, and `connected -> unmatched|blocked`.

- Request recipient sees no precise origin.
- Duplicate/replayed transitions are idempotent.
- A block atomically removes visibility, requests and future messaging.

### Chat
Text, basic reaction and track share after connection. Delete-for-self in MVP; retention and legal-hold rules are explicit.

- 1,000-character limit; links treated as untrusted.
- Per-user and per-connection rate limits.
- Report from a message preserves only authorized evidence.

### Safety/account
Pause/hide, unmatch, block, report, status, appeal/contact seam, data export and deletion.

- Block is immediate and silent to the blocked account.
- Report reasons: harassment, spam/scam, sexual content, impersonation, physical-safety concern, other.
- Delete revokes sessions immediately and schedules full erasure per retention policy.

## Information architecture

| Screen | Purpose | Main API/events | Empty/error/offline |
|---|---|---|---|
| Splash/session restore | Safe routing | session refresh | login; retry; cached shell |
| Onboarding/age/invite | Eligibility and value | invite validate, register | explain ineligible/expired |
| Permission education | Contextual consent | consent record | skip and fallback |
| Home | Discovery status, nearby count, actions | presence, candidates; `app_opened` | honest zero state; stale badge |
| Discovery Mode | Start/pause timer | presence start/stop; `discovery_enabled` | permission and radio recovery |
| Nearby Matches | Small authorized candidate batch | candidates; `candidate_seen` | no fake density |
| Match Detail | Minimal explanation and request | match, request; `match_viewed` | expired candidate |
| Connection request | Accept/reject | transition; `connection_accepted` | already expired/blocked |
| Chat | Connected conversation | messages/WebSocket; `message_sent` | queued local draft, reconnect |
| Music profile/picker | Track and optional taste | tracks/provider; `music_account_connected` | manual search fallback |
| Notifications | Transactional updates | notification list/read | OS push denied is non-blocking |
| Safety Center | Block/report/help | safety endpoints | emergency copy, support contact |
| Settings/privacy | Visibility, consent, provider | profile/privacy | preserve last confirmed state |
| Export/delete | Rights workflow | export/delete | confirmation, job status |
| Admin/moderation | Pilot and reports | admin scoped APIs | least-privilege denial |

Post-MVP screens - sync session, communities, event management, search, blocked users detail - remain route stubs behind disabled flags.

## Non-functional requirements
- API p95 <300 ms excluding providers; candidate refresh <2 s while online.
- 99.5% pilot API availability; presence fails closed.
- WCAG 2.2 AA target; English/Hindi string catalog, IST-neutral timestamps.
- RPO 15 minutes and RTO 4 hours for pilot; quarterly restore exercise.
- Structured logs have no message bodies, track history or raw proximity tokens.

## Analytics
North star: **Meaningful SYNQ Connections / WAU**. Meaningful means a mutual connection formed from an eligible proximity candidate and at least two non-system messages from each participant within 24 hours, excluding blocked/reported/automation-flagged cases.

Funnel: `onboarding_completed -> music_selected -> discovery_enabled -> candidate_seen -> match_viewed -> connection_requested -> connection_accepted -> chat_started -> meaningful_connection`.

Guardrails: discovery opt-in, 1/7/30-day retention, repeat discovery, request rejection, block/report rate, safety response time, permission denial, candidate false-positive feedback.

## Pilot decision
Run 4 weeks with 150-500 consenting adults and scheduled dense windows. Continue only if the feasibility thresholds are met without rising safety incidents; otherwise test the explanation/density/onboarding assumptions before expanding features.
