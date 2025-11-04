import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import { MediaControls } from '../../components/MediaControls';

type RootStackParamList = {
  Transcript: {
    title: string;
    transcript: string;
  };
};

type TranscriptRouteProp = RouteProp<RootStackParamList, 'Transcript'>;
type TranscriptNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Transcript'>;

export default function Transcript() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<TranscriptNavigationProp>();
  const route = useRoute<TranscriptRouteProp>();
  const { title, transcript } = route.params;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transcript</Text>
        <View />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{transcript}</Text>

        <MediaControls
          isPlaying={false}
          currentTime={'00:00'}
          totalTime={'03:00'}
          onPlayPause={() => {}}
          onRewind={() => {}}
          onForward={() => {}}
          onStop={() => {}}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Roboto_400Regular',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Cinzel_400Regular',
    fontSize: 24,
    marginBottom: 12,
  },
  body: {
    color: '#FFFFFF',
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
});



