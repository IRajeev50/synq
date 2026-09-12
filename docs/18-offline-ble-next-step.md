# Offline mode and real BLE next step

## Works without internet in the current demo
Once the current JavaScript bundle has loaded onto the phone, onboarding, Discovery UI, simulated nearby candidates, mutual-connect demo, chat, playlists, shared-session state and two attributed 30-second music excerpts run locally. No API call is required for these demo flows. Expo/Metro needs the Mac and phone on a reachable local network to deliver a newly changed development bundle; that development transport is separate from SYNQ's product design.

## Why Expo Go cannot be the real Bluetooth build
Expo Go contains a fixed set of native modules. A JavaScript package cannot add Core Bluetooth or Android BLE native code to that installed client. SYNQ therefore needs an Expo development build (or prebuilt native Xcode/Gradle projects) containing a maintained BLE module and SYNQ's native transport adapter.

## Minimum two-phone offline BLE demo
1. Create native development builds for iOS and Android with Bluetooth permission descriptions and platform BLE libraries.
2. Implement `NearbyTransport`: start/stop explicit 15-minute discovery, advertise rotating opaque token, filtered scan, receive token, and emit encounter event.
3. Keep the payload small: protocol version, rotating random token, expiry/epoch and integrity data. No profile, track, stable ID or coordinates.
4. Pair an observed token with a locally exchanged encrypted profile/music card for the offline demo. Production still needs server validation for block lists, eligibility, abuse/risk and replay across devices.
5. Test two physical phones across foreground, background, locked, killed, denied permission, Bluetooth off, iOS/Android mixed pair and replay cases. Never promise reliable invisible background discovery.
6. Add a local encrypted pending-event queue and reconcile with the API when connectivity returns.

## Account and device seams
Generating installable development builds needs Apple/Google signing identities or local Xcode/Android Studio builds and physical devices. iOS distribution beyond a tethered local build requires Apple Developer provisioning. None of those credentials belong in the repository.
