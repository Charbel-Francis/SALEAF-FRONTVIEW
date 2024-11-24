import { useAuth } from "@/context/JWTContext";
import { useLocalSearchParams, router } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

const INJECTED_JAVASCRIPT = `
  const meta = document.createElement('meta');
  meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
  meta.setAttribute('name', 'viewport');
  document.getElementsByTagName('head')[0].appendChild(meta);
  
  // Force body to full width
  document.body.style.width = '100%';
  
  // Add CSS to ensure proper scaling
  const style = document.createElement('style');
  style.innerHTML = 'body { min-width: 100vw; max-width: 100vw; overflow-x: hidden; } * { max-width: 100vw; }';
  document.head.appendChild(style);
  
  true;
`;

const PaymentStatus = {
  NONE: 0,
  SUCCESS: 1,
  FAILURE: 2,
  CANCELLED: 3,
} as const;

type PaymentStatusType = (typeof PaymentStatus)[keyof typeof PaymentStatus];

const DonateOnline = () => {
  const { authState } = useAuth();
  const webviewRef = React.useRef<WebView>(null);
  const { donationLink } = useLocalSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusType>(
    PaymentStatus.NONE
  );
  const [countdown, setCountdown] = useState(10);
  const [webViewHeight, setWebViewHeight] = useState(height);
  const scaleValue = new Animated.Value(0);
  const shakeAnimation = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);
  const [currentUrl, setCurrentUrl] = useState("");

  const navigateToEvents = useCallback(() => {
    // router.replace("/events");
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (paymentStatus !== PaymentStatus.NONE) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigateToEvents();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [paymentStatus, navigateToEvents]);

  const handleStatusChange = useCallback(
    (newStatus: PaymentStatusType) => {
      setPaymentStatus(newStatus);

      switch (newStatus) {
        case PaymentStatus.SUCCESS:
          Animated.parallel([
            Animated.timing(scaleValue, {
              toValue: 1,
              duration: 600,
              easing: Easing.elastic(1.2),
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]).start();
          break;

        case PaymentStatus.FAILURE:
          Animated.sequence([
            Animated.timing(shakeAnimation, {
              toValue: 10,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
              toValue: -10,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnimation, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
          break;

        case PaymentStatus.CANCELLED:
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
          break;
      }
    },
    [scaleValue, fadeAnim, shakeAnimation]
  );

  const handleNavigationStateChange = useCallback(
    (navState: any) => {
      const { url } = navState;
      console.log("Navigation state changed, URL:", url);
      //   setCurrentUrl(url);

      if (!url) return;

      try {
        const urlParams = new URL(url).searchParams;
        const status = urlParams.get("status")?.toLowerCase();
        const urlLower = url.toLowerCase();

        if (status === "success" || urlLower.includes("success")) {
          console.log("Success detected");
          handleStatusChange(PaymentStatus.SUCCESS);
        } else if (status === "failure" || urlLower.includes("failure")) {
          console.log("Failure detected");
          handleStatusChange(PaymentStatus.FAILURE);
        } else if (status === "cancel" || urlLower.includes("cancel")) {
          console.log("Cancel detected");
          handleStatusChange(PaymentStatus.CANCELLED);
        }
      } catch (error) {
        console.error("Error parsing URL:", error);
      }
    },
    [handleStatusChange]
  );

  const renderRedirectMessage = () => (
    <Animated.View style={[styles.redirectContainer, { opacity: fadeAnim }]}>
      <Text style={styles.redirectText}>
        Redirecting to events in {countdown} seconds...
      </Text>
      <TouchableOpacity
        style={styles.redirectButton}
        onPress={navigateToEvents}
      >
        <Text style={styles.redirectButtonText}>Go to Events Now</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderPaymentStatus = () => {
    const StatusComponents = {
      [PaymentStatus.SUCCESS]: (
        <BlurView intensity={100} style={styles.container}>
          <Animated.View
            style={[styles.successCard, { transform: [{ scale: scaleValue }] }]}
          >
            <View style={styles.iconWrapper}>
              <LottieView
                source={require("@/assets/icons/paymentsucess.json")}
                autoPlay
                loop={false}
                style={styles.lottie}
              />
            </View>
            <Text style={[styles.title, styles.successText]}>
              Event Registration Successful! 🎉
            </Text>
            <Text style={styles.message}>
              We're excited to have you join us! Check your email for event
              details and confirmation.
            </Text>
            {renderRedirectMessage()}
          </Animated.View>
        </BlurView>
      ),
      [PaymentStatus.FAILURE]: (
        <BlurView intensity={100} style={styles.container}>
          <Animated.View
            style={[
              styles.failureCard,
              { transform: [{ translateX: shakeAnimation }] },
            ]}
          >
            <View style={styles.iconWrapper}>
              <MaterialIcons
                name="error-outline"
                size={hp("12%")}
                color="#FF4444"
              />
            </View>
            <Text style={[styles.title, styles.failureText]}>
              Registration Failed
            </Text>
            <Text style={styles.message}>
              We encountered an issue processing your registration. Please try
              again or contact our support team.
            </Text>
            {renderRedirectMessage()}
          </Animated.View>
        </BlurView>
      ),
      [PaymentStatus.CANCELLED]: (
        <BlurView intensity={100} style={styles.container}>
          <Animated.View style={[styles.cancelledCard, { opacity: fadeAnim }]}>
            <View style={styles.iconWrapper}>
              <MaterialIcons
                name="cancel-presentation"
                size={hp("12%")}
                color="#FFB74D"
              />
            </View>
            <Text style={[styles.title, styles.cancelledText]}>
              Registration Cancelled
            </Text>
            <Text style={styles.message}>
              Your registration request was cancelled. Feel free to try again
              when you're ready.
            </Text>
            {renderRedirectMessage()}
          </Animated.View>
        </BlurView>
      ),
      [PaymentStatus.NONE]: null,
    };

    return StatusComponents[paymentStatus] || null;
  };

  const renderWebView = () => (
    <WebView
      ref={webviewRef}
      source={{
        uri: donationLink as string,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      }}
      originWhitelist={["*"]}
      style={[styles.webView, { height: webViewHeight }]}
      injectedJavaScript={INJECTED_JAVASCRIPT}
      onMessage={(event) => {
        const height = Number(event.nativeEvent.data);
        if (height > 0) {
          setWebViewHeight(height);
        }
      }}
      scalesPageToFit={Platform.OS === "android"}
      automaticallyAdjustContentInsets={false}
      mixedContentMode="compatibility"
      thirdPartyCookiesEnabled={true}
      domStorageEnabled={true}
      javaScriptEnabled={true}
      allowsInlineMediaPlayback={true}
      mediaPlaybackRequiresUserAction={false}
      startInLoadingState={true}
      renderLoading={() => (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF0000" />
        </View>
      )}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn("WebView error: ", nativeEvent);
      }}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );

  if (!donationLink) {
    console.log("No donation link provided");
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        {paymentStatus === PaymentStatus.NONE
          ? renderWebView()
          : renderPaymentStatus()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  webView: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp("5%"),
  },
  loadingContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  successCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: wp("8%"),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: wp("90%"),
  },
  failureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: wp("8%"),
    alignItems: "center",
    shadowColor: "#FF4444",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: wp("90%"),
  },
  cancelledCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: wp("8%"),
    alignItems: "center",
    shadowColor: "#FFB74D",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: wp("90%"),
  },
  iconWrapper: {
    marginBottom: hp("4%"),
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 100,
    padding: wp("5%"),
  },
  lottie: {
    width: hp("20%"),
    height: hp("20%"),
  },
  title: {
    fontSize: hp("3.5%"),
    fontWeight: "bold",
    marginBottom: hp("2%"),
    textAlign: "center",
    fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
    letterSpacing: 0.5,
  },
  message: {
    fontSize: hp("2.2%"),
    color: "#666666",
    textAlign: "center",
    maxWidth: wp("80%"),
    lineHeight: hp("3%"),
    marginBottom: hp("3%"),
  },
  successText: {
    color: "#4CAF50",
    textShadowColor: "rgba(76, 175, 80, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  failureText: {
    color: "#FF4444",
  },
  cancelledText: {
    color: "#FFB74D",
  },
  redirectContainer: {
    marginTop: hp("2%"),
    alignItems: "center",
  },
  redirectText: {
    fontSize: hp("1.8%"),
    color: "#888888",
    marginBottom: hp("1%"),
  },
  redirectButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: wp("6%"),
    paddingVertical: hp("1.5%"),
    borderRadius: 25,
    marginTop: hp("1%"),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  redirectButtonText: {
    color: "#FFFFFF",
    fontSize: hp("2%"),
    fontWeight: "600",
  },
});

export default DonateOnline;
