import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "react-native"
import { ThemeProvider, useTheme, themeColors } from "./src/contexts/ThemeContext"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Import screens
import SplashScreen from "./src/screens/SplashScreen"
import WelcomeScreen from "./src/screens/WelcomeScreen"
import ReturnScreen from "./src/screens/ReturnScreen"
import BottomNav from "./src/components/BottomNav"
import ReadBook from "./src/screens/ReadBook"
import NoInternetScreen from "./src/screens/NoInternetScreen"
import AboutScreen from "./src/screens/AboutScreen"

// Define route names as constants for type safety and consistency
export const ROUTES = {
  SPLASH: "Splash",
  WELCOME: "Welcome",
  HOME: "Home",
  FAVORITES: "Favorites",
  BOOK_DETAILS: "BookDetails",
  SETTINGS: "Settings",
  READ_BOOK: "ReadBook",
  NO_INTERNET: "NoInternet",
}

// Create stack navigator
const Stack = createStackNavigator()

const AppContent = () => {
  const { theme } = useTheme()
  const colors = themeColors[theme]
  const [isConnected, setIsConnected] = useState(true)
  const [showNoInternet, setShowNoInternet] = useState(false)

  useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        const hasVisited = await AsyncStorage.getItem('hasVisitedBefore');
        if (!hasVisited) {
          await AsyncStorage.setItem('hasVisitedBefore', 'true');
        }
      } catch (error) {
        console.error('Error checking first visit:', error);
      }
    };

    checkFirstVisit();

    let isMounted = true

    const checkConnection = async () => {
      try {
        const response = await fetch('https://www.google.com', { method: 'HEAD' })
        if (isMounted) {
          setIsConnected(response.ok)
          setShowNoInternet(!response.ok)
        }
      } catch (error) {
        console.error('Error checking network state:', error)
        if (isMounted) {
          setIsConnected(false)
          setShowNoInternet(true)
        }
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 5000) // Check every 5 seconds

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const handleRetryConnection = async () => {
    try {
      const response = await fetch('https://www.google.com', { method: 'HEAD' })
      setIsConnected(response.ok)
      setShowNoInternet(!response.ok)
    } catch (error) {
      console.error('Error checking network state:', error)
      setIsConnected(false)
      setShowNoInternet(true)
    }
  }

  return (
    <NavigationContainer>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={"light-content"}
      />
      <Stack.Navigator
        initialRouteName={ROUTES.SPLASH}
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
        <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
        <Stack.Screen name="Return" component={ReturnScreen} />
        <Stack.Screen name="MainTabs" component={BottomNav} />
        <Stack.Screen name={ROUTES.READ_BOOK} component={ReadBook} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
      <NoInternetScreen visible={showNoInternet} onRetry={handleRetryConnection} />
    </NavigationContainer>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App

