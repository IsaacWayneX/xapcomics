import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { ROUTES } from "../../App"
import FavoritesScreen from "../screens/FavoritesScreen"
import BookDetailsScreen from "../screens/BookDetailsScreen"

const Stack = createStackNavigator()

const FavoritesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.FAVORITES} component={FavoritesScreen} />
    <Stack.Screen name={ROUTES.BOOK_DETAILS} component={BookDetailsScreen} />
  </Stack.Navigator>
)

export default FavoritesStack