import React, { useState, useEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Home, Settings, Search } from "lucide-react-native"
import { useTheme, themeColors } from "../contexts/ThemeContext"
import { ROUTES } from "../../App"
import { View, Animated, TouchableOpacity, StyleSheet, Dimensions, Keyboard, Platform } from "react-native"

// Import screens
import HomeStack from "./HomeStack"
import FavoritesStack from "./FavoritesStack"
import SettingsScreen from "../screens/SettingsScreen"
// import BookDetailsScreen from "..screens/BookDetailsScreen"

const Tab = createBottomTabNavigator()
const { width } = Dimensions.get('window')

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme()
  const colors = themeColors[theme]
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    )
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    )

    return () => {
      keyboardWillShow.remove()
      keyboardWillHide.remove()
    }
  }, [])

  // Show tab bar only on main screens (Home, Favorites, Settings) and hide on BookDetails or when keyboard is visible
  const currentRoute = state.routes[state.index]
  const { state: nestedState } = descriptors[currentRoute.key].navigation
  
  // Check if we're in a nested stack and if the current screen is BookDetails
  if (nestedState) {
    const currentNestedRoute = nestedState.routes[nestedState.index]
    if (currentNestedRoute.name === ROUTES.BOOK_DETAILS) {
      return null
    }
  }

  if (isKeyboardVisible) {
    return null
  }

  return (
    <View style={styles.tabBarContainer}>
      <View style={[styles.tabBar, { backgroundColor: colors.tabBar }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          const IconComponent = () => {
            if (route.name === ROUTES.HOME) {
              return <Home color={isFocused ? colors.primary : colors.tabBarInactive} size={24} />
            } else if (route.name === ROUTES.FAVORITES) {
              return < Search color={isFocused ? colors.primary : colors.tabBarInactive} size={24} />
            } else if (route.name === ROUTES.SETTINGS) {
              return <Settings color={isFocused ? colors.primary : colors.tabBarInactive} size={24} />
            }
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <Animated.View style={[styles.iconContainer, isFocused && styles.activeIcon]}>
                <IconComponent />
              </Animated.View>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const BottomNav = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name={ROUTES.HOME} component={HomeStack} />
      <Tab.Screen name={ROUTES.FAVORITES} component={FavoritesStack} />
      <Tab.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 20,
    transform: [{ scale: 1 }],
  },
  activeIcon: {
    backgroundColor: 'rgba(224, 91, 58, 0.1)',
    transform: [{ scale: 1.1 }],
  },
})

export default BottomNav