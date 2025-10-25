import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    ImageBackground,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import ArrowsIcon from '../../assets/icons/arrows';
import QuoteIcon from '../../assets/icons/quote';
import SmsIcon from '../../assets/icons/sms';
import VolumeIcon from '../../assets/icons/volume';
import { Button } from '../../components/Button';
import { SecondaryButton } from '../../components/SecondaryButton';
import { ScreenNames } from '../../constants/ScreenNames';

export function Invite() {
    const navigation = useNavigation();

    const handleNext = () => {
        // TODO: Handle invite logic
        console.log('Next - Invite friend');
        navigation.navigate(ScreenNames.INVITE_SEND);
    };

    const handleSkip = () => {
        // TODO: Handle skip logic
        console.log('Skip invite');
        navigation.navigate(ScreenNames.HOME_TABS);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <ImageBackground
                source={require('../../assets/splash-bg.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <SafeAreaView style={styles.safeArea}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <ArrowLeftIcon />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Nevermore</Text>
                        <View style={styles.headerSpacer} />
                    </View>

                    {/* Main Content */}
                    <View style={styles.content}>
                        <Text style={styles.title}>INVITE A FRIEND</Text>

                        <Text style={styles.description}>
                            Whether you're here for yourself or supporting someone else, you're in the right place.
                        </Text>

                        {/* How It Works Section */}
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

                        {/* Quote Section */}
                        <View style={styles.quoteSection}>
                            <QuoteIcon />
                            <Text style={styles.quoteText}>
                                "The opposite of addiction is not sobriety.{'\n'}
                                The opposite of addiction is connection."
                            </Text>
                            <Text style={styles.quoteAuthor}>- Johann Hari</Text>
                        </View>
                    </View>

                    {/* Buttons */}
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
            </ImageBackground>
        </View>
    );
}

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
});
