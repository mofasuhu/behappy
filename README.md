# BeHappy

BeHappy is a private, local-first daily wellbeing journal for Android and iOS. Record how you feel, keep three small tasks, and write what went well—then build a streak from consistent check-ins.

## Features

- Five-point mood check-in from Low to Great.
- Three daily tasks with editable text and completion state.
- A “What went well?” note for each day.
- History view backed by on-device SQLite, with streak calculation from completed check-ins.
- Morning-plan and optional evening reminders, including a one-minute test reminder.
- System, light, and dark themes.
- Free core experience supported by ads, with consent handling and a one-time **Remove Ads** purchase (`remove_ads`) plus restore purchases.
- In-app privacy policy screen and no account requirement.

## Stack

Expo SDK 57, React Native 0.86, TypeScript, Expo Router, and `expo-sqlite`. Notifications use `expo-notifications`; ads use `react-native-google-mobile-ads`; billing uses `expo-iap`. The app is organized around file-based routes in `app/`, reusable UI in `components/` and `src/components/`, and persistence in `src/db/`.

Journal entries and settings are stored locally on the device. Ads, consent, notifications, and purchases are platform services, so review the privacy policy and store disclosures before publishing.

## Run locally

Requirements: Node.js, npm, and either Expo Go or an Android/iOS development build.

```bash
npm install
npm start
```

Scan the terminal QR code with Expo Go while the computer and phone are on the same Wi-Fi. If the device cannot reach the local network, use:

```bash
npx expo start --tunnel
```

Useful scripts:

```bash
npm test
npm run typecheck
npm run android
npm run ios
npm run web
```

The native ad, in-app purchase, and notification integrations are loaded defensively for Expo Go, but store billing and production ads require the appropriate native build and platform configuration.

## Production checklist

1. Create the Android package/iOS bundle for `com.behappy.app` in the relevant stores.
2. Replace the sample Google Mobile Ads IDs in `app.json` with production configuration and provide `EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID` for the production banner.
3. Configure the one-time `remove_ads` product in each store.
4. Host `privacy.html` on HTTPS and complete the store data-safety disclosures.
5. Run the scenarios in [`TESTING.md`](TESTING.md) before uploading.

Build with EAS after configuring credentials and store metadata:

```bash
npx eas-cli build --profile production --platform android
```

Never commit signing files, store credentials, private keys, or production secrets. Keep them in the build service or local environment; the repository ignores common native credential and environment-file patterns.
