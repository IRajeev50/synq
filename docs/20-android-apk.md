# Build an installable Android APK

The `preview` profile produces an APK, not a Play Store AAB, and includes the local `synq-nearby` native BLE module.

## Recommended: EAS cloud build
Gate: an Expo account and login are required. Android signing credentials are also required; EAS can generate/store a keystore after the account owner confirms. SYNQ does not create or hold that account in source control.

```bash
cd ~/Projects/synq
git pull
rm -rf node_modules apps/mobile/node_modules package-lock.json
npm install
cd apps/mobile
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
```

For the first build, confirm creation/linking of the EAS project and choose to generate a new Android keystore if the user does not already have one. When complete, EAS prints a build page and APK download URL. Open it on Android and tap Install. Android may require "Allow from this source" for the browser/files app. Save the keystore/account recovery details securely.

## Local Mac build without Expo account
Prerequisites: Android Studio with Android SDK/platform tools, JDK 17, and accepted SDK licences.

```bash
cd ~/Projects/synq
git pull
rm -rf node_modules apps/mobile/node_modules package-lock.json
npm install
cd apps/mobile
npx expo prebuild --clean
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
cd android
./gradlew assembleDebug
open app/build/outputs/apk/debug
```

Install `app-debug.apk` by USB:

```bash
adb devices
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

A debug APK is suitable for two-phone BLE testing, not public distribution. A release needs a protected signing keystore, versioning, security review, store declarations and device tests.
