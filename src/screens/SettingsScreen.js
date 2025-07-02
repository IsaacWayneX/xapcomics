import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Animated } from "react-native"
import { ChevronDown, ChevronUp, ChevronRight, Star, Info, Palette } from "lucide-react-native"
import { useTheme, themeColors } from "../contexts/ThemeContext"
import { useNavigation } from "@react-navigation/native"

const SettingsScreen = () => {
  const { theme, setTheme } = useTheme()
  const colors = themeColors[theme]
  const [showThemeOptions, setShowThemeOptions] = useState(false)
  const navigation = useNavigation()

  const toggleThemeOptions = () => {
    setShowThemeOptions(!showThemeOptions)
  }

  const handleRateUs = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.xapcomics')
  }

  const ThemeButton = ({ themeName, label }) => {
    const themePreviewColors = themeColors[themeName]
    return (
      <TouchableOpacity
        style={[styles.themeButton, { backgroundColor: themePreviewColors.card }]}
        onPress={() => setTheme(themeName)}
      >
        <View style={styles.themePreview}>
          <View style={[styles.themePreviewHeader, { backgroundColor: themePreviewColors.primary }]} />
          <View style={[styles.themePreviewContent, { backgroundColor: themePreviewColors.background }]} />
        </View>
        <View style={[styles.themeButtonContent, { borderColor: theme === themeName ? themePreviewColors.primary : 'transparent' }]}>
          <Text style={[styles.themeButtonText, { color: themePreviewColors.text }]}>{label}</Text>
          {theme === themeName && (
            <View style={[styles.activeThemeIndicator, { backgroundColor: themePreviewColors.primary }]} />
          )}
        </View>
      </TouchableOpacity>
    )
  }

  const SettingsButton = ({ icon: Icon, title, onPress }) => (
    <TouchableOpacity
      style={[styles.settingsButton, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={styles.settingsButtonContent}>
        <Icon color={colors.primary} size={24} />
        <Text style={[styles.settingsButtonText, { color: colors.text }]}>{title}</Text>
      </View>
      <ChevronRight color={colors.text} size={20} />
    </TouchableOpacity>
  )

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Palette color={colors.primary} size={24} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        </View>
        <TouchableOpacity
          style={[styles.changeThemeButton, { backgroundColor: colors.card }]}
          onPress={toggleThemeOptions}
        >
          <Text style={[styles.changeThemeButtonText, { color: colors.text }]}>Theme</Text>
          {showThemeOptions ? (
            <ChevronUp color={colors.text} size={24} />
          ) : (
            <ChevronDown color={colors.text} size={24} />
          )}
        </TouchableOpacity>

        {showThemeOptions && (
          <View style={styles.themeOptionsContainer}>
            <ThemeButton themeName="dark" label="Dark" />
            <ThemeButton themeName="light" label="Purple" />
            <ThemeButton themeName="blue" label="Blue" />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <SettingsButton
          icon={Star}
          title="Rate Us"
          onPress={handleRateUs}
        />
        <SettingsButton
          icon={Info}
          title="About"
          onPress={() => navigation.navigate('About')}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  changeThemeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  changeThemeButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  themeOptionsContainer: {
    flexDirection: 'column',
    paddingVertical: 16,
    gap: 12,
  },
  themeButton: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  themePreview: {
    width: '30%',
    height: '100%',
    flexDirection: 'row',
  },
  themePreviewHeader: {
    width: '40%',
    height: '100%',
  },
  themePreviewContent: {
    flex: 1,
  },
  themeButtonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 2,
    borderLeftWidth: 0,
  },
  themeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeThemeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
});

export default SettingsScreen

