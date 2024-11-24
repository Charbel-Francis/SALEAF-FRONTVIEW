import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "expo-router";
import { Formik, FormikErrors, FormikTouched } from "formik";
import * as Yup from "yup";
import axiosInstance from "@/utils/config";
import * as DocumentPicker from "expo-document-picker";
interface ProfileData {
  FirstName: string;
  LastName: string;
  Bio: string;
  Skills: string[];
  Achievements: string[];
  University: string;
  Degree: string;
  GraduationDate: string;
  Year: string;
  IsFinalYear: boolean;
  OnlineProfile: string;
  ProfileImage: string | null;
}

const validationSchema = Yup.object().shape({
  FirstName: Yup.string()
    .min(2, "First name is too short")
    .required("First name is required"),
  LastName: Yup.string()
    .min(2, "Last name is too short")
    .required("Last name is required"),
  Bio: Yup.string().min(10, "Bio should be at least 10 characters"),
  University: Yup.string().required("University is required"),
  Degree: Yup.string().required("Degree is required"),
  GraduationDate: Yup.string().required("Graduation date is required"),
  Year: Yup.string().required("Year of study is required"),
  Skills: Yup.array().min(1, "Add at least one skill"),
  OnlineProfile: Yup.string().url("Please enter a valid URL"),
});

