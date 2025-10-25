import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';
import { ScreenNames } from '../../constants/ScreenNames';

export function Home() {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Text>Open up 'src/App.tsx' to start working on your app!</Text>
      <Button screen={ScreenNames.PROFILE} params={{ user: 'jane' }}>
        Go to Profile
      </Button>
      <Button screen={ScreenNames.SETTINGS}>Go to Settings</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
