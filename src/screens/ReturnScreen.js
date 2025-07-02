import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ImageBackground, 
  Dimensions, 
  StatusBar,
  Animated,
  Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, themeColors } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const ReturnScreen = ({ navigation }) => {
  const [countdown, setCountdown] = useState(3);
  const { theme } = useTheme();
  const colors = themeColors[theme];
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const countdownAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in and scale up the background
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        // Animate the countdown number
        Animated.sequence([
          Animated.timing(countdownAnim, {
            toValue: 1.2,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(countdownAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          })
        ]).start();

        if (prev <= 1) {
          clearInterval(timer);
          
          // Fade out before navigation
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }],
            });
          });
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigation, fadeAnim, scaleAnim, countdownAnim]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <Animated.View 
        style={[
          styles.animatedContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }] 
          }
        ]}
      >
        <ImageBackground
          source={{ uri: 'https://www.obchod.crew.cz/im/coc/1280/0/content/977688/cover_image.1731063857.jpg' }}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
         
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
            style={styles.overlay}
          >
      
            <View style={styles.countdownWrapper}>
              <LinearGradient
                colors={['#000', '#000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.countdownContainer}
              >
                <Animated.Text 
                  style={[
                    styles.countdownText,
                    { transform: [{ scale: countdownAnim }] }
                  ]}
                >
                  {countdown}
                </Animated.Text>
              </LinearGradient>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Changed to black to match the dark theme
    width: '100%',
    height: '100%',
  },
  animatedContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownWrapper: {
    position: 'absolute',
    top: 50, // Adjusted for status bar
    right: 20,
    zIndex: 10,
  },
  countdownContainer: {
    paddingHorizontal: 35,
    paddingVertical: 8,
    borderRadius: 50, // Capsule shape
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  countdownText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});

export default ReturnScreen;