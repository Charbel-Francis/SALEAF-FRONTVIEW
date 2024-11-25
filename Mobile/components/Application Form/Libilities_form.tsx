import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard,
} from "react-native";
import { InputField } from "../InputField";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Card } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AppUser } from "@/constants";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    borderRadius: wp("4%"),
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: wp("2%"),
    paddingBottom: hp("15%"),
    gap: hp("2%"),
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "700",
    textAlign: "center",
    marginVertical: hp("2%"),
    color: "#15783D",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#15783D",
    textAlign: "center",
    marginTop: 0,
    letterSpacing: 0.3,
  },
  card: {
    width: wp("75%"),
    alignSelf: "center",
    marginBottom: hp("1.5%"),
    borderRadius: wp("3%"),
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E8EFF5",
  },
  cardContent: {
    padding: wp("3%"),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("3%"),
    borderBottomWidth: 1,
    borderBottomColor: "#E8EFF5",
    backgroundColor: "#FAFBFD",
    borderTopLeftRadius: wp("3%"),
    borderTopRightRadius: wp("3%"),
  },
  cardTitle: {
    fontSize: wp("3.8%"),
    fontWeight: "600",
    color: "#15783D",
    letterSpacing: 0.3,
  },
  cardHint: {
    fontSize: wp("2.8%"),
    color: "#94A3B8",
    fontStyle: "italic",
    fontWeight: "500",
  },
  input: {
    height: hp("2.5%"),
    borderRadius: wp("2.5%"),
    marginBottom: hp("1.5%"),
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    paddingHorizontal: wp("3%"),
    fontSize: wp("3.5%"),
  },
  multilineInput: {
    minHeight: hp("12%"),
    borderRadius: wp("2.5%"),
    marginBottom: hp("1.5%"),
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    paddingHorizontal: wp("3%"),
    paddingTop: hp("1.5%"),
    fontSize: wp("3.5%"),
    textAlignVertical: "top",
  },
  expandedCard: {
    borderColor: "#15783D",
    borderWidth: 1.5,
    transform: [{ scale: 1.01 }],
  },
  iconContainer: {
    width: wp("7%"),
    height: wp("7%"),
    borderRadius: wp("3.5%"),
    backgroundColor: "#F0F7F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("2%"),
  },
});

interface AnimationState {
  height: Animated.Value;
  opacity: Animated.Value;
}

