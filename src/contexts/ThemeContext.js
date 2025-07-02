import React, { createContext, useState, useContext, useEffect } from "react"
import { useColorScheme } from "react-native"

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme()
  const [theme, setTheme] = useState(deviceTheme === "dark" ? "dark" : "light")

  useEffect(() => {
    if (deviceTheme === "dark" || deviceTheme === "light") {
      setTheme(deviceTheme)
    }
  }, [deviceTheme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const themeColors = {
  light: {
    background: "#2A1B3D",
    text: "#FFFFFF",
    primary: "#9B4DCA",
    secondary: "#4A235A",
    card: "#382952",
    tabBar: "#382952",
    tabBarInactive: "#8E8E93",
  },
  dark: {
    background: "#0A0911",
    text: "#FFFFFF",
    primary: "#E05B3A",
    secondary: "#F0F0F0",
    card: "#1C1C1E",
    tabBar: "#1C1C1E",
    tabBarInactive: "#8E8E93",
  },
  blue: {
    background: "#0A1929",
    text: "#FFFFFF",
    primary: "#1E88E5",
    secondary: "#1A237E",
    card: "#102A43",
    tabBar: "#102A43",
    tabBarInactive: "#8E8E93",
  },
}

