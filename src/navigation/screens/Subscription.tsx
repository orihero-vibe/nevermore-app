import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import CheckmarkIcon from '../../assets/icons/checkmark';
import { Button } from '../../components/Button';
import { SecondaryButton } from '../../components/SecondaryButton';
import { ScreenNames } from '../../constants/ScreenNames';

type PlanType = 'monthly' | 'plan2';

export function Subscription() {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('monthly');

  const handleSubscribe = () => {
    // TODO: Handle subscription logic
    console.log('Subscribing to plan:', selectedPlan);
    navigation.navigate(ScreenNames.HOME_TABS);
  };

  const handleSkip = () => {
    // TODO: Handle skip logic
    console.log('Skip subscription');
    navigation.navigate(ScreenNames.HOME_TABS);
  };

  const benefits = [
    'Benefits',
    'Benefits',
    'Benefits',
    'Benefits',
  ];

  const renderPlanCard = (
    planType: PlanType,
    title: string,
    price: string,
    isSelected: boolean
  ) => (
    <TouchableOpacity
      style={[styles.planCard, isSelected && styles.selectedPlanCard]}
      onPress={() => setSelectedPlan(planType)}
    >
      <View style={styles.planHeader}>
        <Text style={styles.planTitle}>{title}</Text>
      </View>
      
      <View style={styles.planContent}>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitRow}>
            <CheckmarkIcon width={16} height={16} color="#8B5CF6" />
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
        
        <View style={styles.planFooter}>
          <View style={styles.planSelection}>
            <View style={[styles.radioButton, isSelected && styles.selectedRadioButton]}>
              {isSelected && <View style={styles.radioButtonInner} />}
            </View>
            <Text style={styles.planLabel}>Monthly</Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{price}</Text>
            <Text style={styles.priceUnit}>per month</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>SUBSCRIPTION</Text>
            
            <Text style={styles.description}>
              Try out our Monthly Plan for 30 days free. Cancel anytime.
            </Text>

            {/* Subscription Plans */}
            <View style={styles.plansContainer}>
              {renderPlanCard('monthly', 'MONTHLY', '$3.99', selectedPlan === 'monthly')}
              {renderPlanCard('plan2', 'PLAN 2', '$4.99', selectedPlan === 'plan2')}
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Subscribe"
              onPress={handleSubscribe}
              variant="primary"
              size="medium"
              style={styles.subscribeButton}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
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
    marginBottom: 32,
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
  },
  plansContainer: {
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  selectedPlanCard: {
    borderColor: '#8B5CF6',
  },
  planHeader: {
    backgroundColor: '#8B5CF6',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  planTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Cinzel_600SemiBold',
    textAlign: 'center',
  },
  planContent: {
    padding: 16,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
    fontFamily: 'Roboto_400Regular',
  },
  planFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  planSelection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666666',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRadioButton: {
    borderColor: '#8B5CF6',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8B5CF6',
  },
  planLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Roboto_500Medium',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    color: '#ffffff',
    fontFamily: 'Cinzel_600SemiBold',
  },
  priceUnit: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'Roboto_400Regular',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  subscribeButton: {
    marginBottom: 12,
  },
  skipButton: {
    alignItems: 'center',
  },
});
