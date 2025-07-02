import React, { useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { Pause, Play } from 'lucide-react-native';


const MusicControlButton = ({ 
  isMusicPlaying, 
  onToggleMusic 
}) => {
  // Animated values for button and tip text animations
  const slideAnim = useRef(new Animated.Value(100)).current;
  const tipOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide-in spring animation for the button
    const slideInAnimation = Animated.spring(slideAnim, {
      toValue: 0,
      friction: 6,
      tension: 40,
      useNativeDriver: true
    });

    // Fade-in animation for tip text with initial delay
    const tipFadeInAnimation = Animated.sequence([
      Animated.delay(800),
      Animated.timing(tipOpacityAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true
      })
    ]);

    // Start both animations
    slideInAnimation.start();
    tipFadeInAnimation.start();

    // Cleanup function to stop animations
    return () => {
      slideInAnimation.stop();
      tipFadeInAnimation.stop();
    };
  }, []);

  return (
    <>
      {/* Animated Tip Text */}
      <Animated.Text 
        style={[
          styles.tipText, 
          { 
            opacity: tipOpacityAnim,
            transform: [
              { 
                translateX: tipOpacityAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                }) 
              }
            ]
          }
        ]}
      >
        Click here to {isMusicPlaying ? 'pause' : 'play'} background music →
      </Animated.Text>

      {/* Music Control Button */}
      <Animated.View 
        style={[
          styles.musicButton, 
          { 
            transform: [
              { translateX: slideAnim }
            ] 
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.buttonContainer}
          onPress={onToggleMusic}
          accessibilityLabel={`${isMusicPlaying ? 'Pause' : 'Play'} background music`}
        >
          {isMusicPlaying ? (
            <Pause color="#fff" strokeWidth={2.5} size={24} />
          ) : (
            <Play color="#fff" strokeWidth={2.5} size={24} />
          )}
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

// Memoize component to prevent unnecessary re-renders
const MusicControlButtonMemo = React.memo(MusicControlButton);

const styles = StyleSheet.create({
  musicButton: {
    position: 'absolute',
    right: 16,
    bottom: Platform.OS === 'ios' ? 300 : 300,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E05B3A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipText: {
    position: 'absolute',
    right: 80,
    bottom: Platform.OS === 'ios' ? 310 : 310,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 12,
  }
});

export default MusicControlButtonMemo;