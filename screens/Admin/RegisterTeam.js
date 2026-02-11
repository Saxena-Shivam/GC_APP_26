import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  FlatList,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { LoginContext } from "../../store/LoginContext";
import { backend_link } from "../../utils/constants";

const RegisterTeam = ({ navigation }) => {
  const { detail, user } = useContext(LoginContext);
  const userBranch = detail?.dept || "CSE";
  const userEmail = detail?.email || user?.email || "";

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, [userBranch]);

  useEffect(() => {
    if (!loading) {
      applyFilters();
    }
  }, [events, selectedCategory, searchQuery, loading]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backend_link}api/registration/events?branch=${userBranch}`,
      );

      setEvents(response.data.events || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      Alert.alert(
        "Error",
        "Failed to load events. Please check your connection.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((evt) =>
        evt.eventName?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((evt) => {
        const category = (evt.category || "").toLowerCase();
        if (selectedCategory === "culture") {
          return (
            category === "culture" ||
            category === "cultural" ||
            category === "cult"
          );
        }
        return category === selectedCategory;
      });
    }

    // Sort: upcoming events first, then past events
    const now = Date.now();
    const upcoming = filtered.filter((e) => e.timestamp >= now);
    const past = filtered.filter((e) => e.timestamp < now);

    upcoming.sort((a, b) => a.timestamp - b.timestamp);
    past.sort((a, b) => b.timestamp - a.timestamp); // Recent past first
    filtered = [...upcoming, ...past];

    setFilteredEvents(filtered);
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "sports":
        return "#118d49";
      case "tech":
        return "#4ECDC4";
      case "culture":
        return "#FFE66D";
      default:
        return "#95E1D3";
    }
  };

  const getStatusBadge = (registrationStatus) => {
    if (registrationStatus === "submitted") {
      return { color: "#4CAF50", text: "Registered" };
    } else if (registrationStatus === "draft") {
      return { color: "#FFC107", text: "Draft" };
    }
    return { color: "#9E9E9E", text: "Not Started" };
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "TBA";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleRegister = (event) => {
    navigation.navigate("TeamRegistrationForm", {
      eventId: event.eventId,
      eventName: event.eventName,
      eventType: event.eventType,
      category: event.category,
      maxPlayers: event.maxPlayers,
      timestamp: event.timestamp,
      location: event.location,
      branch: userBranch,
      userEmail: userEmail,
      registrationStatus: event.registrationStatus,
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const renderEventCard = (event) => {
    const statusBadge = getStatusBadge(event.registrationStatus);
    const isPastEvent = event.timestamp && event.timestamp < Date.now();

    return (
      <TouchableOpacity
        key={event.eventId}
        style={[styles.eventCard, isPastEvent && styles.pastEventCard]}
        onPress={() => !isPastEvent && handleRegister(event)}
        disabled={isPastEvent}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.titleSection}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {event.eventName || "Untitled Event"}
            </Text>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(event.category) },
              ]}
            >
              <Text style={styles.categoryText}>
                {event.category || "Sports"}
              </Text>
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="#AED6F1" />
            <Text style={styles.infoText}>{formatDate(event.timestamp)}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="map-marker"
              size={16}
              color="#AED6F1"
            />
            <Text style={styles.infoText} numberOfLines={1}>
              {event.location || "TBA"}
            </Text>
          </View>

          {event.maxPlayers && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name={event.eventType === "team" ? "account-group" : "account"}
                size={16}
                color="#AED6F1"
              />
              <Text style={styles.infoText}>
                {event.eventType === "team"
                  ? `Max ${event.maxPlayers} players`
                  : "Individual Event"}
              </Text>
            </View>
          )}

          {event.registeredCount > 0 && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="check-circle"
                size={16}
                color="#4CAF50"
              />
              <Text style={styles.infoText}>
                {event.registeredCount}{" "}
                {event.eventType === "team" ? "player(s)" : "participant(s)"}{" "}
                registered
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View
            style={[styles.statusBadge, { backgroundColor: statusBadge.color }]}
          >
            <Text style={styles.statusText}>{statusBadge.text}</Text>
          </View>

          {!isPastEvent && (
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => handleRegister(event)}
            >
              <MaterialCommunityIcons
                name={event.registrationStatus ? "pencil" : "plus"}
                size={16}
                color="#fff"
              />
              <Text style={styles.registerBtnText}>
                {event.registrationStatus ? "Edit" : "Register"}
              </Text>
            </TouchableOpacity>
          )}

          {isPastEvent && (
            <View style={styles.pastBadge}>
              <Text style={styles.pastText}>Event Ended</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Team Registration</Text>
        <Text style={styles.headerSubtitle}>
          Register for events • Branch: {userBranch}
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {["all", "sports", "tech", "culture"].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterChip,
              selectedCategory === cat && styles.filterChipActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === cat && styles.filterTextActive,
              ]}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Events List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#D41D77" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : filteredEvents.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="inbox-outline" size={48} color="#555" />
          <Text style={styles.emptyText}>No events found</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => setSearchQuery("")}
          >
            <Text style={styles.retryText}>Clear filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.eventsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#D41D77"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {filteredEvents.map((event) => renderEventCard(event))}
          <View style={{ height: 10 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1419",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#D41D77",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#888",
    fontWeight: "400",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: "#1A1F26",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2A3038",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: "#fff",
  },
  filterScroll: {
    maxHeight: 45,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#1A1F26",
    borderWidth: 1,
    borderColor: "#333",
  },
  filterChipActive: {
    backgroundColor: "#D41D77",
    borderColor: "#D41D77",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888",
  },
  filterTextActive: {
    color: "#fff",
  },
  eventsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  eventCard: {
    backgroundColor: "#1A1F26",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A3038",
    marginBottom: 12,
    overflow: "hidden",
  },
  pastEventCard: {
    opacity: 0.5,
  },
  cardHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2A3038",
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  eventTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#000",
  },
  cardBody: {
    padding: 12,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#AAA",
    flex: 1,
  },
  cardFooter: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#2A3038",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
  },
  registerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#D41D77",
    borderRadius: 6,
  },
  registerBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  pastBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#555",
    borderRadius: 6,
  },
  pastText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#888",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#D41D77",
    borderRadius: 6,
  },
  retryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
});

export default RegisterTeam;
