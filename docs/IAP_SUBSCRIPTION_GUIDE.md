# In-App Purchase & Subscription Setup Guide

This guide walks you through creating subscription products in **Apple App Store Connect** and **Google Play Console**, wiring them in the app, and how subscription completion works end-to-end.

---

## Table of contents

1. [Overview](#overview)
2. [Apple App Store Connect – Create subscription products](#apple-app-store-connect--create-subscription-products)
3. [Google Play Console – Create subscription products](#google-play-console--create-subscription-products)
4. [Configure the app (.env)](#configure-the-app-env)
5. [Subscription completion flow in the app](#subscription-completion-flow-in-the-app)
6. [Restore purchases](#restore-purchases)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Overview

- **Nevermore** uses **react-native-iap** for subscriptions.
- Payments go through **Apple In-App Purchase** (iOS) and **Google Play Billing** (Android). No Stripe or web checkout.
- The app supports two subscription products: a **Monthly** plan and a **Yearly** plan. Product IDs are configurable via `.env`.
- After a successful purchase, the app marks the user as subscribed in local state and unlocks Journey days 4+.

**App identifiers (from `app.json`):**

- iOS: `com.nevermore.app`
- Android: `com.nevermoreapp`

Use these when creating products in the stores.

---

## Apple App Store Connect – Create subscription products

### Prerequisites

- Apple Developer account (paid).
- App already created in App Store Connect with bundle ID `com.nevermore.app`.
- **Agreements, Tax, and Banking** completed (required for paid apps).

### 1. Create a subscription group (if needed)

1. In [App Store Connect](https://appstoreconnect.apple.com), open your app.
2. Go to **Monetization** → **Subscriptions** (or **Features** → **In-App Purchases**).
3. Under **Subscription Groups**, click **+** to create a group (e.g. `Nevermore Premium`).
4. Set **Reference Name** and **Group Name** (user-facing). Save.

### 2. Create subscription products

1. Open the subscription group you created.
2. Click **+** to add a subscription.

**First product (Monthly plan):**

- **Reference Name:** e.g. `Nevermore Monthly`
- **Product ID:** must be **unique** and **unchanging**. Example: `com.nevermore.app.monthly`  
  → You will put this exact string in `.env` as `IAP_PRODUCT_ID_MONTHLY`.
- **Subscription Duration:** 1 month.
- **Subscription Prices:** set the price to **$4.99 / month** (or your exact monthly price).
- **Localization:** add at least one language and display name/description.
- Save and submit for review if required.

**Second product (Yearly plan):**

- **Reference Name:** e.g. `Nevermore Yearly`
- **Product ID:** e.g. `com.nevermore.app.yearly`  
  → Use this in `.env` as `IAP_PRODUCT_ID_YEARLY`.
- **Subscription Duration:** 1 year.
- **Subscription Prices:** set the price to an annual amount, e.g. **$44.99 / year** (≈ $3.75 / month equivalent).
- Set localization (name/description) as desired.
- Save.

### 3. Optional: free trial / introductory offer

In each subscription’s **Subscription Prices** section you can add an **Introductory Offer** (e.g. 30-day free trial). The app will still use the same **Product ID**; the store handles the trial.

### 4. Copy Product IDs

Note the **exact** Product IDs (e.g. `com.nevermore.app.monthly`, `com.nevermore.app.yearly`). You will use them in [Configure the app (.env)](#configure-the-app-env).

---

## Google Play Console – Create subscription products

### Prerequisites

- Google Play Developer account (one-time fee).
- App created in Play Console with package name `com.nevermoreapp`.
- App in at least **Internal testing** or higher (or **Production** for real purchases).

### 1. Create a subscription

1. In [Google Play Console](https://play.google.com/console), open your app.
2. Go to **Monetize** → **Subscriptions** (or **Monetization setup** → **Subscriptions**).
3. Click **Create subscription**.

**Subscription details:**

- **Product ID:** e.g. `nevermore_monthly` or `com.nevermoreapp.monthly`.  
  → Must match what you put in `.env` (e.g. `IAP_PRODUCT_ID_MONTHLY`).  
  → Cannot be changed later.
- **Name** and **Description:** user-facing; add for each language you support.

### 2. Base plans and offers (monthly)

- Add at least one **Base plan** for the **monthly** subscription.
- Set **Billing period** to 1 month and **Price** to **$4.99** (or your exact monthly price).
- Optionally add a **Free trial** or **Introductory price** in **Offers**.
- Activate the base plan.

### 3. Second subscription (Yearly plan)

Repeat with a different **Product ID** (e.g. `nevermore_yearly` or `com.nevermoreapp.yearly`) and use it for `IAP_PRODUCT_ID_YEARLY` in `.env`.

- Add a **Base plan** for the **yearly** subscription.
- Set **Billing period** to 1 year and **Price** to your annual amount (e.g. **$44.99 / year**, roughly $3.75 / month equivalent).

### 4. Copy Product IDs

Use the **exact** subscription Product IDs from Play Console in your `.env` (see next section).

---

## Configure the app (.env)

1. In the project root, copy the example env if you haven’t:

   ```bash
   cp env.example .env
   ```

2. Set the subscription product IDs to **exactly** match the store:

   ```env
   # In-App Purchase – use the Product IDs from App Store Connect / Play Console
   IAP_PRODUCT_ID_MONTHLY=com.nevermore.app.monthly
   IAP_PRODUCT_ID_PLAN2=com.nevermore.app.yearly
   ```

   - **iOS:** use the Product ID from App Store Connect (e.g. `com.nevermore.app.monthly`).
   - **Android:** use the Product ID from Play Console (e.g. `com.nevermoreapp.monthly`).  
   You can use the same IDs on both platforms if you create matching IDs in both stores, or different IDs per platform and still use one `.env` (the app uses the same env on both; typically you use one set of IDs that you create in both stores).

3. Restart the dev server and rebuild the app so env changes are picked up:

   ```bash
   npx expo start --dev-client
   # Then run on device: npx expo run:ios or npx expo run:android
   ```

---

## Subscription completion flow in the app

End-to-end flow from “Subscribe” tap to unlocked content.

### 1. User taps Subscribe

- **Subscription screen** or **Subscription popup** calls `getIAPProductIds()` to get the product ID for the selected plan (monthly or yearly).
- It then calls `subscriptionStore.purchaseSubscription(productId)`.

### 2. IAP service starts purchase

- **`src/services/iap.service.ts`** calls `requestPurchase()` from **react-native-iap** with:
  - `request.apple.sku` / `request.google.skus` set to that product ID.
  - `type: 'subs'`.
- The native store (App Store / Play Store) shows the payment sheet.

### 3. User completes or cancels

- **If the user pays:** the store fires a **purchase updated** event.  
- **If the user cancels or fails:** the store fires a **purchase error** event.

### 4. Purchase updated listener (success)

- `purchaseUpdatedListener` in `iap.service.ts` receives the **Purchase** object.
- The service checks that `purchase.productId` is one of the configured subscription IDs (from `getSubscriptionSkus()`).
- It then:
  1. Calls **`updateSubscription(true)`** → which updates **`subscriptionStore.setSubscribed(true)`** (and persists via Zustand).
  2. Resolves the **purchase promise** so the UI can close the popup or navigate.
  3. Calls **`finishTransaction({ purchase, isConsumable: false })`** so the store marks the transaction as finished (required for subscriptions).

### 5. Purchase error listener (cancel / failure)

- `purchaseErrorListener` receives the error.
- The service rejects the purchase promise so the UI can show an error (e.g. “Purchase failed” or “Cancelled”).

### 6. UI after success

- **Subscription popup:** `onSubscribeSuccess` runs → popup closes; user stays on the same screen and content is unlocked (e.g. Journey days 4+).
- **Subscription screen:** navigates to `HOME_TABS` so the user enters the main app as a subscriber.

### 7. Unlocking content

- **Journey (40-day):** `FortyDay.tsx` uses `useSubscriptionStore().isSubscribed` and `isJourneyDayFree(dayNumber)`. Days 1–3 are always free; days 4+ are only available when `isSubscribed` is true.
- **Temptations:** currently all categories are free; no subscription check.

**Relevant files:**

- `src/services/iap.service.ts` – init, `requestPurchase`, listeners, `finishTransaction`, `getIAPProductIds` / `getSubscriptionSkus`.
- `src/store/subscriptionStore.ts` – `isSubscribed`, `setSubscribed`, `purchaseSubscription`, persistence.
- `src/App.tsx` – on startup: `iapService.init()`, `setSubscriptionUpdater(store.setSubscribed)`, `checkSubscription()` to restore state from existing purchases.

---

## Restore purchases

When a user reinstalls the app or switches devices, subscription status is restored as follows.

### 1. App startup

- In **`App.tsx`**, after `iapService.init()`, the app calls **`iapService.checkSubscription()`**.
- That calls **`getAvailablePurchases()`** (react-native-iap), which returns non-consumed purchases from the store (including active subscriptions).
- If any of those purchases has a `productId` in the configured subscription SKU list, the app sets **`subscriptionStore.setSubscribed(true)`**.

### 2. User taps “Restore Purchases”

- **Subscription screen** and **Subscription popup** call **`subscriptionStore.restorePurchases()`**.
- That again uses **`getAvailablePurchases()`** in `iap.service.ts` and, if an active subscription is found, calls **`updateSubscription(true)`** (same as after a new purchase).
- The UI then shows success and can close or navigate.

So “subscription completion” for **restore** is: **getAvailablePurchases** → check product IDs → **setSubscribed(true)**. No new payment and no `finishTransaction` for restore (only for new purchases).

---

## Testing

### iOS (Sandbox)

1. In **App Store Connect** → **Users and Access** → **Sandbox** → **Testers**, create a **Sandbox Apple ID** (do not use a real Apple ID).
2. On the device/simulator: **Settings** → **App Store** → sign out of the real Apple ID; when the app prompts for payment, sign in with the **Sandbox** account.
3. Build and run the app on a real device (IAP does not work in the simulator):  
   `npx expo run:ios`
4. Use “Subscribe” or “Restore”; the store will show **Sandbox** and no real charge.

### Android (Test tracks)

1. Add **License testers** in Play Console → **Setup** → **License testing** (optional; helps with test purchases).
2. Upload the app to **Internal testing** (or Closed/Open testing) and install from the Play Store link, or use a **debug build** with the same package name and signing as the track.
3. Run on a device: `npx expo run:android`
4. Purchases in internal/testing tracks are test orders and can be refunded.

### Checklist

- [ ] Product IDs in App Store Connect and Play Console match `.env` exactly (no extra spaces).
- [ ] Subscription products are **Ready** / **Active** in the store.
- [ ] iOS: **Paid Applications** agreement and banking/tax are complete.
- [ ] App restarted (or rebuilt) after changing `.env`.

---

## Troubleshooting

### “SKU not found” / “Product not found”

- **Cause:** The product ID the app sends does not exist in that store (or not yet active).
- **Fix:**
  1. Confirm the Product ID in App Store Connect (iOS) or Play Console (Android) – spelling and case must match exactly.
  2. Set the same ID in `.env` as `IAP_PRODUCT_ID_MONTHLY` or `IAP_PRODUCT_ID_PLAN2`.
  3. Restart the app; ensure you’re not reading an old env (no caching of env across restarts).
  4. iOS: wait a few minutes after creating the subscription; ensure the app’s bundle ID matches.
  5. Android: ensure the subscription is activated and the app is published to at least an internal testing track.

### Purchase succeeds but app doesn’t unlock

- **Cause:** Listener not updating the store, or `finishTransaction` not called.
- **Fix:**
  1. Ensure `iapService.init()` runs at app startup (in `App.tsx`) and that `setSubscriptionUpdater(store.setSubscribed)` is called after init.
  2. In `iap.service.ts`, ensure `handlePurchaseUpdate` calls both `updateSubscription(true)` and `finishTransaction({ purchase, isConsumable: false })`.
  3. Check that the purchase’s `productId` is included in `getSubscriptionSkus()` (same IDs as in `.env`).

### Restore doesn’t set subscriber

- **Cause:** `getAvailablePurchases()` returns nothing or the product ID doesn’t match.
- **Fix:**
  1. Confirm the user is signed in with the same Apple ID / Google account that bought the subscription.
  2. Ensure `getSubscriptionSkus()` includes the same product IDs used at purchase time (from `.env`).
  3. iOS: “Restore Purchases” in Settings → Apple ID → Subscriptions only affects the system; the app must call `getAvailablePurchases()` itself (which the app does in `checkSubscription` and `restorePurchases`).

### Products work on one platform but not the other

- Each store has its own products. You must create a subscription in **both** App Store Connect and Play Console (unless you only ship on one platform).
- Use the **correct** Product ID per platform in `.env` if you use different IDs per store; the app currently uses one set of env vars for both, so typically you create the same logical product (e.g. “monthly”) in both stores and use one shared Product ID that you replicate in both stores.

---

## Quick reference

| Step | Where | Action |
|------|--------|--------|
| Create iOS products | App Store Connect → Subscriptions | Add subscription group and products; copy Product IDs. |
| Create Android products | Play Console → Monetize → Subscriptions | Create subscriptions and base plans; copy Product IDs. |
| Configure app | `.env` | Set `IAP_PRODUCT_ID_MONTHLY` and `IAP_PRODUCT_ID_PLAN2`. |
| Purchase flow | User taps Subscribe | `purchaseSubscription(id)` → store UI → listener → `setSubscribed(true)` + `finishTransaction`. |
| Restore | App start / Restore button | `getAvailablePurchases()` → if subscription in list → `setSubscribed(true)`. |
| Unlock content | FortyDay (and any gated screen) | `isSubscribed` from `useSubscriptionStore()`; Journey days 4+ require `true`. |

For more on react-native-iap, see the [official docs](https://react-native-iap.dooboolab.com/).
