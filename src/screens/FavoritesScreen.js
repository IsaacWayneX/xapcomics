import React, { useState, useEffect } from "react"
import { View, Text, FlatList, StyleSheet, TextInput, StatusBar, Dimensions, ActivityIndicator } from "react-native"
import ComicCard from "../components/ComicCard"
import { Search, BookX } from "lucide-react-native"
import { useTheme, themeColors } from "../contexts/ThemeContext"
import { supabase } from "../api/supabaseClient"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const COMIC_WIDTH = (SCREEN_WIDTH - 48) / 2 // 2 columns with 16px padding on each side and 16px gap

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [allBooks, setAllBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { theme } = useTheme()
  const colors = themeColors[theme]

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const [booksResponse, categoriesResponse] = await Promise.all([
        supabase.from("books").select("*"),
        supabase.from("categories").select("*")
      ])

      if (booksResponse.error) throw booksResponse.error
      if (categoriesResponse.error) throw categoriesResponse.error

      setAllBooks(booksResponse.data)
      setCategories(categoriesResponse.data)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load books. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBooks = searchQuery
    ? allBooks.filter((book) => book.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  const renderItem = ({ item }) => (
    <ComicCard 
      comic={item} 
      onPress={() => {
        const category = categories.find(cat => cat.id === item.category_id)
        navigation.navigate("BookDetails", { 
          book: {
            ...item,
            banner_url: item.banner_url || item.image,
            category: category?.name || "Uncategorized"
          }
        })
      }} 
      isFavorite={false} 
    />
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <BookX size={64} color={colors.text} />
      <Text style={[styles.emptyText, { color: colors.text }]}>
        {searchQuery
          ? "No comics found matching your search"
          : "Start typing to search for comics"}
      </Text>
    </View>
  )

  if (error) {
    return (
      <View style={[styles.container, styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.text }]}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === "light" ? "dark-content" : "light-content"}
      />
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Search Comics</Text>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Search color={colors.text} size={20} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by title..."
            placeholderTextColor={colors.text}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.comicList}
          columnWrapperStyle={styles.comicRow}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingBottom: 50,

  },
  header: {
    paddingTop: StatusBar.currentHeight + 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  comicList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  comicRow: {
    justifyContent: "space-between",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    marginTop: 100,
  
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 16,
  },
})

export default SearchScreen

