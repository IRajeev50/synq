# Testing strategy

Unit: state machines, scorer, privacy projection, token TTL/rotation, permission copy/state, authorization and validation. Integration: Postgres migrations, Redis expiry, provider contracts, outbox, WebSocket recovery and notification idempotency. Mobile: onboarding, progressive permissions, discovery timer, candidate/request/chat, denied/offline/background states on physical devices. Admin: role and audit tests.

Security: OWASP API cases, IDOR, enumeration, refresh replay, rate limits, token replay/relay, log leakage and admin access. Load: k6 profiles for 10K baseline and high-density event bursts; gate on p95, errors, queue lag and DB saturation. Release needs automated CI plus a signed physical-device proximity checklist.
