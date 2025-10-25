import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import PlusIcon from '../../assets/icons/plus';
import { Button } from '../../components/Button';
import { SecondaryButton } from '../../components/SecondaryButton';
import { Input } from '../../components/Input';
import { ScreenNames } from '../../constants/ScreenNames';

export function InviteSend() {
  const navigation = useNavigation();
  const [emails, setEmails] = useState<string[]>(['', '']);

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addAnotherEmail = () => {
    if (emails.length < 3) {
      setEmails([...emails, '']);
    }
  };

  const removeEmail = (index: number) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const handleNext = () => {
    const validEmails = emails.filter(email => email.trim() !== '');
    if (validEmails.length > 0) {
      // TODO: Send invitations
      console.log('Sending invitations to:', validEmails);
      navigation.navigate(ScreenNames.SUBSCRIPTION);
    }
  };

  const handleSkip = () => {
    // TODO: Handle skip logic
    console.log('Skip sending invitations');
    navigation.navigate(ScreenNames.SUBSCRIPTION);
  };

  const isNextEnabled = emails.some(email => email.trim() !== '');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ImageBackground
        source={require('../../assets/splash-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeftIcon />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Nevermore</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <Text style={styles.title}>
              INVITE UP TO THREE (3) FRIENDS OR LOVED ONES TO JOIN YOU ON YOUR JOURNEY.
            </Text>
            
            <View style={styles.emailSection}>
              {emails.map((email, index) => (
                <View key={index} style={styles.emailInputContainer}>
                  <View style={styles.inputRow}>
                    <View style={styles.inputWrapper}>
                      <Input
                        label="Email"
                        placeholder="example@email.com"
                        value={email}
                        onChangeText={(value) => handleEmailChange(index, value)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                    {emails.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeEmail(index)}
                        style={styles.removeButton}
                      >
                        <Text style={styles.removeButtonText}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}

              {emails.length < 3 && (
                <TouchableOpacity
                  onPress={addAnotherEmail}
                  style={styles.addAnotherContainer}
                >
                  <PlusIcon width={20} height={20} color="#8B5CF6" />
                  <Text style={styles.addAnotherText}>Add another</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Next"
              onPress={handleNext}
              variant="primary"
              size="medium"
              disabled={!isNextEnabled}
              style={styles.nextButton}
            />
            <SecondaryButton
              title="Skip"
              onPress={handleSkip}
              size="medium"
              style={styles.skipButton}
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'Cinzel_600SemiBold',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 32,
    fontFamily: 'Cinzel_600SemiBold',
    textAlign: 'left',
    lineHeight: 24,
  },
  emailSection: {
    flex: 1,
  },
  emailInputContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputWrapper: {
    flex: 1,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Roboto_500Medium',
  },
  addAnotherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addAnotherText: {
    fontSize: 16,
    color: '#8B5CF6',
    marginLeft: 8,
    fontFamily: 'Roboto_500Medium',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  nextButton: {
    marginBottom: 12,
  },
  skipButton: {
    alignItems: 'center',
  },
});