export default function CreateProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const navigation = useNavigation();
  type RenderStepProps = {
    values: ProfileData;
    handleChange: {
      (e: React.ChangeEvent<any>): void;
      <T = string | React.ChangeEvent<any>>(
        field: T
      ): T extends React.ChangeEvent<any>
        ? void
        : (e: string | React.ChangeEvent<any>) => void;
    };
    setFieldValue: (field: string, value: any) => void;
    errors: FormikErrors<ProfileData>;
    touched: FormikTouched<ProfileData>;
  };

  const initialValues: ProfileData = {
    FirstName: "",
    LastName: "",
    Bio: "",
    Skills: [],
    Achievements: [],
    University: "",
    Degree: "",
    GraduationDate: new Date().toISOString(),
    Year: "1st",
    IsFinalYear: false,
    OnlineProfile: "",
    ProfileImage: null,
  };

  const handleBackPress = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const pickImage = async (
    setFieldValue: (field: string, value: any) => void
  ) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
      });
      if (!result.canceled) {
        setFieldValue("ProfileImage", result.assets[0]);
      } else {
        setFieldValue("ProfileImage", null);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const renderStep1 = ({
    values,
    handleChange,
    setFieldValue,
    errors,
    touched,
  }: RenderStepProps) => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepDescription}>Let's start with the basics</Text>

      <Pressable
        onPress={() => pickImage(setFieldValue)}
        style={styles.imageUploadContainer}
      >
        {values.ProfileImage ? (
          <Image
            source={{ uri: values.ProfileImage }}
            style={styles.uploadedImage}
          />
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Ionicons name="camera" size={wp("10%")} color="#3949ab" />
            <Text style={styles.uploadText}>Add Profile Photo</Text>
          </View>
        )}
      </Pressable>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={[
            styles.input,
            touched.FirstName && errors.FirstName ? styles.inputError : null,
          ]}
          value={values.FirstName}
          onChangeText={handleChange("FirstName")}
          placeholder="Enter your first name"
          placeholderTextColor="#666"
        />
        {touched.FirstName && errors.FirstName && (
          <Text style={styles.errorText}>{errors.FirstName}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={[
            styles.input,
            touched.LastName && errors.LastName ? styles.inputError : null,
          ]}
          value={values.LastName}
          onChangeText={handleChange("LastName")}
          placeholder="Enter your last name"
          placeholderTextColor="#666"
        />
        {touched.LastName && errors.LastName && (
          <Text style={styles.errorText}>{errors.LastName}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[
            styles.input,
            styles.bioInput,
            touched.Bio && errors.Bio ? styles.inputError : null,
          ]}
          value={values.Bio}
          onChangeText={handleChange("Bio")}
          placeholder="Tell us about yourself..."
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
        />
        {touched.Bio && errors.Bio && (
          <Text style={styles.errorText}>{errors.Bio}</Text>
        )}
      </View>
    </View>
  );

  const renderStep2 = ({
    values,
    handleChange,
    setFieldValue,
    errors,
    touched,
  }: RenderStepProps) => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Education Details</Text>
      <Text style={styles.stepDescription}>Tell us about your studies</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>University</Text>
        <TextInput
          style={[
            styles.input,
            touched.University && errors.University ? styles.inputError : null,
          ]}
          value={values.University}
          onChangeText={handleChange("University")}
          placeholder="Enter your university"
          placeholderTextColor="#666"
        />
        {touched.University && errors.University && (
          <Text style={styles.errorText}>{errors.University}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Degree</Text>
        <TextInput
          style={[
            styles.input,
            touched.Degree && errors.Degree ? styles.inputError : null,
          ]}
          value={values.Degree}
          onChangeText={handleChange("Degree")}
          placeholder="Enter your degree program"
          placeholderTextColor="#666"
        />
        {touched.Degree && errors.Degree && (
          <Text style={styles.errorText}>{errors.Degree}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Year of Study</Text>
        <View style={styles.yearSelector}>
          {["1st", "2nd", "3rd", "4th", "5th"].map((year) => (
            <Pressable
              key={year}
              style={[
                styles.yearOption,
                values.Year === year && styles.yearOptionSelected,
              ]}
              onPress={() => setFieldValue("Year", year)}
            >
              <Text
                style={[
                  styles.yearOptionText,
                  values.Year === year && styles.yearOptionTextSelected,
                ]}
              >
                {year}
              </Text>
            </Pressable>
          ))}
        </View>
        {touched.Year && errors.Year && (
          <Text style={styles.errorText}>{errors.Year}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Expected Graduation Date</Text>
        <Pressable
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {new Date(values.GraduationDate).toLocaleDateString()}
          </Text>
          <Ionicons name="calendar" size={wp("6%")} color="#3949ab" />
        </Pressable>
        {touched.GraduationDate && errors.GraduationDate && (
          <Text style={styles.errorText}>{errors.GraduationDate}</Text>
        )}
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(values.GraduationDate)}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setFieldValue("GraduationDate", selectedDate.toISOString());
            }
          }}
        />
      )}
    </View>
  );

  const renderStep3 = ({
    values,
    handleChange,
    setFieldValue,
    errors,
    touched,
  }: RenderStepProps) => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Skills & Achievements</Text>
      <Text style={styles.stepDescription}>Share your expertise</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Skills</Text>
        <View style={styles.addItemContainer}>
          <TextInput
            style={styles.addItemInput}
            value={newSkill}
            onChangeText={setNewSkill}
            placeholder="Add a skill"
            placeholderTextColor="#666"
          />
          <Pressable
            onPress={() => {
              if (newSkill.trim() && !values.Skills.includes(newSkill.trim())) {
                setFieldValue("Skills", [...values.Skills, newSkill.trim()]);
                setNewSkill("");
              }
            }}
            style={styles.addButton}
          >
            <Ionicons name="add" size={wp("6%")} color="#3949ab" />
          </Pressable>
        </View>
        <View style={styles.tagContainer}>
          {values.Skills.map((skill, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{skill}</Text>
              <Pressable
                onPress={() =>
                  setFieldValue(
                    "Skills",
                    values.Skills.filter((_, i) => i !== index)
                  )
                }
                style={styles.removeTagButton}
              >
                <Ionicons name="close-circle" size={wp("4%")} color="#3949ab" />
              </Pressable>
            </View>
          ))}
        </View>
        {touched.Skills && errors.Skills && (
          <Text style={styles.errorText}>{errors.Skills}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Achievements</Text>
        <View style={styles.addItemContainer}>
          <TextInput
            style={styles.addItemInput}
            value={newAchievement}
            onChangeText={setNewAchievement}
            placeholder="Add an achievement"
            placeholderTextColor="#666"
          />
          <Pressable
            onPress={() => {
              if (newAchievement.trim()) {
                setFieldValue("Achievements", [
                  ...values.Achievements,
                  newAchievement.trim(),
                ]);
                setNewAchievement("");
              }
            }}
            style={styles.addButton}
          >
            <Ionicons name="add" size={wp("6%")} color="#3949ab" />
          </Pressable>
        </View>
        {values.Achievements.map((achievement, index) => (
          <View key={index} style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <LinearGradient
                colors={["#FFD700", "#FFA000"]}
                style={styles.achievementIconGradient}
              >
                <Ionicons name="star" size={wp("4%")} color="white" />
              </LinearGradient>
            </View>
            <Text style={styles.achievementText}>{achievement}</Text>
            <Pressable
              onPress={() =>
                setFieldValue(
                  "Achievements",
                  values.Achievements.filter((_, i) => i !== index)
                )
              }
              style={styles.removeAchievementButton}
            >
              <Ionicons name="close-circle" size={wp("5%")} color="#666" />
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Online Profile</Text>
        <TextInput
          style={[
            styles.input,
            touched.OnlineProfile && errors.OnlineProfile
              ? styles.inputError
              : null,
          ]}
          value={values.OnlineProfile}
          onChangeText={handleChange("OnlineProfile")}
          placeholder="Your GitHub, LinkedIn, or portfolio URL"
          placeholderTextColor="#666"
        />
        {touched.OnlineProfile && errors.OnlineProfile && (
          <Text style={styles.errorText}>{errors.OnlineProfile}</Text>
        )}
      </View>
    </View>
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          setLoading(true);
          await axiosInstance.post(
            "/api/StudentProfile/create-profile",
            values
          );
          Alert.alert(
            "Success",
            "Your profile has been created successfully!",
            [
              {
                text: "OK",
                onPress: () => navigation.goBack(),
              },
            ]
          );
        } catch (error) {
          Alert.alert("Error", "Failed to create profile. Please try again.");
        } finally {
          setLoading(false);
        }
      }}
    >
      {({
        handleChange,
        setFieldValue,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Pressable onPress={handleBackPress} style={styles.backButton}>
              <Ionicons name="arrow-back" size={wp("6%")} color="#1a237e" />
            </Pressable>
            <Text style={styles.headerTitle}>Create Profile</Text>
            <View style={styles.backButton} />
          </View>

          <View style={styles.container}>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}
            >
              <View style={styles.progressContainer}>
                <View style={styles.progressLine}>
                  <View
                    style={[
                      styles.progressLineFill,
                      { width: `${((currentStep - 1) / 2) * 100}%` },
                    ]}
                  />
                </View>
                {[1, 2, 3].map((step) => (
                  <View key={step} style={styles.progressStep}>
                    <View
                      style={[
                        styles.progressDot,
                        currentStep >= step && styles.progressDotActive,
                        currentStep === step && styles.progressDotCurrent,
                      ]}
                    >
                      <Text
                        style={[
                          styles.progressNumber,
                          currentStep >= step && styles.progressNumberActive,
                        ]}
                      >
                        {step}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {currentStep === 1 &&
                renderStep1({
                  values,
                  handleChange,
                  setFieldValue,
                  errors,
                  touched,
                })}
              {currentStep === 2 &&
                renderStep2({
                  values,
                  handleChange,
                  setFieldValue,
                  errors,
                  touched,
                })}
              {currentStep === 3 &&
                renderStep3({
                  values,
                  handleChange,
                  setFieldValue,
                  errors,
                  touched,
                })}

              <View style={styles.buttonContainer}>
                {currentStep > 1 && (
                  <Pressable
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={() => setCurrentStep((prev) => prev - 1)}
                  >
                    <Text style={styles.buttonTextSecondary}>Previous</Text>
                  </Pressable>
                )}

                {currentStep < 3 ? (
                  <Pressable
                    style={[styles.button, styles.buttonPrimary]}
                    onPress={() => {
                      // Validate current step before proceeding
                      let stepValid = true;
                      if (currentStep === 1) {
                        stepValid =
                          !errors.FirstName && !errors.LastName && !errors.Bio;
                      } else if (currentStep === 2) {
                        stepValid =
                          !errors.University &&
                          !errors.Degree &&
                          !errors.Year &&
                          !errors.GraduationDate;
                      }

                      if (stepValid) {
                        setCurrentStep((prev) => prev + 1);
                      } else {
                        Alert.alert(
                          "Validation Error",
                          "Please fill in all required fields correctly"
                        );
                      }
                    }}
                  >
                    <Text style={styles.buttonTextPrimary}>Next</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={[
                      styles.button,
                      styles.buttonPrimary,
                      loading && styles.buttonDisabled,
                    ]}
                    onPress={() => handleSubmit()}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.buttonTextPrimary}>
                        Create Profile
                      </Text>
                    )}
                  </Pressable>
                )}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: wp("5%"),
    fontWeight: "600",
    color: "#1a237e",
  },
  backButton: {
    width: wp("12%"),
    height: wp("12%"),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: wp("6%"),
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: hp("4%"),
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("8%"),
    paddingVertical: hp("4%"),
    position: "relative",
  },
  progressLine: {
    position: "absolute",
    top: "50%",
    left: wp("12%"),
    right: wp("12%"),
    height: 2,
    backgroundColor: "#E0E0E0",
  },
  progressLineFill: {
    height: "100%",
    backgroundColor: "#3949ab",
  },
  progressStep: {
    alignItems: "center",
    zIndex: 1,
  },
  progressDot: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  progressDotActive: {
    backgroundColor: "#3949ab",
    borderColor: "#3949ab",
  },
  progressDotCurrent: {
    transform: [{ scale: 1.2 }],
    borderColor: "#3949ab",
    backgroundColor: "white",
  },
  progressNumber: {
    fontSize: wp("4%"),
    fontWeight: "bold",
    color: "#666",
  },
  progressNumberActive: {
    color: "white",
  },
  stepContainer: {
    padding: wp("6%"),
  },
  stepTitle: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: hp("1%"),
  },
  stepDescription: {
    fontSize: wp("4%"),
    color: "#666",
    marginBottom: hp("4%"),
  },
  imageUploadContainer: {
    width: wp("40%"),
    height: wp("40%"),
    borderRadius: wp("20%"),
    alignSelf: "center",
    marginBottom: hp("4%"),
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  uploadPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  uploadText: {
    color: "#3949ab",
    fontSize: wp("3.5%"),
    marginTop: hp("1%"),
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: hp("3%"),
  },
  label: {
    fontSize: wp("4%"),
    color: "#1a237e",
    fontWeight: "600",
    marginBottom: hp("1%"),
  },
  input: {
    backgroundColor: "white",
    borderRadius: wp("3%"),
    padding: wp("4%"),
    fontSize: wp("4%"),
    color: "#424242",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputError: {
    borderColor: "#ff3333",
  },
  errorText: {
    color: "#ff3333",
    fontSize: wp("3.5%"),
    marginTop: hp("0.5%"),
    paddingHorizontal: wp("1%"),
  },
  bioInput: {
    height: hp("15%"),
    textAlignVertical: "top",
  },
  yearSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: wp("3%"),
    padding: wp("2%"),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  yearOption: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    alignItems: "center",
    marginHorizontal: wp("1%"),
    borderRadius: wp("2%"),
  },
  yearOptionSelected: {
    backgroundColor: "#3949ab",
  },
  yearOptionText: {
    fontSize: wp("3.5%"),
    color: "#666",
    fontWeight: "500",
  },
  yearOptionTextSelected: {
    color: "white",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: wp("3%"),
    padding: wp("4%"),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dateText: {
    fontSize: wp("4%"),
    color: "#424242",
  },
  addItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
    marginBottom: hp("2%"),
  },
  addItemInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: wp("3%"),
    padding: wp("4%"),
    fontSize: wp("4%"),
    color: "#424242",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  addButton: {
    width: wp("12%"),
    height: wp("12%"),
    backgroundColor: "#EEF2FF",
    borderRadius: wp("6%"),
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp("2%"),
  },
  tag: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
    borderRadius: wp("5%"),
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },
  tagText: {
    color: "#3949ab",
    fontSize: wp("3.8%"),
    fontWeight: "500",
  },
  removeTagButton: {
    padding: wp("1%"),
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: wp("3%"),
    borderRadius: wp("2%"),
    marginBottom: hp("1%"),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  achievementIcon: {
    marginRight: wp("3%"),
  },
  achievementIconGradient: {
    width: wp("8%"),
    height: wp("8%"),
    borderRadius: wp("4%"),
    alignItems: "center",
    justifyContent: "center",
  },
  achievementText: {
    fontSize: wp("4%"),
    color: "#424242",
    flex: 1,
    lineHeight: wp("5.5%"),
  },
  removeAchievementButton: {
    padding: wp("2%"),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: wp("6%"),
    gap: wp("4%"),
  },
  button: {
    flex: 1,
    paddingVertical: hp("2%"),
    borderRadius: wp("3%"),
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonPrimary: {
    backgroundColor: "#3949ab",
  },
  buttonSecondary: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#3949ab",
  },
  buttonTextPrimary: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: "#3949ab",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
