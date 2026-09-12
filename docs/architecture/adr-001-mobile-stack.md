# ADR-001: React Native shell with native proximity modules

Status: Accepted for MVP.

React Native wins for one small product team, shared typed domain logic and rapid Android/iOS iteration. Flutter has a strong UI stack but offers no OS exemption for BLE/background limits. Fully native Swift and Kotlin offer maximum radio control but duplicate most product/UI work before the hypothesis is validated.

Use React Native/Expo development builds for UI and domain features. Implement proximity behind `NearbyTransport`, with Swift Core Bluetooth and Kotlin BLE adapters. Expo Go is explicitly unsupported for proximity. Keep a QR/event-code adapter for simulators, denied permissions and pilot fallback.

Consequences: native build expertise and device lab coverage are required. Cross-platform code must not conceal platform-specific degraded states.
