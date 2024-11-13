import { useAuth } from "@/context/JWTContext";
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

const DonateOnline = ({
  donationLink,
  setSteps,
  setPaymentStatus,
}: {
  donationLink: string;
  setSteps: (steps: number) => void;
  setPaymentStatus: (status: number) => void;
}) => {
  const { authState } = useAuth();
  const webviewRef = React.useRef<WebView>(null);
  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    if (url.includes("success")) {
      setPaymentStatus(1);
      setSteps(4);
    } else if (url.includes("failure")) {
      setPaymentStatus(2);
      setSteps(4);
    } else if (url.includes("cancel")) {
      setPaymentStatus(3);
      setSteps(4);
    }
  };

  return (
    <WebView
      source={{
        uri: donationLink,
      }}
      originWhitelist={["*"]}
      style={{ overflow: "scroll" }}
      scalesPageToFit={false}
      mixedContentMode={"compatibility"}
      thirdPartyCookiesEnabled={true}
      domStorageEnabled={true}
      setBuiltInZoomControls={false}
      startInLoadingState={true}
      renderLoading={() => (
        <View
          style={{
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color="#FF0000" />
        </View>
      )}
      allowUniversalAccessFromFileURLs={true}
      bounces={false}
      automaticallyAdjustContentInsets={false}
      javaScriptEnabled={true}
      hideKeyboardAccessoryView={true}
      allowsLinkPreview={false}
      cacheEnabled={false} // Ensures that no cache is used, forcing a fresh load
      onLoadStart={() => {
        console.log(authState?.token);
      }}
      onLoadEnd={() => {
        console.log("WebView finished loading");
      }}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
};

export default DonateOnline;
