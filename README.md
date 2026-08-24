# BeHappy

Free Android daily app: tap today’s mood, write three things, keep a streak. Ads fund it. The only purchase is one-time **Remove Ads**. Every feature stays free.

Journal data stays on-device (SQLite). No account.

## Open on your phone (no Android SDK)

`press a` in the Expo terminal needs `adb` and the Android SDK. You do **not** need that to try BeHappy.

1. Put the phone and this Mac on the **same Wi‑Fi**.
2. Install **Expo Go** ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) or [iPhone](https://apps.apple.com/app/expo-go/id982107779)).
3. In this folder run `npm start` and leave it running.
4. Open Expo Go and **scan the QR code** in the terminal (or the browser tab Expo opens).
   - Android: use Expo Go’s scanner.
   - iPhone: the Camera app, or Expo Go.

If the QR never loads, same network is usually the issue. From the project folder you can try:

```bash
npx expo start --tunnel
```

That is slower, but it works when the phone cannot see `192.168.x.x`.

See [TESTING.md](TESTING.md) before any Play upload.

## Run locally

```bash
npm install
npm test
npm start
```

## Play Store

1. Create a Play Console app for `com.behappy.app` ($25 developer fee).
2. Host [privacy.html](privacy.html) on HTTPS.
3. Create the `remove_ads` managed product (one-time, non-consumable).
4. Replace AdMob test app IDs in `app.json` with your real app ID.
5. `npx eas-cli build --profile production --platform android`
6. Upload the `.aab` and complete Data safety using [store/listing.md](store/listing.md).

## Stack

Expo SDK 57, Expo Router, SQLite, AdMob banners, Play Billing via `expo-iap`.
