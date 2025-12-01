import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import {
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Linking,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Canvas,
    Image as SkiaImage,
    useImage
} from '@shopify/react-native-skia';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import ArrowsIcon from '../../assets/icons/arrows';
import QuoteIcon from '../../assets/icons/quote';
import SmsIcon from '../../assets/icons/sms';
import VolumeIcon from '../../assets/icons/volume';
import { Button } from '../../components/Button';
import { SecondaryButton } from '../../components/SecondaryButton';
import { ScreenNames } from '../../constants/ScreenNames';
import { invitationService } from '../../services/invitation.service';
import { account } from '../../services/appwrite.config';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { showAppwriteError, showSuccessNotification } from '../../services/notifications';
import { useAppNavigation } from '../../hooks/useAppNavigation';

type RootStackParamList = {
  [ScreenNames.INVITE]: {
    token?: string;
    userId?: string;
    secret?: string;
    expire?: string;
    project?: string;
  } | undefined;
  [ScreenNames.INVITE_SEND]: undefined;
  [ScreenNames.HOME_TABS]: undefined;
  [ScreenNames.SIGN_UP]: undefined;
};

type InviteRouteProp = RouteProp<RootStackParamList, ScreenNames.INVITE>;
type InviteNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function Invite() {
    const navigation = useNavigation<InviteNavigationProp>();
    const route = useRoute<InviteRouteProp>();
    const { navigateToInviteSend, navigateToHomeTabs, navigateToSignUp } = useAppNavigation();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessingInvitation, setIsProcessingInvitation] = useState(false);
    
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const bg = useImage(require('../../assets/gradient.png'));

    const token = route.params?.token;
    const userId = route.params?.userId;
    const secret = route.params?.secret;
    const isFromDeepLink = !!(token || userId || secret);

    useEffect(() => {
        if (isFromDeepLink && token) {
            handleInvitationAcceptance();
        }
    }, [isFromDeepLink, token]);

    const handleInvitationAcceptance = async () => {
        if (!token) {
            Alert.alert('Error', 'Invalid invitation link. Missing invitation token.');
            return;
        }

        setIsProcessingInvitation(true);

        try {
            const invitation = await invitationService.getInvitationByToken(token);
            
            if (!invitation) {
                Alert.alert(
                    'Invalid Invitation',
                    'This invitation link is invalid or has expired. Please request a new invitation.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigateToHomeTabs(),
                        },
                    ]
                );
                return;
            }

            if (invitation.status !== 'pending') {
                Alert.alert(
                    'Invitation Already Used',
                    `This invitation has already been ${invitation.status}.`,
                    [
                        {
                            text: 'OK',
                            onPress: () => navigateToHomeTabs(),
                        },
                    ]
                );
                return;
            }

            if (userId && secret) {
                try {
                    await account.createSession({
                        userId,
                        secret,
                    });
                    await invitationService.acceptInvitation(token);
                    
                    showSuccessNotification(
                        'Invitation accepted! Welcome to Nevermore.',
                        'Success'
                    );
                    
                    navigateToHomeTabs();
                } catch (sessionError: any) {
                    try {
                        await invitationService.acceptInvitation(token);
                    } catch (acceptError) {
                    }
                    
                    Alert.alert(
                        'Welcome!',
                        'Please create an account to continue.',
                        [
                            {
                                text: 'OK',
                                onPress: () => navigateToSignUp(),
                            },
                        ]
                    );
                }
            } else {
                Alert.alert(
                    'Welcome!',
                    'Please create an account to continue.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigateToSignUp(),
                        },
                    ]
                );
            }
        } catch (error: unknown) {
            showAppwriteError(error, {
                title: 'Failed to Process Invitation',
                skipUnauthorized: true,
            });
        } finally {
            setIsProcessingInvitation(false);
        }
    };

    const handleNext = () => {
        navigateToInviteSend();
    };

    const handleSkip = () => {
        navigateToHomeTabs();
    };

    if (isProcessingInvitation) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#000000" />
                <Canvas style={styles.canvas}>
                    <SkiaImage image={bg} x={0} y={0} width={width} height={height} fit="cover" />
                </Canvas>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.loadingContainer}>
                        <LoadingSpinner />
                        <Text style={styles.loadingText}>Processing invitation...</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <Canvas style={styles.canvas}>
                <SkiaImage image={bg} x={0} y={0} width={width} height={height} fit="cover" />
            </Canvas>
            <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <ArrowLeftIcon />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Nevermore</Text>
                        <View style={styles.headerSpacer} />
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.title}>INVITE A FRIEND</Text>

                        <Text style={styles.description}>
                            Whether you're here for yourself or supporting someone else, you're in the right place.
                        </Text>

                        <View style={styles.howItWorksSection}>
                            <Text style={styles.sectionTitle}>HOW IT WORKS</Text>

                            <View style={styles.stepContainer}>
                                    <SmsIcon />
                                <Text style={styles.stepText}>Send a personal invite link via email</Text>
                            </View>

                            <View style={styles.stepContainer}>
                                <ArrowsIcon />
                                <Text style={styles.stepText}>Let them choose their role—support or recovery</Text>
                            </View>

                            <View style={styles.stepContainer}>
                                <VolumeIcon />
                                <Text style={styles.stepText}>Stay connected through shared audio experiences</Text>
                            </View>
                        </View>

                        <View style={styles.quoteSection}>
                            <QuoteIcon />
                            <Text style={styles.quoteText}>
                                "The opposite of addiction is not sobriety.{'\n'}
                                The opposite of addiction is connection."
                            </Text>
                            <Text style={styles.quoteAuthor}>- Johann Hari</Text>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Next"
                            onPress={handleNext}
                            variant="primary"
                            size="medium"
                            style={styles.nextButton}
                        />
                        <SecondaryButton
                            title="Skip"
                            onPress={handleSkip}
                            size="medium"
                            style={styles.skipButton}
                        />
                    </View>
                </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    safeArea: {
        flex: 1,
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
        marginBottom: 16,
        fontFamily: 'Cinzel_600SemiBold',
        textAlign: 'left',
    },
    description: {
        fontSize: 16,
        color: '#ffffff',
        marginBottom: 40,
        fontFamily: 'Roboto_400Regular',
        lineHeight: 24,
    },
    howItWorksSection: {
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        color: '#ffffff',
        marginBottom: 24,
        fontFamily: 'Cinzel_600SemiBold',
        textAlign: 'left',
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    stepIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2d1b4e',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: '#ffffff',
        fontFamily: 'Roboto_400Regular',
        lineHeight: 22,
        marginLeft: 16,
    },
    quoteSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    quoteIcon: {
        marginBottom: 16,
    },
    quoteText: {
        fontSize: 18,
        color: '#ffffff',
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 12,
    },
    quoteAuthor: {
        fontSize: 14,
        color: '#8B5CF6',
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    nextButton: {
        marginBottom: 12,
    },
    skipButton: {
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#ffffff',
        fontFamily: 'Roboto_400Regular',
    },
});
