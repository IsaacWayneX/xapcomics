import React from "react"
import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity } from "react-native"
import { ChevronLeft, Github, Mail } from "lucide-react-native"
import { useTheme, themeColors } from "../contexts/ThemeContext"

const AboutScreen = ({ navigation }) => {
  const { theme } = useTheme()
  const colors = themeColors[theme]

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <View style={[styles.backButtonBackground, { backgroundColor: colors.card }]}>
          <ChevronLeft color={colors.text} size={24} />
        </View>
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Image 
            source={require('../../assets/xapLogo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: colors.text }]}>XapComics</Text>
          <Text style={[styles.version, { color: colors.text }]}>Version 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <Text style={[styles.description, { color: colors.text }]}>
            XapComics is your go-to comic reading app, designed to provide a seamless and enjoyable reading experience. 
            Browse through our extensive collection of comics, customize your reading experience with different themes, 
            and enjoy your favorite stories anytime, anywhere.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact</Text>
          <TouchableOpacity 
            style={[styles.contactButton, { backgroundColor: colors.card }]}
            onPress={() => Linking.openURL('mailto:support@xapcomics.com')}
          >
            <Mail color={colors.primary} size={24} />
            <Text style={[styles.contactButtonText, { color: colors.text }]}>support@xapcomics.com</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Follow Us</Text>
          <TouchableOpacity 
            style={[styles.contactButton, { backgroundColor: colors.card }]}
            onPress={() => Linking.openURL('https://github.com/xapcomics')}
          >
            <Github color={colors.primary} size={24} />
            <Text style={[styles.contactButtonText, { color: colors.text }]}>GitHub</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.copyright, { color: colors.text }]}>
          © 2025 XapComics. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  backButtonBackground: {
    borderRadius: 20,
    top: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
    borderRadius: 20,
    elevation: 8,

  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    opacity: 0.8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.9,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactButtonText: {
    fontSize: 16,
    marginLeft: 12,
  },
  copyright: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.6,
    marginTop: 20,
    marginBottom: 40,
  },
})

export default AboutScreen