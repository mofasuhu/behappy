# Local testing

Nothing goes to Play Console until this checklist passes.

## Automated

```bash
npm test
```

Covers date keys, streak math, ads gate, reminder payloads, SQLite row mapping, save/load, and the AdSlot gate.

## What already ran in this repo

- `npm test` — 8 suites, 25 tests passing
- `npx tsc --noEmit`
- `npx expo export --platform android` — Android JS bundle succeeded

This machine did not have Android Studio / an emulator. After you install an AVD (or plug in a phone):

```bash
npm start
```

Press `a` to open Expo Go, or use a [development build](https://docs.expo.dev/develop/development-builds/introduction/) for real test ads and Play Billing.

1. Start Metro: `npm start`
2. Android emulator or USB phone: press `a` (Expo Go is enough for mood/tasks/history/reminders).
3. Ads SDK and Play Billing need a dev client:

```bash
npx eas-cli login
npx eas-cli build --profile development --platform android
```

Then `npx expo start --dev-client`.

Dev safety:

- Banner ads always use Google **test** unit IDs while `__DEV__` is true.
- Settings → **Simulate Remove Ads** turns ads off without charging a SKU.
- Settings → **Send test reminder in 1 minute** verifies notifications.

## Manual emulator checklist

- [ ] Fresh install: Today works with no account
- [ ] Tap each mood; edit and check off all 3 tasks
- [ ] Kill and reopen: data still there
- [ ] History: past days show the right mood and tasks
- [ ] Reminders: test notification fires (~1 minute)
- [ ] Ads: test banner (or placeholder) on Today and History only — not on the mood/task check-in
- [ ] Simulate Remove Ads: banners disappear; survive relaunch
- [ ] Restore Purchases does not crash in Expo Go
- [ ] Privacy policy link opens
- [ ] (Dev client) UMP consent form can be shown from Settings
