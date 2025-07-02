import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { supabase } from "../api/supabaseClient"

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([])
  const [favoriteComics, setFavoriteComics] = useState([])

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites")
      if (storedFavorites !== null) {
        const favoriteIds = JSON.parse(storedFavorites)
        setFavorites(favoriteIds)
        await loadFavoriteComics(favoriteIds)
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    }
  }

  const loadFavoriteComics = async (favoriteIds) => {
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .in("id", favoriteIds)

      if (error) throw error
      setFavoriteComics(data || [])
    } catch (error) {
      console.error("Error loading favorite comics:", error)
      setFavoriteComics([])
    }
  }

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites))
    } catch (error) {
      console.error("Error saving favorites:", error)
    }
  }

  const toggleFavorite = async (comicId) => {
    try {
      // Get the comic data from Supabase if not already in favoriteComics
      let comicData = favoriteComics.find(c => c.id === comicId)
      if (!comicData) {
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .eq("id", comicId)
          .single()

        if (error) throw error
        comicData = data
      }

      // Update favorites array
      const newFavorites = favorites.includes(comicId)
        ? favorites.filter(id => id !== comicId)
        : [...favorites, comicId]

      // Update favoriteComics array
      const newFavoriteComics = favorites.includes(comicId)
        ? favoriteComics.filter(c => c.id !== comicId)
        : [...favoriteComics, comicData]

      // Update state and storage
      setFavorites(newFavorites)
      setFavoriteComics(newFavoriteComics)
      await saveFavorites(newFavorites)
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const isFavorite = (comicId) => favorites.includes(comicId)

  const getFavoriteComics = () => favoriteComics

  return { favorites, toggleFavorite, isFavorite, getFavoriteComics }
}

