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
    backgroundColor: "#f5f5f5",
    borderRadius: wp("4%"),
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: wp("4%"),
    paddingBottom: hp("15%"),
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: hp("2%"),
    color: "#2c3e50",
  },
  card: {
    marginBottom: hp("1%"),
    borderRadius: wp("2%"),
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    padding: wp("3%"),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("3%"),
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  cardTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#2c3e50",
  },
  cardDisclose: {
    fontSize: wp("4%"),
    width: wp("60%"),
    fontWeight: "600",
    color: "#2c3e50",
  },
  cardHint: {
    fontSize: wp("2.8%"),
    color: "#e74c3c",
    fontStyle: "italic",
  },
  inputWrapper: {
    paddingVertical: hp("1%"),
  },
  input: {
    height: hp("5%"),
    backgroundColor: "#f8f9fa",
    borderRadius: wp("1%"),
    marginBottom: hp("1%"),
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("1%"),
  },
  switchLabel: {
    fontSize: wp("4%"),
    color: "#2c3e50",
  },
  disabledInput: {
    backgroundColor: "#e9ecef",
    color: "#6c757d",
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

    return (
      <Card style={styles.card}>
        <TouchableOpacity
          onPress={() => toggleField(fieldName)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardHint}>
              {isExpanded ? "tap to close" : "tap to open"}
            </Text>
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
      </Card>
    );
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

          <Card style={styles.card}>
            <View style={[styles.cardContent, styles.switchContainer]}>
              <Text style={styles.cardTitle}>
                Do you intend to study further after attaining your first
                qualification
              </Text>
              <Switch
                value={application.intendsToStudyFurther}
                onValueChange={(value) => {
                  updateState({ intendsToStudyFurther: value });
                }}
                color="#2ecc71"
              />
            </View>
          </Card>

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

          <Card style={styles.card}>
            <View style={[styles.cardContent, styles.switchContainer]}>
              <Text style={styles.cardDisclose}>
                Are there matters you prefer not to disclose on this application
                form but would rather discuss face to face?
              </Text>
              <Switch
                value={application.hasSensitiveMatters}
                onValueChange={(value) => {
                  updateState({ hasSensitiveMatters: value });
                }}
                color="#2ecc71"
              />
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Additional_Information_Form;
