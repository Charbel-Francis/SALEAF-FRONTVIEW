import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import Animated from "react-native-reanimated";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Link } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { sharedTransition } from "@/components/transitions/sharedTransitions";
import axiosInstance from "@/utils/config";
import { StudentInterface } from "@/types/types";
import { ActivityIndicator } from "react-native-paper";

const StudentCard = ({ student }: { student: StudentInterface }) => {
  return (
    <Link
      href={{
        pathname: "/pages/student_details",
        params: {
          ...student,
          skills: JSON.stringify(student.skills),
          achievements: JSON.stringify(student.achievements),
          isFinalYear: student.isFinalYear.toString(),
          graduationDate: new Date(student.graduationDate).toDateString(),
          studentImageUrl: student.imageUrl,
        },
      }}
      asChild
    >
      <Pressable style={styles.cardContainer}>
        <Animated.View
          sharedTransitionTag={`card-container-${student.id}`}
          sharedTransitionStyle={sharedTransition}
          style={[styles.cardInner]}
        >
          <Animated.Image
            source={{ uri: student.imageUrl }}
            sharedTransitionTag={`card-image-${student.id}`}
            sharedTransitionStyle={sharedTransition}
            style={[styles.cardImage]}
            resizeMode="cover"
          />
          <BlurView
            intensity={30}
            style={[
              styles.blurContainer,
              { backgroundColor: "rgba(0, 0, 0, 0.3)" },
            ]}
            tint="dark"
          >
            <View style={styles.contentWrapper}>
              <View style={styles.infoContainer}>
                <Animated.Text
                  sharedTransitionTag={`student-name-${student.id}`}
                  sharedTransitionStyle={sharedTransition}
                  style={styles.title}
                  numberOfLines={1}
                >
                  {student.firstName} {student.lastName}
                </Animated.Text>

                <View style={styles.detailsContainer}>
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="school"
                      size={wp("4%")}
                      color="white"
                      style={styles.icon}
                    />
                    <Animated.Text
                      sharedTransitionTag={`student-university-${student.id}`}
                      sharedTransitionStyle={sharedTransition}
                      style={styles.infoText}
                      numberOfLines={1}
                    >
                      {student.university}
                    </Animated.Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="book"
                      size={wp("4%")}
                      color="white"
                      style={styles.icon}
                    />
                    <Animated.Text
                      sharedTransitionTag={`student-degree-${student.id}`}
                      sharedTransitionStyle={sharedTransition}
                      style={styles.infoText}
                      numberOfLines={1}
                    >
                      {student.degree}
                    </Animated.Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="calendar"
                      size={wp("4%")}
                      color="white"
                      style={styles.icon}
                    />
                    <Text style={styles.infoText} numberOfLines={1}>
                      Class of {new Date(student.graduationDate).getFullYear()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Status</Text>
                <Text style={styles.priceValue}>
                  {student.isFinalYear ? "Final Year" : "Undergraduate"}
                </Text>
              </View>
            </View>
          </BlurView>
        </Animated.View>
      </Pressable>
    </Link>
  );
};

export default function StudentsScreen() {
  const [students, setStudents] = useState<StudentInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getStudents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        "/api/StudentProfile/all-studentprofiles"
      );
      setStudents(response.data);
      setError(null);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="people-outline" size={wp("20%")} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No Students Found</Text>
      <Text style={styles.emptyStateText}>
        There are currently no students available
      </Text>
      <Pressable style={styles.retryButton} onPress={getStudents}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#3949ab" size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyStateContainer}>
        <Ionicons
          name="alert-circle-outline"
          size={wp("20%")}
          color="#ff6b6b"
        />
        <Text style={styles.emptyStateTitle}>Something went wrong</Text>
        <Text style={styles.emptyStateText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={getStudents}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={students}
        ListHeaderComponent={() => <Text style={styles.header}>Students</Text>}
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => <StudentCard student={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: hp("20%") },
          students.length === 0 && { flex: 1 },
        ]}
        removeClippedSubviews={false}
        initialNumToRender={students.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: "#1a1a1a",
    marginVertical: hp("2%"),
    marginHorizontal: wp("4%"),
  },
  cardContainer: {
    height: hp("25%"),
    marginHorizontal: wp("4%"),
    marginBottom: hp("2%"),
    borderRadius: wp("3%"),
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: hp("0.25%"),
    },
    shadowOpacity: 0.25,
    shadowRadius: wp("1%"),
  },
  cardInner: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  blurContainer: {
    position: "absolute",
    height: wp("25%"),
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "row",
    padding: wp("3%"),
    justifyContent: "space-between",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingRight: wp("2%"),
  },
  detailsContainer: {
    justifyContent: "space-between",
  },
  title: {
    fontSize: wp("4%"),
    fontWeight: "700",
    color: "white",
    marginBottom: hp("0.5%"),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("0.5%"),
  },
  icon: {
    width: wp("4%"),
    marginRight: wp("1%"),
  },
  infoText: {
    color: "white",
    fontSize: wp("3.2%"),
    flex: 1,
  },
  priceContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  priceLabel: {
    color: "white",
    fontSize: wp("3%"),
    opacity: 0.9,
  },
  priceValue: {
    color: "white",
    fontSize: wp("3.8%"),
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
  },
  emptyStateTitle: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: "#333",
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
  },
  emptyStateText: {
    fontSize: wp("4%"),
    color: "#666",
    textAlign: "center",
    marginBottom: hp("2%"),
  },
  retryButton: {
    backgroundColor: "#3949ab",
    paddingHorizontal: wp("8%"),
    paddingVertical: hp("1.5%"),
    borderRadius: wp("2%"),
    marginTop: hp("2%"),
  },
  retryButtonText: {
    color: "white",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
});
