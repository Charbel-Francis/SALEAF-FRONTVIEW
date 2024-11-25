import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axiosInstance from "@/utils/config";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
interface ProfileData {
  firstName: string;
  lastName: string;
  bio: string;
  skills: { skillName: string }[];
  achievements: { achievementName: string }[];
  university: string;
  degree: string;
  graduationDate: string;
  year: string;
  isFinalYear: boolean;
  onlineProfile: string;
  profileImage: string | null;
}

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [editingSections, setEditingSections] = useState({
    header: false,
    bio: false,
    skills: false,
    achievements: false,
  });
  const [newSkill, setNewSkill] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    bio: "",
    skills: [],
    achievements: [],
    university: "",
    degree: "",
    graduationDate: new Date().toISOString(),
    year: "",
    isFinalYear: false,
    onlineProfile: "",
    profileImage: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/StudentProfile/get-logged-user-profile"
        );
        console.log("Profile Data:", response.data);

        if (response.data) {
          setProfileData({
            ...response.data,
            profileImage: response.data.imageUrl,
          });
          setHasProfile(true);
        }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        setHasProfile(false);

        // Detailed error logging
        console.error("Profile fetch error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          },
        });

        // Handle specific error cases
        if (error.response) {
          // Server responded with error
          switch (error.response.status) {
            case 401:
              console.error("Authentication error - user not authorized");
              // You might want to trigger a logout or token refresh here
              break;
            case 403:
              console.error(
                "Permission denied - user not allowed to access profile"
              );
              break;
            case 404:
              console.error("Profile not found");
              break;
            case 500:
              console.error("Server error:", error.response.data);
              break;
            default:
              console.error(
                `Unexpected error (${error.response.status}):`,
                error.response.data
              );
          }
        } else if (error.request) {
          // Request made but no response received
          console.error("Network error - no response received:", error.request);
        } else {
          // Error in setting up the request
          console.error("Request setup error:", error.message);
        }

        // Check request headers
        console.log("Request headers:", {
          authorization:
            error.config?.headers?.Authorization || "No auth header found",
          contentType: error.config?.headers?.["Content-Type"],
        });
      }
    };
    fetchProfile();
  }, []);

  const updateProfile = async () => {
    try {
      setLoading(true);

      // Create FormData instance
      const formData = new FormData();

      // Add all profile data fields with null checks
      formData.append("FirstName", profileData.firstName || "");
      formData.append("LastName", profileData.lastName || "");
      formData.append("Bio", profileData.bio || "");
      formData.append("University", profileData.university || "");
      formData.append("Degree", profileData.degree || "");
      formData.append(
        "GraduationDate",
        profileData.graduationDate || new Date().toISOString()
      );
      formData.append("Year", profileData.year || "");
      formData.append("IsFinalYear", String(Boolean(profileData.isFinalYear)));
      formData.append("OnlineProfile", profileData.onlineProfile || "");

      profileData.skills?.forEach((skill) => {
        formData.append("Skills", skill.skillName);
      });
      profileData.achievements?.forEach((achievement) => {
        formData.append("Achievements", achievement.achievementName);
      });

      // Handle profile image
      if (profileData.profileImage) {
        if (profileData.profileImage.startsWith("file://")) {
          const imageUri = profileData.profileImage;
          const filename = imageUri.split("/").pop() || "image.jpg";
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : "image/jpeg";

          formData.append("ProfileImage", {
            uri: imageUri,
            name: filename,
            type,
          } as any);
        } else if (profileData.profileImage.startsWith("data:")) {
          // Handle base64 image if needed
          formData.append("ProfileImage", profileData.profileImage);
        }
      }

      const response = await axiosInstance.put(
        "/api/StudentProfile/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          transformRequest: (data) => data,
        }
      );

      console.log("Profile update response:", response.data);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      console.error("Update error details:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      });
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  type Section = "header" | "bio" | "skills" | "achievements";

  const toggleEditSection = async (section: Section) => {
    if (editingSections[section]) {
      await updateProfile();
    }
    setEditingSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const pickImage = async (
    setFieldValue: React.Dispatch<React.SetStateAction<ProfileData>>
  ) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
      });
      if (!result.canceled) {
        setFieldValue((prev) => ({
          ...prev,
          profileImage: result.assets[0].uri,
        }));
      } else {
        setFieldValue((prev) => ({ ...prev, profileImage: null }));
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;

    setProfileData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), { skillName: newSkill.trim() }],
    }));
    setNewSkill("");
  };

  const addAchievement = () => {
    if (!newAchievement.trim()) return;

    setProfileData((prev) => ({
      ...prev,
      achievements: [
        ...(prev.achievements || []),
        { achievementName: newAchievement.trim() },
      ],
    }));
    setNewAchievement("");
  };

  const removeSkill = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const removeAchievement = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };
  const EmptyProfileView = () => (
    <View style={styles.emptyProfileContainer}>
      <Ionicons name="person-circle-outline" size={wp("20%")} color="#3949ab" />
      <Text style={styles.emptyProfileTitle}>Create Your Profile</Text>
      <Text style={styles.emptyProfileText}>
        Would you like to promote yourself for employment from potential donors?
        Create your profile now!
      </Text>
      <Pressable
        style={styles.createProfileButton}
        onPress={() => router.navigate("/pages/CreateProfile")}
      >
        <Text style={styles.createProfileButtonText}>Create Profile</Text>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3949ab" />
      </View>
    );
  }

  if (!hasProfile) {
    return <EmptyProfileView />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Pressable
            onPress={
              editingSections.header
                ? () => pickImage(setProfileData)
                : undefined
            }
            style={styles.imageWrapper}
          >
            {profileData.profileImage ? (
              <Image
                source={{ uri: profileData.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="person" size={wp("15%")} color="#BDBDBD" />
              </View>
            )}
            {editingSections.header && (
              <View style={styles.editImageOverlay}>
                <Ionicons name="camera" size={wp("6%")} color="white" />
                <Text style={styles.editImageText}>Change Photo</Text>
              </View>
            )}
          </Pressable>

          <BlurView
            intensity={30}
            style={[
              styles.blurContainer,
              { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            ]}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerInfo}>
                <View style={styles.headerEditContainer}>
                  {editingSections.header ? (
                    <View style={styles.nameInputContainer}>
                      <TextInput
                        style={styles.nameInput}
                        value={profileData.firstName}
                        onChangeText={(text) =>
                          setProfileData((prev) => ({
                            ...prev,
                            firstName: text,
                          }))
                        }
                        placeholder="First Name"
                        placeholderTextColor="#E0E0E0"
                      />
                      <TextInput
                        style={styles.nameInput}
                        value={profileData.lastName}
                        onChangeText={(text) =>
                          setProfileData((prev) => ({
                            ...prev,
                            lastName: text,
                          }))
                        }
                        placeholder="Last Name"
                        placeholderTextColor="#E0E0E0"
                      />
                    </View>
                  ) : (
                    <Text style={styles.name}>
                      {profileData.firstName} {profileData.lastName}
                    </Text>
                  )}
                  <Pressable
                    onPress={() => toggleEditSection("header")}
                    style={styles.headerEditButton}
                  >
                    <Ionicons
                      name={
                        editingSections.header
                          ? "checkmark-circle"
                          : "create-outline"
                      }
                      size={wp("6%")}
                      color="white"
                    />
                  </Pressable>
                </View>
                {editingSections.header ? (
                  <TextInput
                    style={styles.degreeInput}
                    value={profileData.degree}
                    onChangeText={(text) =>
                      setProfileData((prev) => ({ ...prev, degree: text }))
                    }
                    placeholder="Degree"
                    placeholderTextColor="#E0E0E0"
                  />
                ) : (
                  <Text style={styles.degree}>{profileData.degree}</Text>
                )}
                <View style={styles.universityContainer}>
                  <Ionicons name="location" size={wp("4%")} color="#E0E0E0" />
                  {editingSections.header ? (
                    <TextInput
                      style={styles.universityInput}
                      value={profileData.university}
                      onChangeText={(text) =>
                        setProfileData((prev) => ({
                          ...prev,
                          university: text,
                        }))
                      }
                      placeholder="University"
                      placeholderTextColor="#E0E0E0"
                    />
                  ) : (
                    <Text style={styles.university}>
                      {profileData.university}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </BlurView>
        </View>

        <View style={styles.contentContainer}>
          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {profileData?.skills?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Skills</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {profileData?.achievements?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {new Date(profileData.graduationDate).getFullYear()}
              </Text>
              <Text style={styles.statLabel}>Year</Text>
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLeft}>
                <View style={styles.sectionIconContainer}>
                  <Ionicons
                    name="person-outline"
                    size={wp("6%")}
                    color="#3949ab"
                  />
                </View>
                <Text style={styles.sectionTitle}>About</Text>
              </View>
              <Pressable
                onPress={() => toggleEditSection("bio")}
                style={styles.sectionEditButton}
              >
                <Ionicons
                  name={
                    editingSections.bio ? "checkmark-circle" : "create-outline"
                  }
                  size={wp("6%")}
                  color="#3949ab"
                />
              </Pressable>
            </View>
            {editingSections.bio ? (
              <TextInput
                style={styles.bioInput}
                value={profileData.bio}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, bio: text }))
                }
                multiline
                placeholder="Tell us about yourself..."
                placeholderTextColor="#666"
              />
            ) : (
              <Text style={styles.bioText}>{profileData.bio}</Text>
            )}
          </View>

          {/* Skills Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLeft}>
                <View style={styles.sectionIconContainer}>
                  <Ionicons
                    name="code-working-outline"
                    size={wp("6%")}
                    color="#3949ab"
                  />
                </View>
                <Text style={styles.sectionTitle}>Skills</Text>
              </View>
              <Pressable
                onPress={() => toggleEditSection("skills")}
                style={styles.sectionEditButton}
              >
                <Ionicons
                  name={
                    editingSections.skills
                      ? "checkmark-circle"
                      : "create-outline"
                  }
                  size={wp("6%")}
                  color="#3949ab"
                />
              </Pressable>
            </View>
            {editingSections.skills && (
              <View style={styles.addItemContainer}>
                <TextInput
                  style={styles.addItemInput}
                  value={newSkill}
                  onChangeText={setNewSkill}
                  placeholder="Add new skill"
                  placeholderTextColor="#666"
                />
                <Pressable onPress={addSkill} style={styles.addButton}>
                  <Ionicons name="add" size={wp("6%")} color="#3949ab" />
                </Pressable>
              </View>
            )}
            <View style={styles.tagContainer}>
              {profileData.skills.map((skill, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{skill?.skillName}</Text>
                  {editingSections.skills && (
                    <Pressable
                      onPress={() => removeSkill(index)}
                      style={styles.removeTagButton}
                    >
                      <Ionicons
                        name="close-circle"
                        size={wp("4%")}
                        color="#3949ab"
                      />
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Achievements Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLeft}>
                <View style={styles.sectionIconContainer}>
                  <Ionicons
                    name="trophy-outline"
                    size={wp("6%")}
                    color="#3949ab"
                  />
                </View>
                <Text style={styles.sectionTitle}>Achievements</Text>
              </View>
              <Pressable
                onPress={() => toggleEditSection("achievements")}
                style={styles.sectionEditButton}
              >
                <Ionicons
                  name={
                    editingSections.achievements
                      ? "checkmark-circle"
                      : "create-outline"
                  }
                  size={wp("6%")}
                  color="#3949ab"
                />
              </Pressable>
            </View>
            {editingSections.achievements && (
              <View style={styles.addItemContainer}>
                <TextInput
                  style={styles.addItemInput}
                  value={newAchievement}
                  onChangeText={setNewAchievement}
                  placeholder="Add new achievement"
                  placeholderTextColor="#666"
                />
                <Pressable onPress={addAchievement} style={styles.addButton}>
                  <Ionicons name="add" size={wp("6%")} color="#3949ab" />
                </Pressable>
              </View>
            )}
            {Array.isArray(profileData?.achievements) &&
              profileData.achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <View style={styles.achievementIcon}>
                    <LinearGradient
                      colors={["#FFD700", "#FFA000"]}
                      style={styles.achievementIconGradient}
                    >
                      <Ionicons name="star" size={wp("4%")} color="white" />
                    </LinearGradient>
                  </View>
                  <Text style={styles.achievementText}>
                    {achievement.achievementName}
                  </Text>
                  {editingSections.achievements && (
                    <Pressable
                      onPress={() => removeAchievement(index)}
                      style={styles.removeAchievementButton}
                    >
                      <Ionicons
                        name="close-circle"
                        size={wp("5%")}
                        color="#666"
                      />
                    </Pressable>
                  )}
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollView: {
    flex: 1,
    height: "100%",
  },
  imageContainer: {
    height: hp("45%"),
    backgroundColor: "#E0E0E0",
    position: "relative",
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  editImageOverlay: {
    position: "absolute",
    bottom: hp("20%"),
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: hp("2%"),
  },
  editImageText: {
    color: "white",
    fontSize: wp("4%"),
    marginTop: hp("1%"),
  },
  blurContainer: {
    position: "absolute",
    height: hp("20%"),
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    padding: wp("4%"),
  },
  headerContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  headerInfo: {
    flex: 1,
  },
  headerEditContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("0.5%"),
  },
  headerEditButton: {
    padding: wp("2%"),
  },
  nameInputContainer: {
    flexDirection: "row",
    gap: wp("2%"),
    flex: 1,
  },
  nameInput: {
    fontSize: wp("7%"),
    fontWeight: "bold",
    color: "white",
    flex: 1,
    padding: 0,
  },
  name: {
    fontSize: wp("7%"),
    fontWeight: "bold",
    color: "white",
  },
  degreeInput: {
    fontSize: wp("4.5%"),
    color: "white",
    marginBottom: hp("1%"),
    padding: 0,
  },
  degree: {
    fontSize: wp("4.5%"),
    color: "#E0E0E0",
    marginBottom: hp("1%"),
    fontWeight: "500",
  },
  universityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  universityInput: {
    fontSize: wp("4%"),
    color: "white",
    marginLeft: wp("2%"),
    flex: 1,
    padding: 0,
  },
  university: {
    fontSize: wp("4%"),
    color: "#E0E0E0",
    marginLeft: wp("2%"),
  },
  contentContainer: {
    padding: wp("4%"),
    marginTop: -hp("2%"),
    paddingBottom: hp("10%"),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyProfileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp("8%"),
    backgroundColor: "#F5F7FA",
  },
  emptyProfileTitle: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "#3949ab",
    marginVertical: hp("2%"),
  },
  emptyProfileText: {
    fontSize: wp("4%"),
    color: "#666",
    textAlign: "center",
    marginBottom: hp("4%"),
    lineHeight: wp("6%"),
  },
  createProfileButton: {
    backgroundColor: "#3949ab",
    paddingHorizontal: wp("8%"),
    paddingVertical: hp("2%"),
    borderRadius: wp("2%"),
  },
  createProfileButtonText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
  quickStats: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: wp("4%"),
    padding: wp("4%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: hp("2%"),
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "#3949ab",
  },
  statLabel: {
    fontSize: wp("3.5%"),
    color: "#666",
    marginTop: hp("0.5%"),
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#E0E0E0",
    marginHorizontal: wp("2%"),
  },
  section: {
    backgroundColor: "white",
    borderRadius: wp("4%"),
    padding: wp("4%"),
    marginBottom: hp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp("2%"),
  },
  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIconContainer: {
    width: wp("12%"),
    height: wp("12%"),
    backgroundColor: "#EEF2FF",
    borderRadius: wp("6%"),
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp("3%"),
  },
  sectionEditButton: {
    padding: wp("2%"),
  },
  sectionTitle: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: "#3949ab",
  },
  bioInput: {
    fontSize: wp("4%"),
    color: "#424242",
    lineHeight: wp("6%"),
    textAlignVertical: "top",
    minHeight: hp("10%"),
    padding: wp("2%"),
    backgroundColor: "#F8F9FB",
    borderRadius: wp("2%"),
  },
  bioText: {
    fontSize: wp("4%"),
    color: "#424242",
    lineHeight: wp("6%"),
  },
  addItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2%"),
    gap: wp("2%"),
  },
  addItemInput: {
    flex: 1,
    fontSize: wp("4%"),
    color: "#424242",
    padding: wp("3%"),
    backgroundColor: "#F8F9FB",
    borderRadius: wp("2%"),
  },
  addButton: {
    width: wp("12%"),
    height: wp("12%"),
    backgroundColor: "#EEF2FF",
    borderRadius: wp("6%"),
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "#F8F9FB",
    padding: wp("3%"),
    borderRadius: wp("2%"),
    marginBottom: hp("1%"),
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
});
