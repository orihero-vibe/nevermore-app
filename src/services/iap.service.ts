/**
 * In-App Purchase service (Apple IAP / Google Play Billing).
 * Uses react-native-iap for native purchases.
 *
 * Product IDs must match exactly what you create in:
 * - iOS: App Store Connect → Your App → Subscriptions
 * - Android: Google Play Console → Your App → Monetize → Subscriptions
 *
 * Set IAP_PRODUCT_ID_MONTHLY and IAP_PRODUCT_ID_YEARLY in your .env. Both are required; the app will throw at runtime if they are missing.
 */

import { Platform } from "react-native";
import {
  initConnection,
  endConnection,
  requestPurchase,
  fetchProducts,
  getStorefront,
  getAvailablePurchases,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  type Purchase,
  type PurchaseError,
} from "react-native-iap";

import appwriteConfig from "./appwrite.config";

function getSubscriptionProductIds(): { monthly: string; yearly: string } {
  const monthly = appwriteConfig.iapProductIdMonthly?.trim() ?? "";
  const yearly = appwriteConfig.iapProductIdYearly?.trim() ?? "";

  if (!monthly) {
    const error = new Error(
      "IAP_PRODUCT_ID_MONTHLY is not set in environment variables. Please add it to your .env file.",
    );
    console.error("Configuration Error:", error.message);
    throw error;
  }
  if (!yearly) {
    const error = new Error(
      "IAP_PRODUCT_ID_YEARLY is not set in environment variables. Please add it to your .env file.",
    );
    console.error("Configuration Error:", error.message);
    throw error;
  }

  return { monthly, yearly };
}

/** Product IDs used for subscription (monthly, yearly). Use these when starting a purchase. */
export function getIAPProductIds(): { monthly: string; yearly: string } {
  return getSubscriptionProductIds();
}

function getSubscriptionSkus(): string[] {
  const { monthly, yearly } = getSubscriptionProductIds();
  return [monthly, yearly];
}

let purchaseResolve: ((value: boolean) => void) | null = null;
let purchaseReject: ((reason: Error) => void) | null = null;

let updateSubscription: ((value: boolean) => void) | null = null;

export function setSubscriptionUpdater(updater: (value: boolean) => void) {
  updateSubscription = updater;
}

async function hasActiveSubscription(): Promise<boolean> {
  try {
    const purchases = await getAvailablePurchases();
    if (!purchases || purchases.length === 0) return false;
    const skus = getSubscriptionSkus();
    return purchases.some((p) => p.productId && skus.includes(p.productId));
  } catch {
    return false;
  }
}

