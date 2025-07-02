import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  FlatList,
} from "react-native"
import { BookX } from "lucide-react-native"
import ComicCard from "../components/ComicCard"
import { ComicSkeleton } from "../components/ComicSkeleton"
import { useTheme, themeColors } from "../contexts/ThemeContext"
import { supabase } from "../api/supabaseClient"


const { width: SCREEN_WIDTH } = Dimensions.get("window")
const COMIC_WIDTH = (SCREEN_WIDTH - 48) / 2 // 2 columns with 16px padding on each side and 16px gap
const FEATURED_COMIC_WIDTH = SCREEN_WIDTH - 32 // Full width with 16px padding on each side

const HomeScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState("All")
  const [filteredComics, setFilteredComics] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCategoryLoading, setIsCategoryLoading] = useState(false)
  const [categories, setCategories] = useState([{ id: 0, name: "All" }])
  const [error, setError] = useState(null)

  const { theme } = useTheme()
  const colors = themeColors[theme]

  const fetchBooksByCategory = async (categoryId) => {
    try {
      if (categoryId === 0) {
        const { data, error } = await supabase.from("books").select("*")
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .eq("category_id", categoryId)
        if (error) throw error
        return data
      }
    } catch (error) {
      console.error("Error fetching books:", error)
      setError("Failed to fetch books. Please try again later.")
      return []
    }
  }

  const handleCategoryPress = async (category) => {
    setIsCategoryLoading(true)
    setActiveCategory(category.name)
    setError(null)

    try {
      const books = await fetchBooksByCategory(category.id)
      setFilteredComics(books)
    } catch (error) {
      console.error("Error in category press:", error)
      setError("Failed to load category. Please try again.")
    } finally {
      setIsCategoryLoading(false)
    }
  }

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [categoriesResponse, booksResponse] = await Promise.all([
          supabase.from("categories").select("*"),
          supabase.from("books").select("*")
        ])

        if (categoriesResponse.error) throw categoriesResponse.error
        if (booksResponse.error) throw booksResponse.error

        setCategories([{ id: 0, name: "All" }, ...categoriesResponse.data])
        setFilteredComics(booksResponse.data)
      } catch (error) {
        console.error("Error initializing data:", error)
        setError("Failed to load initial data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()

    // Add focus listener to reload data when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      initializeData()
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const handleComicPress = (comic) => {
    // Find the category name from the categories array
    const category = categories.find(cat => cat.id === comic.category_id)
    navigation.navigate("BookDetails", { 
      book: {
        ...comic,
        banner_url: comic.banner_url || comic.image,
        category: category?.name || "Uncategorized"
      }
    })
  }



  // Removed redundant handleCategoryPress implementation

  const renderNoResults = () => (
    <View style={styles.noResultsContainer}>
      <BookX size={64} color={colors.text} />
      <Text style={[styles.noResultsText, { color: colors.text }]}>
        Sorry, the book you're searching for is not in our library.
      </Text>
    </View>
  )

  const renderSkeletons = () => (
    <View style={styles.comicsGrid}>
      {[...Array(6)].map((_, index) => (
        <ComicSkeleton key={index} />
      ))}
    </View>
  )

  const Header = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={[styles.greeting, { color: colors.text }]}>XAP Comics</Text>
      </View>
    </View>
  )

  const Categories = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesContainer}
      contentContainerStyle={styles.categoriesContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            { backgroundColor: category.name === activeCategory ? colors.primary : colors.card },
          ]}
          onPress={() => handleCategoryPress(category)}
        >
          <Text style={[styles.categoryText, { color: category.name === activeCategory ? colors.background : colors.text }]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )

  const renderItem = ({ item }) => (
    <ComicCard comic={item} onPress={() => handleComicPress(item)} />
  )

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      <View style={[styles.stickyHeader, { backgroundColor: colors.background }]}>
        <Header />
        <Categories />
      </View>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          data={filteredComics}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.comicRow}
          ListHeaderComponent={() => (
            <>
              {activeCategory === "All" && (
                <View style={styles.featuredSection}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Comics</Text>
                  <FlatList
                    horizontal
                    data={filteredComics
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      .slice(0, 4)}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleComicPress(item)} style={styles.featuredComicCard}>
                        <Image source={{ uri: item.banner_url || item.image }} style={styles.featuredComicImage} />
                        <View style={styles.featuredComicOverlay}>
                          <Text style={styles.featuredComicTitle}>{item.title}</Text>
                          <Text style={styles.featuredComicDescription} numberOfLines={3}>
                            {item.description}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => `featured-${item.id}`}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={FEATURED_COMIC_WIDTH}
                    decelerationRate="fast"
                    pagingEnabled
                    contentContainerStyle={styles.featuredComicsList}
                  />
                </View>
              )}
              <View style={styles.allComicsSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {`${activeCategory} Comics`}
                </Text>
              </View>
            </>
          )}
          ListEmptyComponent={renderNoResults}
          ListLoadingComponent={isLoading || isCategoryLoading ? renderSkeletons : null}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: StatusBar.currentHeight + 16,
    paddingHorizontal: 16,
    paddingBottom: 10,
   
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 160,
    paddingHorizontal: 16,
    paddingBottom: 70,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "900",
  },

  categoriesContainer: {
    marginBottom: 12,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
  },
  featuredSection: {
    marginBottom: 24,
    marginTop:5
  },
  allComicsSection: {
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 16,
  },
  comicsGrid: {
    paddingBottom: 20,
  },
  comicRow: {
    justifyContent: "space-between",
  },
  featuredComicsList: {
    paddingRight: 16,
  },
  featuredComicCard: {
    width: FEATURED_COMIC_WIDTH,
    height: FEATURED_COMIC_WIDTH * 0.75,
    marginRight: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  featuredComicImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  featuredComicOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
    justifyContent: "flex-end",
  },
  featuredComicTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  featuredComicDescription: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
})

export default HomeScreen

