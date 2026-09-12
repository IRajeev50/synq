# SYNQ technical feasibility review

**Reviewed:** 12 September 2026  
**Decision:** Proceed with a deliberately foreground-first pilot. The product hypothesis is testable today, but reliable invisible cross-platform discovery and universal "now playing" detection are not.

## Executive decision

SYNQ can ship a credible MVP if Discovery Mode is an explicit, time-boxed user session and the app treats proximity as probabilistic. The MVP should combine rotating BLE advertisements with a server-assisted rendezvous fallback, then match only users who are both opted in and currently sharing a track through an in-app picker or a supported, authorized provider session. It must not claim to detect whatever any app on the phone is playing.

The first pilot should be a dense, controlled campus or music event. Exact location is neither required nor desirable. True synchronized third-party playback is removed from the MVP; a shared countdown, session clock, metadata and reactions are safe fallbacks.

## Capability matrix

| Capability | iOS | Android | MVP decision | Production / partnership |
|---|---|---|---|---|
| Foreground BLE discovery | Supported through Core Bluetooth | Supported through BLE APIs with runtime Nearby Devices permissions | Use rotating service payloads | Native radio modules, device lab testing |
| Background BLE discovery | Possible in declared modes, but scans/advertising behave differently, are coalesced, and the OS may suspend/terminate work | Possible with documented background patterns; execution and battery controls still apply | Best effort only, never a reliability promise | Foreground service only where justified; venue beacon/QR fallback |
| Cross-platform nearby handshake | No single universal guarantee; BLE payload and lifecycle differ | Same | Small common BLE protocol plus server confirmation | Native Swift/Kotlin modules and protocol conformance suite |
| Nearby Connections | Swift and Android SDKs exist; needs Bluetooth/local-network permissions | Google Play services, Bluetooth/Wi-Fi permissions | Optional experimental adapter, not sole architecture | Reassess SDK availability, policy, telemetry and vendor lock-in |
| Precise distance | RSSI is noisy and environment-dependent | Same | Use buckets: likely-near / uncertain / expired | Calibrate by device class; never show metres |
| Peer-to-peer transport | BLE/GATT and Nearby can exchange small handshakes | BLE/GATT and Nearby | Exchange only opaque short-lived tokens | WebRTC is unnecessary for matching; WebSocket for server events |
| Background location | Sensitive and tightly reviewed; unnecessary for core BLE session | Play policy requires core-purpose justification, consent and minimum scope | Do not request | Only reconsider for a separately justified venue mode |
| Current Spotify playback | Spotify App Remote can expose player state after auth while connected to Spotify app | Similar App Remote model | Provider adapter behind feature flag; require user action and auth | Commercial approval/extended quota may be required; terms review before launch |
| Current Apple Music playback | MusicKit supports authorized catalog/library and app/system player state, but privacy boundaries prevent universal observation | Apple Music API availability differs | In-app MusicKit selection/playback adapter on iOS | Apple entitlement/configuration and store review |
| YouTube Music now playing | No official public YouTube Music now-playing API was found; YouTube Data API covers YouTube resources, not arbitrary YT Music playback | Same | Manual track search/share only | Partnership-required; do not scrape or use accessibility abuse |
| Ambient song recognition | Technically possible through recognition vendors or fingerprints, but microphone, consent, battery and licensing risks are material | Same | Exclude. Optional tap-to-identify experiment only after counsel | Vendor contract, privacy review and rights analysis |
| Playback synchronization | Spotify policy says do not synchronize Spotify content; provider control is not universal | Same | Synchronize session state, countdown and reactions, not audio | Provider-specific capability only with written permission |
| Push notifications | APNs | FCM | Use for connection/message events, not continuous presence | Managed provider in early stages |

## Platform constraints

### iOS

