import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { Icon } from "react-native-elements";
import { LoginContext } from "../../store/LoginContext";
import { backend_link } from "../../utils/constants";
import axios from "axios";

const ViewContentions = ({ navigation }) => {
  const LoginCtx = useContext(LoginContext);
  const isAdmin = !!LoginCtx?.isAdmin;
  const isCoordinator = !!LoginCtx?.isCoordinator;
  const [contentions, setContentions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedContention, setSelectedContention] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, reviewed, resolved

  useEffect(() => {
    if (!isAdmin && !isCoordinator) {
      Alert.alert(
        "Unauthorized",
        "You are not authorized to access contentions.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      );
      setLoading(false);
      return;
    }
    fetchContentions();
  }, [isAdmin, isCoordinator]);

  const fetchContentions = async () => {
    try {
      const reviewerEmail = LoginCtx?.user?.email;
      if (!reviewerEmail) {
        setLoading(false);
        Alert.alert("Error", "User email not found. Please login again.");
        return;
      }

      setLoading(true);
      const response = await axios.get(
        `${backend_link}api/contentions/getContentions`,
        {
          params: { email: reviewerEmail },
        },
      );
      const dataObj = response.data || {};

      // Convert object to array
      const contentionsArray = Object.keys(dataObj).map((id) => ({
        id,
        ...dataObj[id],
      }));

      // Sort by timestamp (newest first)
      const sorted = contentionsArray.sort((a, b) => {
        const getTime = (ts) => {
          if (ts?._seconds) return ts._seconds * 1000;
          if (ts) return new Date(ts).getTime();
          return 0;
        };
        return getTime(b.timestamp) - getTime(a.timestamp);
      });

      setContentions(sorted);
    } catch (error) {
      console.error("Error fetching contentions:", error);
      Alert.alert("Error", "Failed to fetch contentions");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContentions();
    setRefreshing(false);
  };

  const handleUpdateStatus = async (contentionId, newStatus) => {
    try {
      const updateData = {
        contentionId,
        status: newStatus,
        adminNotes,
        reviewedBy: LoginCtx?.user?.email,
      };

      const response = await axios.put(
        `${backend_link}api/contentions/updateContention`,
        updateData,
      );

      Alert.alert("Success", "Contention status updated successfully");
      setModalVisible(false);
      setAdminNotes("");
      await fetchContentions();
    } catch (error) {
      console.error("Error updating contention:", error);
      Alert.alert("Error", "Failed to update contention status");
    }
  };

  const openContentionDetails = (item) => {
    setSelectedContention(item);
    setAdminNotes(item.adminNotes || "");
    setModalVisible(true);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently";
    let date;
    if (timestamp?._seconds) {
      date = new Date(timestamp._seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    return date.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#FFA500";
      case "reviewed":
        return "#4169E1";
      case "resolved":
        return "#00C853";
      default:
        return "#888";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "clock-outline";
      case "reviewed":
        return "eye-check-outline";
      case "resolved":
        return "check-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  const filteredContentions = contentions.filter((item) => {
    if (filterStatus === "all") return true;
    return item.status?.toLowerCase() === filterStatus;
  });

  const renderContention = ({ item }) => (
    <TouchableOpacity
      style={styles.contentionCard}
      onPress={() => openContentionDetails(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Icon
            name={getStatusIcon(item.status)}
            type="material-community"
            size={24}
            color={getStatusColor(item.status)}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.eventName}>{item.eventName}</Text>
            <Text style={styles.eventType}>
              {item.eventType?.toUpperCase()} • Team: {item.teamInvolved}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status?.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>
          By: {item.submitterBranch} Coordinator
        </Text>
        <Text style={styles.footerText}>{formatDate(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="clipboard-check-outline"
        type="material-community"
        size={80}
        color="#555"
      />
      <Text style={styles.emptyTitle}>No Contentions</Text>
      <Text style={styles.emptyText}>
        {filterStatus === "all"
          ? "No contentions have been submitted yet"
          : `No ${filterStatus} contentions found`}
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d41d77" />
        <Text style={styles.loadingText}>Loading contentions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isAdmin ? "Contentions Portal" : "My Contentions"}
        </Text>
        <Text style={styles.headerSubtitle}>
          {contentions.length} total complaint(s)
        </Text>

        {/* Filter Buttons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterContainer}>
            {["all", "pending", "reviewed", "resolved"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  filterStatus === status && styles.activeFilterButton,
                ]}
                onPress={() => setFilterStatus(status)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterStatus === status && styles.activeFilterButtonText,
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={filteredContentions}
        renderItem={renderContention}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          filteredContentions.length === 0 && styles.emptyListContainer
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

      {/* Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Contention Details</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon
                    name="close"
                    type="material-community"
                    size={28}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              {selectedContention && (
                <>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Event:</Text>
                    <Text style={styles.detailValue}>
                      {selectedContention.eventName}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Event Type:</Text>
                    <Text style={styles.detailValue}>
                      {selectedContention.eventType?.toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Team Involved:</Text>
                    <Text style={styles.detailValue}>
                      {selectedContention.teamInvolved}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Description:</Text>
                    <Text style={styles.detailValue}>
                      {selectedContention.description}
                    </Text>
                  </View>

                  {selectedContention.evidenceDetails && (
                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Evidence:</Text>
                      <Text style={styles.detailValue}>
                        {selectedContention.evidenceDetails}
                      </Text>
                    </View>
                  )}

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Submitted By:</Text>
                    <Text style={styles.detailValue}>
                      {selectedContention.submitterBranch} Coordinator
                    </Text>
                    <Text style={styles.detailSubValue}>
                      {selectedContention.submittedBy}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Submitted At:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedContention.timestamp)}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Current Status:</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusColor(
                            selectedContention.status,
                          ),
                        },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {selectedContention.status?.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {isAdmin ? (
                    <>
                      <View style={styles.detailSection}>
                        <Text style={styles.detailLabel}>Admin Notes:</Text>
                        <TextInput
                          style={styles.notesInput}
                          placeholder="Add notes or response..."
                          placeholderTextColor="#888"
                          value={adminNotes}
                          onChangeText={setAdminNotes}
                          multiline
                          numberOfLines={3}
                        />
                      </View>

                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            { backgroundColor: "#FFA500" },
                          ]}
                          onPress={() =>
                            handleUpdateStatus(selectedContention.id, "pending")
                          }
                        >
                          <Text style={styles.actionButtonText}>
                            Mark Pending
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            { backgroundColor: "#4169E1" },
                          ]}
                          onPress={() =>
                            handleUpdateStatus(
                              selectedContention.id,
                              "reviewed",
                            )
                          }
                        >
                          <Text style={styles.actionButtonText}>
                            Mark Reviewed
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            { backgroundColor: "#00C853" },
                          ]}
                          onPress={() =>
                            handleUpdateStatus(
                              selectedContention.id,
                              "resolved",
                            )
                          }
                        >
                          <Text style={styles.actionButtonText}>
                            Mark Resolved
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : null}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  filterContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
  },
  activeFilterButton: {
    backgroundColor: "#d41d77",
    borderColor: "#d41d77",
  },
  filterButtonText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "600",
  },
  activeFilterButtonText: {
    color: "#fff",
  },
  contentionCard: {
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
    alignItems: "flex-start",
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  eventType: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#ccc",
    lineHeight: 20,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#888",
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  detailSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 16,
    color: "#fff",
    lineHeight: 22,
  },
  detailSubValue: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  notesInput: {
    backgroundColor: "#0a0a0a",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ViewContentions;
