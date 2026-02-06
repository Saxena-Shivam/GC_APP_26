import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Icon } from "react-native-elements";
import { LoginContext } from "../store/LoginContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { backend_link } from "../utils/constants";
import FollowTeamComponent from "../Components/FollowTeamComponent";

const { width } = Dimensions.get("window");

export default function NotificationsPage() {
  const LoginCtx = useContext(LoginContext);
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("messages"); // "messages" or "follow"
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [followedTeams, setFollowedTeams] = useState([]);
  const [reload, setReload] = useState(false);

  // Fetch followed teams
  const fetchFollowedTeams = async () => {
    try {
      const email = LoginCtx?.user?.email;
      if (!email) return;

      const response = await axios.get(
        `${backend_link}api/user/getFollowing?email=${email}`,
      );
      const teams = response.data?.following?.team || [];
      setFollowedTeams(teams);
    } catch (error) {
      console.error("Error fetching followed teams:", error);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const email = LoginCtx?.user?.email;
      if (!email) {
        setLoading(false);
        return;
      }

      // Fetch all announcements from backend
      const response = await axios.get(
        `${backend_link}api/announcements/getAnnouncements`,
      );

      // Backend returns object with uuid keys, convert to array
      const dataObj = response.data || {};
      const allNotifications = Object.keys(dataObj).map((id) => ({
        id,
        ...dataObj[id],
      }));

      // Filter notifications based on followed teams
      // Show all "All" notifications + notifications for followed teams
      const filteredNotifications = allNotifications.filter((notif) => {
        if (notif.team === "All") return true;
        return followedTeams.includes(notif.team);
      });

      // Sort by timestamp (newest first)
      const sortedNotifications = filteredNotifications.sort((a, b) => {
        // Handle firestore timestamp objects
        const getTime = (ts) => {
          if (ts?._seconds) return ts._seconds * 1000;
          if (ts) return new Date(ts).getTime();
          return 0;
        };
        return getTime(b.timestamp) - getTime(a.timestamp);
      });

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowedTeams();
  }, [reload]);

  useEffect(() => {
    if (followedTeams.length > 0 || LoginCtx?.user?.email) {
      fetchNotifications();
    }
  }, [followedTeams]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFollowedTeams();
    await fetchNotifications();
    setRefreshing(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently";

    // Handle Firestore timestamp format
    let date;
    if (timestamp?._seconds) {
      date = new Date(timestamp._seconds * 1000);
    } else {
      date = new Date(timestamp);
    }

    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getTeamColor = (team) => {
    if (team === "All") return "#d41d77";
    const colors = {
      CSE: "#FF6B6B",
      ECE_META: "#4ECDC4",
      EE: "#FFE66D",
      CIVIL: "#95E1D3",
      MECH: "#F38181",
      MTech: "#AA96DA",
      MSc_ITEP: "#FCBAD3",
      PHD: "#A8E6CF",
    };
    return colors[team] || "#888";
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Icon
            name="bell"
            type="material-community"
            size={20}
            color={getTeamColor(item.team)}
          />
          <Text
            style={[
              styles.teamBadge,
              { backgroundColor: getTeamColor(item.team) },
            ]}
          >
            {item.team || "General"}
          </Text>
        </View>
        <Text style={styles.timeText}>{formatDate(item.timestamp)}</Text>
      </View>

      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationBody}>{item.description}</Text>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="bell-outline"
        type="material-community"
        size={80}
        color="#555"
      />
      <Text style={styles.emptyTitle}>No Notifications Yet</Text>
      <Text style={styles.emptyText}>
        Follow your favorite teams to receive updates!
      </Text>
      <TouchableOpacity
        style={styles.followButton}
        onPress={() => setActiveTab("follow")}
      >
        <Text style={styles.followButtonText}>Follow Teams</Text>
      </TouchableOpacity>
    </View>
  );

  const teams = [
    "CSE",
    "ECE_META",
    "EE",
    "CIVIL",
    "MECH",
    "MTech",
    "MSc_ITEP",
    "PHD",
  ];

  const renderFollowItem = ({ item }) => {
    const isFollowing = followedTeams.includes(item);
    return (
      <View style={{ padding: 5, alignItems: "center", width: "100%" }}>
        <FollowTeamComponent
          setReload={setReload}
          branchData={item}
          isFollowing={isFollowing}
        />
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d41d77" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Text style={styles.headerSubtitle}>
          {followedTeams.length > 0
            ? `Following ${followedTeams.length} team(s)`
            : "Follow teams to get updates"}
        </Text>

        {/* Tab Buttons */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "messages" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("messages")}
          >
            <Icon
              name="message-text"
              type="material-community"
              size={20}
              color={activeTab === "messages" ? "#fff" : "#888"}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "messages" && styles.activeTabButtonText,
              ]}
            >
              Messages
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "follow" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("follow")}
          >
            <Icon
              name="account-group"
              type="material-community"
              size={20}
              color={activeTab === "follow" ? "#fff" : "#888"}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "follow" && styles.activeTabButtonText,
              ]}
            >
              Follow
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages Tab Content */}
      {activeTab === "messages" && (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item, index) =>
            `${item.id || index}-${item.timestamp}`
          }
          contentContainerStyle={
            notifications.length === 0 && styles.emptyListContainer
          }
          ListEmptyComponent={<EmptyState />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#d41d77"
              colors={["#d41d77"]}
            />
          }
        />
      )}

      {/* Follow Tab Content */}
      {activeTab === "follow" && (
        <View style={styles.followContainer}>
          <View style={styles.followHeader}>
            <Text style={styles.followTitle}>Follow your Team!</Text>
            <Text style={styles.followSubtitle}>
              Stay updated and get all news about GC!
            </Text>
          </View>
          <FlatList
            data={teams}
            renderItem={renderFollowItem}
            keyExtractor={(item, index) => `${item}-${index}`}
            contentContainerStyle={{ paddingBottom: 100, alignItems: "center" }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#d41d77"
                colors={["#d41d77"]}
              />
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#1a1a1a",
    gap: 8,
  },
  activeTabButton: {
    backgroundColor: "#d41d77",
  },
  tabButtonText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabButtonText: {
    color: "#fff",
  },
  notificationCard: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#d41d77",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamBadge: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    overflow: "hidden",
  },
  timeText: {
    color: "#888",
    fontSize: 12,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  notificationBody: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
  },
  followButton: {
    backgroundColor: "#d41d77",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  followContainer: {
    flex: 1,
    paddingTop: 10,
    alignItems: "center",
  },
  followHeader: {
    padding: 20,
    paddingBottom: 10,
    alignItems: "center",
    width: "100%",
  },
  followTitle: {
    color: "#d41d77",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  followSubtitle: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
  },
});
