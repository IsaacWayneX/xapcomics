import React, {useState, useEffect, useRef} from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, StatusBar, Dimensions, ScrollView, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { ChevronLeft } from "lucide-react-native"
import { useTheme, themeColors } from "../contexts/ThemeContext"
import { supabase } from "../api/supabaseClient"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const BANNER_HEIGHT = SCREEN_HEIGHT * 0.5
const CARD_INITIAL_TOP = SCREEN_HEIGHT * 0.45 // Card starts at 40% of screen height
const MAX_SCROLL_POSITION = SCREEN_HEIGHT * 0.4 // Limit scroll to 65% of screen (100% - 65% = 35%)

const BookDetailsScreen = ({ route, navigation }) => {
  const { book } = route.params
  const { theme } = useTheme()
  const colors = themeColors[theme]
  const [episodes, setEpisodes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const scrollY = useRef(new Animated.Value(0)).current
  const scrollViewRef = useRef(null)

  useEffect(() => {
    fetchEpisodes()
  }, [])

  const fetchEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from("episodes")
        .select("*")
        .eq("book_id", book.id)

      if (error) throw error
      setEpisodes(data)
    } catch (error) {
      console.error("Error fetching episodes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEpisodePress = (episode) => {
    navigation.navigate("ReadBook", { 
      episode: {
        ...episode,
        pdfUrl: episode.pdf_url || episode.pdfUrl || book.pdf_url || book.pdfUrl
      }, 
      book: {
        ...book,
        pdfUrl: book.pdf_url || book.pdfUrl
      }
    })
  }

  // Handle scroll to cap at MAX_SCROLL_POSITION
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: true,
      listener: (event) => {
        const offsetY = event.nativeEvent.contentOffset.y
        if (offsetY > MAX_SCROLL_POSITION && scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: MAX_SCROLL_POSITION, animated: false })
        }
      }
    }
  )

  // Banner parallax scale effect - expands as card pushes it up
  const bannerScale = scrollY.interpolate({
    inputRange: [0, MAX_SCROLL_POSITION],
    outputRange: [1, 1.2],
    extrapolate: 'clamp'
  })

  // Banner translation - moves up as card pushes it
  const bannerTranslateY = scrollY.interpolate({
    inputRange: [0, MAX_SCROLL_POSITION],
    outputRange: [0, -BANNER_HEIGHT * 0.3],
    extrapolate: 'clamp'
  })

  // Opacity for the overlay to create a darker effect as we scroll
  const overlayOpacity = scrollY.interpolate({
    inputRange: [0, MAX_SCROLL_POSITION],
    outputRange: [0.5, 0.7],
    extrapolate: 'clamp'
  })

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      
      {/* Banner image with parallax expansion effect */}
      <Animated.View 
        style={[
          styles.imageContainer,
          {
            transform: [
              { translateY: bannerTranslateY },
              { scale: bannerScale }
            ]
          }
        ]}
      >
        <Image source={{ uri: book.banner_url || book.image }} style={styles.image} />
        
        {/* Dark overlay on the image that gets darker as we scroll */}
        <Animated.View 
          style={[
            StyleSheet.absoluteFill, 
            { 
              backgroundColor: 'black',
              opacity: overlayOpacity
            }
          ]} 
        />
      </Animated.View>
      
      {/* Content Scroll View */}
      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Spacer to position content below banner */}
        <View style={{ height: CARD_INITIAL_TOP }} />
        
        {/* Content with gradient blend */}
        <View style={styles.contentWrapper}>
          {/* Multi-step gradient that matches the UI in the image */}
          <LinearGradient 
            colors={[
              'rgba(0,0,0,0)',
              `rgba(${hexToRgb(colors.background)},0.4)`,
              `rgba(${hexToRgb(colors.background)},0.75)`,
              `rgba(${hexToRgb(colors.background)},0.97)`,
              `rgba(${hexToRgb(colors.background)},1)`,
              colors.background
            ]} 
            locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
            style={styles.contentGradient}
            pointerEvents="none"
          />
          
          {/* Solid background container */}
          <View 
            style={[
              styles.backgroundContainer, 
              { backgroundColor: colors.background }
            ]} 
          />
          
          {/* Main content */}
          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.text }]}>{book.title}</Text>
            </View>
            
            <View style={[styles.categoryContainer, { backgroundColor: colors.primary }]}>
              <Text style={[styles.category, { color: colors.background }]}>{book.category}</Text>
            </View>
            
            <View>
              <Text 
                style={[styles.description, { color: colors.text }]} 
                numberOfLines={showFullDescription ? undefined : 3}
              >
                {book.description}
              </Text>
              <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                <Text style={[styles.readMore, { color: colors.primary }]}>
                  {showFullDescription ? "Show less..." : "Read more..."}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.episodesContainer}>
              <Text style={[styles.episodesTitle, { color: colors.text }]}>Episodes</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.episodesList}>
                {episodes.map((episode, index) => (
                  <TouchableOpacity 
                    key={episode.id || index} 
                    style={[styles.episodeCard, { backgroundColor: colors.card }]}
                    onPress={() => handleEpisodePress(episode)}
                  >
                    <Image 
                      source={{ uri: book.banner_url || book.image }} 
                      style={styles.episodeThumbnail}
                    />
                    <View style={styles.episodeInfo}>
                      <Text style={[styles.episodeNumber, { color: colors.primary }]}>
                        Episode {episode.issue_number || index + 1}
                      </Text>
                      <Text style={[styles.episodeTitle, { color: colors.text }]} numberOfLines={1}>
                        {episode.title || book.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Add extra padding at the bottom to ensure scrolling works properly */}
            <View style={{ height: 100 }} />
          </View>
        </View>
      </Animated.ScrollView>
      
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <View style={[styles.backButtonBackground, { backgroundColor: colors.card }]}>
          <ChevronLeft color={colors.text} size={24} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

// Helper function to convert hex color to RGB format for rgba()
const hexToRgb = (hex) => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r},${g},${b}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'absolute',
    height: SCREEN_HEIGHT * 0.6, // Make image container taller to ensure full coverage
    width: SCREEN_WIDTH,
    zIndex: 1
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentWrapper: {
    flex: 1,
    minHeight: SCREEN_HEIGHT * 0.7,
  },
  contentGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: -150, // Extend gradient further up
    height: 200, // Make gradient taller for smoother transition
    width: SCREEN_WIDTH,
    zIndex: 1,
  },
  backgroundContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 0, // Below the content but above the gradient
  },
  contentContainer: {
    padding: 24,
    paddingTop: 24, // Add some padding at top now that we have a background
    zIndex: 2,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 32, // Larger font size to match the image
    fontWeight: "bold",
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
    flex: 1,
    marginRight: 10,
    // Add text shadow to make it pop against the background
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  favoriteButton: {
    padding: 8,
  },
  categoryContainer: {
    borderRadius: 20, // More rounded to match the image
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  category: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  readMore: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 40,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
    fontStyle: 'italic', // Match the italic style in the image
  },
  episodesContainer: {
    paddingHorizontal: 0,
    paddingBottom: 40,
  },
  episodesTitle: {
    fontSize: 32, // Larger font size to match the image
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  episodesList: {
    flexGrow: 0,
    paddingHorizontal: 0,
  },
  episodeCard: {
    width: 200,
    marginRight: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  episodeThumbnail: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  episodeInfo: {
    padding: 12,
  },
  episodeNumber: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  backButton: {
    position: "absolute",
    top: StatusBar.currentHeight + 8,
    left: 8,
    zIndex: 10,
  },
  backButtonBackground: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
})

export default BookDetailsScreen