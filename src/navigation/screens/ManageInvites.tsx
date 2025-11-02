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
import { SafeAreaView } from 'react-native-safe-area-context';
import ChevronLeftIcon from '../../assets/icons/chevron-left';
import TrashIcon from '../../assets/icons/trash';

interface InvitedUser {
  id: string;
  email: string;
}

interface InvitedUserItemProps {
  email: string;
  onDelete: () => void;
}

const InvitedUserItem: React.FC<InvitedUserItemProps> = ({ email, onDelete }) => {
  return (
    <View style={styles.userItem}>
      <Text style={styles.userEmail}>{email}</Text>
      <TouchableOpacity
        onPress={onDelete}
        style={styles.deleteButton}
        activeOpacity={0.7}
      >
        <TrashIcon width={20} height={20} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

export const ManageInvites: React.FC = () => {
  const navigation = useNavigation();
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([
    { id: '1', email: 'example1@gmail.com' },
    { id: '2', email: 'example2@gmail.com' },
    { id: '3', email: 'example3@gmail.com' },
  ]);

  const MAX_INVITES = 3;

  const handleDeleteUser = (userId: string, email: string) => {
    Alert.alert(
      'Remove Invite',
      `Are you sure you want to remove ${email}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setInvitedUsers(invitedUsers.filter(user => user.id !== userId));
          },
        },
      ]
    );
  };

  const handleInviteFriend = () => {
    if (invitedUsers.length >= MAX_INVITES) {
      Alert.alert(
        'Invite Limit Reached',
        `You can only invite up to ${MAX_INVITES} people.`
      );
    } else {
      // Navigate to invite screen or show invite dialog
      Alert.alert('Invite Friend', 'Invite functionality coming soon');
    }
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
          {/* Title and Invite Link */}
          <View style={styles.titleContainer}>
            <Text style={styles.pageTitle}>Your Invites</Text>
            <TouchableOpacity
              onPress={handleInviteFriend}
              activeOpacity={0.7}
            >
              <Text style={styles.inviteLink}>Invite a friend</Text>
            </TouchableOpacity>
          </View>

          {/* Info Text */}
          <Text style={styles.infoText}>
            Users can invite up to {MAX_INVITES} people.
          </Text>

          {/* Invited Users List */}
          <View style={styles.usersList}>
            {invitedUsers.map((user) => (
              <InvitedUserItem
                key={user.id}
                email={user.email}
                onDelete={() => handleDeleteUser(user.id, user.email)}
              />
            ))}
          </View>

          {/* Empty State */}
          {invitedUsers.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                You haven't invited anyone yet.
              </Text>
              <TouchableOpacity
                onPress={handleInviteFriend}
                style={styles.emptyStateButton}
                activeOpacity={0.7}
              >
                <Text style={styles.emptyStateButtonText}>Invite a Friend</Text>
              </TouchableOpacity>
            </View>
          )}
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: '#ffffff',
    fontFamily: 'Cinzel_400Regular',
    letterSpacing: 0.5,
  },
  inviteLink: {
    fontSize: 14,
    color: '#8B5CF6',
    fontFamily: 'Roboto_500Medium',
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 32,
    fontFamily: 'Roboto_400Regular',
  },
  usersList: {
    gap: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 16,
  },
  userEmail: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Roboto_400Regular',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 24,
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
  },
  emptyStateButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Roboto_500Medium',
  },
});

export default ManageInvites;

