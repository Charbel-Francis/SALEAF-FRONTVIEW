import { DualInputFieldProps, InputFieldProps } from "@/types/types";
import React from "react";
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
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <Text className={`text-lg font-sans mb-3 ${labelStyle}`}>
            {label}
          </Text>
          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500  ${containerStyle}`}
          >
            {icon &&
              (typeof icon === "string" ? (
                <Image
                  source={{ uri: icon }}
                  className={`w-6 h-6 ml-4 ${iconStyle}`}
                />
              ) : (
                React.cloneElement(icon)
              ))}
            <TextInput
              className={`rounded-full p-4 font-sans text-[15px] flex-1 ${inputStyle} text-left`}
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
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  onChangeFirstName,
  onChangeLastName,
  ...props
}: DualInputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`my-2 w-full ${containerStyle}`}>
          <View className="flex flex-row justify-between items-start">
            {/* First Input Field */}
            <View className="flex-1 mr-2">
              <Text className={`text-lg font-sans mb-3 ${labelStyle}`}>
                {label1}
              </Text>
              <View
                className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-mainColor`}
              >
                {icon1 &&
                  (typeof icon1 === "string" ? (
                    <Image
                      source={{ uri: icon1 }}
                      className={`w-6 h-6 ml-4 ${iconStyle}`}
                    />
                  ) : (
                    React.cloneElement(icon1)
                  ))}
                <TextInput
                  placeholder="First Name"
                  className={`rounded-full p-4 font-sans text-[15px] flex-1 ${inputStyle} text-left`}
                  onChangeText={onChangeLastName}
                  {...props}
                />
              </View>
            </View>
            {/* Second Input Field */}
            <View className="flex-1 ml-2">
              <Text className={`text-lg font-sans mb-3 ${labelStyle}`}>
                {label2}
              </Text>
              <View
                className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-mainColor`}
              >
                {icon2 &&
                  (typeof icon2 === "string" ? (
                    <Image
                      source={{ uri: icon2 }}
                      className={`w-6 h-6 ml-4 ${iconStyle}`}
                    />
                  ) : (
                    React.cloneElement(icon2)
                  ))}
                <TextInput
                  placeholder="Last Name"
                  className={`rounded-full p-4 font-sans text-[15px] flex-1 ${inputStyle} text-left`}
                  onChangeText={onChangeLastName}
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
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full text-center">
          <Text
            className={`text-lg font-sans mb-3 justify-center ${labelStyle}`}
            style={{ textAlign: "center" }} // This centers the label text
          >
            {label}
          </Text>
          <View
            className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500  ${containerStyle}`}
          >
            {icon &&
              (typeof icon === "string" ? (
                <Image
                  source={{ uri: icon }}
                  className={`w-6 h-6 ml-4 ${iconStyle}`}
                />
              ) : (
                React.cloneElement(icon)
              ))}
            <TextInput
              className={`rounded-full p-4 font-sans text-[15px] flex-1 ${inputStyle} text-left`}
              keyboardType="numeric"
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};