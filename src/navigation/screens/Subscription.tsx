import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Canvas,
  Image as SkiaImage,
  useImage
} from '@shopify/react-native-skia';
import ArrowLeftIcon from '../../assets/icons/arrow-left';
import CheckmarkIcon from '../../assets/icons/checkmark';
import { Button } from '../../components/Button';
import { SecondaryButton } from '../../components/SecondaryButton';
import { ScreenNames } from '../../constants/ScreenNames';

type PlanType = 'monthly' | 'plan2';

export function Subscription() {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('monthly');
  const width = Dimensions.get('window').width;
  const bg = useImage(require('../../assets/gradient.png'));

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
  ) => {
    const planLabel = planType === 'monthly' ? 'Monthly' : 'Plan 2';
    
    return (
      <TouchableOpacity
        style={[styles.planCard]}
        onPress={() => setSelectedPlan(planType)}
      >
        <ImageBackground
          source={require('../../assets/card-bg.png')}
          style={styles.planHeader}
          imageStyle={styles.planHeaderImage}
        >
          <Text style={styles.planTitle}>{title}</Text>
        </ImageBackground>
        
        <View style={styles.planContent}>
          <View style={styles.benefitsContainer}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <CheckmarkIcon width={16} height={16} color="#8B5CF6" />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
          </View>
          
          <View style={styles.planFooter}>
            <View style={styles.planSelection}>
              <View style={[styles.radioButton]}>
                {isSelected && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.planLabel}>{planLabel}</Text>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{price}</Text>
              <Text style={styles.priceUnit}>per month</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.backgroundContainer}>
        <Canvas style={styles.backgroundCanvas}>
          <SkiaImage image={bg} x={0} y={0} width={width} height={300} fit="cover" />
        </Canvas>
      </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 0,
  },
  backgroundCanvas: {
    height: 300,
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
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
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 16,
    fontFamily: 'Cinzel_400Regular',
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
    backgroundColor: '#000000',
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  planHeader: {
    backgroundColor: '#8B5CF6',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  planHeaderImage: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    resizeMode: 'cover',
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  planTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Cinzel_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  planContent: {
    paddingHorizontal: 4,
    paddingVertical: 4, 
  },
  benefitsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
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
    marginTop: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
  },
  planSelection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#777777',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
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
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
  priceUnit: {
    fontSize: 12,
    color: '#CCCCCC',
    fontFamily: 'Roboto_400Regular',
    marginTop: 2,
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
