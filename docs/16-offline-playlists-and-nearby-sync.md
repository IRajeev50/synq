# Feasibility addendum: SYNQ playlists, downloads and nearby sync

**Reviewed:** 12 September 2026  
**Plain verdict:** The product idea is feasible if it is split into three different things. SYNQ can build playlists and nearby sharing of playlist/track references now. SYNQ can build Bitchat-style peer-to-peer transport for its own encrypted messages and small session events now. SYNQ cannot legally copy Spotify, Apple Music or YouTube Music audio into SYNQ, download it, or pass those files to nearby phones through their normal public APIs. A true downloadable SYNQ music service is a separate licensed music business requiring direct label/distributor/publisher deals, rights reporting, DRM/offline controls and substantial operations.

## What exactly can ship

| Idea | Technical | Rights / policy | Decision |
|---|---|---|---|
| SYNQ playlist of track metadata and links | Straightforward | Follow artwork/metadata/provider terms | Build in MVP/post-MVP |
| Nearby exchange of a SYNQ playlist reference | Small encrypted payload over BLE/Nearby/Multipeer | Safe if it contains IDs/metadata, not copied audio | Build after BLE validation |
| Shared countdown, queue position, reactions | Straightforward state sync | Do not represent this as synchronized provider audio | Build as SYNQ Session |
| Each user plays the same track from their own licensed provider | Technically provider-specific and imperfect | Each user must be authorized/subscribed; provider rules apply | Partnership or carefully scoped deep-link/remote-control adapters |
| Download open-licensed, public-domain or SYNQ-commissioned audio | Straightforward with HTTPS download, encrypted cache and rights manifest | Feasible only when SYNQ holds every needed right | Best path to a small SYNQ music catalogue |
| Download major-label music inside SYNQ | Mature technology, large operational scope | Requires negotiated sound-recording rights plus composition/mechanical/performance rights, territories, reports and DRM | Separate later business, not ordinary API access |
| Phone-to-phone transfer of commercial song files | Nearby stacks can move bytes/files | A technical transport does not grant reproduction/distribution rights; provider APIs prohibit extraction/download/transfer | Do not build |
| Transfer a user's local MP3 to another stranger | Technically possible | Ownership of one copy does not normally grant redistribution; provenance cannot be trusted | Exclude, except clearly licensed creator-owned uploads with rights attestation and controls |

## The clean product architecture

### Layer A: SYNQ social playlist
A playlist is a SYNQ object containing canonical track references, ordering, notes, contributors and provider mappings. Nearby users exchange only a short encrypted object ID or compact signed manifest. The receiver opens available tracks in their own provider. This preserves the emotional "we are listening together" experience without moving copyrighted audio.

### Layer B: SYNQ Session
Peers exchange session ID, queue item, target start time, play/pause intent, reactions and drift observations. The app shows a countdown and shared state. Where a provider lawfully permits remote control, each phone separately controls that user's own authorized playback. Unsupported providers use deep links and a countdown. Never promise sample-perfect sync.

### Layer C: SYNQ-owned catalogue
If SYNQ later wants true offline downloads, start with artists/labels who opt in directly, commissioned tracks, public-domain recordings, or clear open licences that allow commercial reproduction and distribution. Maintain a machine-readable rights ledger by recording, composition, territory, usage, start/end date, offline allowance, P2P allowance and royalty/reporting terms. Encrypted offline caches should be device/account-bound, time-limited and revocable. Do not enable re-export.

## Why a Bitchat analogy only partly fits

The current official Bitchat repository describes dual transport: a local Bluetooth mesh for offline messages and Nostr for internet reach, with no central accounts required. Its core payloads are small encrypted messages, not licensed music catalogues. That architecture is relevant to **discovery and session-control messages**:

- encrypted short payloads;
- local peer discovery and relaying;
- store-and-forward for messages;
- resilience without network access.

It is a poor model for full songs. BLE is low-throughput relative to audio files, background delivery is unreliable, mesh relays amplify bandwidth/battery/abuse risk, and every relay makes another copy. Android Nearby Connections and Apple's Multipeer Connectivity can transfer bytes/files using Bluetooth and higher-bandwidth local transports, but that only proves technical transfer, not permission to distribute the work.

SYNQ should also not inherit Bitchat's anonymous/no-account trust model. SYNQ connects strangers in physical space, so verified pilot membership, mutual consent, blocks, reporting, rate limits and server-side safety controls remain necessary.

## Rights reality

### India
A commercial recording contains separate rights, commonly including the sound recording and underlying musical/literary works. The Indian Copyright Act gives owners reproduction and communication/distribution-related rights. Section 31D and the related Rules concern statutory licensing by a **broadcasting organisation** under specified notice/royalty procedures. They should not be assumed to grant an on-demand, downloadable, interactive P2P catalogue. The scope has legal uncertainty and must be reviewed by qualified Indian music counsel. The safe planning assumption is negotiated rights for interactive downloads and nearby redistribution.

