import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Animated,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/JWTContext";
import axiosInstance from "@/utils/config";
import { SafeAreaView } from "react-native-safe-area-context";

// Types and Interfaces
interface Message {
  id: string | number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  loading?: boolean;
}

interface ChatThread {
  id: string | number;
  messages: Message[];
  timestamp: Date;
}

interface QuickReply {
  id: string;
  text: string;
}

// Constants
const MOCK_QUICK_REPLIES: QuickReply[] = [
  { id: "1", text: "What is SALEAF?" },
  { id: "2", text: "What is the mission of SALEAF?" },
  { id: "3", text: "Is SALEAF affiliated with any other organizations?" },
  { id: "4", text: "When was SALEAF founded?" },
  { id: "5", text: "What is the objective of SALEAF?" },
  { id: "6", text: "How can I make a donation?" },
  {
    id: "7",
    text: "Why is financial assistance needed for South African Lebanese students?",
  },
];

// Sub-components
const TypingIndicator: React.FC = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={[styles.message, styles.botMessage, { paddingVertical: hp("1%") }]}
    >
      <View style={styles.typingContainer}>
        <View style={styles.typingDot} />
        <View style={styles.typingDot} />
        <View style={styles.typingDot} />
      </View>
    </View>
  );
};

// Main Component
const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showHistory, setShowHistory] = useState(true);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const { authState } = useAuth();

  useEffect(() => {
    if (authState?.authenticated) {
      loadAuthenticatedChatHistory();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fadeAnim.setValue(0);
      slideAnim.setValue(100);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const loadAuthenticatedChatHistory = async () => {
    try {
      const response = await axiosInstance.get(
        "/ChatBot/get-previous-conversation"
      );

      if (response.status === 200) {
        const data = response.data;
        const formattedHistory: ChatThread[] = data.map((item: any) => ({
          id: item.id,
          messages: [
            {
              id: `user-${item.id}`,
              text: item.userQuestion,
              isUser: true,
              timestamp: new Date(item.dateCreated),
            },
            {
              id: `bot-${item.id}`,
              text: JSON.parse(item.botResponse).choices[0].message.content,
              isUser: false,
              timestamp: new Date(item.dateCreated),
            },
          ],
          timestamp: new Date(item.dateCreated),
        }));

        setChatThreads(
          formattedHistory.sort(
            (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
          )
        );
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setChatThreads([
        {
          id: "error",
          messages: [
            {
              id: "error-msg",
              text: "Failed to load chat history. Please try again later.",
              isUser: false,
              timestamp: new Date(),
            },
          ],
          timestamp: new Date(),
        },
      ]);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const endpoint = authState?.authenticated
      ? "/ChatBot/authorize-ask"
      : "/ChatBot/ask";

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: "loading",
      text: "",
      isUser: false,
      timestamp: new Date(),
      loading: true,
    };

    if (!activeThread) {
      const newThread: ChatThread = {
        id: Date.now(),
        messages: [userMessage, loadingMessage],
        timestamp: new Date(),
      };
      setChatThreads((prev) => [newThread, ...prev]);
      setActiveThread(newThread.id.toString());
    } else {
      setChatThreads((prev) =>
        prev.map((thread) =>
          thread.id.toString() === activeThread
            ? {
                ...thread,
                messages: [...thread.messages, userMessage, loadingMessage],
                timestamp: new Date(),
              }
            : thread
        )
      );
    }

    setMessage("");
    setIsLoading(true);
    scrollViewRef.current?.scrollToEnd({ animated: true });

    try {
      const response = await axiosInstance.post(endpoint, {
        message: messageText,
      });

      if (response?.status === 200) {
        setChatThreads((prev) =>
          prev.map((thread) =>
            thread.id.toString() === activeThread
              ? {
                  ...thread,
                  messages: thread.messages
                    .filter((msg) => msg.id !== "loading")
                    .concat({
                      id: Date.now() + 1,
                      text: response.data.reply,
                      isUser: false,
                      timestamp: new Date(),
                    }),
                  timestamp: new Date(),
                }
              : thread
          )
        );

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setChatThreads((prev) =>
        prev.map((thread) =>
          thread.id.toString() === activeThread
            ? {
                ...thread,
                messages: thread.messages.filter((msg) => msg.id !== "loading"),
                timestamp: new Date(),
              }
            : thread
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowHistory(authState?.authenticated || false);
    if (!authState?.authenticated) {
      startNewChat();
    }
  };

  const startNewChat = () => {
    const newThread: ChatThread = {
      id: Date.now(),
      messages: [],
      timestamp: new Date(),
    };
    setChatThreads((prev) => [newThread, ...prev]);
    setActiveThread(newThread.id.toString());
    setShowHistory(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!isOpen) {
    return (
      <TouchableOpacity
        style={styles.fab}
        onPress={handleOpenChat}
        activeOpacity={0.8}
      >
        <MaterialIcons name="chat" size={24} color="white" />
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.chatContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                {!showHistory && activeThread && (
                  <TouchableOpacity
                    onPress={() => setShowHistory(true)}
                    style={styles.backButton}
                  >
                    <MaterialIcons name="arrow-back" size={24} color="#666" />
                  </TouchableOpacity>
                )}
                <View style={styles.onlineDot} />
                <Text style={styles.headerTitle}>
                  {showHistory ? "Chat History" : "Support Chat"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {showHistory ? (
            <ScrollView style={styles.historyContainer}>
              <TouchableOpacity
                style={styles.newChatButton}
                onPress={startNewChat}
              >
                <MaterialIcons name="add" size={24} color="#007AFF" />
                <Text style={styles.newChatText}>Start New Chat</Text>
              </TouchableOpacity>

              {chatThreads.map((thread) => (
                <TouchableOpacity
                  key={thread.id}
                  style={styles.historyItem}
                  onPress={() => {
                    setActiveThread(thread.id.toString());
                    setShowHistory(false);
                  }}
                >
                  <View style={styles.historyItemContent}>
                    <View style={styles.historyItemHeader}>
                      <Text style={styles.historyItemTitle}>
                        {thread.messages[0]?.text || "New Chat"}
                      </Text>
                      <Text style={styles.historyItemDate}>
                        {formatTime(thread.timestamp)}
                      </Text>
                    </View>
                    <Text style={styles.historyItemMessage} numberOfLines={1}>
                      {thread.messages[0]?.text || "New Chat"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{ flex: 1 }}
            >
              <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={{ flexGrow: 1 }}
                onContentSizeChange={() =>
                  scrollViewRef.current?.scrollToEnd({ animated: true })
                }
              >
                {activeThread &&
                  chatThreads
                    .find((thread) => thread.id.toString() === activeThread)
                    ?.messages.map((msg) => (
                      <View
                        key={msg.id}
                        style={[
                          styles.messageWrapper,
                          msg.isUser
                            ? styles.userMessageWrapper
                            : styles.botMessageWrapper,
                        ]}
                      >
                        {msg.loading ? (
                          <TypingIndicator />
                        ) : (
                          <View
                            style={[
                              styles.message,
                              msg.isUser
                                ? styles.userMessage
                                : styles.botMessage,
                            ]}
                          >
                            <Text
                              style={[
                                styles.messageText,
                                msg.isUser
                                  ? styles.userMessageText
                                  : styles.botMessageText,
                              ]}
                            >
                              {msg.text}
                            </Text>
                            <Text
                              style={[
                                styles.timestamp,
                                msg.isUser
                                  ? styles.userTimestamp
                                  : styles.botTimestamp,
                              ]}
                            >
                              {formatTime(msg.timestamp)}
                            </Text>
                          </View>
                        )}
                      </View>
                    ))}
              </ScrollView>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.quickRepliesContainer}
              >
                {MOCK_QUICK_REPLIES.map((reply) => (
                  <TouchableOpacity
                    key={reply.id}
                    style={styles.quickReply}
                    onPress={() => sendMessage(reply.text)}
                  >
                    <Text style={styles.quickReplyText}>{reply.text}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  maxLength={500}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    message.trim()
                      ? styles.sendButtonActive
                      : styles.sendButtonInactive,
                  ]}
                  onPress={() => sendMessage(message)}
                  disabled={!message.trim()}
                >
                  <MaterialIcons
                    name="send"
                    size={24}
                    color={message.trim() ? "#007AFF" : "#999"}
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 10,
    zIndex: 9999,
  },
  fab: {
    backgroundColor: "#007AFF",
    width: Platform.OS === "ios" ? wp("16%") : wp("14%"),
    height: Platform.OS === "ios" ? wp("16%") : wp("14%"),
    borderRadius: Platform.OS === "ios" ? wp("8%") : wp("7%"),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: wp("20%"),
    right: wp("0%"),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  chatContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    padding: wp("4%"),
    zIndex: 10,
    height: Platform.OS === "ios" ? hp("8%") : hp("9%"),
    justifyContent: "center",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("2%"),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineDot: {
    width: wp("2%"),
    height: wp("2%"),
    borderRadius: wp("1%"),
    backgroundColor: "#4CAF50",
    marginRight: wp("2%"),
  },
  headerTitle: {
    fontSize: Platform.OS === "ios" ? wp("4.5%") : wp("5%"),
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: wp("2%"),
  },
  backButton: {
    marginRight: wp("2%"),
    padding: wp("2%"),
  },
  messagesContainer: {
    flex: 1,
    padding: wp("4%"),
    backgroundColor: "#F8F9FA",
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: hp("2%"),
    width: "100%",
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
  },
  botMessageWrapper: {
    justifyContent: "flex-start",
  },
  message: {
    maxWidth: "85%",
    padding: wp("4%"),
    borderRadius: wp("4%"),
    marginVertical: hp("0.5%"),
  },
  userMessage: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: wp("1%"),
    marginLeft: "auto",
  },
  botMessage: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: wp("1%"),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  messageText: {
    fontSize: Platform.OS === "ios" ? wp("4%") : wp("4.5%"),
    lineHeight: Platform.OS === "ios" ? wp("5.5%") : wp("6%"),
  },
  userMessageText: {
    color: "white",
  },
  botMessageText: {
    color: "#333",
  },
  timestamp: {
    fontSize: Platform.OS === "ios" ? wp("3%") : wp("3.5%"),
    marginTop: hp("0.5%"),
    alignSelf: "flex-end",
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  botTimestamp: {
    color: "rgba(0, 0, 0, 0.5)",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: wp("3%"),
    marginLeft: wp("2%"),
  },
  typingDot: {
    width: wp("2.5%"),
    height: wp("2.5%"),
    borderRadius: wp("1.25%"),
    backgroundColor: "#999",
    marginHorizontal: wp("1%"),
    opacity: 0.6,
  },
  quickRepliesContainer: {
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("4%"),
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    maxHeight: hp("12%"),
    backgroundColor: "#FFFFFF",
  },
  quickReply: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.5%"),
    borderRadius: wp("6%"),
    marginRight: wp("2%"),
    marginVertical: hp("0.5%"),
  },
  quickReplyText: {
    fontSize: Platform.OS === "ios" ? wp("3.8%") : wp("4%"),
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("4%"),
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "white",
    minHeight: Platform.OS === "ios" ? hp("8%") : hp("9%"),
  },
  input: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: wp("6%"),
    paddingHorizontal: wp("5%"),
    paddingVertical: Platform.OS === "ios" ? hp("1.5%") : hp("1.8%"),
    fontSize: Platform.OS === "ios" ? wp("4%") : wp("4.5%"),
    maxHeight: hp("15%"),
    color: "#333",
    minHeight: Platform.OS === "ios" ? hp("5%") : hp("6%"),
  },
  sendButton: {
    marginLeft: wp("3%"),
    padding: wp("3%"),
    height: Platform.OS === "ios" ? hp("6%") : hp("7%"),
    width: Platform.OS === "ios" ? wp("12%") : wp("14%"),
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {
    transform: [{ scale: 1 }],
  },
  sendButtonInactive: {
    transform: [{ scale: 0.9 }],
    opacity: 0.7,
  },
  historyContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("5%"),
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#F8F9FA",
  },
  newChatText: {
    marginLeft: wp("2%"),
    fontSize: Platform.OS === "ios" ? wp("4.5%") : wp("4.8%"),
    color: "#007AFF",
    fontWeight: "500",
  },
  historyItem: {
    padding: wp("5%"),
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  historyItemTitle: {
    fontSize: Platform.OS === "ios" ? wp("4.2%") : wp("4.5%"),
    fontWeight: "500",
    color: "#333",
  },
  historyItemDate: {
    fontSize: Platform.OS === "ios" ? wp("3.5%") : wp("3.8%"),
    color: "#999",
  },
  historyItemMessage: {
    fontSize: Platform.OS === "ios" ? wp("4%") : wp("4.2%"),
    color: "#666",
    marginTop: hp("0.5%"),
  },
});

export default FloatingChatbot;
