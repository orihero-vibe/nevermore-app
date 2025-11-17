import { useState, useEffect, FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChevronLeftIcon from '../../assets/icons/chevron-left';
import EditIcon from '../../assets/icons/edit';
import ChevronRightIcon from '../../assets/icons/chevron-right';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenNames } from '../../constants/ScreenNames';
import { useAuthStore } from '../../store/authStore';
import { useUserProfile } from '../../hooks/useUserProfile';
import { EditFieldModal } from '../../components/EditFieldModal';
import { account } from '../../services/appwrite.config';

interface EditableFieldProps {
  label: string;
  value: string;
  isPassword?: boolean;
  onEdit: () => void;
}

const EditableField: FC<EditableFieldProps> = ({
  label,
  value,
  isPassword = false,
  onEdit,
}) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldInputContainer}>
        <Text style={styles.fieldValue}>
          {isPassword ? '• • • • • • • • •' : value}
        </Text>
        <TouchableOpacity
          onPress={onEdit}
          style={styles.editButton}
          activeOpacity={0.7}
        >
          <EditIcon width={20} height={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

type EditFieldType = 'nickname' | 'fullName' | 'email' | 'phone' | 'password' | null;

export const Profile: React.FC = () => {
  const navigation = useNavigation();
  const { user, signOut, deleteAccount } = useAuthStore();
  const { profile, isLoading, updateProfile, checkNicknameAvailability } = useUserProfile();
  
  const [editingField, setEditingField] = useState<EditFieldType>(null);

  const handleEditNickname = async (value: string): Promise<boolean> => {
    return await updateProfile({ nickname: value });
  };

  const handleEditFullName = async (value: string): Promise<boolean> => {
    return await updateProfile({ full_name: value });
  };

  const handleEditPhone = async (value: string): Promise<boolean> => {
    return await updateProfile({ phone: value });
  };

  const handleEditEmail = async (value: string): Promise<boolean> => {
    try {
      return new Promise((resolve) => {
        Alert.prompt(
          'Password Required',
          'Please enter your current password to update your email',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => resolve(false),
            },
            {
              text: 'Update',
              onPress: async (password?: string) => {
                try {
                  if (!password) {
                    Alert.alert('Error', 'Password is required');
                    resolve(false);
                    return;
                  }
                  await account.updateEmail(value, password);
                  Alert.alert('Success', 'Email updated successfully');
                  resolve(true);
                } catch (error: any) {
                  console.error('Error updating email:', error);
                  Alert.alert('Error', error.message || 'Failed to update email');
                  resolve(false);
                }
              },
            },
          ],
          'secure-text'
        );
      });
    } catch (error: any) {
      console.error('Error updating email:', error);
      Alert.alert('Error', error.message || 'Failed to update email');
      return false;
    }
  };

  const handleEditPassword = async (newPassword: string): Promise<boolean> => {
    try {
      return new Promise((resolve) => {
        Alert.prompt(
          'Current Password Required',
          'Please enter your current password',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => resolve(false),
            },
            {
              text: 'Update',
              onPress: async (oldPassword?: string) => {
                try {
                  if (!oldPassword) {
                    Alert.alert('Error', 'Current password is required');
                    resolve(false);
                    return;
                  }
                  await account.updatePassword(newPassword, oldPassword);
                  Alert.alert('Success', 'Password updated successfully');
                  resolve(true);
                } catch (error: any) {
                  console.error('Error updating password:', error);
                  Alert.alert('Error', error.message || 'Failed to update password');
                  resolve(false);
                }
              },
            },
          ],
          'secure-text'
        );
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      Alert.alert('Error', error.message || 'Failed to update password');
      return false;
    }
  };

  const validateNickname = async (value: string) => {
    if (!value.trim()) {
      return { valid: false, message: 'Nickname is required' };
    }
    if (value.length < 3) {
      return { valid: false, message: 'Nickname must be at least 3 characters' };
    }
    const isAvailable = await checkNicknameAvailability(value);
    if (!isAvailable) {
      return { valid: false, message: 'This nickname is already taken' };
    }
    return { valid: true };
  };

  const validatePhone = async (value: string) => {
    if (!value.trim()) {
      return { valid: false, message: 'Phone number is required' };
    }
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value)) {
      return { valid: false, message: 'Please enter a valid phone number' };
    }
    if (value.replace(/\D/g, '').length < 9) {
      return { valid: false, message: 'Phone number must be at least 10 digits' };
    }
    return { valid: true };
  };

  const validateEmail = async (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { valid: false, message: 'Please enter a valid email' };
    }
    return { valid: true };
  };

  const validatePassword = async (value: string) => {
    if (value.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' };
    }
    return { valid: true };
  };

  const handleManageInvitedUsers = () => {
    (navigation as any).navigate(ScreenNames.MANAGE_INVITES);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              (navigation as any).reset({
                index: 0,
                routes: [{ name: ScreenNames.WELCOME }],
              });
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete:\n\n• Your profile information\n• All your data\n• Your authentication credentials',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              
              // Navigate to welcome screen after successful deletion
              (navigation as any).reset({
                index: 0,
                routes: [{ name: ScreenNames.WELCOME }],
              });
              
              // Show success message after navigation
              setTimeout(() => {
                Alert.alert(
                  'Account Deleted', 
                  'Your account data has been permanently deleted.'
                );
              }, 500);
            } catch (error: any) {
              console.error('Error deleting account:', error);
              Alert.alert(
                'Error', 
                error.message || 'Failed to delete account. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/gradient.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ChevronLeftIcon width={24} height={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nevermore</Text>
          <View style={styles.headerSpacer} />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.pageTitle}>Account Settings</Text>

            <View style={styles.fieldsContainer}>
              <EditableField
                label="Full Name"
                value={profile?.full_name || 'Not set'}
                onEdit={() => setEditingField('fullName')}
              />
              <EditableField
                label="Nickname"
                value={profile?.nickname || 'Not set'}
                onEdit={() => setEditingField('nickname')}
              />
              <EditableField
                label="Email"
                value={user?.email || 'Not set'}
                onEdit={() => setEditingField('email')}
              />
              <EditableField
                label="Phone"
                value={profile?.phone || 'Not set'}
                onEdit={() => setEditingField('phone')}
              />
              <EditableField
                label="Password"
                value="********"
                isPassword={true}
                onEdit={() => setEditingField('password')}
              />
            </View>

            <TouchableOpacity
              style={styles.manageUsersButton}
              onPress={handleManageInvitedUsers}
              activeOpacity={0.7}
            >
              <Text style={styles.manageUsersText}>Manage Invited Users</Text>
              <ChevronRightIcon width={24} height={24} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
              activeOpacity={0.7}
            >
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteAccountButton}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteAccountText}>Delete Account</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Edit Modals */}
        <EditFieldModal
          visible={editingField === 'fullName'}
          title="Edit Full Name"
          label="Full Name"
          value={profile?.full_name || ''}
          placeholder="Enter your full name"
          onClose={() => setEditingField(null)}
          onSave={handleEditFullName}
        />

        <EditFieldModal
          visible={editingField === 'nickname'}
          title="Edit Nickname"
          label="Nickname"
          value={profile?.nickname || ''}
          placeholder="Enter your nickname"
          onClose={() => setEditingField(null)}
          onSave={handleEditNickname}
          validateInput={validateNickname}
        />

        <EditFieldModal
          visible={editingField === 'email'}
          title="Edit Email"
          label="Email"
          value={user?.email || ''}
          placeholder="Enter your email"
          onClose={() => setEditingField(null)}
          onSave={handleEditEmail}
          validateInput={validateEmail}
        />

        <EditFieldModal
          visible={editingField === 'phone'}
          title="Edit Phone"
          label="Phone Number"
          value={profile?.phone || ''}
          placeholder="Enter your phone number"
          onClose={() => setEditingField(null)}
          onSave={handleEditPhone}
          validateInput={validatePhone}
        />

        <EditFieldModal
          visible={editingField === 'password'}
          title="Change Password"
          label="New Password"
          value=""
          placeholder="Enter new password"
          isPassword={true}
          onClose={() => setEditingField(null)}
          onSave={handleEditPassword}
          validateInput={validatePassword}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#131313',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Roboto_600SemiBold',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#ffffff',
    marginBottom: 32,
    fontFamily: 'Roboto_400Regular',
    letterSpacing: 0.5,
  },
  fieldsContainer: {
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
    fontFamily: 'Roboto_400Regular',
  },
  fieldInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  fieldValue: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Roboto_400Regular',
  },
  editButton: {
    padding: 4,
    marginLeft: 12,
  },
  manageUsersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 40,
  },
  manageUsersText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Roboto_500Medium',
  },
  signOutButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 12,
  },
  signOutText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Roboto_500Medium',
  },
  deleteAccountButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  deleteAccountText: {
    fontSize: 16,
    color: '#ff4444',
    fontFamily: 'Roboto_500Medium',
  },
});

export default Profile;