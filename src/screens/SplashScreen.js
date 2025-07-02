import React, { useState, useEffect, useRef } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { View, Image, Animated, Dimensions, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"

// Screen dimensions for responsive design
const { width, height } = Dimensions.get("window")

// Background image collection
const backgroundImages = [
  'https://static.wikia.nocookie.net/tomb-raider-king/images/2/22/TRKMVl1_Cover_Front.jpg/revision/latest?cb=20210422101534',
  'https://rukminim2.flixcart.com/image/850/1000/xif0q/book/y/k/m/solo-leveling-vol-2-original-imah4hhdzaaftsvp.jpeg?q=90&crop=false',
  'https://lh3.googleusercontent.com/proxy/xhO3mdx8y6m_XrIBdWogE0injU7iZoeQGx_68kZWKVW8552M3viXgXodzPeSkj8AsaWTvcnWybFg9dmihqFUQApPVVANkk2JYZP3CfgfpzJM7McBqGiboz4x0CNBvz-RGt3IY5E',
  'https://media.dcbservice.com/xlarge/JUN220725.jpg',
  'https://media.mycomicshop.com/n_iv/600/6075075.jpg',
]

// Splash screen component with precise animation and navigation
const SplashScreen = () => {
  // Navigation hook
  const navigation = useNavigation()

  // Current image tracking state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Animated value references for multi-stage animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const zoomAnim = useRef(new Animated.Value(1)).current
  const overlayAnim = useRef(new Animated.Value(0)).current
  const logoFadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Comprehensive animation sequence manager
    const animationSequence = () => {
      // Sophisticated image switching mechanism
      const switchImage = () => {
        // Circular image index progression
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
        
        // Coordinated animation sequence
        Animated.parallel([
          // Background image crossfade
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 8000,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 8000,
              useNativeDriver: true,
            }),
          ]),
          // Zoom animation for background
          Animated.sequence([
            Animated.timing(zoomAnim, {
              toValue: 2.5,  // Zoom level
              duration: 16000,  // Full cycle duration
              useNativeDriver: true,
            }),
            Animated.timing(zoomAnim, {
              toValue: 1,  // Reset zoom
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          // Overlay animation
          Animated.timing(overlayAnim, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: false,
          })
        ]).start(() => {
          if (overlayAnim.__getValue() < 1) {
            switchImage()
          }
        })
      }

      // Logo fade-in animation with delay
      Animated.timing(logoFadeAnim, {
        toValue: 1,
        duration: 5000,
        delay: 4000,
        useNativeDriver: true,
      }).start()

      // Initiate image switching
      switchImage()

      // Navigation timeout
      const totalAnimationTime = 8000 * 2 + 2000
      const navigationTimeout = setTimeout(async () => {
        try {
          const hasVisited = await AsyncStorage.getItem('hasVisitedBefore');
          if (!hasVisited) {
            await AsyncStorage.setItem('hasVisitedBefore', 'true');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Return' }],
            });
          }
        } catch (error) {
          console.error('Error checking first visit:', error);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
          });
        }
      }, totalAnimationTime)

      // Return cleanup function
      return () => clearTimeout(navigationTimeout)
    }

    // Execute animation sequence
    const cleanup = animationSequence()

    // Cleanup on component unmount
    return () => {
      cleanup?.()
    }
  }, [navigation, fadeAnim, zoomAnim, overlayAnim, logoFadeAnim])

  return (
    <View style={styles.container}>
      {/* Dynamic Background Images with Zoom */}
      {backgroundImages.map((image, index) => (
        <Animated.Image
          key={index}
          source={{ uri: image }}
          style={[
            styles.backgroundImage,
            {
              // Opacity interpolation for crossfade
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [index === currentImageIndex ? 1 : 0, index === currentImageIndex ? 0 : 1],
              }),
              // Zoom transformation
              transform: [
                {
                  scale: zoomAnim,
                },
              ],
            },
          ]}
        />
      ))}

      {/* Flat Color Overlay */}
      <Animated.View
        style={[
          styles.flatOverlay,
          {
            opacity: overlayAnim,
          },
        ]}
      />

      {/* Logo */}
      <Animated.Image
        source={require("../../assets/XAP.png")}
        style={[
          styles.logo,
          {
            opacity: logoFadeAnim,
          },
        ]}
      />
    </View>
  )
}

// Optimized StyleSheet with precise layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000"
  },
  backgroundImage: {
    position: "absolute",
    width: width,
    height: height,
    resizeMode: "cover", // Ensure full screen coverage
  },
  flatOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000", // Solid orange overlay
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
})

export default SplashScreen