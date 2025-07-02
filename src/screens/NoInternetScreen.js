import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from "react-native"
import { WifiOff, RefreshCw } from "lucide-react-native"
import { useTheme, themeColors } from "../contexts/ThemeContext"
import { LinearGradient } from "expo-linear-gradient"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const NoInternetScreen = ({ visible, onRetry }) => {
  const { theme } = useTheme()
  const colors = themeColors[theme]

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRetry}
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 1)']}
        locations={[0, 0.5, 1]}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <WifiOff size={64} color={colors.text} style={styles.icon} />
          <Text style={[styles.title, { color: colors.text }]}>No Internet Connection</Text>
          <Text style={[styles.description, { color: colors.text }]}>
            Please check your internet connection and try again
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={onRetry}
          >
            <RefreshCw size={20} color={colors.background} style={styles.retryIcon} />
            <Text style={[styles.retryText, { color: colors.background }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.8,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    opacity: 0.8,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryIcon: {
    marginRight: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "600",
  },
})

export default NoInternetScreen
