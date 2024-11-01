import { TextInputProps } from "react-native";

declare interface InputFieldProps extends TextInputProps{
    label:string;
    icon?:string|React.ReactElement;
    secureTextEntry?:boolean;
    labelStyle?:string;
    containerStyle?:string;
    inputStyle?:string;
    iconStyle?:string;
    className?:string;
}

declare interface DualInputFieldProps extends TextInputProps{
    label1:string;
    label2:string;
    icon1?:string|React.ReactElement;
    icon2?:string|React.ReactElement;
    labelStyle?:string;
    containerStyle?:string;
    inputStyle?:string;
    placeholder1?:string;
    placeholder2?:string;
    iconStyle?:string;
    className?:string;
    onChange1?: (text: string) => void;
  onChange2?: (text: string) => void;
}

declare interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
    textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
    IconLeft?: React.ComponentType<any>;
    className?: string;
    IconRight?: React.ComponentType<any>;
    onPress: () => void;
  }
  