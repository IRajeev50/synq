# Proximity architecture

A discovery session receives signed epoch tokens derived from a random server secret. Five-minute rotation, ten-minute acceptance and fifteen-minute session expiry limit tracking. BLE payload contains protocol version, truncated opaque rendezvous token and integrity bits only.

Observation submission contains observer session proof, token, random nonce, coarse RSSI bucket and client time. The API checks signature/TTL, one-time nonce, active opt-in, participant eligibility, device velocity, encounter quotas and blocks. It stores no raw long-term token or coordinates.

Radio adapters: iOS Core Bluetooth, Android BLE, QR/event-zone fallback, simulator fake. Background is degraded and may pause. QA matrix covers major OS versions, foreground/background/locked/killed states, radio disabled, permission states, mixed devices, crowds, trains and replay/relay attempts.
