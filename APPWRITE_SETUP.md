# Appwrite Authentication Setup Guide

This guide will help you configure Appwrite.io authentication for the Nevermore app.

## 📋 Prerequisites

- An Appwrite account (create one at [cloud.appwrite.io](https://cloud.appwrite.io))
- Your project deployed and running

## 🚀 Setup Steps

### 1. Create an Appwrite Project

1. Go to [Appwrite Cloud Console](https://cloud.appwrite.io)
2. Click "Create Project"
3. Name your project (e.g., "Nevermore")
4. Copy your **Project ID** (you'll need this for the `.env` file)

### 2. Configure Authentication

1. In your Appwrite project dashboard, go to **Auth** section
2. Click on **Settings**
3. Enable the following authentication methods:
   - **Email/Password** (required for this app)
4. Configure your email templates:
   - **Email Verification**
   - **Password Recovery**
   - **Magic URL**

### 3. Set Up a Database (REQUIRED)

1. Go to **Databases** in your Appwrite dashboard
2. Click "Create Database"
3. Name it (e.g., "nevermore-db")
4. Copy your **Database ID**

5. **Create User Profiles Collection** (REQUIRED):
   - Click "Create Collection"
   - Name it "user_profiles"
   - Copy your **Collection ID**
   
   **Add Attributes:**
   - `auth_id` (String, required, size: 255) - Links to Appwrite Auth user ID
   - `full_name` (String, optional, size: 255)
   - `nickname` (String, optional, size: 255)
   - `type` (String, optional, size: 50, default: "user")
   
   **⚠️ CRITICAL: Set Collection Permissions (Settings → Permissions):**
   
   Go to the **Settings** tab of your collection, then click **Permissions**:
   
   1. Click "Add a permission"
   2. Select "Users" from the role dropdown
   3. Enable these permissions for "Users" role:
      - ✅ **Create** - Allows authenticated users to create documents
      - ✅ **Read** - Allows users to read documents
      - ✅ **Update** - Allows users to update documents
      - ❌ **Delete** - Keep disabled (or set to Admin only)
   
   **Alternative: Document-Level Permissions** (more secure):
   - You can also use document-level permissions
   - After creating the document, set permissions to `user:[USER_ID]`
   - This ensures users can only access their own profile
   
   **Without proper permissions, you'll get this error:**
   ```
   "The current user is not authorized to perform the requested action"
   ```

6. Create additional collections as needed:
   
   **Categories Collection:**
   - Click "Create Collection"
   - Name it "categories"
   - Copy your **Collection ID**
   
   **Add Attributes:**
   - `name` or `title` (String, required, size: 255) - Category display name
   - `order` (Integer, optional) - Display order
   
   **Content Collection:**
   - Click "Create Collection"
   - Name it "content"
   - Copy your **Collection ID**
   
   **Add Attributes:**
   - `title` (String, required, size: 1000) - Content title
   - `role` (Enum, optional) - Content role
   - `category` (Relationship, optional) - Many to one relationship to categories collection
   - `type` (Enum, required) - Content type
   - `transcript` (URL, optional) - Transcript URL
   - `images` (URL Array, optional) - Array of image URLs
   - `files` (URL Array, optional) - Array of file URLs
   - `tasks` (String Array, optional, size: 1000) - Array of task strings
   
   **⚠️ CRITICAL: Set Collection Permissions for Categories and Content:**
   - Add "Users" role with Read permissions
   - This allows authenticated users to view categories and content
   
   **Support Collection:**
   - Click "Create Collection"
   - Name it "support"
   - Copy your **Collection ID**
   
   **Add Attributes:**
   - `status` (Enum, required, default: "new") - Ticket status
     - Values: "new", "in-progress", "resolved", "closed"
   - `message` (String, required, size: 5000) - Support message/description
   - `reason` (Enum, optional) - Reason for support request
     - Values: "bug-issue", "feedback", "feature-request", "inappropriate-content", "other"
   - `userProfile` (Relationship, optional) - One to one relationship to user_profiles collection
   
   **⚠️ CRITICAL: Set Collection Permissions for Support:**
   - Go to **Settings** → **Permissions**
   - Add "Users" role with:
     - ✅ **Create** - Allows users to create support tickets
     - ✅ **Read** - Allows users to read their own tickets
     - ❌ **Update** - Keep disabled (or Admin only)
     - ❌ **Delete** - Keep disabled (or Admin only)

### 4. Configure Platform Settings

#### For iOS:
1. Go to **Settings** → **Platforms**
2. Click "Add Platform" → "iOS"
3. Add your bundle identifier (found in `ios/nevermoreapp.xcodeproj`)
4. Add your App Store ID (if applicable)

#### For Android:
1. Go to **Settings** → **Platforms**
2. Click "Add Platform" → "Android"
3. Add your package name (found in `android/app/build.gradle`)
4. Add your SHA-256 fingerprint (optional for now)

### 5. Set Up Storage (For Audio and Media Files)

1. Go to **Storage** in your Appwrite dashboard
2. Click "Create Bucket"
3. Name it (e.g., "media" or "audio-files")
4. Copy your **Bucket ID**

**⚠️ CRITICAL: Set Bucket Permissions:**

1. In the bucket settings, go to **Permissions**
2. Add "Users" role with:
   - ✅ **Read** - Allows authenticated users to view/download files
   - ✅ **Create** - (Optional) If users need to upload files
3. Configure **File Security**:
   - Set maximum file size (e.g., 50MB for audio files)
   - Enable/disable file type restrictions
   - Configure allowed file extensions: `.mp3`, `.m4a`, `.wav`, `.aac`

**File Upload for FortyDay Journey:**
- When creating content in the `content` collection with type `forty_day_journey`
- Upload audio files to this storage bucket
- Copy the file ID that Appwrite generates
- Add this file ID to the `files` array field in your content document
- The app will automatically convert file IDs to proper URLs

**Without proper Storage configuration, you'll see this error:**
```
Error: The AVPlayerItem instance has failed with the error code -16044
```

### 6. Configure Environment Variables

Your `.env` file in the project root should contain:

```bash
# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_DATABASE_ID=your_database_id_here
APPWRITE_CATEGORY_COLLECTION_ID=your_collection_id_here
APPWRITE_CONTENT_COLLECTION_ID=your_content_collection_id_here
APPWRITE_USER_PROFILES_COLLECTION_ID=your_user_profiles_collection_id_here
APPWRITE_SUPPORT_COLLECTION_ID=your_support_collection_id_here
APPWRITE_STORAGE_BUCKET_ID=your_storage_bucket_id_here
```

**Important Notes:**
- Replace `your_project_id_here` with your actual Appwrite Project ID from the console
- Replace `your_database_id_here` with your actual Database ID
- Replace `your_collection_id_here` with your actual Collection ID for categories
- Replace `your_content_collection_id_here` with your actual Collection ID for content
- Replace `your_user_profiles_collection_id_here` with your User Profiles Collection ID (REQUIRED)
- Replace `your_support_collection_id_here` with your Support Collection ID (required for help & support feature)
- Replace `your_storage_bucket_id_here` with your Storage Bucket ID (REQUIRED for audio/media files)
- Never commit the `.env` file to version control (it's already in `.gitignore`)
- After updating `.env`, restart the development server: `npm start` or `npx expo start --clear`

### 7. Configure Deep Links (for Email Verification & Password Reset)

Update the URLs in `src/services/auth.service.ts`:

```typescript
// For Email Verification
await account.createVerification(
  'https://your-app-domain.com/verify-email' // or 'exp://your-app-slug/verify-email'
);

// For Password Recovery
await account.createRecovery(
  email,
  'https://your-app-domain.com/reset-password' // or 'exp://your-app-slug/reset-password'
);
```

For Expo apps, you can use:
- Development: `exp://localhost:8081/verify-email`
- Production: `https://your-app-slug.exp.direct/verify-email`

## 🧪 Testing the Integration

### Test Sign Up Flow

1. Run your app: `npm run ios` or `npm run android`
2. Navigate to the Sign Up screen
3. Enter a valid email and password
4. Agree to terms and conditions
5. Click "Create Account"
6. You should see a success message and be redirected

### Test Sign In Flow

1. Navigate to the Sign In screen
2. Enter the email and password you just created
3. Click "Sign In"
4. You should see a welcome message and be redirected to the home screen

### Test Forgot Password Flow

1. Navigate to the Forgot Password screen
2. Enter your email address
3. Click "Next"
4. Check your email for the password reset link

## 📱 Features Implemented

### ✅ Authentication Service (`src/services/auth.service.ts`)
- Sign Up with email/password (automatically creates user profile in database)
- Sign In with email/password
- Sign Out
- Get current user
- Check authentication status
- Send password recovery email
- Complete password recovery
- Send email verification
- Confirm email verification

### ✅ User Profile Service (`src/services/userProfile.service.ts`)
- Create user profile in database
- Get user profile by auth_id
- Update user profile
- Delete user profile

### ✅ Auth Store (`src/store/authStore.ts`)
- Zustand-based state management
- Global authentication state
- Loading states
- Error handling
- Persistent user session

### ✅ Integrated Screens
- **Sign Up Screen**: Full registration flow with password validation
- **Sign In Screen**: Login with email/password
- **Forgot Password Screen**: Password recovery via email

## 🎯 How It Works

### Sign Up Flow
1. User creates account → Appwrite creates auth user with unique ID
2. System auto signs in the new user
3. **Automatic User Profile Creation**: A document is created in `user_profiles` collection:
   ```javascript
   {
     auth_id: "appwrite_auth_user_id",  // Links to Appwrite Auth
     full_name: "User Name",              // From sign up or email prefix
     nickname: "",                         // Can be set later
     type: "user"                          // Default user type
   }
   ```
4. Navigate to email verification screen

### Sign In Flow
1. User enters credentials → Appwrite validates
2. Session created → User state updated
3. Navigate to home screen

### Forgot Password Flow
1. User enters email → Appwrite sends recovery email
2. User clicks link in email → Redirected to reset password

### Database Structure

The `user_profiles` collection automatically links to Appwrite Auth via the `auth_id` field:
- **auth_id**: Appwrite authentication user ID (`$id` from auth)
- **full_name**: User's display name
- **nickname**: Optional nickname for the app
- **type**: User role/type (default: "user")

## 🔒 Security Best Practices

1. **Environment Variables**: Never hardcode API keys or credentials
2. **Password Requirements**: The app enforces:
   - At least 1 capital letter
   - At least 1 numerical value
   - At least 1 special character
3. **Session Management**: Appwrite handles session tokens automatically
4. **HTTPS Only**: Always use HTTPS endpoints in production

## 🐛 Troubleshooting

### Common Issues:

#### "The current user is not authorized to perform the requested action"
**This is the most common error when setting up Appwrite for the first time.**

**Solution:**
1. Go to your Appwrite Console → Databases → your database → `user_profiles` collection
2. Click on the **Settings** tab
3. Click on **Permissions**
4. Click "Add a permission"
5. Select **"Users"** from the role dropdown
6. Enable these checkboxes:
   - ✅ Create
   - ✅ Read
   - ✅ Update
7. Click "Save" or "Add"
8. Try signing up again

**Why this happens:** By default, Appwrite collections have no permissions set, which means even authenticated users cannot create documents.

#### "Failed to create account"
- Check your Appwrite project is active
- Verify your Project ID in `.env` is correct
- Ensure Email/Password auth is enabled in Appwrite dashboard
- Verify `APPWRITE_USER_PROFILES_COLLECTION_ID` is set in `.env`
- Check that the `user_profiles` collection exists with correct permissions

#### "Invalid credentials"
- Verify the email and password are correct
- Check if the account exists in Appwrite dashboard

#### "Network Error"
- Check your internet connection
- Verify the Appwrite endpoint URL is correct
- Check if Appwrite service is running

#### Environment variables not loading
- Verify your `.env` file is in the project root
- Restart the Metro bundler after changing `.env`
- Run: `npm start` or `npx expo start --clear`
- Check that babel plugins are configured correctly for env variables

#### Audio files not loading (Error -16044)
**This error means the audio URL is invalid or the file cannot be accessed.**

**Solution:**
1. Verify `APPWRITE_STORAGE_BUCKET_ID` is set correctly in your `.env` file
2. Restart your development server after updating `.env`
3. Check that your Storage bucket has proper permissions:
   - Go to Appwrite Console → Storage → Your Bucket → Permissions
   - Ensure "Users" role has "Read" permission
4. Verify your audio files are uploaded to the correct bucket:
   - Go to Appwrite Console → Storage → Your Bucket → Files
   - Confirm your audio files are listed there
5. Check the `files` field in your content documents:
   - Go to Appwrite Console → Databases → Content Collection
   - Open a document with type `forty_day_journey`
   - The `files` array should contain file IDs (not URLs) from your Storage bucket
6. Ensure audio files are in supported formats:
   - MP3 (recommended)
   - M4A
   - WAV
   - AAC
7. Test the file URL manually in a browser:
   ```
   https://cloud.appwrite.io/v1/storage/buckets/[BUCKET_ID]/files/[FILE_ID]/view?project=[PROJECT_ID]
   ```
   Replace [BUCKET_ID], [FILE_ID], and [PROJECT_ID] with your actual values

## 📚 Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite React Native SDK](https://appwrite.io/docs/sdks#client)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

## 🎯 Next Steps

1. Configure email templates in Appwrite for better branding
2. Add social authentication (Google, Apple, etc.)
3. Implement user profile management
4. Add biometric authentication
5. Set up analytics and monitoring

## 🤝 Support

If you encounter any issues:
1. Check the [Appwrite Discord](https://appwrite.io/discord)
2. Review [Appwrite GitHub Issues](https://github.com/appwrite/appwrite/issues)
3. Consult the [Expo Forums](https://forums.expo.dev/)

---

**Note**: Remember to test thoroughly in both development and production environments before releasing to users.

