import { DualInputFieldProps, InputFieldProps } from "@/types/types";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Text,
  View,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
  Keyboard,
} from "react-native";

export const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle = "",
  containerStyle = "",
  inputStyle = "",
  iconStyle = "",
  className = "",
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`my-2 w-full ${className}`}>
          <Text className={`text-base md:text-lg mb-1 md:mb-3 ${labelStyle}`}>
            {label}
          </Text>
          <View
            className={`flex flex-row items-center bg-neutral-100 rounded-lg border border-neutral-300 p-2 md:p-3 ${containerStyle}`}
          >
            {icon &&
              (typeof icon === "string" ? (
                <Image
                  source={{ uri: icon }}
                  className={`w-5 h-5 md:w-6 md:h-6 ml-3 ${iconStyle}`}
                />
              ) : (
                React.cloneElement(icon, { style: { width: 24, height: 24 } })
              ))}
            <TextInput
              className={`flex-1 text-sm md:text-base ${inputStyle}`}
              secureTextEntry={secureTextEntry}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export const DualInputField = ({
  label1,
  label2,
  icon1,
  icon2,
  labelStyle = "",
  containerStyle = "",
  inputStyle = "",
  iconStyle = "",
  placeholder1 = "",
  placeholder2 = "",
  onChange1,
  onChange2,
  ...props
}: DualInputFieldProps) => {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`my-2 w-full ${containerStyle}`}>
          <View className="flex flex-row justify-between space-x-2">
            {/* First Input Field */}
            <View className="flex-1">
              <Text className={`text-base md:text-lg mb-1 ${labelStyle}`}>
                {label1}
              </Text>
              <View className="flex flex-row items-center bg-neutral-100 rounded-lg border border-neutral-300 p-2">
                {icon1 &&
                  (typeof icon1 === "string" ? (
                    <Image
                      source={{ uri: icon1 }}
                      className={`w-5 h-5 ml-3 ${iconStyle}`}
                    />
                  ) : (
                    React.cloneElement(icon1, { style: { width: 24, height: 24 } })
                  ))}
                <TextInput
                  placeholder={placeholder1}
                  className={`flex-1 text-sm md:text-base ${inputStyle}`}
                  onChangeText={onChange1}
                  {...props}
                />
              </View>
            </View>
            {/* Second Input Field */}
            <View className="flex-1">
              <Text className={`text-base md:text-lg mb-1 ${labelStyle}`}>
                {label2}
              </Text>
              <View className="flex flex-row items-center bg-neutral-100 rounded-lg border border-neutral-300 p-2">
                {icon2 &&
                  (typeof icon2 === "string" ? (
                    <Image
                      source={{ uri: icon2 }}
                      className={`w-5 h-5 ml-3 ${iconStyle}`}
                    />
                  ) : (
                    React.cloneElement(icon2, { style: { width: 24, height: 24 } })
                  ))}
                <TextInput
                  placeholder={placeholder2}
                  className={`flex-1 text-sm md:text-base ${inputStyle}`}
                  onChangeText={onChange2}
                  {...props}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};


export const DonateInputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle = "",
  containerStyle = "",
  inputStyle = "",
  iconStyle = "",
  className = "",
  onChangeText,
  ...props
}: InputFieldProps & { onChangeText?: (value: string) => void }) => {
  const [value, setValue] = useState("");

  const handleChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setValue(numericText);
    if (onChangeText) {
      onChangeText(numericText);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`my-2 w-full ${className}`}>
          <Text className={`text-center text-base md:text-lg mb-1 ${labelStyle}`}>
            {label}
          </Text>
          <View
            className={`flex flex-row items-center bg-neutral-100 rounded-lg border border-neutral-300 p-2 md:p-3 ${containerStyle}`}
          >
            {icon &&
              (typeof icon === "string" ? (
                <Image
                  source={{ uri: icon }}
                  className={`w-5 h-5 md:w-6 md:h-6 ml-3 ${iconStyle}`}
                />
              ) : (
                React.cloneElement(icon, { style: { width: 24, height: 24 } })
              ))}
            <TextInput
              className={`flex-1 text-sm md:text-base ${inputStyle}`}
              keyboardType="numeric"
              value={value}
              onChangeText={handleChange}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