Core Bluetooth supports `bluetooth-central` and `bluetooth-peripheral` background modes, but background behavior is not foreground behavior. Scanning is slower/coalesced, advertising changes, wake time is limited, and terminated apps cannot be treated as continuously active. SYNQ therefore cannot promise "always find everyone nearby" on iOS. Discovery sessions need a visible state, expiry and honest degraded-state UI.

Music access is permissioned and provider-scoped. MusicKit can power playback initiated or selected through SYNQ, but must not be described as a system-wide listener. Apple also requires social/UGC apps to provide filtering, reporting, blocking and reachable contact information. Random or anonymous chat patterns are a store-review risk; SYNQ must require mutual consent and identified accounts.

### Android

Android 12+ separates `BLUETOOTH_SCAN`, `BLUETOOTH_ADVERTISE` and `BLUETOOTH_CONNECT`. Some older versions tie scanning to location permission. Background BLE can use documented scan patterns, including pending intents, but background-work limits, OEM power managers and battery impact remain. Companion Device Manager is meant for paired companion devices and does not provide unrestricted continuous social scanning.

Google Play treats location and device data as sensitive. Prominent disclosure, purpose limitation, runtime consent, deletion and Data Safety declarations are required. UGC requires terms acceptance, moderation, report and block controls.

## Secure proximity protocol

1. User explicitly starts a 15-minute Discovery session.
2. Device requests only the permission needed at that moment.
3. API issues a random 128-bit presence secret and signed, opaque epoch tokens. Tokens rotate every 5 minutes and expire after 10 minutes.
4. BLE advertises only a truncated rendezvous token and protocol version. It contains no user ID, track ID, gender, coordinates or stable device value.
5. A scanner submits the observed token, its own active-session proof, a coarse RSSI bucket and nonce over TLS.
6. Server resolves both active presences, enforces block/age/risk rules, deduplicates and creates a short-lived candidate.
7. Profile and music explanation appear only after server authorization. Exact location and raw RSSI never appear.
8. Replayed tokens, impossible encounter rates and token harvesting trigger rate limits and risk review.

**Limits:** RSSI does not prove co-location, relays are possible, and phones may miss advertisements. The protocol answers "probably nearby during overlapping opt-in windows", not "at this exact position".

## External partnerships

- **Music providers:** production Spotify distribution, higher quotas and synchronized playback need terms validation or written approval. YouTube Music support is partnership-only.
- **Venues/campuses/events:** useful for dense pilots, trusted event boundaries, QR activation and safety operations. Not needed for the first internal test.
- **Metro/airline operators:** needed before branding modes around controlled transport environments, distributing onboard codes, or integrating manifests/connectivity. SYNQ must not infer flight/seat identity.
- **Rights holders/licensing counsel:** required before storing previews, rebroadcasting audio, generating shared streams or commercial music experiences. Metadata-only matching is the MVP boundary.

## MVP that tests the hypothesis

### Must ship

- Adult-only invite-code pilot, verified email/phone seam, basic profile and consent ledger.
- Explicit 15-minute Discovery Mode with visible timer, pause and permission education.
- Track sharing through SYNQ search/manual selection; optional provider adapters behind flags.
- BLE rotating-token discovery while foregrounded, plus QR/event-zone server rendezvous fallback.
- Exact-track and artist-overlap explanation.
- Candidate -> request -> accepted -> connected state machine.
- Basic text chat after mutual acceptance only.
- Block, report, unmatch, discovery pause, rate limits and moderation queue.
- Funnel and safety analytics with pseudonymous identifiers.

### Excluded

System-wide passive playback detection, continuous invisible discovery, exact distance/location, minors, dating filters, public profiles, media uploads, voice/video, universal synchronization, communities and AI moderation as sole decision-maker.

### Success criterion

In a 150-500 person dense pilot, at least 25% of eligible candidates are opened, 10% result in a mutual connection, 40% of connections exchange at least two messages from each participant within 24 hours, and abuse reports stay below 1% of exposed candidates. These are experiment thresholds, not market facts.

## Build vs buy