function handlePurchaseUpdate(purchase: Purchase) {
  const skus = getSubscriptionSkus();
  const valid = purchase.productId && skus.includes(purchase.productId);
  // #region agent log
  fetch("http://127.0.0.1:7283/ingest/a370f837-25c2-44a9-9150-0af17ca05a19", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "dfcee1",
    },
    body: JSON.stringify({
      sessionId: "dfcee1",
      runId: "baseline",
      hypothesisId: "H3",
      location: "src/services/iap.service.ts:82",
      message: "purchaseUpdatedListener triggered",
      data: {
        productId: purchase.productId,
        transactionId: purchase.transactionId,
        valid,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  if (valid) {
    updateSubscription?.(true);
    purchaseResolve?.(true);
  }
  finishTransaction({ purchase, isConsumable: false }).catch(() => {});
  purchaseResolve = null;
  purchaseReject = null;
}

function handlePurchaseError(error: PurchaseError) {
  // #region agent log
  fetch("http://127.0.0.1:7283/ingest/a370f837-25c2-44a9-9150-0af17ca05a19", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "dfcee1",
    },
    body: JSON.stringify({
      sessionId: "dfcee1",
      runId: "baseline",
      hypothesisId: "H4",
      location: "src/services/iap.service.ts:115",
      message: "purchaseErrorListener triggered",
      data: {
        code: error.code,
        message: error.message,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  purchaseReject?.(new Error(error.message || "Purchase failed"));
  purchaseResolve = null;
  purchaseReject = null;
}

export const iapService = {
  setSubscriptionUpdater,
  async init(): Promise<void> {
    try {
      await initConnection();
      // #region agent log
      fetch("http://127.0.0.1:7283/ingest/a370f837-25c2-44a9-9150-0af17ca05a19", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "dfcee1",
        },
        body: JSON.stringify({
          sessionId: "dfcee1",
          runId: "baseline",
          hypothesisId: "H2",
          location: "src/services/iap.service.ts:144",
          message: "IAP initConnection succeeded",
          data: { platform: Platform.OS },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      purchaseUpdatedListener(handlePurchaseUpdate);
      purchaseErrorListener(handlePurchaseError);
    } catch (err) {
      console.warn("IAP initConnection error:", err);
    }
  },

  async endConnection(): Promise<void> {
    try {
      await endConnection();
    } catch (err) {
      console.warn("IAP endConnection error:", err);
    }
  },

  async checkSubscription(): Promise<boolean> {
    try {
      return await hasActiveSubscription();
    } catch {
      return false;
    }
  },

  async purchaseSubscription(productId: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      purchaseResolve = resolve;
      purchaseReject = reject;
      try {
        // #region agent log
        fetch("http://127.0.0.1:7283/ingest/a370f837-25c2-44a9-9150-0af17ca05a19", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "dfcee1",
          },
          body: JSON.stringify({
            sessionId: "dfcee1",
            runId: "baseline",
            hypothesisId: "H1",
            location: "src/services/iap.service.ts:179",
            message: "purchaseSubscription entry",
            data: {
              platform: Platform.OS,
              productId,
              hasResolve: Boolean(purchaseResolve),
              hasReject: Boolean(purchaseReject),
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        if (Platform.OS === "web") {
          resolve(false);
          return;
        }
        console.log("requesting purchase for productId", productId);
        // #region agent log
        try {
          const storefront = Platform.OS === "ios" ? await getStorefront() : "";
          const products = await fetchProducts({ skus: [productId], type: "subs" });
          const productList = Array.isArray(products) ? products : [];
          fetch("http://127.0.0.1:7283/ingest/a370f837-25c2-44a9-9150-0af17ca05a19", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Debug-Session-Id": "dfcee1",
            },
            body: JSON.stringify({
              sessionId: "dfcee1",
              runId: "baseline",
              hypothesisId: "H6",
              location: "src/services/iap.service.ts:211",
              message: "preflight store lookup",
              data: {
                storefront,
                requestedSku: productId,
                resultCount: productList.length,
                returnedIds: productList.map((p) => p.id),
              },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
        } catch (preflightError) {
          fetch("http://127.0.0.1:7283/ingest/a370f837-25c2-44a9-9150-0af17ca05a19", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Debug-Session-Id": "dfcee1",
            },
            body: JSON.stringify({
              sessionId: "dfcee1",
              runId: "baseline",
              hypothesisId: "H6",
              location: "src/services/iap.service.ts:231",
              message: "preflight store lookup failed",
              data: {
                requestedSku: productId,
                error:
                  preflightError instanceof Error
                    ? { name: preflightError.name, message: preflightError.message }
                    : String(preflightError),
              },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
        }
        // #endregion
        // #region agent log
        fetch("http://127.0.0.1:7283/ingest/a370f837-25c2-44a9-9150-0af17ca05a19", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "dfcee1",
          },
          body: JSON.stringify({
            sessionId: "dfcee1",
            runId: "baseline",
            hypothesisId: "H1",
            location: "src/services/iap.service.ts:201",
            message: "requestPurchase payload prepared",
            data: {
              productId,
              appleSku: productId,
              googleSkus: [productId],
              type: "subs",
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        await requestPurchase({
          request: {
            apple: { sku: productId },
            google: { skus: [productId] },
          },
          type: "subs",
        });
        // #region agent log
        fetch("http://127.0.0.1:7283/ingest/a370f837-25c2-44a9-9150-0af17ca05a19", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "dfcee1",
          },
          body: JSON.stringify({
            sessionId: "dfcee1",
            runId: "baseline",
            hypothesisId: "H5",
            location: "src/services/iap.service.ts:223",
            message: "requestPurchase resolved (await completed)",
            data: {
              productId,
              hasResolveAfterAwait: Boolean(purchaseResolve),
              hasRejectAfterAwait: Boolean(purchaseReject),
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        // Result will come via purchaseUpdatedListener or purchaseErrorListener
      } catch (err) {
        // #region agent log
        fetch("http://127.0.0.1:7283/ingest/a370f837-25c2-44a9-9150-0af17ca05a19", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "dfcee1",
          },
          body: JSON.stringify({
            sessionId: "dfcee1",
            runId: "baseline",
            hypothesisId: "H4",
            location: "src/services/iap.service.ts:241",
            message: "requestPurchase threw",
            data: {
              productId,
              error:
                err instanceof Error
                  ? { name: err.name, message: err.message }
                  : String(err),
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {});
        // #endregion
        purchaseReject = null;
        purchaseResolve = null;
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  },

  async restorePurchases(): Promise<boolean> {
    try {
      if (Platform.OS === "web") {
        return false;
      }
      const active = await hasActiveSubscription();
      if (active) {
        updateSubscription?.(true);
      }
      return active;
    } catch {
      return false;
    }
  },
};
