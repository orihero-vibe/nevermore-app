import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { Button } from '../../components/Button';
import { ScreenNames } from '../../constants/ScreenNames';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import CheckIcon from '../../assets/icons/check';

export const CreateNewPassword: React.FC = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('Qwerty1234!');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Password validation
  const hasCapitalLetter = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleCreateAccount = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to main app or success screen
      navigation.navigate(ScreenNames.HOME_TABS);
    }, 1000);
  };

  const handleBack = () => {
    navigation.goBack();
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
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <ArrowLeftIcon width={24} height={24} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Nevermore</Text>
              <View style={styles.headerSpacer} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
              <Text style={styles.title}>CREATE NEW PASSWORD</Text>

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
                containerStyle={passwordsMatch ? styles.passwordMatchContainer : undefined}
              />

              {/* Password Requirements */}
              <View style={styles.requirementsContainer}>
                <View style={styles.requirementItem}>
                  <View style={[styles.checkIcon, hasCapitalLetter && styles.checkIconActive]}>
                    {hasCapitalLetter && <CheckIcon width={12} height={12} color="#ffffff" />}
                  </View>
                  <Text style={styles.requirementText}>At least 1 capital letter</Text>
                </View>

                <View style={styles.requirementItem}>
                  <View style={[styles.checkIcon, hasNumber && styles.checkIconActive]}>
                    {hasNumber && <CheckIcon width={12} height={12} color="#ffffff" />}
                  </View>
                  <Text style={styles.requirementText}>At least 1 numerical value</Text>
                </View>

                <View style={styles.requirementItem}>
                  <View style={[styles.checkIcon, hasSpecialChar && styles.checkIconActive]}>
                    {hasSpecialChar && <CheckIcon width={12} height={12} color="#ffffff" />}
                  </View>
                  <Text style={styles.requirementText}>At least 1 special character</Text>
                </View>

                <View style={styles.requirementItem}>
                  <View style={[styles.checkIcon, passwordsMatch && styles.checkIconActive]}>
                    {passwordsMatch && <CheckIcon width={12} height={12} color="#ffffff" />}
                  </View>
                  <Text style={styles.requirementText}>Passwords match</Text>
                </View>
              </View>

              {/* Create Account Button */}
              <Button
                title="Create Account"
                onPress={handleCreateAccount}
                loading={isLoading}
                disabled={!hasCapitalLetter || !hasNumber || !hasSpecialChar || !passwordsMatch}
                style={styles.createButton}
                size="large"
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Roboto_500Medium',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'Roboto_700Bold',
    letterSpacing: 0.5,
  },
  passwordMatchContainer: {
    borderColor: '#8b5cf6',
  },
  requirementsContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#666666',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkIconActive: {
    // backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  requirementText: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'Roboto_400Regular',
  },
  createButton: {
    marginTop: 'auto',
    marginBottom: 40,
  },
});
