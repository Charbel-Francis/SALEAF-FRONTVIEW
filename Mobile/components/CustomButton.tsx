import { ButtonProps } from "@/types/types";
import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const CustomButton = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  style,
  textStyle,
  className,
  loading = false,
  ...props
}: ButtonProps & {
  loading?: boolean;
  style?: any;
  textStyle?: any;
}) => {
  const styles = StyleSheet.create({
    keyboardAvoid: {
      width: "100%",
    },
    buttonContainer: {
      backgroundColor: bgVariant === "primary" ? "#3B82F6" : "#fff", // blue-500 as default
      borderRadius: wp("8%"), // rounded-full equivalent
      paddingHorizontal: wp("4%"),
      paddingVertical: hp("1.2%"),
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      minWidth: wp("25%"), // minimum width
      minHeight: hp("5%"), // minimum height
    },
    buttonText: {
      color: textVariant === "default" ? "#FFFFFF" : "#000000",
      fontSize: wp("4%"),
      fontWeight: "700",
      textAlign: "center",
      marginHorizontal: wp("1%"),
    },
    icon: {
      marginHorizontal: wp("1%"),
    },
    loadingContainer: {
      padding: wp("1%"),
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.keyboardAvoid]}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={loading}
        style={[
          styles.buttonContainer,
          style,
          className, // If using a CSS-in-JS solution that processes className
        ]}
        {...props}
      >
        {IconLeft && !loading && (
          <IconLeft style={styles.icon} size={wp("5%")} />
        )}

        {loading ? (
          <ActivityIndicator
            color="white"
            size="small"
            style={styles.loadingContainer}
          />
        ) : (
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        )}

        {IconRight && !loading && (
          <IconRight style={styles.icon} size={wp("5%")} />
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default CustomButton;