const Liabilities_Form = ({
  updateState,
  application,
}: {
  updateState: (updates: Partial<AppUser>) => void;
  application: AppUser;
}) => {
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const animations = useRef<{ [key: string]: AnimationState }>({}).current;

  useEffect(() => {
    const fields = [
      "unsecuredBorrowings",
      "contingentLiabilities",
      "totalAssetsLiabilities",
    ];

    fields.forEach((field) => {
      animations[field] = {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0),
      };
    });
  }, []);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const toggleField = (fieldName: string) => {
    const isExpanding = expandedField !== fieldName;

    if (expandedField) {
      Animated.parallel([
        Animated.timing(animations[expandedField].height, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(animations[expandedField].opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }

    setExpandedField(isExpanding ? fieldName : null);
    Animated.parallel([
      Animated.timing(animations[fieldName].height, {
        toValue: isExpanding ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animations[fieldName].opacity, {
        toValue: isExpanding ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();

    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: Object.keys(animations).indexOf(fieldName) * hp("10%"),
        animated: true,
      });
    }, 100);
  };

  // Update the renderCard function
  const renderCard = (
    fieldName: string,
    title: string,
    content: React.ReactNode,
    contentHeight: number
  ) => {
    const isExpanded = expandedField === fieldName;

    if (!animations[fieldName]) {
      animations[fieldName] = {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0),
      };
    }

    const iconStyle = {
      width: wp("7%"),
      height: wp("7%"),
      borderRadius: wp("3.5%"),
      backgroundColor: isExpanded ? "#E8F5EE" : "#F0F7F4",
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginRight: wp("2%"),
    };

    const getIcon = () => {
      switch (fieldName) {
        case "unsecuredBorrowings":
          return <Ionicons name="wallet" size={wp("4%")} color="#666" />;
        case "contingentLiabilities":
          return <Ionicons name="alert-circle" size={wp("4%")} color="#666" />;
        case "totalAssetsLiabilities":
          return <Ionicons name="calculator" size={wp("4%")} color="#666" />;
        default:
          return <Ionicons name="cash" size={wp("4%")} color="#666" />;
      }
    };

    return (
      <View
        key={`liability-${fieldName}`}
        style={[styles.card, isExpanded && styles.expandedCard]}
      >
        <TouchableOpacity
          onPress={() => toggleField(fieldName)}
          activeOpacity={0.7}
          style={{ overflow: "hidden", borderRadius: wp("3%") }}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={iconStyle}>{getIcon()}</View>
              <View>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={[styles.cardHint, { marginTop: hp("0.5%") }]}>
                  {isExpanded ? "Tap to close" : "Tap to edit"}
                </Text>
              </View>
            </View>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: animations[fieldName].height.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "180deg"],
                    }),
                  },
                ],
              }}
            >
              <Ionicons
                name="chevron-down"
                size={wp("4.5%")}
                color={isExpanded ? "#15783D" : "#94A3B8"}
              />
            </Animated.View>
          </View>

          <Animated.View
            style={{
              opacity: animations[fieldName].opacity,
              maxHeight: animations[fieldName].height.interpolate({
                inputRange: [0, 1],
                outputRange: [0, contentHeight],
              }),
            }}
          >
            <View style={[styles.cardContent, { paddingTop: hp("2%") }]}>
              {content}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Text style={styles.title}>
          Person Statement of Assets and Liability
        </Text>

        <Text style={[styles.title, { fontSize: wp("4%"), marginTop: 0 }]}>
          Other liabilities
        </Text>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: keyboardHeight + hp("10%") },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {renderCard(
            "unsecuredBorrowings",
            "Unsecured Borrowings",
            <View>
              <InputField
                label="Overdrafts"
                placeholder="Enter Overdrafts"
                textContentType="none"
                className="h-8"
                keyboardType="numeric"
                onChangeText={(value) => {
                  updateState({ overdrafts: parseInt(value) });
                }}
                value={application.overdrafts?.toString() ?? ""}
                icon={<Ionicons name="cash" size={20} color="gray" />}
                style={styles.input}
              />
              <InputField
                label="Unsecured Loans"
                placeholder="Enter Unsecured Loans"
                textContentType="none"
                className="h-8"
                keyboardType="numeric"
                onChangeText={(value) => {
                  updateState({ unsecuredLoans: parseInt(value) });
                }}
                value={application.unsecuredLoans?.toString() ?? ""}
                icon={<Ionicons name="cash" size={20} color="gray" />}
                style={styles.input}
              />
              <InputField
                label="Credit Cards"
                placeholder="Enter Credit Card Debts"
                textContentType="none"
                className="h-8"
                keyboardType="numeric"
                value={application.creditCardDebts?.toString() ?? ""}
                onChangeText={(value) => {
                  updateState({ creditCardDebts: parseInt(value) });
                }}
                icon={<Ionicons name="card" size={20} color="gray" />}
                style={styles.input}
              />
              <InputField
                label="Income Tax"
                placeholder="Enter Income Tax Debts"
                textContentType="none"
                className="h-8"
                keyboardType="numeric"
                value={application.incomeTaxDebts?.toString() ?? ""}
                onChangeText={(value) => {
                  updateState({ incomeTaxDebts: parseInt(value) });
                }}
                icon={<Ionicons name="calculator" size={20} color="gray" />}
                style={styles.input}
              />
            </View>,
            hp("50%")
          )}

          {renderCard(
            "contingentLiabilities",
            "Contingent Liabilities",
            <View>
              <InputField
                label="Other"
                placeholder="Contingent Liabilities (e.g Suretyships)"
                textContentType="none"
                multiline
                onChangeText={(value) => {
                  updateState({ contingentLiabilities: parseInt(value) });
                }}
                value={application.contingentLiabilities?.toString() ?? ""}
                keyboardType="numeric"
                className="h-20"
                style={styles.multilineInput}
              />
            </View>,
            hp("30%")
          )}

          {renderCard(
            "totalAssetsLiabilities",
            "Total of Assets & Liabilities",
            <View>
              <InputField
                label="Total of Assets & Liabilities"
                placeholder="Net Asset Value (Assets Less Liabilities)"
                textContentType="none"
                multiline
                keyboardType="numeric"
                onChangeText={(value) => {
                  updateState({ totalOfAssetsAndLiabilities: parseInt(value) });
                }}
                value={
                  application.totalOfAssetsAndLiabilities?.toString() ?? ""
                }
                className="h-20"
                style={styles.multilineInput}
              />
            </View>,
            hp("30%")
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Liabilities_Form;
