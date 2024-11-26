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
import {
  WebView,
  WebViewNavigation,
  WebViewMessageEvent,
} from "react-native-webview";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

// Payment status constants
const PAYMENT_STATUS = {
  NONE: 0,
  SUCCESS: 1,
  FAILURE: 2,
  CANCELLED: 3,
} as const;

type PaymentStatusType = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

type StepType = {
  id: number;
  title: string;
  description: string;
};

const STEPS: StepType[] = [
  {
    id: 1,
    title: "Payment",
    description: "Complete your payment",
  },
  {
    id: 2,
    title: "Confirmation",
    description: "Registration status",
  },
];

const INJECTED_JAVASCRIPT = `
  const meta = document.createElement('meta');
  meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
  meta.setAttribute('name', 'viewport');
  document.getElementsByTagName('head')[0].appendChild(meta);
  
  document.body.style.width = '100%';
  
  const style = document.createElement('style');
  style.innerHTML = 'body { min-width: 100vw; max-width: 100vw; overflow-x: hidden; } * { max-width: 100vw; }';
  document.head.appendChild(style);
  
  function checkUrl() {
    const currentUrl = window.location.href;
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'urlChange',
      url: currentUrl
    }));
  }

  setInterval(checkUrl, 500);
  
  const observer = new MutationObserver(checkUrl);
  observer.observe(document, { subtree: true, childList: true });
  
  true;
`;

