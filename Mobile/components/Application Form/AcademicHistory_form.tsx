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
  subtitle: {
    fontSize: wp("4%"),
    fontWeight: "semibold",
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
  selectedFileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp("2%"),
    marginHorizontal: wp("3%"),
  },
  selectedFileText: {
    fontSize: wp("3.5%"),
    color: "#333",
    fontStyle: "italic",
    marginRight: wp("2%"),
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
        <Card style={styles.card}>
          <View style={[styles.cardContent, styles.switchContainer]}>
            <Text style={styles.cardTitle}>
              Currently at a Tertiary Institution?
            </Text>
            <Switch
              value={isTertiaryChecked}
              onValueChange={handleTertiaryChange}
              color="#2ecc71"
            />
          </View>
        </Card>

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

            <TouchableOpacity
              onPress={() => {
                pickDocument("tertiarySubjectsAndResultsFile");
              }}
            >
              <Card style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    Tertiary Subjects and Results
                  </Text>
                  <Text style={styles.cardHint}>*click me to upload file</Text>
                </View>
                {application.tertiarySubjectsAndResultsFile && (
                  <View style={styles.selectedFileContainer}>
                    <StyledText style={styles.selectedFileText}>
                      Selected File:{" "}
                      {application.tertiarySubjectsAndResultsFile.name}
                    </StyledText>
                    <IconButton
                      icon="close"
                      iconColor="red"
                      size={20}
                      onPress={() => {
                        deselectFile("tertiarySubjectsAndResultsFile");
                      }}
                    />
                  </View>
                )}
              </Card>
            </TouchableOpacity>
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

        <TouchableOpacity
          onPress={() => {
            pickDocument("grade11SubjectsAndResultsFile");
          }}
        >
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                Grade 12 Subjects and Results
              </Text>
              <Text style={styles.cardHint}>*click me to upload file</Text>
            </View>
            {application.grade11SubjectsAndResultsFile && (
              <View style={styles.selectedFileContainer}>
                <StyledText style={styles.selectedFileText}>
                  Selected File:{" "}
                  {application.grade11SubjectsAndResultsFile.name}
                </StyledText>
                <IconButton
                  icon="close"
                  iconColor="red"
                  size={20}
                  onPress={() => {
                    deselectFile("grade11SubjectsAndResultsFile");
                  }}
                />
              </View>
            )}
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            pickDocument("grade12SubjectsAndResultsFile");
          }}
        >
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                Grade 11 Subjects and Results
              </Text>
              <Text style={styles.cardHint}>*click me to upload file</Text>
            </View>
            {application.grade12SubjectsAndResultsFile && (
              <View style={styles.selectedFileContainer}>
                <StyledText style={styles.selectedFileText}>
                  Selected File:{" "}
                  {application.grade12SubjectsAndResultsFile.name}
                </StyledText>
                <IconButton
                  icon="close"
                  iconColor="red"
                  size={20}
                  onPress={() => {
                    deselectFile("grade12SubjectsAndResultsFile");
                  }}
                />
              </View>
            )}
          </Card>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AcademicHistory_form;
