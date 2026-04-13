# Appwrite: migrate transcripts from file URLs to in-app text

The mobile app and admin panel now use **plain text** attributes for Recovery and Support transcripts. File-based fields (`transcriptRecoveryURL`, `transcriptSupportURL`) are no longer read or written by the app.

## 1. Schema (Content collection)

In **Appwrite Console** → your database → **Content** collection (same ID as `APPWRITE_CONTENT_COLLECTION_ID` / `VITE_APPWRITE_CONTENT_COLLECTION_ID`):

### Add attributes (if missing)

| Attribute ID | Type        | Notes |
|----------------------------|------------|--------|
| `transcriptRecoveryText`   | Large text | Use **mediumtext**, **longtext**, or the largest **string** size your Appwrite version allows. Must hold full scripts, not short labels. |
| `transcriptSupportText`    | Large text | Same as above. |

Exact attribute **keys** must match: `transcriptRecoveryText` and `transcriptSupportText` (case-sensitive).

### Optional cleanup (after data migration)

- You may **delete** `transcriptRecoveryURL` and `transcriptSupportURL` from the collection once no tooling depends on them, or leave them unused.
- Or run a one-time script to copy text out of old `.txt` files in Storage into these fields, then clear the URL fields.

## 2. Permissions

Ensure the **same roles / API keys** that could read other Content fields can **read** the new text attributes. The admin and mobile clients use your existing server/client API configuration.

## 3. Data migration (content rows)

For each **forty_temptations** document that only had storage URLs:

1. Open the source document (or download the old file from Storage).
2. Paste the full transcript into **Recovery** and **Support** in the admin app (or set the attributes in Appwrite).
3. Save. The admin sends `transcriptRecoveryText` / `transcriptSupportText` only; URLs are not updated anymore.

Until the text field for the **active role** (Recovery or Support) is filled, the **mobile app will not show a transcript block** (there is no file download fallback).

## 4. Storage

Old transcript **files** in the bucket are not deleted automatically when you edit content. After migration you can remove orphaned files from Storage if you no longer need them.

## 5. Deploy order

1. Apply Appwrite schema changes (add text attributes).
2. Migrate existing rows (paste text).
3. Deploy **admin** then **mobile** (or together). Older app versions that still expect URL fields will stop showing transcripts until users update.
