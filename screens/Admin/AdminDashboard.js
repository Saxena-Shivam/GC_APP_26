import React from "react";
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";

import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import axios from "axios";
import { backend_link } from "../../utils/constants";

const handleBetsUpdate = async () => {
  try {
    const res = await axios.post(
      `${backend_link}api/points/updateFantasyPoints`,
      {
        backend_link,
      },
    );
    const res2 = await axios.get(
      `${backend_link}api/points/updateTechCultPoints`,
    );
    // console.log("Updated Fantasy Points");
    // console.log(res.data);
    if (res.data.message != "success") {
      new Error("something went wrong");
    }
    Alert.alert("Updated Fantasy Points,");
  } catch (error) {
    console.error("Error updating coins(frontend)", error);
  }
};

const AdminDashboard = ({ navigation }) => {
  const AddPoints = () => {
    return navigation.navigate("AdminAddScoreStack");
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Text style={styles.heading}>Admin Panel</Text>
            <Text style={styles.subtitle}>
              Manage all platform features and settings
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={40}
              color="#d41d77"
            />
          </View>
        </View>

        {/* Main Grid */}
        <View style={styles.gridContainer}>
          {/* Row 1 */}
          <View style={styles.row}>
            {/* Notifications */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.notificationCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => navigation.navigate("AddNotification")}
            >
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons name="bell" size={28} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Notifications</Text>
              <Text style={styles.cardDescription}>Send or Delete</Text>
            </Pressable>

            {/* Add Score */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.scoreCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => navigation.navigate("AdminAddScoreStack")}
            >
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons
                  name="star-circle"
                  size={28}
                  color="#fff"
                />
              </View>
              <Text style={styles.cardTitle}>Add Score</Text>
              <Text style={styles.cardDescription}>Sports Events</Text>
            </Pressable>
          </View>

          {/* Row 2 */}
          <View style={styles.row}>
            {/* Live Events */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.liveCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => navigation.navigate("LiveEvents")}
            >
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons
                  name="flag-checkered"
                  size={28}
                  color="#fff"
                />
              </View>
              <Text style={styles.cardTitle}>Live Events</Text>
              <Text style={styles.cardDescription}>Add or Update</Text>
            </Pressable>

            {/* Update Points */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.pointsCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => handleBetsUpdate()}
            >
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons
                  name="chart-line"
                  size={28}
                  color="#fff"
                />
              </View>
              <Text style={styles.cardTitle}>Update Points</Text>
              <Text style={styles.cardDescription}>Fantasy League</Text>
            </Pressable>
          </View>

          {/* Row 3 */}
          <View style={styles.row}>
            {/* Sports Result */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.resultsCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => navigation.navigate("SportPoints")}
            >
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons name="trophy" size={28} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Sports Result</Text>
              <Text style={styles.cardDescription}>Add Results</Text>
            </Pressable>

            {/* Report Cheating */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.contentionCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => navigation.navigate("AddContention")}
            >
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons
                  name="alert-octagon"
                  size={28}
                  color="#fff"
                />
              </View>
              <Text style={styles.cardTitle}>Report Cheating</Text>
              <Text style={styles.cardDescription}>File Complaint</Text>
            </Pressable>
          </View>

          {/* Row 4 */}
          <View style={styles.row}>
            {/* View Contentions */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.viewCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => navigation.navigate("ViewContentions")}
            >
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons
                  name="clipboard-check"
                  size={28}
                  color="#fff"
                />
              </View>
              <Text style={styles.cardTitle}>View Contentions</Text>
              <Text style={styles.cardDescription}>Manage Complaints</Text>
            </Pressable>

            {/* Register Team */}
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.registerCard,
                pressed && styles.cardPressed,
              ]}
              // onPress={() => navigation.navigate("/")}
            >
              <View style={styles.cardIconContainer}>
                <MaterialCommunityIcons
                  name="account-plus"
                  size={28}
                  color="#fff"
                />
              </View>
              <Text style={styles.cardTitle}>Register Team</Text>
              <Text style={styles.cardDescription}>Add Participants</Text>
            </Pressable>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 20,
  },
  headerSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
  },
  headerIcon: {
    marginLeft: 20,
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  heading: {
    color: "#d41d77",
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: "#999",
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
  },
  gridContainer: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 160,
    borderWidth: 1,
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  cardDescription: {
    color: "#999",
    fontSize: 11,
    fontWeight: "400",
    textAlign: "center",
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  notificationCard: {
    backgroundColor: "#1a1a1a",
    borderColor: "#444",
  },
  scoreCard: {
    backgroundColor: "#1a1a1a",
    borderColor: "#444",
  },
  liveCard: {
    backgroundColor: "#1a1a1a",
    borderColor: "#d41d77",
  },
  pointsCard: {
    backgroundColor: "#1a1a1a",
    borderColor: "#444",
  },
  resultsCard: {
    backgroundColor: "#1a1a1a",
    borderColor: "#444",
  },
  contentionCard: {
    backgroundColor: "#1a1a1a",
    borderColor: "#d41d77",
  },
  viewCard: {
    backgroundColor: "#1a1a1a",
    borderColor: "#444",
  },
  registerCard: {
    backgroundColor: "#1a1a1a",
    borderColor: "#444",
  },
});
