import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Platform,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ProfileScreen() {
  const [editingSections, setEditingSections] = useState({
    header: false,
    bio: false,
    skills: false,
    achievements: false,
  });
  const [newSkill, setNewSkill] = useState("");
  const [newAchievement, setNewAchievement] = useState("");

  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    bio: "Passionate computer science student with a focus on mobile development and AI.",
    skills: ["React Native", "TypeScript", "Python", "Machine Learning"],
    achievements: ["First Place Hackathon 2023", "Dean's List 2022"],
    university: "Tech University",
    degree: "BSc Computer Science",
    graduationDate: "2025-05",
    year: "3rd",
    onlineProfile: "github.com/johndoe",
    profileImage: null as string | null,
  });

  type Section = "header" | "bio" | "skills" | "achievements";

  const toggleEditSection = (section: Section) => {
    setEditingSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const pickImage = async () => {};

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setProfileData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()],
      }));
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Pressable
            onPress={editingSections.header ? pickImage : undefined}
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
              <Text style={styles.statNumber}>{profileData.skills.length}</Text>
              <Text style={styles.statLabel}>Skills</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {profileData.achievements.length}
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
                  <Text style={styles.tagText}>{skill}</Text>
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
            {profileData.achievements.map((achievement, index) => (
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
    paddingBottom: hp("10%"), // Added padding for tab bar
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
