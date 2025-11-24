import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import ChevronLeftIcon from '../../assets/icons/chevron-left';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { usePrivacyPolicy } from '../../hooks/usePrivacyPolicy';

export const PrivacyPolicy: React.FC = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { content, loading, error } = usePrivacyPolicy();

  return (
    <ImageBackground
      source={require('../../assets/gradient.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
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
          <Text style={styles.pageTitle}>Privacy Policy</Text>

          <View style={styles.contentContainer}>
            {loading && (
              <View style={styles.loadingContainer}>
                <LoadingSpinner size={40} color="#8B5CF6" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            )}

            {error && !loading && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {!loading && !error && content && (
              <RenderHTML
                contentWidth={width - 48}
                source={{ html: content }}
                baseStyle={styles.htmlContent}
                tagsStyles={{
                  p: styles.htmlParagraph,
                  h1: styles.htmlHeading1,
                  h2: styles.htmlHeading2,
                  h3: styles.htmlHeading3,
                  ul: styles.htmlList,
                  ol: styles.htmlList,
                  li: styles.htmlListItem,
                  strong: styles.htmlStrong,
                  em: styles.htmlEmphasis,
                }}
              />
            )}

            {!loading && !error && !content && (
              <Text style={styles.contentText}>
                We collect basic info like your name, email, and how you use the app. This helps us improve your experience and keep things running smoothly. We don't sell your data and only work with trusted services that help support the app.
              </Text>
            )}
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
  },
  errorContainer: {
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    lineHeight: 24,
    fontFamily: 'Roboto_400Regular',
  },
  htmlContent: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    fontFamily: 'Roboto_400Regular',
  },
  htmlParagraph: {
    marginBottom: 16,
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    fontFamily: 'Roboto_400Regular',
  },
  htmlHeading1: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    fontFamily: 'Roboto_600SemiBold',
  },
  htmlHeading2: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
    marginTop: 16,
    fontFamily: 'Roboto_600SemiBold',
  },
  htmlHeading3: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
    marginTop: 12,
    fontFamily: 'Roboto_600SemiBold',
  },
  htmlList: {
    marginBottom: 16,
  },
  htmlListItem: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 8,
    fontFamily: 'Roboto_400Regular',
  },
  htmlStrong: {
    fontWeight: '600',
    fontFamily: 'Roboto_600SemiBold',
  },
  htmlEmphasis: {
    fontStyle: 'italic',
  },
});

export default PrivacyPolicy;

