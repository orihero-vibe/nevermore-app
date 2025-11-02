import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChevronLeftIcon from '../../assets/icons/chevron-left';
import EditIcon from '../../assets/icons/edit';
import ChevronRightIcon from '../../assets/icons/chevron-right';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenNames } from '../../constants/ScreenNames';

interface EditableFieldProps {
  label: string;
  value: string;
  isPassword?: boolean;
  onEdit: () => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
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

export const Profile: React.FC = () => {
  const navigation = useNavigation();
  const [nickname, setNickname] = useState('Mary_Langston');
  const [phoneNumber, setPhoneNumber] = useState('(123) 456 - 7890');
  const [email, setEmail] = useState('Mary.Langston@email.com');
  const [password, setPassword] = useState('********');

  const handleEditField = (field: string) => {
    Alert.alert('Edit Field', `Edit ${field} functionality coming soon`);
  };

  const handleManageInvitedUsers = () => {
    (navigation as any).navigate(ScreenNames.MANAGE_INVITES);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Handle account deletion
            Alert.alert('Account Deleted', 'Your account has been deleted.');
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
        
        {/* Header */}
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

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Account Settings Title */}
          <Text style={styles.pageTitle}>Account Settings</Text>

          {/* Editable Fields */}
          <View style={styles.fieldsContainer}>
            <EditableField
              label="Nickname"
              value={nickname}
              onEdit={() => handleEditField('Nickname')}
            />
            <EditableField
              label="Phone Number"
              value={phoneNumber}
              onEdit={() => handleEditField('Phone Number')}
            />
            <EditableField
              label="Email"
              value={email}
              onEdit={() => handleEditField('Email')}
            />
            <EditableField
              label="Password"
              value={password}
              isPassword={true}
              onEdit={() => handleEditField('Password')}
            />
          </View>

          {/* Manage Invited Users Button */}
          <TouchableOpacity
            style={styles.manageUsersButton}
            onPress={handleManageInvitedUsers}
            activeOpacity={0.7}
          >
            <Text style={styles.manageUsersText}>Manage Invited Users</Text>
            <ChevronRightIcon width={24} height={24} color="#ffffff" />
          </TouchableOpacity>

          {/* Delete Account Button */}
          <TouchableOpacity
            style={styles.deleteAccountButton}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteAccountText}>Delete Account</Text>
          </TouchableOpacity>
        </ScrollView>
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

