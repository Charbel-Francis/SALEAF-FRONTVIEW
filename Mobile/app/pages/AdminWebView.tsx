import React, { useState, useEffect, useRef } from "react";
import { WebView, WebViewNavigation } from "react-native-webview";
import {
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  StatusBar,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import * as SecureStore from "expo-secure-store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const WebViewComponent = () => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useLocalSearchParams();
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);

  const baseUrl = "https://saleaffrontend-production.up.railway.app";
  const allowedPaths = ["/apps/", "/dashboard/"];

  const handleBack = () => {
    router.back();
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;

    if (!url.startsWith(baseUrl)) {
      router.replace("/(tabs)/home");
      return;
    }

    const path = url.replace(baseUrl, "");

    const isAllowedPath = allowedPaths.some((allowedPath) =>
      path.startsWith(allowedPath)
    );

    if (!isAllowedPath) {
      console.log("Unauthorized path detected, redirecting to home");
      router.replace("/(tabs)/home");
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("my-jwt");
        const storedRefreshToken = await SecureStore.getItemAsync(
          "refreshToken"
        );
        setToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching token:", error);
        setIsLoading(false);
      }
    };

    fetchToken();
  }, []);

  const renderLoadingIndicator = () => (
    <ActivityIndicator color="#000000" size="large" style={styles.loader} />
  );

  const injectedJavaScript = `
    (function() {
      try {
        if (typeof localStorage === 'undefined') {
          console.error('localStorage is not available');
          window.ReactNativeWebView.postMessage('localStorage_not_available');
          return;
        }

        localStorage.setItem('serviceToken', '${token}');
        localStorage.setItem('refreshToken', '${refreshToken}');
    
      } catch (error) {
        console.error('Error setting token:', error);
        window.ReactNativeWebView.postMessage('token_set_error: ' + error.message);
      }
      true;
    })();
  `;

  const injectTokenScript = `
    (function() {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('serviceToken', '${token}');
          localStorage.setItem('refreshToken', '${refreshToken}');
          window.ReactNativeWebView.postMessage('token_refresh_success');
        }
      } catch (error) {
        window.ReactNativeWebView.postMessage('token_refresh_error: ' + error.message);
      }
    })();
  `;

  if (isLoading) {
    return renderLoadingIndicator();
  }

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: params.url as string }}
        startInLoadingState={true}
        scalesPageToFit={false}
        renderLoading={renderLoadingIndicator}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={["*"]}
        style={styles.webview}
        mixedContentMode={"compatibility"}
        thirdPartyCookiesEnabled={true}
        setBuiltInZoomControls={false}
        bounces={false}
        allowUniversalAccessFromFileURLs={true}
        automaticallyAdjustContentInsets={false}
        hideKeyboardAccessoryView={true}
        allowsLinkPreview={false}
        cacheEnabled={false}
        onNavigationStateChange={handleNavigationStateChange}
        onMessage={(event) => {
          console.log("Message from webview:", event.nativeEvent.data);
          if (event.nativeEvent.data.includes("token_set_error")) {
            console.error("Failed to set token:", event.nativeEvent.data);
          }
        }}
        injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
        onLoadEnd={() => {
          if (token) {
            webViewRef.current?.injectJavaScript(injectTokenScript);
          }
        }}
        ref={webViewRef}
      />

      {/* Floating Action Button with Blur Background */}
      <View style={styles.fabContainer}>
        <BlurView intensity={80} tint="light" style={styles.blurContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.fab}>
            <View style={styles.fabContent}>
              <MaterialIcons name="arrow-back" size={20} color="#007AFF" />
              <Text style={styles.fabText}>Back to App</Text>
            </View>
          </TouchableOpacity>
        </BlurView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
  },
  fabContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 16,
    zIndex: 1000,
  },
  blurContainer: {
    borderRadius: 20,
    overflow: "hidden",
    borderColor: "rgba(255,255,255,0.3)",
    borderWidth: 1,
  },
  fab: {
    padding: 8,
    paddingHorizontal: 16,
  },
  fabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default WebViewComponent;
