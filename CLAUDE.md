# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start           # Start Expo dev server (requires dev client, not Expo Go)
npm run ios         # Build and run on iOS simulator
npm run android     # Build and run on Android emulator
npm run web         # Run in browser
```

TypeScript checking:
```bash
npx tsc --noEmit    # Type-check without building
```

No test or lint scripts are configured.

## Architecture

**Nevermore** is a React Native / Expo app for temptation recovery, structured around a 40-day journey. It uses Appwrite as its BaaS, Zustand for state, and react-native-iap for subscriptions.

### Layer overview

| Layer | Location | Purpose |
|---|---|---|
| Navigation | `src/navigation/index.tsx` | Single file wiring all navigators; routing logic depends on auth, onboarding, subscription state |
| Screens | `src/navigation/screens/` | 24 screens — auth, onboarding, core content, account |
| Stores | `src/store/` | Zustand stores for auth, subscription, 40-day journey, trial, onboarding, bookmarks |
| Services | `src/services/` | Appwrite calls, IAP, audio cache, invitations |
| Hooks | `src/hooks/` | 20 hooks that bridge stores/services to screen logic |
| Components | `src/components/` | Reusable UI (modals, media controls, animations, glassmorphism cards) |

### Key flows

**Auth & onboarding gate** — `src/navigation/index.tsx` checks `authStore`, `onboardingStore`, `subscriptionStore`, and `trialStore` to decide which navigator is shown. Screens progress: Welcome → SignUp/SignIn → Onboarding steps → TrialWelcome → HOME_TABS.

**Onboarding** — five steps (Permission, Purpose, Nickname, Invite, InviteSend) tracked in `onboardingStore`. Completion state persists via AsyncStorage.

**40-day journey** — `fortyDayStore` tracks per-day progress. Days 4+ are subscription-gated; `useFullAccess` hook and `src/utils/contentAccess.ts` centralize the access check.

**Subscriptions & trial** — `subscriptionStore` wraps react-native-iap. Trial start date lives in `trialStore`. Hard-block `TrialExpired` screen is injected by the navigator when the trial ends and no active subscription exists. Restore purchases runs on startup via `getAvailablePurchases()`.

**Deep linking** — prefixes `nevermoreapp://` and `https://nevermore-admin-app.vercel.app`. Handled in navigation config for password reset, magic URL login, and invitation acceptance (see `INVITATION_FLOW.md`).

**Audio** — expo-audio with caching in `audioCache.service.ts`. Playback state lives in `useAudioPlayer` hook.

### Backend (Appwrite)

Config in `src/services/appwrite.config.ts`. Collections: `categories`, `content`, `user_profiles`, `invitations`, `welcome_quotes`, `support`, `settings`. All IDs come from `.env`.

IAP product IDs (monthly & yearly) also come from `.env`.

### Screen names

All screen name string constants are in `src/constants/ScreenNames.ts` — always use this enum when navigating, never hardcode strings.

### Native setup

iOS/Android folders are **not committed** (Continuous Native Generation). Re-run `npm run ios` / `npm run android` to regenerate. Requires a development build — Expo Go is not supported due to native plugins (expo-audio, react-native-iap, Appwrite).