| Subsystem | Decision | Rationale / lock-in / cost |
|---|---|---|
| Mobile UI and domain logic | Build in React Native with native Swift/Kotlin proximity modules | One product team, typed shared logic. Native radio seam avoids framework capability claims. Moderate maintenance. |
| BLE protocol | Build small protocol on OS APIs | Privacy/security core and vendor independence. High device-test burden. |
| Server API | Build modular TypeScript service | Fast MVP iteration, shared schemas. Start as modular monolith. |
| PostgreSQL | Managed cloud service | Backups, encryption and operations. Moderate cloud lock-in; standard SQL eases migration. |
| Ephemeral presence/rate limits | Managed Redis-compatible cache | TTL and atomic counters. Replaceable adapter. |
| Authentication | Managed OIDC provider in production; local dev adapter | Do not build password recovery/MFA from scratch. Per-MAU cost and provider lock-in. |
| Push | APNs/FCM directly or managed abstraction | Platform requirement; low early cost. |
| Chat transport | Build API/WebSocket semantics; managed gateway initially | Product safety rules stay internal; infrastructure can scale later. |
| Moderation | Build queue and rules; buy optional classifiers | Human decisions remain authoritative. Classifier cost and bias monitored. |
| Analytics | OpenTelemetry plus warehouse/product analytics adapter | Avoid hard-coupling event taxonomy. Free/low-cost at pilot scale. |
| Track metadata | MusicBrainz/open catalog for demo; provider APIs when authorized | Demo data cannot be represented as universal commercial catalog. Cache within terms. |
| Song recognition | Do not build in MVP | High privacy, battery, accuracy and rights burden. Future vendor evaluation. |
| Infrastructure | Terraform on AWS managed services | Common managed stack; estimated MVP baseline cost documented separately. |

## Failure modes and fallback UX

- Bluetooth denied/unavailable: allow QR/event-code rendezvous and manual track sharing.
- App backgrounded or killed: expire visibility quickly and show "Discovery paused" on return.
- Provider disconnected/expired: keep prior taste summary only within consent/retention rules; ask user to reauthorize or select a track manually.
- Sparse density: show no fake candidates. Pilot invitation and scheduled discovery windows solve cold start.
- High density: cap candidate fan-out, rank server-side, reveal a small batch, and apply encounter/request quotas.
- Offline: maintain local session state, never create a connection until server confirms both consents.

## Current source ledger

Official sources reviewed on 12 September 2026:

1. Apple, Core Bluetooth background processing: https://developer.apple.com/library/archive/documentation/NetworkingInternetWeb/Conceptual/CoreBluetooth_concepts/CoreBluetoothBackgroundProcessingForIOSApps/PerformingTasksWhileYourAppIsInTheBackground.html
2. Apple, App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
3. Apple, MusicKit: https://developer.apple.com/documentation/musickit
4. Android Developers, Bluetooth permissions: https://developer.android.com/develop/connectivity/bluetooth/bt-permissions
5. Android Developers, BLE in the background: https://developer.android.com/develop/connectivity/bluetooth/ble/background
6. Google, Nearby Connections overview: https://developers.google.com/nearby/connections/overview
7. Spotify iOS SDK getting started and policy notes: https://developer.spotify.com/documentation/ios/getting-started
8. Spotify Developer Policy: https://developer.spotify.com/policy
9. YouTube Data API reference: https://developers.google.com/youtube/v3/docs
10. Google Play UGC policy: https://support.google.com/googleplay/android-developer/answer/9876937?hl=en
11. Google Play User Data policy: https://support.google.com/googleplay/android-developer/answer/10144311?hl=en
12. Indian Copyright Office, Copyright Act and Rules: https://copyright.gov.in/Copyright_Act_1957/chapter_i.html and https://copyright.gov.in/Copyright_Rules_2013/chapter_viii.html

This is an engineering and product assessment, not legal advice. Indian DPDP Act compliance, intermediary obligations, child-safety design, music licences and each provider's launch terms require qualified counsel before a public release.
