import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CheckIcon from '../../assets/icons/check';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { Button } from '../../components/Button';
import { ScreenNames } from '../../constants/ScreenNames';

interface PasswordRequirements {
  capital: boolean;
  numerical: boolean;
  special: boolean;
  match: boolean;
}

export function SignUp() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('Mary.Langston@email.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('Qwerty1234!');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [agreeToTerms, setAgreeToTerms] = useState(true);

  const checkPasswordRequirements = (): PasswordRequirements => {
    const hasCapital = /[A-Z]/.test(password);
    const hasNumerical = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const passwordsMatch = password === confirmPassword && password.length > 0;

    return {
      capital: hasCapital,
      numerical: hasNumerical,
      special: hasSpecial,
      match: passwordsMatch,
    };
  };

  const requirements = checkPasswordRequirements();

  const handleSignUp = () => {
    if (requirements.capital && requirements.numerical && requirements.special && requirements.match && agreeToTerms) {
      // TODO: Implement sign up logic
      // Navigate to email verification screen with signup source
      navigation.navigate(ScreenNames.VERIFY_EMAIL as any, { source: 'signup' });
    }
  };

  const handleSignIn = () => {
    navigation.navigate(ScreenNames.SIGN_IN);
  };

  const handleTermsPress = () => {
    navigation.navigate(ScreenNames.TERMS_CONDITIONS);
  };

  const handlePrivacyPress = () => {
    navigation.navigate(ScreenNames.PRIVACY_POLICY);
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
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
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
                <Text style={styles.title}>CREATE YOUR ACCOUNT</Text>
                <Text style={styles.subtitle}>Enter your information below</Text>

                {/* Email Field */}
                <Input
                  label="Email"
                  placeholder="Enter Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* Password Field */}
                <PasswordInput
                  label="Password"
                  placeholder="Enter password"
                  value={password}
                  onChangeText={setPassword}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* Re-enter Password Field */}
                <PasswordInput
                  label="Re-enter Password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  showPassword={showConfirmPassword}
                  onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {/* Password Requirements */}
                <View style={styles.requirementsContainer}>
                  <View style={styles.requirementItem}>
                    {requirements.capital ? <CheckIcon stroke="#8b5cf6" /> : <CheckIcon stroke="#666" />}
                    <Text style={[styles.requirementText, requirements.capital && styles.requirementTextChecked]}>
                      At least 1 capital letter
                    </Text>
                  </View>

                  <View style={styles.requirementItem}>
                    {requirements.numerical ? <CheckIcon stroke="#8b5cf6" /> : <CheckIcon stroke="#666" />}
                    <Text style={[styles.requirementText, requirements.numerical && styles.requirementTextChecked]}>
                      At least 1 numerical value
                    </Text>
                  </View>

                  <View style={styles.requirementItem}>
                    {requirements.special ? <CheckIcon stroke="#8b5cf6" /> : <CheckIcon stroke="#666" />}
                    <Text style={[styles.requirementText, requirements.special && styles.requirementTextChecked]}>
                      At least 1 special character
                    </Text>
                  </View>

                  <View style={styles.requirementItem}>
                    {requirements.match ? <CheckIcon stroke="#8b5cf6" /> : <CheckIcon stroke="#666" />}
                    <Text style={[styles.requirementText, requirements.match && styles.requirementTextChecked]}>
                      Passwords match
                    </Text>
                  </View>
                </View>

                {/* Terms and Conditions */}
                <TouchableOpacity
                  style={styles.termsContainer}
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                >
                  <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                    {agreeToTerms && (
                      <CheckIcon />
                    )}
                  </View>
                  <View style={styles.termsTextContainer}>
                    <Text style={styles.termsText}>
                      I agree to the{' '}
                      <Text style={styles.termsLink} onPress={handleTermsPress}>
                        Terms & Conditions
                      </Text>
                      {' '}and{' '}
                      <Text style={styles.termsLink} onPress={handlePrivacyPress}>
                        Privacy Policy
                      </Text>
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Create Account Button */}
                <Button
                  title="Create Account"
                  onPress={handleSignUp}
                  variant="primary"
                  size="medium"
                  disabled={!requirements.capital || !requirements.numerical || !requirements.special || !requirements.match || !agreeToTerms}
                  style={styles.createAccountButton}
                />

                {/* Sign In Link */}
                <View style={styles.signInContainer}>
                  <Text style={styles.signInText}>Already have an account? </Text>
                  <TouchableOpacity onPress={handleSignIn}>
                    <Text style={styles.signInLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    marginBottom: 8,
    fontFamily: 'Cinzel_600SemiBold',
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 32,
    fontFamily: 'Roboto_400Regular',
  },
  requirementsContainer: {
    marginBottom: 24,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
    fontFamily: 'Roboto_400Regular',
  },
  requirementTextChecked: {
    color: '#8b5cf6',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: '#8b5cf6',
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
    fontFamily: 'Roboto_400Regular',
  },
  termsLink: {
    color: '#8b5cf6',
    fontFamily: 'Roboto_500Medium',
  },
  createAccountButton: {
    marginBottom: 24,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Roboto_400Regular',
  },
  signInLink: {
    fontSize: 16,
    color: '#8b5cf6',
    fontFamily: 'Roboto_500Medium',
  },
});
