import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import MusicControlButton from '../components/MusicControlButton';

// Screen dimensions for responsive design
const { width, height } = Dimensions.get('window');

// Centralized image collection with popular manhwa covers
const MANHWA_IMAGES = [
  'https://static.wikia.nocookie.net/tomb-raider-king/images/2/22/TRKMVl1_Cover_Front.jpg/revision/latest?cb=20210422101534',
  'https://rukminim2.flixcart.com/image/850/1000/xif0q/book/y/k/m/solo-leveling-vol-2-original-imah4hhdzaaftsvp.jpeg?q=90&crop=false',
  'https://lh3.googleusercontent.com/proxy/xhO3mdx8y6m_XrIBdWogE0injU7iZoeQGx_68kZWKVW8552M3viXgXodzPeSkj8AsaWTvcnWybFg9dmihqFUQApPVVANkk2JYZP3CfgfpzJM7McBqGiboz4x0CNBvz-RGt3IY5E',
  'https://media.dcbservice.com/xlarge/JUN220725.jpg',
  'https://media.mycomicshop.com/n_iv/600/6075075.jpg',
  'https://www.shoplevelup.com/cdn/shop/files/202403-0000448957_large.jpg?v=1717428669',
  'https://storage.googleapis.com/hipcomic/p/8e63d655df0546fcc7c1491af09c3fc0-800.jpg',
  'https://cdn.imagecomics.com/assets/i/releases/999532/purr-evil-2-of-6_ab3b6a0d58.jpg',
  'https://media.dcbservice.com/xlarge/DEC181737.jpg',
  'https://www.cgc-emporium.com/cdn/shop/products/202303-0000414330.jpg?v=1691770461',
  'https://storage.googleapis.com/hipcomic/p/8e5bedce8e687afdf60b86b97ace71a8-800.jpg',
  'https://www.gothamcentralcomics.com/cdn/shop/products/202310-0000435036.jpg?v=1710011993',
];

// Background music track (replace with your actual audio file path)
const BACKGROUND_MUSIC = require('../../assets/melody.mp3');

const WelcomeScreen = ({ navigation }) => {
  // Refs for animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const imageIndex = useRef(new Animated.Value(0)).current;

  // State for audio management
  const [sound, setSound] = useState(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  /**
   * Setup background music with error handling and configuration
   * @returns {Promise<void>}
   */
  const setupBackgroundMusic = useCallback(async () => {
    try {
      const { sound: audioSound } = await Audio.Sound.createAsync(
        BACKGROUND_MUSIC,
        {
          shouldPlay: true,
          isLooping: true,
          volume: 0.5,
        }
      );

      setSound(audioSound);
      setIsMusicPlaying(true);
    } catch (error) {
      console.error('Error setting up background music:', error);
    }
  }, []);

  /**
   * Toggle music play/pause state
   * @returns {Promise<void>}
   */
  const toggleMusic = useCallback(async () => {
    if (!sound) return;

    try {
      if (isMusicPlaying) {
        await sound.pauseAsync();
        setIsMusicPlaying(false);
      } else {
        await sound.playAsync();
        setIsMusicPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling music:', error);
    }
  }, [sound, isMusicPlaying]);

  useEffect(() => {
    // Fade-in animation for screen content
    const fadeInAnimation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    // Continuous image slideshow animation
    const slideshowAnimation = Animated.loop(
      Animated.sequence(
        MANHWA_IMAGES.map((_, index) =>
          Animated.timing(imageIndex, {
            toValue: index,
            duration: 5000,
            useNativeDriver: false,
          })
        )
      )
    );

    // Start animations
    fadeInAnimation.start();
    slideshowAnimation.start();

    // Setup background music
    setupBackgroundMusic();

    // Cleanup function
    return () => {
      fadeInAnimation.stop();
      slideshowAnimation.stop();

      // Unload sound to prevent memory leaks
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [setupBackgroundMusic]);

  // Interpolate image index for smooth transitions
  const currentImageIndex = imageIndex.interpolate({
    inputRange: MANHWA_IMAGES.map((_, index) => index),
    outputRange: MANHWA_IMAGES.map((_, index) => index),
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Dynamic Background Slideshow */}
      {MANHWA_IMAGES.map((image, index) => (
        <Animated.View
          key={index}
          style={[
            styles.slideContainer,
            {
              opacity: currentImageIndex.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [0, 1, 0],
                extrapolate: 'clamp',
              }),
            },
          ]}>
          <ImageBackground
            source={{ uri: image }}
            style={styles.backgroundImage}>
            <LinearGradient
              colors={[
                'rgba(0,0,0,0)',
                'rgba(0,0,0,0.3)',
                'rgba(0,0,0,0.9)',
                'rgba(0,0,0,1)',
              ]}
              locations={[0, 0.4, 0.7, 1]}
              style={styles.gradient}
            />
          </ImageBackground>
        </Animated.View>
      ))}

      {/* Screen Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>XAP NOVELS</Text>
        <Text style={styles.subtitle}>
          Discover the finest collection of Comic books and Manhwas
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.getStartedButton}
          onPress={async () => {
            if (sound) {
              await sound.stopAsync();
              setIsMusicPlaying(false);
            }
            navigation.navigate('MainTabs');
          }}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.terms}>
          By clicking Get Started, you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </Animated.View>

      {/* Music Control Button */}
      <MusicControlButton
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slideContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 50 : 24,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 24,
  },
  getStartedButton: {
    backgroundColor: '#E05B3A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  terms: {
    color: '#fff',
    opacity: 0.6,
    textAlign: 'center',
    fontSize: 12,
  },
  link: {
    color: '#fff',
    opacity: 0.8,
  },
});

export default WelcomeScreen;
