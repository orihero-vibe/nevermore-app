import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HeaderButton, Text } from '@react-navigation/elements';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import bell from '../assets/bell.png';
import newspaper from '../assets/newspaper.png';
import { ScreenNames } from '../constants/ScreenNames';
import { Home } from './screens/Home';
import { Welcome } from './screens/Welcome';
import { SignIn } from './screens/SignIn';
import { SignUp } from './screens/SignUp';
import { ForgotPassword } from './screens/ForgotPassword';
import { CreateNewPassword } from './screens/CreateNewPassword';
import { VerifyEmail } from './screens/VerifyEmail';
import { Permission } from './screens/Permission';
import { Purpose } from './screens/Purpose';
import { Nickname } from './screens/Nickname';
import { Invite } from './screens/Invite';
import { InviteSend } from './screens/InviteSend';
import { Subscription } from './screens/Subscription';

const HomeTabs = createBottomTabNavigator({
  screens: {
    [ScreenNames.HOME]: {
      screen: Home,
      options: {
        title: 'Feed',
        tabBarIcon: ({ color, size }) => (
          <Image
            source={newspaper}
            tintColor={color}
            style={{
              width: size,
              height: size,
            }}
          />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  initialRouteName: ScreenNames.WELCOME,
  screens: {
    [ScreenNames.WELCOME]: {
      screen: Welcome,
      options: {
        title: 'Welcome',
        headerShown: false,
      },
    },
    [ScreenNames.SIGN_IN]: {
      screen: SignIn,
      options: {
        title: 'Sign In',
        headerShown: false,
      },
    },
    [ScreenNames.SIGN_UP]: {
      screen: SignUp,
      options: {
        title: 'Sign Up',
        headerShown: false,
      },
    },
    [ScreenNames.FORGOT_PASSWORD]: {
      screen: ForgotPassword,
      options: {
        title: 'Forgot Password',
        headerShown: false,
      },
    },
    [ScreenNames.CREATE_NEW_PASSWORD]: {
      screen: CreateNewPassword,
      options: {
        title: 'Create New Password',
        headerShown: false,
      },
    },
    [ScreenNames.VERIFY_EMAIL]: {
      screen: VerifyEmail,
      options: {
        title: 'Verify Email',
        headerShown: false,
      },
    },
    [ScreenNames.PERMISSION]: {
      screen: Permission,
      options: {
        title: 'Permission',
        headerShown: false,
      },
    },
    [ScreenNames.PURPOSE]: {
      screen: Purpose,
      options: {
        title: 'Purpose',
        headerShown: false,
      },
    },
    [ScreenNames.NICKNAME]: {
      screen: Nickname,
      options: {
        title: 'Nickname',
        headerShown: false,
      },
    },
    [ScreenNames.INVITE]: {
      screen: Invite,
      options: {
        title: 'Invite',
        headerShown: false,
      },
    },
    [ScreenNames.INVITE_SEND]: {
      screen: InviteSend,
      options: {
        title: 'Invite Send',
        headerShown: false,
      },
    },
    [ScreenNames.SUBSCRIPTION]: {
      screen: Subscription,
      options: {
        title: 'Subscription',
        headerShown: false,
      },
    },
    [ScreenNames.HOME_TABS]: {
      screen: HomeTabs,
      options: {
        title: 'Home',
        headerShown: false,
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}