const StepIndicator = ({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: StepType[];
}) => {
  return (
    <View style={styles.stepContainer}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <View style={styles.stepWrapper}>
            <View
              style={[
                styles.stepCircle,
                currentStep >= step.id && styles.activeStep,
              ]}
            >
              {currentStep > step.id ? (
                <MaterialIcons name="check" size={16} color="#FFFFFF" />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    currentStep >= step.id && styles.activeStepNumber,
                  ]}
                >
                  {step.id}
                </Text>
              )}
            </View>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          </View>
          {index < steps.length - 1 && (
            <View
              style={[
                styles.stepConnector,
                currentStep > step.id && styles.activeConnector,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const DonateOnline = () => {
  const { donationLink } = useLocalSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusType>(
    PAYMENT_STATUS.NONE
  );
  const [currentStep, setCurrentStep] = useState(2);
  const [countdown, setCountdown] = useState(10);
  const scaleValue = new Animated.Value(0);
  const shakeAnimation = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  const navigateToEvents = useCallback(() => {
    router.replace("/events");
  }, []);

  const handleAnimation = useCallback(
    (status: PaymentStatusType) => {
      switch (status) {
        case PAYMENT_STATUS.SUCCESS:
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

        case PAYMENT_STATUS.FAILURE:
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

        case PAYMENT_STATUS.CANCELLED:
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

  const checkUrlForStatus = useCallback(
    (url: string) => {
      console.log("Checking URL:", url);
      const urlLower = url.toLowerCase();

      if (urlLower.includes("success")) {
        console.log("Success detected");
        setPaymentStatus(PAYMENT_STATUS.SUCCESS);
        setCurrentStep(2);
        handleAnimation(PAYMENT_STATUS.SUCCESS);
      } else if (urlLower.includes("failure") || urlLower.includes("failed")) {
        console.log("Failure detected");
        setPaymentStatus(PAYMENT_STATUS.FAILURE);
        setCurrentStep(2);
        handleAnimation(PAYMENT_STATUS.FAILURE);
      } else if (urlLower.includes("cancel")) {
        console.log("Cancellation detected");
        setPaymentStatus(PAYMENT_STATUS.CANCELLED);
        setCurrentStep(2);
        handleAnimation(PAYMENT_STATUS.CANCELLED);
      }
    },
    [handleAnimation]
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    // if (paymentStatus !== PAYMENT_STATUS.NONE) {
    //   timer = setInterval(() => {
    //     setCountdown((prev) => {
    //       if (prev <= 1) {
    //         clearInterval(timer);
    //         navigateToEvents();
    //         return 0;
    //       }
    //       return prev - 1;
    //     });
    //   }, 1000);
    // }
    // return () => timer && clearInterval(timer);
  }, [paymentStatus, navigateToEvents]);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === "urlChange" && data.url) {
          checkUrlForStatus(data.url);
        }
      } catch (error) {
        console.error("Error handling WebView message:", error);
      }
    },
    [checkUrlForStatus]
  );

  const renderRedirectMessage = useCallback(
    () => (
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
    ),
    [countdown, fadeAnim, navigateToEvents]
  );

  const renderStatus = useCallback(() => {
    const statusComponents = {
      [PAYMENT_STATUS.SUCCESS]: (
        <BlurView intensity={100} style={styles.container}>
          <View style={styles.iconWrapper}>
            <LottieView
              source={require("@/assets/icons/paymentsucess.json")}
              autoPlay
              loop={true}
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
        </BlurView>
      ),
      [PAYMENT_STATUS.FAILURE]: (
        <BlurView intensity={100} style={styles.container}>
          <View style={styles.iconWrapper}>
            <LottieView
              source={require("@/assets/icons/paymentfailure.json")}
              autoPlay
              loop={true}
              style={styles.lottie}
            />
          </View>
          <Text style={[styles.title, styles.failureText]}>
            Registration Failed
          </Text>
          <Text style={styles.message}>
            We encountered an issue processing your registration. Please try
            again or contact support.
          </Text>
          {renderRedirectMessage()}
        </BlurView>
      ),
      [PAYMENT_STATUS.CANCELLED]: (
        <BlurView intensity={100} style={styles.container}>
          <View style={styles.iconWrapper}>
            <LottieView
              source={require("@/assets/icons/paymentfailure.json")}
              autoPlay
              loop={true}
              style={styles.lottie}
            />
          </View>
          <Text style={[styles.title, styles.cancelledText]}>
            Registration Cancelled
          </Text>
          <Text style={styles.message}>
            Your registration request was cancelled. Feel free to try again when
            you're ready.
          </Text>
          {renderRedirectMessage()}
        </BlurView>
      ),
    };

    return (
      statusComponents[paymentStatus as keyof typeof statusComponents] || null
    );
  }, [
    paymentStatus,
    scaleValue,
    shakeAnimation,
    fadeAnim,
    renderRedirectMessage,
  ]);
  if (!donationLink) {
    console.log("No donation link provided");
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <StepIndicator currentStep={currentStep} steps={STEPS} />
        <View style={styles.contentContainer}>
          {paymentStatus !== PAYMENT_STATUS.NONE ? (
            renderStatus()
          ) : (
            <WebView
              source={{
                uri: donationLink as string,
                headers: {
                  "Content-Type": "text/html; charset=utf-8",
                  "Cache-Control": "no-cache",
                },
              }}
              style={styles.webView}
              injectedJavaScript={INJECTED_JAVASCRIPT}
              onMessage={handleMessage}
              onNavigationStateChange={({ url }) => checkUrlForStatus(url)}
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
                  <ActivityIndicator size="large" color="#007AFF" />
                </View>
              )}
              onError={(syntheticEvent) => {
                console.warn("WebView error: ", syntheticEvent.nativeEvent);
              }}
            />
          )}
        </View>
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
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  stepContainer: {
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  stepWrapper: {
    flex: 1,
    alignItems: "center",
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EEEEEE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#DDDDDD",
  },
  activeStep: {
    backgroundColor: "#007AFF",
    borderColor: "#0056B3",
  },
  stepNumber: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "bold",
  },
  activeStepNumber: {
    color: "#FFFFFF",
  },
  stepTextContainer: {
    alignItems: "center",
    paddingHorizontal: 4,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 2,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 10,
    color: "#666666",
    textAlign: "center",
  },
  stepConnector: {
    width: wp("10%"),
    height: 2,
    backgroundColor: "#EEEEEE",
    alignSelf: "center",
    marginTop: -hp("2%"),
  },
  activeConnector: {
    backgroundColor: "#007AFF",
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
