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
    value1?:string;
    value2?:string
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
  
  export type EventInterface = {
    eventId: number;
    eventName: string;
    eventDescription: string;
    location: string;
    eventImageUrl: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    status: "Upcoming" | "Ongoing" | "Completed";
    packages:{ packageName:string;
      packagePrice:number;}[];
    // publish: boolean;
  };
  interface Packages{
    packageName:string;
    packagePrice:number;
  }
  export type StudentInterface = {
    id: string;
    firstName: string;
    lastName: string;
    skills: string[];
    achievements: string[];
    year: string;
    isFinalYear: boolean;
    bio: string;
    graduationDate:Date;
    university:string;
    degree:string;
    onlineProfile:string; 
    imageUrl:string;
  };

  export interface Message {
    id: string | number;
    text: string;
    isUser: boolean;
    timestamp: Date;
    loading?: boolean;
  }
  
  export interface ChatThread {
    id: string | number;
    messages: Message[];
    timestamp: Date;
  }
  
  export interface QuickReply {
    id: string;
    text: string;
  }