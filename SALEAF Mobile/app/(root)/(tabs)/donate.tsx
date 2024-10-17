import { useAuth } from "@/context/JWTContext";
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

const Chat = () => {
  const { authState } = useAuth();
  const injectedJS = `
   document.addEventListener('DOMContentLoaded', function() {
      window.localStorage.setItem('serviceToken', '${authState?.token}');
      window.localStorage.setItem('mobileView', 'true');
    });
    true;
  `;

  return (
    <WebView
      source={{
        uri: "http://localhost:3000/react/donate/donate",
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
      injectedJavaScriptBeforeContentLoaded={injectedJS}
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
    />
  );
};

export default Chat;
