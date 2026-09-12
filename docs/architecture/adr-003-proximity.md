# ADR-003: rotating BLE rendezvous plus server validation

Status: Accepted for experiment; device validation required.

Use BLE only to observe rotating opaque tokens. The server verifies active opt-in, blocks, risk, age/pilot eligibility and creates candidates. No stable ID, exact coordinates, track data or profile data is advertised. Tokens rotate every five minutes and expire after ten. Discovery sessions expire at fifteen.

RSSI is only a coarse, device-calibrated signal. QR/event codes are the non-BLE fallback. Nearby Connections can be evaluated as another `NearbyTransport`, never as the sole cross-platform contract.
