import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform } from 'react-native';
import { ScreenNames } from '../constants/ScreenNames';
import { FortyDay } from './screens/FortyDay';
import { Bookmark } from './screens/Bookmark';
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
import TemptationDetails from './screens/TemptationDetails';
import HomeIcon from '../assets/icons/home';
import CalendarIcon from '../assets/icons/calendar';
import BookmarkIcon from '../assets/icons/bookmark';

import Home from './screens/Home';

const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        animation: 'shift',
        tabBarStyle: {
          backgroundColor: '#131313',
          borderTopColor: 'transparent',
          height: 100,
          paddingBottom: 12,
          paddingTop: 12,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
          fontFamily: 'Roboto',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarAnimationEnabled: true,
      }}
    >
      <Tab.Screen
        name={ScreenNames.HOME}
        component={Home}
        options={{
          title: 'Temptations',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} width={size} height={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ScreenNames.FORTY_DAY}
        component={FortyDay}
        options={{
          title: '40 Day',
          tabBarIcon: ({ color, size }) => (
            <CalendarIcon color={color} width={size} height={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ScreenNames.BOOKMARK}
        component={Bookmark}
        options={{
          title: 'Bookmark',
          tabBarIcon: ({ color, size }) => (
            <BookmarkIcon color={color} width={size} height={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName={ScreenNames.WELCOME}
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'slide_from_right' : 'slide_from_right',
        animationDuration: 300,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen
        name={ScreenNames.WELCOME}
        component={Welcome}
        options={{
          title: 'Welcome',
        }}
      />
      <Stack.Screen
        name={ScreenNames.SIGN_IN}
        component={SignIn}
        options={{
          title: 'Sign In',
        }}
      />
      <Stack.Screen
        name={ScreenNames.SIGN_UP}
        component={SignUp}
        options={{
          title: 'Sign Up',
        }}
      />
      <Stack.Screen
        name={ScreenNames.FORGOT_PASSWORD}
        component={ForgotPassword}
        options={{
          title: 'Forgot Password',
        }}
      />
      <Stack.Screen
        name={ScreenNames.CREATE_NEW_PASSWORD}
        component={CreateNewPassword}
        options={{
          title: 'Create New Password',
        }}
      />
      <Stack.Screen
        name={ScreenNames.VERIFY_EMAIL}
        component={VerifyEmail}
        options={{
          title: 'Verify Email',
        }}
      />
      <Stack.Screen
        name={ScreenNames.PERMISSION}
        component={Permission}
        options={{
          title: 'Permission',
        }}
      />
      <Stack.Screen
        name={ScreenNames.PURPOSE}
        component={Purpose}
        options={{
          title: 'Purpose',
        }}
      />
      <Stack.Screen
        name={ScreenNames.NICKNAME}
        component={Nickname}
        options={{
          title: 'Nickname',
        }}
      />
      <Stack.Screen
        name={ScreenNames.INVITE}
        component={Invite}
        options={{
          title: 'Invite',
        }}
      />
      <Stack.Screen
        name={ScreenNames.INVITE_SEND}
        component={InviteSend}
        options={{
          title: 'Invite Send',
        }}
      />
      <Stack.Screen
        name={ScreenNames.SUBSCRIPTION}
        component={Subscription}
        options={{
          title: 'Subscription',
        }}
      />
      <Stack.Screen
        name={ScreenNames.HOME_TABS}
        component={HomeTabs}
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name={ScreenNames.TEMPTATION_DETAILS}
        component={TemptationDetails}
        options={{
          title: 'Temptation Details',
          animation: 'slide_from_bottom',
          animationDuration: 400,
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      />
    </Stack.Navigator>
  );
}

RootStack.displayName = 'RootStack';

export function Navigation() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}

Navigation.displayName = 'Navigation';
