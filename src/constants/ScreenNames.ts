/**
 * Enum containing all screen names used in the navigation
 * This provides type safety and prevents typos when navigating between screens
 */
export enum ScreenNames {
  // Root Stack Screens
  WELCOME = 'Welcome',
  SIGN_IN = 'SignIn',
  SIGN_UP = 'SignUp',
  FORGOT_PASSWORD = 'ForgotPassword',
  CREATE_NEW_PASSWORD = 'CreateNewPassword',
  VERIFY_EMAIL = 'VerifyEmail',
  PERMISSION = 'Permission',
  PURPOSE = 'Purpose',
  NICKNAME = 'Nickname',
  INVITE = 'Invite',
  INVITE_SEND = 'InviteSend',
  SUBSCRIPTION = 'Subscription',
  HOME_TABS = 'HomeTabs',
  PROFILE = 'Profile',
  SETTINGS = 'Settings',
  NOT_FOUND = 'NotFound',
  
  // Tab Screens
  HOME = 'Home',
  FORTY_DAY = 'FortyDay',
  BOOKMARK = 'Bookmark',
  
  // Detail Screens
  TEMPTATION_DETAILS = 'TemptationDetails',
  TRANSCRIPT = 'Transcript',
  
  // Legal Screens
  PRIVACY_POLICY = 'PrivacyPolicy',
  TERMS_CONDITIONS = 'TermsConditions',
  
  // Support Screens
  HELP_SUPPORT = 'HelpSupport',
  
  // Invite Management
  MANAGE_INVITES = 'ManageInvites',
}
