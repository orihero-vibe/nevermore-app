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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChevronLeftIcon from '../../assets/icons/chevron-left';
import { SafeAreaView } from 'react-native-safe-area-context';
import CheckIcon from '../../assets/icons/check';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onToggle }) => {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && (
          <CheckIcon color="#ffffff" />
        )}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

export const HelpSupport: React.FC = () => {
  const navigation = useNavigation();
  const [selectedReasons, setSelectedReasons] = useState<string[]>(['Feedback']);
  const [message, setMessage] = useState('');
  const maxCharacters = 1000;

  const reasons = [
    'Technical Issue/Bug',
    'Feedback',
    'Feature Request',
    'Inappropriate Content',
    'Other',
  ];

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) => {
      if (prev.includes(reason)) {
        return prev.filter((r) => r !== reason);
      } else {
        return [...prev, reason];
      }
    });
  };

  const handleSend = () => {
    if (selectedReasons.length === 0) {
      Alert.alert('Error', 'Please select at least one reason.');
      return;
    }

    if (message.trim().length === 0) {
      Alert.alert('Error', 'Please provide a description of your issue.');
      return;
    }

    // Handle sending the support request
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

          {/* Select reason(s) section */}
          <Text style={styles.sectionLabel}>Select reason(s):</Text>
          
          <View style={styles.checkboxList}>
            {reasons.map((reason) => (
              <Checkbox
                key={reason}
                label={reason}
                checked={selectedReasons.includes(reason)}
                onToggle={() => toggleReason(reason)}
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
            style={styles.sendButton}
            onPress={handleSend}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>Send</Text>
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
  checkboxList: {
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
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

