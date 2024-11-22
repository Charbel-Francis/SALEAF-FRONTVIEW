import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface QuickReply {
  id: string;
  text: string;
}

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const quickReplies: QuickReply[] = [
    { id: "1", text: "How to submit makrs?" },
    { id: "2", text: "View my grades" },
    { id: "3", text: "Course schedule" },
    { id: "4", text: "Contact support" },
  ];

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleQuickReply = (reply: QuickReply) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: reply.text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  if (!isOpen) {
    return (
      <TouchableOpacity style={styles.fab} onPress={() => setIsOpen(true)}>
        <MaterialIcons name="chat" size={24} color="white" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.chatContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.onlineDot} />
              <Text style={styles.headerTitle}>Support Chat</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView style={styles.messagesContainer}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageWrapper,
                msg.isUser
                  ? styles.userMessageWrapper
                  : styles.botMessageWrapper,
              ]}
            >
              <View
                style={[
                  styles.message,
                  msg.isUser ? styles.userMessage : styles.botMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.isUser ? styles.userMessageText : styles.botMessageText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Quick Replies */}
        <ScrollView
          horizontal
          style={styles.quickRepliesContainer}
          showsHorizontalScrollIndicator={false}
        >
          {quickReplies.map((reply) => (
            <TouchableOpacity
              key={reply.id}
              style={styles.quickReply}
              onPress={() => handleQuickReply(reply)}
            >
              <Text style={styles.quickReplyText}>{reply.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <MaterialIcons
                name="send"
                size={24}
                color={message.trim() ? "#007AFF" : "#CCC"}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: hp("2%"),
    right: wp("2%"),
    zIndex: 9999,
    width: "auto",
    height: "auto",
  },
  fab: {
    backgroundColor: "#007AFF",
    width: wp("8%"),
    height: wp("8%"),
    borderRadius: wp("4%"),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  chatContainer: {
    position: "absolute",
    bottom: hp("10%"),
    right: 0,
    width: wp("80%"),
    height: hp("80%"),
    backgroundColor: "white",
    borderRadius: wp("2%"),
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    padding: wp("3%"),
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineDot: {
    width: wp("1.5%"),
    height: wp("1.5%"),
    borderRadius: wp("0.75%"),
    backgroundColor: "#4CAF50",
    marginRight: wp("1.5%"),
  },
  headerTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: wp("1%"),
  },
  messagesContainer: {
    flex: 1,
    padding: wp("3%"),
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: hp("1%"),
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
  },
  botMessageWrapper: {
    justifyContent: "flex-start",
  },
  message: {
    maxWidth: "80%",
    padding: wp("3%"),
    borderRadius: wp("2%"),
  },
  userMessage: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: wp("1%"),
  },
  botMessage: {
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: wp("1%"),
  },
  messageText: {
    fontSize: wp("3.5%"),
  },
  userMessageText: {
    color: "white",
  },
  botMessageText: {
    color: "#333",
  },
  quickRepliesContainer: {
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("3%"),
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    maxHeight: hp("10%"),
  },
  quickReply: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    borderRadius: wp("4%"),
    marginRight: wp("2%"),
  },
  quickReplyText: {
    fontSize: wp("3%"),
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("3%"),
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: wp("5%"),
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    fontSize: wp("3.5%"),
    maxHeight: hp("12%"),
    color: "#333",
  },
  sendButton: {
    marginLeft: wp("2%"),
    padding: wp("2%"),
  },
});

export default FloatingChatbot;
