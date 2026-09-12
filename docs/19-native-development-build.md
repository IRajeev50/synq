# Native development build and two-phone BLE validation

Expo Go cannot contain SYNQ's custom Bluetooth module. Use a development build.

## Local iOS build on a Mac

Prerequisites: current Xcode, Xcode Command Line Tools, CocoaPods, an attached iPhone with Developer Mode enabled, and an Apple signing team selected by Xcode.

```bash
cd ~/Projects/synq
git pull
rm -rf node_modules apps/mobile/node_modules package-lock.json
npm install
cd apps/mobile
npx expo prebuild --clean
npx expo run:ios --device
```

If automatic signing cannot choose a team, open `ios/SYNQ.xcworkspace`, select the SYNQ target, choose the user's Team under Signing & Capabilities, then Build/Run. This is an account-bound setting and is not committed.

## Local Android build

Prerequisites: Android Studio/SDK, JDK 17, USB debugging and an attached Android phone.

```bash
cd ~/Projects/synq/apps/mobile
npx expo prebuild --clean
npx expo run:android --device
```

Android 12+ prompts for Nearby Devices. Android 11 and below can require location permission for BLE scan. Grant only while testing SYNQ Discovery.

## Two-phone acceptance test

1. Install the SYNQ development build on both phones.
2. Start Discovery explicitly on both for a 15-minute window.
3. Confirm Bluetooth permission education precedes the system prompt.
4. Confirm each phone observes the other's rotating token once and shows only a coarse proximity bucket.
5. Rotate tokens at five minutes; old tokens must expire by ten minutes.
6. Stop Discovery on one phone; it must stop scan and advertising and disappear after TTL.
7. Repeat with Bluetooth off, denied permission, background, locked screen and app termination.
8. Attempt replay of an old token and high-volume encounter submissions; both must fail closed.
9. Run mixed iOS/Android and same-platform pairs. Record OS/device/RSSI/environment and failures.

The current native module supplies radio transport. Product wiring must connect the `onEncounter` event to the discovery session/API when online, or the local encrypted demo card when offline. Production eligibility, block/risk enforcement and anti-replay across phones remain server-validated when connectivity returns.
