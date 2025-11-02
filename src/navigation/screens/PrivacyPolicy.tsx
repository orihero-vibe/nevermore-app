import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChevronLeftIcon from '../../assets/icons/chevron-left';
import { SafeAreaView } from 'react-native-safe-area-context';

export const PrivacyPolicy: React.FC = () => {
  const navigation = useNavigation();

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
          {/* Page Title */}
          <Text style={styles.pageTitle}>Privacy Policy</Text>

          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>
              We collect basic info like your name, email, and how you use the app. This helps us improve your experience and keep things running smoothly. We don't sell your data and only work with trusted services that help support the app.
            </Text>

            <Text style={[styles.contentText, styles.contentTextSpacing]}>
              You can ask to see or delete your info anytime by emailing [your contact email]. We do our best to protect your data, but no system is perfect. This policy may change over time, and we'll let you know if anything major happens.
            </Text>
          </View>
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
    fontFamily: 'Cinzel_400Regular',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  contentContainer: {
    flex: 1,
  },
  contentText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    fontFamily: 'Roboto_400Regular',
  },
  contentTextSpacing: {
    marginTop: 20,
  },
});

export default PrivacyPolicy;

