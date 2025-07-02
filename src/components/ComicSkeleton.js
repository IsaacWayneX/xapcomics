import React from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { useTheme, themeColors } from '../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COMIC_WIDTH = (SCREEN_WIDTH - 48) / 2; // Match HomeScreen's calculation

export const ComicSkeleton = () => {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonItem = () => (
    <View style={styles.skeletonCard}>
      <Animated.View 
        style={[
          styles.skeletonImage, 
          { 
            opacity,
            backgroundColor: colors.card 
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.skeletonTitle, 
          { 
            opacity,
            backgroundColor: colors.card 
          }
        ]} 
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <SkeletonItem />
        <SkeletonItem />
      </View>
      <View style={styles.row}>
        <SkeletonItem />
        <SkeletonItem />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  skeletonCard: {
    width: COMIC_WIDTH,
  },
  skeletonImage: {
    width: COMIC_WIDTH,
    height: COMIC_WIDTH * 1.5,
    borderRadius: 8,
    marginBottom: 8,
  },
  skeletonTitle: {
    width: '80%',
    height: 14,
    borderRadius: 4,
    alignSelf: 'center',
  },
});
