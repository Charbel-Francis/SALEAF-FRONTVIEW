import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import Animated from "react-native-reanimated";
import { View, StyleSheet, Pressable, Text, ScrollView } from "react-native";
import { BlurView } from "expo-blur";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { sharedTransition } from "@/components/transitions/sharedTransitions";
import { LinearGradient } from "expo-linear-gradient";

interface StudentParams {
  studentId: string;
  firstName: string;
  lastName: string;
  skills: string; // Changed from string[] to string since it comes as JSON string
  achievements: string; // Changed from string[] to string since it comes as JSON string
  year: string;
  isFinalYear: string;
  bio: string;
  graduationDate: string;
  university: string;
  degree: string;
  onlineProfile: string;
  studentImageUrl: string;
}

interface Skill {
  id: string;
  skillName: string;
  studentProfileId: string;
  studentProfile?: any;
}
interface Achievement {
  id: string;
  achievementName: string;
  studentProfileId: string;
  studentProfile?: any;
}
export default function StudentDetailsScreen() {
  const params = useLocalSearchParams() as unknown as StudentParams;
  const router = useRouter();

  // Parse skills and achievements, ensuring we handle both array and string cases
  const parsedSkills = JSON.parse(
    Array.isArray(params.skills) ? params.skills[0] : params.skills || "[]"
  ) as Skill[];

  const parsedAchievements = JSON.parse(
    Array.isArray(params.achievements)
      ? params.achievements[0]
      : params.achievements || "[]"
  ) as Achievement[];

  // Extract skill names from the skill objects
  const skills = parsedSkills.map((skill) => skill.skillName);
  const achievements = parsedAchievements;

  const {
    studentId,
    firstName,
    lastName,
    year,
    isFinalYear,
    bio,
    graduationDate,
    university,
    degree,
    onlineProfile,
    studentImageUrl,
  } = params;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.scrollView} bounces={false}>
        <View style={styles.imageContainer}>
          <Animated.View
            sharedTransitionTag={`event-container-${studentId}`}
            sharedTransitionStyle={sharedTransition}
            style={[StyleSheet.absoluteFill, { overflow: "hidden" }]}
          >
            <Animated.Image
              source={{
                uri: Array.isArray(studentImageUrl)
                  ? studentImageUrl[0]
                  : studentImageUrl,
              }}
              sharedTransitionTag={`event-image-${studentId}`}
              sharedTransitionStyle={sharedTransition}
              style={[StyleSheet.absoluteFill]}
              resizeMode="cover"
            />
          </Animated.View>

          <BlurView
            intensity={30}
            style={[
              styles.blurContainer,
              { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            ]}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerInfo}>
                <Animated.Text
                  sharedTransitionTag={`event-title-${studentId}`}
                  sharedTransitionStyle={sharedTransition}
                  style={styles.name}
                >
                  {firstName} {lastName}
                </Animated.Text>
                <Text style={styles.degree}>{degree}</Text>
                <View style={styles.universityContainer}>
                  <Ionicons name="location" size={wp("4%")} color="#E0E0E0" />
                  <Animated.Text
                    sharedTransitionTag={`event-location-${university}`}
                    sharedTransitionStyle={sharedTransition}
                    style={styles.university}
                  >
                    {university}
                  </Animated.Text>
                </View>
              </View>
            </View>
          </BlurView>
        </View>

        <View style={styles.contentContainer}>
          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{skills.length}</Text>
              <Text style={styles.statLabel}>Skills</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{achievements.length}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {new Date(graduationDate).getFullYear()}
              </Text>
              <Text style={styles.statLabel}>Year</Text>
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons
                  name="person-outline"
                  size={wp("6%")}
                  color="#3949ab"
                />
              </View>
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            <Text style={styles.bioText}>{bio}</Text>
          </View>

          {/* Education */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Ionicons
                  name="school-outline"
                  size={wp("6%")}
                  color="#3949ab"
                />
              </View>
              <Text style={styles.sectionTitle}>Education</Text>
            </View>
            <View style={styles.educationItem}>
              <Text style={styles.educationDegree}>{degree}</Text>
              <Text style={styles.educationDetails}>{university}</Text>
              <View style={styles.educationMetaContainer}>
                <View style={styles.educationMeta}>
                  <Ionicons
                    name="calendar-outline"
                    size={wp("4%")}
                    color="#666"
                  />
                  <Text style={styles.educationMetaText}>
                    {year} Year {isFinalYear === "true" && "• Final Year"}
                  </Text>
                </View>
                <View style={styles.educationMeta}>
                  <Ionicons name="time-outline" size={wp("4%")} color="#666" />
                  <Text style={styles.educationMetaText}>
                    Graduating:{" "}
                    {new Date(graduationDate).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Skills */}
          {skills.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Ionicons
                    name="code-working-outline"
                    size={wp("6%")}
                    color="#3949ab"
                  />
                </View>
                <Text style={styles.sectionTitle}>Skills</Text>
              </View>
              <View style={styles.tagContainer}>
                {skills.map((skill, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Ionicons
                    name="trophy-outline"
                    size={wp("6%")}
                    color="#3949ab"
                  />
                </View>
                <Text style={styles.sectionTitle}>Achievements</Text>
              </View>
              {achievements.map((achievement, index) => (
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
                </View>
              ))}
            </View>
          )}

          {/* Online Profile */}
          {onlineProfile && (
            <Pressable>
              <View style={[styles.section, styles.profileSection]}>
                <LinearGradient
                  colors={["#3949ab", "#5c6bc0"]}
                  style={styles.profileGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.profileContent}>
                    <View style={styles.profileLeft}>
                      <Ionicons
                        name="globe-outline"
                        size={wp("6%")}
                        color="white"
                      />
                      <Text style={styles.profileText}>{onlineProfile}</Text>
                    </View>
                    <View style={styles.profileButton}>
                      <Text style={styles.profileButtonText}>View Profile</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={wp("5%")}
                        color="white"
                      />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <BlurView intensity={80} style={styles.backButtonBlur}>
          <Ionicons name="arrow-back" size={wp("6%")} color="#3949ab" />
        </BlurView>
      </Pressable>
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
  },
  imageContainer: {
    height: hp("45%"),
    position: "relative",
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
  name: {
    fontSize: wp("7%"),
    fontWeight: "bold",
    color: "white",
    marginBottom: hp("0.5%"),
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
  university: {
    fontSize: wp("4%"),
    color: "#E0E0E0",
    marginLeft: wp("2%"),
  },
  contentContainer: {
    padding: wp("4%"),
    marginTop: -hp("2%"),
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
    marginBottom: hp("2%"),
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
  sectionTitle: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: "#3949ab",
  },
  bioText: {
    fontSize: wp("4%"),
    color: "#424242",
    lineHeight: wp("6%"),
  },
  educationItem: {
    backgroundColor: "#F8F9FB",
    padding: wp("4%"),
    borderRadius: wp("3%"),
  },
  educationDegree: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: "#3949ab",
    marginBottom: hp("0.5%"),
  },
  educationDetails: {
    fontSize: wp("4%"),
    color: "#424242",
    marginBottom: hp("1.5%"),
  },
  educationMetaContainer: {
    gap: hp("1%"),
  },
  educationMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  educationMetaText: {
    fontSize: wp("3.5%"),
    color: "#666",
    marginLeft: wp("2%"),
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
  },
  tagText: {
    color: "#3949ab",
    fontSize: wp("3.8%"),
    fontWeight: "500",
  },
  // Continuing the styles object...
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
  profileSection: {
    padding: 0,
    overflow: "hidden",
  },
  profileGradient: {
    padding: wp("4%"),
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "500",
    marginLeft: wp("3%"),
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
    borderRadius: wp("5%"),
  },
  profileButtonText: {
    color: "white",
    fontSize: wp("3.8%"),
    fontWeight: "500",
    marginRight: wp("2%"),
  },
  backButton: {
    position: "absolute",
    top: hp("6%"),
    left: wp("4%"),
    zIndex: 1,
  },
  backButtonBlur: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  skillsContainer: {
    gap: hp("2%"),
  },
  skillItem: {
    backgroundColor: "#F8F9FB",
    borderRadius: wp("3%"),
    padding: wp("3%"),
  },
  skillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  skillName: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#424242",
  },
  skillLevelContainer: {
    flexDirection: "row",
    gap: wp("1%"),
  },
  skillDot: {
    width: wp("2%"),
    height: wp("2%"),
    borderRadius: wp("1%"),
  },
  skillProgress: {
    height: hp("1%"),
    backgroundColor: "#E0E0E0",
    borderRadius: hp("0.5%"),
    overflow: "hidden",
  },
  skillProgressFill: {
    height: "100%",
    backgroundColor: "#3949ab",
    borderRadius: hp("0.5%"),
  },
  achievementsContainer: {
    gap: hp("2%"),
  },
  achievementCard: {
    backgroundColor: "#F8F9FB",
    borderRadius: wp("3%"),
    padding: wp("4%"),
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  achievementIconContainer: {
    marginRight: wp("3%"),
  },
  achievementTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#424242",
    marginBottom: hp("0.5%"),
  },
  achievementDate: {
    fontSize: wp("3.5%"),
    color: "#666",
  },
  achievementDescription: {
    fontSize: wp("3.8%"),
    color: "#666",
    lineHeight: wp("5.5%"),
    marginTop: hp("1%"),
  },
});
