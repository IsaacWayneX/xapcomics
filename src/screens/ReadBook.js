import React, { useState, useCallback, useEffect } from "react"
import { View, StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator, Text, Dimensions } from "react-native"
import { ChevronLeft, FileDown } from "lucide-react-native"
import { SliderVertical1, SliderHorizontal1 } from "iconsax-react-native"
import { useTheme, themeColors } from "../contexts/ThemeContext"
import Pdf from "react-native-pdf"
import * as FileSystem from "expo-file-system"
import Slider from "@react-native-community/slider"

const ReadBook = ({ route, navigation }) => {
  const { episode, book } = route.params
  const { theme } = useTheme()
  const colors = themeColors[theme]
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [localPdfPath, setLocalPdfPath] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [isHorizontal, setIsHorizontal] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [singlePageMode, setSinglePageMode] = useState(false)

  useEffect(() => {
    // Determine the PDF URL from either episode or book
    const url = episode?.pdfUrl || episode?.pdf_url || book?.pdfUrl || book?.pdf_url
    if (!url) {
      setError('No PDF URL available for this content.')
      setIsLoading(false)
      return
    }
    setPdfUrl(url)
    downloadPdf(url)
  }, [])

  // Update enablePaging based on orientation and singlePageMode
  useEffect(() => {
    // In vertical mode, we want continuous scrolling (enablePaging=false)
    // In horizontal mode, we want paged scrolling (enablePaging=true)
    if (!isHorizontal) {
      setSinglePageMode(false)
    }
  }, [isHorizontal])

  const downloadPdf = async (url) => {
    if (!url) {
      setError('Invalid PDF URL')
      setIsLoading(false)
      return
    }
    try {
      const fileUri = `${FileSystem.documentDirectory}${book.id}.pdf`
      // Delete existing file if it exists
      const fileInfo = await FileSystem.getInfoAsync(fileUri)
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(fileUri)
      }

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite
          setDownloadProgress(progress)
        }
      )

      const { uri } = await downloadResumable.downloadAsync()
      console.log('PDF downloaded to:', uri)
      setLocalPdfPath(uri)
      setDownloadProgress(1) // Set progress to 100%
    } catch (err) {
      console.error('Download error:', err)
      setError('Failed to download PDF. Please check your internet connection and try again.')
      setIsLoading(false)
      setDownloadProgress(0)
    }
  }

  const source = localPdfPath ? {
    uri: localPdfPath,
    cache: false,
    enableRTL: false,
    enableAnnotationRendering: false,
    // When in vertical mode, disable paging for continuous scroll
    enablePaging: isHorizontal,
    fitPolicy: 2,
    trustAllCerts: false,
    scale: scale
  } : null

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={theme === "light" ? "light-content" : "light-content"}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <View style={[styles.backButtonBackground, { backgroundColor: colors.card }]}>
          <ChevronLeft color={colors.text} size={24} />
        </View>
      </TouchableOpacity>
      <View style={styles.pdfContainer}>
        {(!localPdfPath) && (
          <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
            <ActivityIndicator size="large" color={colors.primary} style={styles.loadingSpinner} />
            <Text style={[styles.loadingText, { color: colors.text, fontWeight: "700" }]}>
              {downloadProgress === 0 ? "Loading..." :
               `${Math.round(downloadProgress * 100)}%`}
            </Text>
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          </View>
        )}

        {localPdfPath && (
          <>
            <Pdf
              source={source}
              style={styles.pdf}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`PDF loaded with ${numberOfPages} pages from ${filePath}`)
                setIsLoading(false)
                setError(null)
                setTotalPages(numberOfPages)
              }}
              onPageChanged={(page) => {
                console.log(`Current page: ${page}`)
                setCurrentPage(page)
              }}
              onError={(error) => {
                console.error("PDF Error:", error)
                setError("Failed to load PDF. Please try again later.")
                setIsLoading(false)
              }}
              onLoadProgress={(percentage) => {
                console.log(`Loading PDF: ${percentage * 100}%`)
              }}
              // Key settings for continuous scrolling in vertical mode:
              enablePaging={isHorizontal}
              horizontal={isHorizontal}
              enableAntialiasing={true}
              spacing={0}
              activityIndicator={null}
              fitWidth={true}
              // Set page gap to 0 for seamless vertical scrolling
              pageGap={0}
              // Disable single page mode in vertical orientation
              singlePage={isHorizontal && singlePageMode}
            />
            <TouchableOpacity
              style={[styles.modeButton, { backgroundColor: colors.card }]}
              onPress={() => setIsHorizontal(!isHorizontal)}
            >
              {isHorizontal ? (
                <SliderVertical1 size={24} color={colors.text} />
              ) : (
                <SliderHorizontal1 size={24} color={colors.text} />
              )}
            </TouchableOpacity>
            <View style={[styles.pageCounter, { backgroundColor: colors.card }]}>
              <Text style={[styles.pageCounterText, { color: colors.text }]}>
                {currentPage}
              </Text>
            </View>
            
            {/* Reading mode indicator */}
            {/* <View style={[styles.readingModeIndicator, { backgroundColor: colors.card }]}>
              <Text style={[styles.readingModeText, { color: colors.text }]}>
                {isHorizontal ? "Paged" : "Continuous"}
              </Text>
            </View> */}
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: StatusBar.currentHeight + 8,
    left: 8,
    zIndex: 10,
  },
  backButtonBackground: {
    borderRadius: 50,
    padding: 8,
    opacity: 0.9,
  },
  pdfContainer: {
    flex: 1,
    marginTop: 0,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "transparent",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  modeButton: {
    position: 'absolute',
    top: StatusBar.currentHeight + 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pageCounter: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  pageCounterText: {
    fontSize: 16,
    fontWeight: '600',
  },
  readingModeIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  readingModeText: {
    fontSize: 14,
    fontWeight: '600',
  },
})

export default ReadBook