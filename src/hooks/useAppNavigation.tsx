import { useNavigation as useRNNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenNames } from '../constants/ScreenNames';

export type RootStackParamList = {
  [ScreenNames.WELCOME]: undefined;
  [ScreenNames.SIGN_IN]: undefined;
  [ScreenNames.SIGN_UP]: undefined;
  [ScreenNames.FORGOT_PASSWORD]: undefined;
  [ScreenNames.CREATE_NEW_PASSWORD]: {
    userId?: string;
    secret?: string;
  };
  [ScreenNames.MAGIC_URL_VERIFY]: {
    userId?: string;
    secret?: string;
  };
  [ScreenNames.PERMISSION]: undefined;
  [ScreenNames.PURPOSE]: undefined;
  [ScreenNames.NICKNAME]: undefined;
  [ScreenNames.INVITE]: {
    token?: string;
    userId?: string;
    secret?: string;
    expire?: string;
    project?: string;
  } | undefined;
  [ScreenNames.INVITE_SEND]: undefined;
  [ScreenNames.SUBSCRIPTION]: undefined;
  [ScreenNames.HOME_TABS]: undefined;
  [ScreenNames.HOME]: undefined;
  [ScreenNames.FORTY_DAY]: undefined;
  [ScreenNames.BOOKMARK]: undefined;
  [ScreenNames.TEMPTATION_DETAILS]: {
    contentId: string;
    temptationTitle: string;
    categoryId?: string;
    date?: string;
    audioUrl?: string;
  };
  [ScreenNames.TRANSCRIPT]: { 
    title: string;
    transcript: string;
  };
  [ScreenNames.PROFILE]: undefined;
  [ScreenNames.MANAGE_INVITES]: undefined;
  [ScreenNames.PRIVACY_POLICY]: undefined;
  [ScreenNames.TERMS_CONDITIONS]: undefined;
  [ScreenNames.HELP_SUPPORT]: {
    preSelectedReason?: string;
  } | undefined;
  [ScreenNames.SETTINGS]: undefined;
  [ScreenNames.NOT_FOUND]: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useAppNavigation = () => {
  const navigation = useRNNavigation<NavigationProp>();

  return {
    goBack: () => navigation.goBack(),
    canGoBack: () => navigation.canGoBack(),
    navigate: navigation.navigate,
    navigateToWelcome: () => navigation.navigate(ScreenNames.WELCOME),
    navigateToSignIn: () => navigation.navigate(ScreenNames.SIGN_IN),
    navigateToSignUp: () => navigation.navigate(ScreenNames.SIGN_UP),
    navigateToForgotPassword: () => navigation.navigate(ScreenNames.FORGOT_PASSWORD),
    navigateToCreateNewPassword: () => navigation.navigate(ScreenNames.CREATE_NEW_PASSWORD),
    navigateToPermission: () => navigation.navigate(ScreenNames.PERMISSION),
    navigateToPurpose: () => navigation.navigate(ScreenNames.PURPOSE),
    navigateToNickname: () => navigation.navigate(ScreenNames.NICKNAME),
    navigateToInvite: () => navigation.navigate(ScreenNames.INVITE),
    navigateToInviteSend: () => navigation.navigate(ScreenNames.INVITE_SEND),
    navigateToSubscription: () => navigation.navigate(ScreenNames.SUBSCRIPTION),
    navigateToHome: () => navigation.navigate(ScreenNames.HOME_TABS),
    navigateToHomeTabs: () => navigation.navigate(ScreenNames.HOME_TABS),
    navigateToFortyDay: () => navigation.navigate(ScreenNames.FORTY_DAY),
    navigateToBookmark: () => navigation.navigate(ScreenNames.BOOKMARK),
    navigateToTemptationDetails: (params: {
      contentId: string;
      temptationTitle: string;
      categoryId?: string;
      date?: string;
      audioUrl?: string;
    }) => navigation.navigate(ScreenNames.TEMPTATION_DETAILS, params),
    navigateToTranscript: (params: { title: string; transcript: string }) => 
      navigation.navigate(ScreenNames.TRANSCRIPT, params),
    navigateToProfile: () => navigation.navigate(ScreenNames.PROFILE),
    navigateToManageInvites: () => navigation.navigate(ScreenNames.MANAGE_INVITES),
    navigateToPrivacyPolicy: () => navigation.navigate(ScreenNames.PRIVACY_POLICY),
    navigateToTermsConditions: () => navigation.navigate(ScreenNames.TERMS_CONDITIONS),
    navigateToHelpSupport: (params?: { preSelectedReason?: string }) => 
      navigation.navigate(ScreenNames.HELP_SUPPORT, params),
    raw: navigation,
  };
};