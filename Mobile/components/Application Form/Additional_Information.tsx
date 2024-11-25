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
import { Switch, Card } from "react-native-paper";
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
  iconContainer: {
    width: wp("7%"),
    height: wp("7%"),
    borderRadius: wp("3.5%"),
    backgroundColor: "#F0F7F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("2%"),
  },
  input: {
    minHeight: hp("20%"),
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
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("2%"),
    backgroundColor: "#F8FAFC",
    borderRadius: wp("2.5%"),
    paddingHorizontal: wp("3%"),
    marginVertical: hp("1%"),
    borderWidth: 1,
    borderColor: "#E8EFF5",
  },
  switchCard: {
    width: wp("75%"),
    alignSelf: "center",
  },
  switchText: {
    fontSize: wp("3.5%"),
    color: "#334155",
    fontWeight: "600",
    letterSpacing: 0.2,
    flex: 1,
    marginRight: wp("2%"),
  },
  labelText: {
    fontSize: wp("3.2%"),
    color: "#334155",
    fontWeight: "600",
    marginBottom: hp("0.8%"),
    marginLeft: wp("1%"),
    letterSpacing: 0.2,
  },
  cardDisclose: {
    fontSize: wp("3.5%"),
    color: "#334155",
    fontWeight: "600",
    letterSpacing: 0.2,
    flex: 1,
    marginRight: wp("2%"),
  },
});

interface AnimationState {
  height: Animated.Value;
  opacity: Animated.Value;
}

const Additional_Information_Form = ({
  updateState,
  application,
}: {
  updateState: (updates: Partial<AppUser>) => void;
  application: AppUser;
}) => {
  // State
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation refs
  const animations = useRef<{ [key: string]: AnimationState }>({}).current;

  useEffect(() => {
    // Initialize animations for each field
    const fields = [
      "leadershipRoles",
      "sportsAndCulturalActivities",
      "hobbiesAndInterests",
      "reasonForStudyFieldChoice",
      "selfDescription",
      "intendsToStudyFurther",
      "whySelectYou",
      "hasSensitiveMatters",
    ];

    fields.forEach((field) => {
      animations[field] = {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0),
      };
    });
  }, []);

  // Keyboard handlers
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
  const renderSwitch = (
    title: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    icon: string = "help-circle"
  ) => (
    <Card style={[styles.card, styles.switchCard]}>
      <View style={[styles.switchContainer]}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={wp("4%")} color="#666" />
          </View>
          <Text style={styles.cardDisclose} numberOfLines={3}>
            {title}
          </Text>
        </View>
        <Switch value={value} onValueChange={onValueChange} color="#2ecc71" />
      </View>
    </Card>
  );

  // Animation handler
  const toggleField = (fieldName: string) => {
    const isExpanding = expandedField !== fieldName;

    if (expandedField) {
      // Collapse the currently expanded field
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

    // Expand the new field
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

    // Scroll to the expanded field
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: Object.keys(animations).indexOf(fieldName) * hp("10%"),
        animated: true,
      });
    }, 100);
  };

  const renderCard = (
    fieldName: string,
    title: string,
    content: React.ReactNode,
    contentHeight: number
  ) => {
    const isExpanded = expandedField === fieldName;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      toggleField(fieldName);
    };

    return (
      <Animated.View
        style={[
          styles.card,
          isExpanded && styles.expandedCard,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={getIconName(fieldName)}
                  size={wp("5%")}
                  color="#15783D"
                />
              </View>
              <Text style={styles.cardTitle}>{title}</Text>
            </View>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate:
                      animations[fieldName]?.height.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "180deg"],
                      }) || "0deg",
                  },
                ],
              }}
            >
              <Ionicons name="chevron-down" size={wp("5%")} color="#15783D" />
            </Animated.View>
          </View>
        </TouchableOpacity>

        <Animated.View
          style={{
            opacity: animations[fieldName]?.opacity || 0,
            maxHeight:
              animations[fieldName]?.height.interpolate({
                inputRange: [0, 1],
                outputRange: [0, contentHeight],
              }) || 0,
            overflow: "hidden",
          }}
        >
          <View style={styles.cardContent}>{content}</View>
        </Animated.View>
      </Animated.View>
    );
  };
  const getIconName = (fieldName: string): string => {
    const icons: { [key: string]: string } = {
      leadershipRoles: "medal",
      sportsAndCulturalActivities: "football",
      hobbiesAndInterests: "heart",
      reasonForStudyFieldChoice: "school",
      selfDescription: "person",
      whySelectYou: "star",
    };
    return icons[fieldName] || "document";
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <Text style={styles.title}>Additional Details</Text>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: keyboardHeight + hp("10%") },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {renderCard(
            "leadershipRoles",
            "Leadership Roles",
            <InputField
              label="Leadership Roles"
              placeholder="Details of leadership roles in school"
              textContentType="addressCity"
              className="h-[200]"
              multiline
              value={application.leadershipRoles}
              onChangeText={(value) => {
                updateState({ leadershipRoles: value });
              }}
            />,
            hp("40%")
          )}

          {renderCard(
            "sportsAndCulturalActivities",
            "Sports and Cultural Activities",
            <InputField
              label="Sports and Cultural Activities "
              placeholder="Enter Details of sports and cultural activties"
              textContentType="addressCity"
              className="h-[200]"
              onChangeText={(value) => {
                updateState({ sportsAndCulturalActivities: value });
              }}
              value={application.sportsAndCulturalActivities}
              multiline
            />,
            hp("40%")
          )}

          {renderCard(
            "hobbiesAndInterests",
            "Hobbies and Interests",
            <InputField
              label="Hobbies and Interests"
              placeholder="Enter Hobbies and Interests"
              textContentType="addressCity"
              maxLength={600}
              className="h-[200]"
              value={application.hobbiesAndInterests}
              onChangeText={(value) => {
                updateState({ hobbiesAndInterests: value });
              }}
              multiline
            />,
            hp("40%")
          )}

          {renderCard(
            "reasonForStudyFieldChoice",
            "Reason for Field of Study",
            <InputField
              label="Reason for field of study"
              placeholder="Why have you chosen this particular field of study"
              textContentType="addressCity"
              multiline
              onChangeText={(value) => {
                updateState({ reasonForStudyFieldChoice: value });
              }}
              value={application.reasonForStudyFieldChoice}
              className="h-[200]"
            />,
            hp("40%")
          )}

          {renderCard(
            "selfDescription",
            "Self Description",
            <InputField
              label="Self Description"
              placeholder="How would you describe yourself?"
              textContentType="addressCity"
              multiline
              onChangeText={(value) => {
                updateState({ selfDescription: value });
              }}
              value={application.selfDescription}
              className="h-[200]"
            />,
            hp("40%")
          )}
          {renderSwitch(
            "Do you intend to study further after attaining your first qualification",
            application.intendsToStudyFurther,
            (value) => {
              updateState({ intendsToStudyFurther: value });
            }
          )}

          {renderCard(
            "whySelectYou",
            "Why should we consider you?",
            <InputField
              label="Why would SALEAF select you as recipient?"
              placeholder="Why should we select you as a bursary recipient?"
              textContentType="emailAddress"
              multiline
              onChangeText={(value) => {
                updateState({ whySelectYou: value });
              }}
              className="h-[200]"
            />,
            hp("45%")
          )}

          {renderSwitch(
            "Are there matters you prefer not to disclose on this application  form but would rather discuss face to face?",
            application.intendsToStudyFurther,
            (value) => {
              updateState({ intendsToStudyFurther: value });
            }
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Additional_Information_Form;
