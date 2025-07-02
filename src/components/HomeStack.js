import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { ROUTES } from "../../App"
import HomeScreen from "../screens/HomeScreen"
import BookDetailsScreen from "../screens/BookDetailsScreen"

const Stack = createStackNavigator()

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
    <Stack.Screen name={ROUTES.BOOK_DETAILS} component={BookDetailsScreen} />
  </Stack.Navigator>
)

export default HomeStack