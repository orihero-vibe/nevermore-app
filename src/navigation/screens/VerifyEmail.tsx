import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import { Button } from '../../components/Button';
import { ScreenNames } from '../../constants/ScreenNames';

export function VerifyEmail() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get the source parameter to determine navigation path
  const source = route.params?.source || 'signup';

  const handleResendEmail = () => {
    // TODO: Implement resend email logic
    console.log('Resend email pressed');
    
    // Navigate based on source
    if (source === 'signup') {
      // From signup flow, go to onboarding
      navigation.navigate(ScreenNames.PERMISSION);
    } else if (source === 'forgot-password') {
      // From forgot password flow, go to create new password
      navigation.navigate(ScreenNames.CREATE_NEW_PASSWORD);
    } else {
      // Default to permission screen
      navigation.navigate(ScreenNames.PERMISSION);
    }
  };

  const handleDidntGetEmail = () => {
    // TODO: Implement didn't get email logic
    console.log("Didn't get email pressed");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ImageBackground
        source={require('../../assets/gradient.png')}
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
            <Text style={styles.title}>CHECK YOUR EMAIL</Text>
            
            <Text style={styles.instructionText}>
              A link to verify your email was sent to
            </Text>
            
            <Text style={styles.emailText}>Mary.Langston@email.com</Text>
            
            <Text style={styles.spamText}>
              (Please check your spam folder if the email has not arrived after a few minutes).
            </Text>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
              <TouchableOpacity onPress={handleDidntGetEmail}>
                <Text style={styles.didntGetEmailText}>Didn't get an email?</Text>
              </TouchableOpacity>
              
              <Button
                title="Resend Email"
                onPress={handleResendEmail}
                variant="primary"
                size="medium"
              />
            </View>
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
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 24,
    fontFamily: 'Cinzel_600SemiBold',
  },
  instructionText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
    fontFamily: 'Roboto_400Regular',
  },
  emailText: {
    fontSize: 16,
    color: '#8b5cf6',
    marginBottom: 16,
    fontFamily: 'Roboto_500Medium',
  },
  spamText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 40,
    fontFamily: 'Roboto_400Regular',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  didntGetEmailText: {
    fontSize: 16,
    color: '#8b5cf6',
    textAlign: 'right',
    marginBottom: 24,
    fontFamily: 'Roboto_500Medium',
  },
});