### United States
The Copyright Office explains that the Music Modernization Act/section 115 blanket system covers digital phonorecord deliveries of musical works, including permanent downloads, limited downloads and interactive streams. That addresses the **composition/mechanical** side under its conditions. It does not itself supply the licence for a label's/master sound recording for an interactive service. A SYNQ catalogue therefore needs both the required musical-work rights/reporting and sound-recording agreements, plus any performance rights applicable to the use.

### Device-to-device copies
Sending an audio file from A to B creates/distributes another copy even if the transport is private, encrypted or offline. Calling it "sync," "mesh," "AirDrop-like," or "non-commercial" does not create rights. SYNQ should move metadata and control state unless the rights ledger explicitly permits the audio transfer mode.

This section is product/engineering risk analysis, not legal advice.

## Provider partnership reality

### Spotify
The public platform is built for metadata, authorization and control of Spotify playback, subject to policy and quota/access review. Spotify policy says Spotify content may not be downloaded, transferred to another service, broadcast, or synchronized as prohibited by its rules. The Web API endpoint named "transfer playback" moves playback to one Spotify Connect device; it does not transfer an audio file and supports one target device. A real SYNQ group-listening deal would need a written commercial/product partnership defining multi-user playback, territories, subscriptions, reporting, branding, data and safety. It cannot be implemented by applying for one more OAuth scope.

### Apple Music
MusicKit can authorize a user, access permitted catalogue/library data and control app/system playback within Apple's framework. On-device "downloaded" status belongs to the user's Apple Music environment; it is not an exportable file grant. SYNQ can request a product partnership for approved shared-session behavior, but should plan for each participant to have their own entitlement and for audio to remain in Apple-controlled playback/cache.

### YouTube Music
YouTube API policies prohibit enabling downloads outside authorized YouTube experiences, separating audio, or modifying the audiovisual stream. No ordinary public YouTube Music now-playing/group-session API has been identified. This is partnership-only; scraping, accessibility capture, stream extraction or unofficial endpoints are rejected designs.

## Recommended phased plan

1. **Now - Playlist references:** canonical SYNQ playlists, provider mappings, share by QR/BLE object ID, shared countdown and reactions. No audio bytes.
2. **Pilot - Same-provider session:** deep-link or authorized remote-control adapters. Each user presses consent and plays through their own account. Measure whether shared listening adds retention beyond the match itself.
3. **Independent catalogue experiment:** 20-100 directly licensed indie/creator tracks with explicit offline and synchronized-session terms. Use normal CDN download and encrypted device-bound cache, not mesh distribution.
4. **Partnership package:** take evidence to Spotify/Apple/YouTube/Indian services: pilot cohort, session starts, completion, retention, safety rate, architecture, rights boundary, requested capability and commercial model.
5. **Only after contracts:** provider-specific group playback or broader catalogue. Keep `PlaybackController` and `RightsPolicy` capability-driven so one deal does not redefine all providers.

## Required controls for SYNQ-owned downloads

- signed rights manifest checked before stream, offline cache or session;
- encrypted per-device cache, secure key storage and expiry;
- no filesystem export or P2P audio relay by default;
- territory/account/subscription checks;
- takedown and immediate licence revocation;
- play/download/session accounting and royalty reports;
- catalogue ingestion validation for master and composition ownership;
- fingerprint/deduplication and leak investigation proportionate to contracts;
- accessibility and offline UX that honestly shows licence expiry.

## Official sources

- Indian Copyright Act definitions/rights: https://copyright.gov.in/Copyright_Act_1957/chapter_i.html
- Indian Copyright Act licensing provisions: https://copyright.gov.in/Copyright_Act_1957/chapter_vi.html
- Indian Copyright Rules, statutory broadcasting procedure: https://copyright.gov.in/Copyright_Rules_2013/chapter_viii.html
- U.S. Copyright Office, Music Modernization Act: https://www.copyright.gov/music-modernization
- U.S. Copyright Office, section 115 modernization: https://www.copyright.gov/music-modernization/115
- Spotify Developer Policy: https://developer.spotify.com/policy
- Spotify playback transfer endpoint: https://developer.spotify.com/documentation/web-api/reference/transfer-a-users-playback
- Apple MusicKit: https://developer.apple.com/documentation/musickit
- Apple Multipeer Connectivity: https://developer.apple.com/documentation/multipeerconnectivity
- Google Nearby Connections overview: https://developers.google.com/nearby/connections/overview
- YouTube API developer policies: https://developers.google.com/youtube/terms/developer-policies
- Bitchat official repository: https://github.com/permissionlesstech/bitchat/
