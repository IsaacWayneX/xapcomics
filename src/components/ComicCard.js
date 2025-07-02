import React from "react"
import { TouchableOpacity, Image, Text, StyleSheet } from "react-native"
import { useTheme, themeColors } from "../contexts/ThemeContext"

const ComicCard = ({ comic, onPress }) => {
  const { theme } = useTheme()
  const colors = themeColors[theme]

  return (
    <TouchableOpacity style={styles.comicCard} onPress={onPress}>
      <Image source={{ uri: comic.banner_url || comic.image }} style={styles.comicImage} resizeMode="cover" />
      <Text style={[styles.comicTitle, { color: colors.text }]} numberOfLines={2}>
        {comic.title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  comicCard: {
    width: "48%",
    marginBottom: 20,
  },
  comicImage: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  comicTitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
})

export default ComicCard

