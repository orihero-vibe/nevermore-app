import { ID, account } from "./appwrite.config";
import type { Models } from "react-native-appwrite";
import type { User } from "../types";
import { showAppwriteError } from "./notifications";
import { isUnauthorizedError } from "./errorHandler";
import { userProfileService } from "./userProfile.service";

export interface SignUpParams {
  email: string;
  password: string;
  name?: string;
  nickname?: string;
  type?: string;
}

export const signUp = async ({ 
  email, 
  password, 
  name, 
  nickname, 
  type 
}: SignUpParams): Promise<Models.User<Models.Preferences>> => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    if (!newAccount) {
      throw new Error('Failed to create account');
    }

    await signIn(email, password);

    try {
      await userProfileService.createUserProfile({
        auth_id: newAccount.$id,
        full_name: name || email.split('@')[0],
        nickname: nickname || '',
        type: type || 'patient',
      });
    } catch (profileError: any) {
      console.error('Failed to create user profile:', profileError);
    }

    return newAccount;
  } catch (error: unknown) {
    console.error('Sign up error:', error);
    showAppwriteError(error, { skipUnauthorized: true });
    throw error;
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<Models.Session> => {
  try {
    // Check if there's an existing session and delete it before creating a new one
    const existingSession = await getCurrentSession();
    if (existingSession) {
      try {
        await account.deleteSession('current');
      } catch (deleteError) {
        // Ignore errors when deleting session (might already be invalid)
        console.log('Could not delete existing session:', deleteError);
      }
    }

    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: unknown) {
    const isInvalidCredentials = isUnauthorizedError(error);
    if (!isInvalidCredentials) {
      showAppwriteError(error, { skipUnauthorized: true });
    }
    throw error;
  }
};

export const getCurrentSession = async (): Promise<Models.Session | null> => {
  try {
    const session = await account.getSession('current');
    return session;
  } catch (error: unknown) {
    if (isUnauthorizedError(error)) {
      return null;
    }
    showAppwriteError(error, { skipUnauthorized: true });
    console.error("Error getting current session:", error);
    return null;
  }
};

export const getCurrentUser = async (): Promise<Models.User<Models.Preferences> | null> => {
  try {
    const user = await account.get();
    return user;
  } catch (error: unknown) {
    if (isUnauthorizedError(error)) {
      return null;
    }
    showAppwriteError(error, { skipUnauthorized: true });
    console.error("Error getting current user:", error);
    return null;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await account.deleteSession('current');
  } catch (error: unknown) {
    if (isUnauthorizedError(error)) {
      return;
    }
    console.error("Error signing out:", error);
  }
};

export const createPasswordRecovery = async (
  email: string,
  url?: string
): Promise<void> => {
  try {
    // Using a universal HTTPS URL for development
    // For production, replace with your actual app domain or registered deep link
    const recoveryUrl = url || 'https://cloud.appwrite.io/v1/account/recovery/confirm';
    await account.createRecovery(email, recoveryUrl);
  } catch (error: unknown) {
    showAppwriteError(error, { skipUnauthorized: true });
    throw error;
  }
};

export const updatePasswordRecovery = async (
  userId: string,
  secret: string,
  password: string
): Promise<void> => {
  try {
    await account.updateRecovery(userId, secret, password);
  } catch (error: unknown) {
    showAppwriteError(error, { skipUnauthorized: true });
    throw error;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch (error) {
    return false;
  }
};

export const deleteAccount = async (): Promise<void> => {
  try {
    // First, get the current user to get their auth_id
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    // Delete user profile from database first
    try {
      const userProfile = await userProfileService.getUserProfileByAuthId(currentUser.$id);
      if (userProfile && userProfile.$id) {
        await userProfileService.deleteUserProfile(userProfile.$id);
      }
    } catch (profileError) {
      console.error('Error deleting user profile:', profileError);
      // Continue with auth deletion even if profile deletion fails
    }

    // Block the account permanently (Appwrite doesn't provide client-side account deletion for security)
    // The account will be blocked and unable to login again
    try {
      await account.updateStatus();
    } catch (statusError) {
      console.error('Error blocking account:', statusError);
    }

    // Delete current session (log out)
    await signOut();
  } catch (error: unknown) {
    console.error('Error deleting account:', error);
    showAppwriteError(error, { skipUnauthorized: true });
    throw error;
  }
};

export const mapAppwriteUserToUser = (
  appwriteUser: Models.User<Models.Preferences>
): User => {
  return {
    id: appwriteUser.$id,
    email: appwriteUser.email,
    name: appwriteUser.name || appwriteUser.email,
    role: (appwriteUser.prefs as Models.Preferences & { role?: string })?.role || "user",
    createdAt: appwriteUser.$createdAt,
  };
};
