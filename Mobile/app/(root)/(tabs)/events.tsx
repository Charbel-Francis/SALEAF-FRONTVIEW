import React from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const Events = () => {
  const injectedJS = `
    document.addEventListener('DOMContentLoaded', function() {
      window.localStorage.setItem('serviceToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTg3ODA5MjczZTI4Yjk2ZDJlMzg1MzgiLCJpYXQiOjE3MjY3MjQ3NzEsImV4cCI6MTcyNjgxMTE3MX0.VM5p84DQuA9PCm3eoOHHXseFneeTHEIKa_shFX04WnY');
      window.localStorage.setItem('mobileView', 'true');
    });
    true;
`;

  return (
    <WebView
      source={{
        uri: "http://localhost:3000/react/components-overview/buttons",
      }}
      originWhitelist={["*"]}
      style={{ overflow: "scroll" }}
      scalesPageToFit={false}
      scrollEnabled={true}
      mixedContentMode={"compatibility"}
      thirdPartyCookiesEnabled={true}
      domStorageEnabled={true}
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
      injectedJavaScript={injectedJS}
      javaScriptEnabled={true}
      hideKeyboardAccessoryView={true}
      allowsLinkPreview={false}
    />
  );
};

export default Events;
