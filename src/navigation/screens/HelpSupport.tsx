import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import ChevronLeftIcon from '../../assets/icons/chevron-left';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supportService, SupportReason } from '../../services/support.service';
import { useUserProfile } from '../../hooks/useUserProfile';
import { ScreenNames } from '../../constants/ScreenNames';

type HelpSupportRouteParams = {
  [ScreenNames.HELP_SUPPORT]: {
    preSelectedReason?: string;
  } | undefined;
};

interface RadioButtonProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, checked, onToggle }) => {
  return (
    <TouchableOpacity
      style={styles.radioContainer}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.radioButton, checked && styles.radioButtonChecked]}>
        {checked && <View style={styles.radioButtonInner} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

// Map UI reason labels to enum values
const REASON_MAP: Record<string, SupportReason> = {
  'Technical Issue/Bug': 'bug-issue',
  'Feedback': 'feedback',
  'Feature Request': 'feature-request',
  'Inappropriate Content': 'inappropriate-content',
  'Other': 'other',
};

const REASONS = [
  'Technical Issue/Bug',
  'Feedback',
  'Feature Request',
  'Inappropriate Content',
  'Other',
] as const;

export const HelpSupport: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<HelpSupportRouteParams, typeof ScreenNames.HELP_SUPPORT>>();
  const { profile } = useUserProfile();
  const preSelectedReason = route.params?.preSelectedReason;
  const [selectedReason, setSelectedReason] = useState<string>(preSelectedReason || 'Feedback');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxCharacters = 5000;

  const selectReason = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleSend = async () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Please select a reason.');
      return;
    }

    if (message.trim().length === 0) {
      Alert.alert('Error', 'Please provide a description of your issue.');
      return;
    }

    setIsSubmitting(true);
    try {
      const reasonEnum = REASON_MAP[selectedReason] || 'other';

      await supportService.createSupportTicket({
        message: message.trim(),
        reason: reasonEnum,
        userProfileId: profile?.$id,
      });

      Alert.alert(
        'Thank You',
        'Your message has been sent. We will respond within 3-5 business days.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating support ticket:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to send your message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../../assets/gradient.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        
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
          {/* Title */}
          <Text style={styles.pageTitle}>How Can We Help You?</Text>

          {/* Select reason section */}
          <Text style={styles.sectionLabel}>Select reason:</Text>
          
          <View style={styles.radioList}>
            {REASONS.map((reason) => (
              <RadioButton
                key={reason}
                label={reason}
                checked={selectedReason === reason}
                onToggle={() => selectReason(reason)}
              />
            ))}
          </View>

          {/* Description */}
          <Text style={styles.description}>
            Please tell us about the issue you are having and we will respond within 3-5 business days.
          </Text>

          {/* Text Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Please give us as much detail about the problem you are experiencing."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              multiline
              maxLength={maxCharacters}
              value={message}
              onChangeText={setMessage}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>
              {message.length}/{maxCharacters}
            </Text>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[styles.sendButton, isSubmitting && styles.sendButtonDisabled]}
            onPress={handleSend}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
    fontSize: 28,
    fontWeight: '400',
    color: '#ffffff',
    marginBottom: 32,
    fontFamily: 'Cinzel_400Regular',
    letterSpacing: 0.5,
  },
  sectionLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 16,
    fontFamily: 'Roboto_400Regular',
  },
  radioList: {
    marginBottom: 24,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonChecked: {
    borderColor: '#8B5CF6',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B5CF6',
  },
  radioLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Roboto_400Regular',
  },
  description: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 24,
    fontFamily: 'Roboto_400Regular',
    lineHeight: 20,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Roboto_400Regular',
    minHeight: 160,
  },
  characterCount: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Roboto_400Regular',
  },
  sendButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Roboto_600SemiBold',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontFamily: 'Roboto_500Medium',
  },
});

export default HelpSupport;

