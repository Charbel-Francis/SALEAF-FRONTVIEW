import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { InputField, DualInputField } from "../InputField";
import Ionicons from "react-native-vector-icons/Ionicons";
import { IconButton, Card, Switch } from "react-native-paper";
import { styled } from "nativewind";
import * as DocumentPicker from "expo-document-picker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AppUser } from "@/constants";

const styles = StyleSheet.create({
  // Container styles
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

  // Typography styles
  title: {
    fontSize: wp("6%"),
    fontWeight: "700",
    textAlign: "center",
    marginVertical: hp("2%"),
    color: "#15783D",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: wp("4.2%"),
    fontWeight: "600",
    color: "#15783D",
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
    marginLeft: wp("13%"),
    letterSpacing: 0.3,
  },

  // Base card styles
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

  // Switch styles
  switchCard: {
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
  switchContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp("3%"),
    backgroundColor: "#FAFBFD",
    borderRadius: wp("3%"),
  },
  switchTextContainer: {
    flex: 1,
    marginRight: wp("3%"),
  },
  switchIconContainer: {
    width: wp("7%"),
    height: wp("7%"),
    borderRadius: wp("3.5%"),
    backgroundColor: "#F0F7F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("2%"),
  },
  switchText: {
    fontSize: wp("3.5%"),
    color: "#15783D",
    fontWeight: "600",
    letterSpacing: 0.3,
    flexShrink: 1,
  },

  // Icon styles
  iconContainer: {
    width: wp("7%"),
    height: wp("7%"),
    borderRadius: wp("3.5%"),
    backgroundColor: "#F0F7F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("2%"),
  },

  // Input styles
  input: {
    height: hp("6%"),
    borderRadius: wp("2.5%"),
    marginBottom: hp("1.5%"),
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    paddingHorizontal: wp("3%"),
    fontSize: wp("3.5%"),
  },
  inputWrapper: {
    paddingVertical: hp("1.5%"),
    gap: hp("1%"),
  },
  labelText: {
    fontSize: wp("3.2%"),
    color: "#334155",
    fontWeight: "600",
    marginBottom: hp("0.8%"),
    marginLeft: wp("1%"),
    letterSpacing: 0.2,
  },

  // Upload card styles
  uploadCard: {
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
  uploadHeader: {
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
  uploadIconContainer: {
    width: wp("7%"),
    height: wp("7%"),
    borderRadius: wp("3.5%"),
    backgroundColor: "#F0F7F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("2%"),
  },

  // File selection styles
  selectedFileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("3%"),
    backgroundColor: "#F0F7F4",
    borderBottomLeftRadius: wp("3%"),
    borderBottomRightRadius: wp("3%"),
  },
  selectedFileText: {
    fontSize: wp("3.2%"),
    color: "#2D3748",
    flex: 1,
  },

  // Animation styles
  expandedCard: {
    borderColor: "#15783D",
    borderWidth: 1.5,
    transform: [{ scale: 1.01 }],
  },

  // Error styles
  errorText: {
    color: "#DC2626",
    fontSize: wp("3%"),
    marginTop: hp("0.5%"),
    marginLeft: wp("1%"),
    fontWeight: "500",
  },
});

interface AnimationState {
  height: Animated.Value;
  opacity: Animated.Value;
}

const AcademicHistory_form = ({
  updateState,
  application,
}: {
  updateState: (updates: Partial<AppUser>) => void;
  application: AppUser;
}) => {
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [isTertiaryChecked, setIsTertiaryChecked] = useState(false);
  const animations = useRef<{ [key: string]: AnimationState }>({}).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const StyledText = styled(Text);
  useEffect(() => {
    // Initialize animations for each field
    const fields = [
      "institutionName",
      "yearCommencedT",
      "yearCompletedT",
      "subjectsT",
      "schoolName",
      "yearCommencedH",
      "yearCompletedH",
      "gradeResults11",
      "gradeResults12",
    ];

    fields.forEach((field) => {
      animations[field] = {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0),
      };
    });
  }, []);

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
  const renderTertiarySwitch = () => (
    <Card style={styles.switchCard}>
      <View style={styles.switchContent}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View style={styles.switchIconContainer}>
            <Ionicons name="school" size={wp("4%")} color="#666" />
          </View>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchText} numberOfLines={2}>
              Currently at a Tertiary Institution?
            </Text>
          </View>
        </View>
        <Switch
          value={isTertiaryChecked}
          onValueChange={handleTertiaryChange}
          color="#2ecc71"
        />
      </View>
    </Card>
  );

  // Update the file upload component
  const renderFileUpload = (
    title: string,
    documentType: keyof AppUser,
    file: any
  ) => (
    <TouchableOpacity onPress={() => pickDocument(documentType)}>
      <View style={styles.uploadCard}>
        <View style={styles.uploadHeader}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.uploadIconContainer}>
              <Ionicons name="document-text" size={wp("4%")} color="#666" />
            </View>
            <View>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={[styles.cardHint, { marginTop: hp("0.5%") }]}>
                Click to upload file
              </Text>
            </View>
          </View>
        </View>
        {file && (
          <View style={styles.selectedFileContainer}>
            <Text
              style={styles.selectedFileText}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              Selected: {file.name}
            </Text>
            <IconButton
              icon="close"
              iconColor="red"
              size={wp("4%")}
              onPress={() => deselectFile(documentType)}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCard = (
    fieldName: string,
    title: string,
    content: React.ReactNode,
    contentHeight: number
  ) => {
    const isExpanded = expandedField === fieldName;
    const icon = getIconForField(fieldName);

    // Ensure animations[fieldName] exists
    if (!animations[fieldName]) {
      animations[fieldName] = {
        height: new Animated.Value(0),
        opacity: new Animated.Value(0),
      };
    }

    const cardStyle = [styles.card, isExpanded && styles.expandedCard];

    const iconStyle = {
      width: wp("7%"),
      height: wp("7%"),
      borderRadius: wp("3.5%"),
      backgroundColor: isExpanded ? "#E8F5EE" : "#F0F7F4",
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginRight: wp("2%"),
    };

    return (
      <View style={cardStyle}>
        <TouchableOpacity
          onPress={() => toggleField(fieldName)}
          activeOpacity={0.7}
          style={{ overflow: "hidden", borderRadius: wp("3%") }}
        >
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {icon && <View style={iconStyle}>{icon}</View>}
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

  const getIconForField = (fieldName: string) => {
    const iconSize = wp("4%");
    const iconColor = "#666";

    const iconMap = {
      institutionName: (
        <Ionicons name="school" size={iconSize} color={iconColor} />
      ),
      yearCommencedT: (
        <Ionicons name="calendar" size={iconSize} color={iconColor} />
      ),
      yearCompletedT: (
        <Ionicons name="calendar" size={iconSize} color={iconColor} />
      ),
      subjectsT: (
        <Ionicons name="document-text" size={iconSize} color={iconColor} />
      ),
      schoolName: (
        <Ionicons name="business" size={iconSize} color={iconColor} />
      ),
      yearCommencedH: (
        <Ionicons name="calendar" size={iconSize} color={iconColor} />
      ),
      yearCompletedH: (
        <Ionicons name="calendar" size={iconSize} color={iconColor} />
      ),
      gradeResults11: (
        <Ionicons name="document-text" size={iconSize} color={iconColor} />
      ),
      gradeResults12: (
        <Ionicons name="document-text" size={iconSize} color={iconColor} />
      ),
    };

    return iconMap[fieldName as keyof typeof iconMap];
  };

  const pickDocument = async (variableName: keyof AppUser) => {
    setFileLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
      });
      if (!result.canceled) {
        updateState({ [variableName]: result.assets[0] });
        console.log(application[variableName]);
      }
      setFileLoading(false);
    } catch (error) {
      setFileLoading(false);
      console.error("Error picking document:", error);
    }
  };

  const deselectFile = (variableName: keyof AppUser) => {
    updateState({ [variableName]: "" });
  };

  const handleTertiaryChange = () => {
    setIsTertiaryChecked(!isTertiaryChecked);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Academic History</Text>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
      >
        {renderTertiarySwitch()}

        {isTertiaryChecked && (
          <>
            <Text style={styles.subtitle}>Tertiary</Text>
            {renderCard(
              "institutionName",
              "Name of Institution",
              <InputField
                label="Name of Institution"
                placeholder="Enter Institution Name"
                textContentType="addressCity"
                className="h-10"
                onChange={(event) => {
                  updateState({
                    nameOfInstitution: event.nativeEvent.text,
                  });
                }}
                icon={<Ionicons name="school" size={20} color="gray" />}
              />,
              hp("20%")
            )}

            {renderCard(
              "yearCommencedT",
              "Year Commenced/Completed",
              <DualInputField
                label1="Year Commenced"
                label2="Year Completed"
                placeholder1="Year Commenced"
                placeholder2="Year Completed"
                onChange1={(value) => {
                  updateState({ yearCommencedInstitution: parseInt(value) });
                }}
                onChange2={(value) => {
                  updateState({
                    yearToBeCompletedInstitution: parseInt(value),
                  });
                }}
                keyboardType="numeric"
                className="h-10"
                icon1={<Ionicons name="calendar" size={20} color="gray" />}
                icon2={<Ionicons name="calendar" size={20} color="gray" />}
              />,
              hp("20%")
            )}

            {renderFileUpload(
              "Tertiary Subjects and Results",
              "tertiarySubjectsAndResultsFile",
              application.tertiarySubjectsAndResultsFile
            )}
          </>
        )}
        <Text style={styles.subtitle}>High School</Text>
        {renderCard(
          "schoolName",
          "Name of School",
          <InputField
            label="Name of High School"
            placeholder="Enter High School Name"
            textContentType="addressCity"
            value={application.nameOfSchool}
            onChangeText={(value) => {
              updateState({ nameOfSchool: value });
            }}
            icon={<Ionicons name="school" size={20} color="gray" />}
            className="h-10"
          />,
          hp("20%")
        )}

        {renderCard(
          "yearCommencedH",
          "Year Commenced/Completed",
          <DualInputField
            label1="Year Commenced"
            label2="Year Completed"
            placeholder1="Year Commenced"
            placeholder2="Year Completed"
            onChange1={(value) => {
              updateState({ yearCommencedSchool: parseInt(value) });
            }}
            onChange2={(value) => {
              updateState({ yearToBeCompletedSchool: parseInt(value) });
            }}
            keyboardType="numeric"
            className="h-10"
            icon1={<Ionicons name="calendar" size={20} color="gray" />}
            icon2={<Ionicons name="calendar" size={20} color="gray" />}
          />,
          hp("20%")
        )}

        {renderFileUpload(
          "Grade 11 Subjects and Results",
          "grade11SubjectsAndResultsFile",
          application.grade11SubjectsAndResultsFile
        )}
        {renderFileUpload(
          "Grade 12 Subjects and Results",
          "grade12SubjectsAndResultsFile",
          application.grade12SubjectsAndResultsFile
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AcademicHistory_form;
