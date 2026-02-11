import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { backend_link } from "../../utils/constants";

const TeamRegistrationForm = ({ route, navigation }) => {
  const {
    eventId,
    eventName,
    eventType,
    category,
    maxPlayers,
    timestamp,
    location,
    branch,
    userEmail,
    registrationStatus,
  } = route.params;

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(true);
  const [existingStatus, setExistingStatus] = useState(null);
  const [teamName, setTeamName] = useState("");

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  useEffect(() => {
    const fetchExistingRegistration = async () => {
      try {
        const response = await axios.get(
          `${backend_link}api/registration/team/${eventId}/${branch}`,
        );
        const registration = response.data?.registration;

        if (registration) {
          setTeamName(registration.teamName || "");
          setParticipants(
            (registration.participants || []).map((p) => ({
              id: generateId(),
              name: p.name || "",
              rollNumber: p.rollNumber || "",
              email: p.email || "",
            })),
          );
          setExistingStatus(registration.status || "submitted");
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("❌ Error fetching registration:", error);
        }
      } finally {
        setPrefillLoading(false);
      }
    };

    fetchExistingRegistration();
  }, [eventId, branch]);

  const addParticipant = () => {
    if (eventType === "team" && participants.length >= maxPlayers) {
      Alert.alert("Limit Reached", `Maximum ${maxPlayers} players allowed`);
      return;
    }

    setParticipants([
      ...participants,
      {
        id: generateId(),
        name: "",
        rollNumber: "",
        email: "",
      },
    ]);
  };

  const updateParticipant = (id, field, value) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const removeParticipant = (id) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const validateParticipants = () => {
    if (participants.length === 0) {
      Alert.alert("Required", "Add at least one participant");
      return false;
    }

    for (let p of participants) {
      if (!p.name.trim()) {
        Alert.alert("Missing Name", `Enter name for all participants`);
        return false;
      }
      if (!p.rollNumber.trim()) {
        Alert.alert("Missing Roll Number", `Enter roll number for all`);
        return false;
      }
      if (!p.email.trim() || !p.email.includes("@")) {
        Alert.alert("Invalid Email", `Check email addresses`);
        return false;
      }
    }

    // Check for duplicate roll numbers
    const rollNumbers = participants.map((p) => p.rollNumber.toUpperCase());
    if (new Set(rollNumbers).size !== rollNumbers.length) {
      Alert.alert("Duplicate", "Roll numbers must be unique");
      return false;
    }

    return true;
  };

  const submitRegistration = async (isDraft = false) => {
    if (!validateParticipants()) return;
    if (!userEmail) {
      Alert.alert("Missing Email", "Login email not found. Please re-login.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        eventId,
        eventName,
        eventType,
        category,
        branch,
        teamName: teamName || `${branch} Team`,
        participants: participants.map((p) => ({
          name: p.name.trim(),
          rollNumber: p.rollNumber.trim().toUpperCase(),
          email: p.email.trim(),
        })),
        coordinatorEmail: userEmail,
        status: isDraft ? "draft" : "submitted",
        submittedAt: new Date().toISOString(),
      };

      // console.log(
      //   "📤 Submitting registration:",
      //   JSON.stringify(payload, null, 2),
      // );

      const endpoint = isDraft ? "/saveTeam" : "/submitTeam";
      const response = await axios.post(
        `${backend_link}api/registration${endpoint}`,
        payload,
      );

      Alert.alert(
        "Success",
        isDraft
          ? "Draft saved successfully"
          : "Registration submitted successfully",
      );

      // Go back to events list
      navigation.goBack();
    } catch (error) {
      console.error("❌ Error submitting:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to submit registration",
      );
    } finally {
      setLoading(false);
    }
  };

  const isPastEvent = timestamp && timestamp < Date.now();
  const isFormLocked = loading || prefillLoading;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Event Info Header */}
        <View style={styles.eventInfo}>
          <View style={styles.eventHeader}>
            <View style={styles.eventDetails}>
              <Text style={styles.eventName}>{eventName}</Text>
              <View style={styles.metaRow}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={14}
                  color="#888"
                />
                <Text style={styles.metaText}>
                  {new Date(timestamp).toLocaleDateString("en-IN")}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={14}
                  color="#888"
                />
                <Text style={styles.metaText}>{location}</Text>
              </View>
            </View>
            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor:
                    category?.toLowerCase() === "sports"
                      ? "#118d49"
                      : category?.toLowerCase() === "tech"
                        ? "#4ECDC4"
                        : "#FFE66D",
                },
              ]}
            >
              <Text style={styles.categoryText}>{category || "Sports"}</Text>
            </View>
          </View>
        </View>

        {prefillLoading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#888" />
            <Text style={styles.loadingText}>Loading Teams...</Text>
          </View>
        )}
        {existingStatus && !prefillLoading && (
          <View style={styles.existingBox}>
            <MaterialCommunityIcons
              name="check-circle"
              size={18}
              color="#4CAF50"
            />
            <Text style={styles.existingText}>
              Registration already {existingStatus}. You can edit and submit
              again.
            </Text>
          </View>
        )}

        {isPastEvent && (
          <View style={styles.warningBox}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={20}
              color="#FFC107"
            />
            <Text style={styles.warningText}>This event has ended</Text>
          </View>
        )}

        {/* Team Name Section (only for team events) */}
        {eventType === "team" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Team Name</Text>
            <TextInput
              style={styles.teamNameInput}
              placeholder="Enter team name (optional)"
              placeholderTextColor="#666"
              value={teamName}
              onChangeText={setTeamName}
              editable={!isFormLocked}
            />
          </View>
        )}

        {/* Participants Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Participants ({participants.length}
              {eventType === "team" ? `/${maxPlayers}` : ""})
            </Text>
            {!isPastEvent && (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={addParticipant}
                disabled={isFormLocked}
              >
                <MaterialCommunityIcons name="plus" size={18} color="#fff" />
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>

          {participants.length === 0 ? (
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons
                name="account-outline"
                size={32}
                color="#555"
              />
              <Text style={styles.emptyText}>No participants added yet</Text>
            </View>
          ) : (
            participants.map((participant, idx) => (
              <View key={participant.id} style={styles.participantCard}>
                <View style={styles.participantNumber}>
                  <Text style={styles.participantNumText}>{idx + 1}</Text>
                </View>

                <View style={styles.participantForm}>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#666"
                    value={participant.name}
                    onChangeText={(value) =>
                      updateParticipant(participant.id, "name", value)
                    }
                    editable={!isFormLocked}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Roll Number (e.g., 21CS045)"
                    placeholderTextColor="#666"
                    value={participant.rollNumber}
                    onChangeText={(value) =>
                      updateParticipant(participant.id, "rollNumber", value)
                    }
                    editable={!isFormLocked}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    value={participant.email}
                    onChangeText={(value) =>
                      updateParticipant(participant.id, "email", value)
                    }
                    editable={!isFormLocked}
                    keyboardType="email-address"
                  />
                </View>

                {!isFormLocked && (
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => removeParticipant(participant.id)}
                  >
                    <MaterialCommunityIcons
                      name="trash-can"
                      size={18}
                      color="#D41D77"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>

        <View style={{ height: 8 }} />
      </ScrollView>

      {/* Footer Buttons */}
      {!isPastEvent && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.footerBtn, styles.draftBtn]}
            onPress={() => submitRegistration(true)}
            disabled={isFormLocked || participants.length === 0}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#888" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="content-save"
                  size={18}
                  color="#888"
                />
                <Text style={styles.draftBtnText}>Save Draft</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerBtn, styles.submitBtn]}
            onPress={() => submitRegistration(false)}
            disabled={isFormLocked || participants.length === 0}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="check-all"
                  size={18}
                  color="#fff"
                />
                <Text style={styles.submitBtnText}>
                  {existingStatus ? "Update" : "Submit"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1419",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  eventInfo: {
    marginBottom: 20,
  },
  eventHeader: {
    flexDirection: "row",
    backgroundColor: "#1A1F26",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2A3038",
  },
  eventDetails: {
    flex: 1,
    marginRight: 10,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  metaText: {
    fontSize: 12,
    color: "#888",
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
  },
  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1A1F26",
    borderWidth: 1,
    borderColor: "#2A3038",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  existingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1E2B1E",
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  existingText: {
    fontSize: 12,
    color: "#C8E6C9",
    flex: 1,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFC10720",
    borderWidth: 1,
    borderColor: "#FFC107",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 13,
    color: "#FFC107",
    fontWeight: "500",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#D41D77",
    borderRadius: 6,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  teamNameInput: {
    backgroundColor: "#1A1F26",
    borderWidth: 1,
    borderColor: "#2A3038",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#fff",
  },
  emptyBox: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#1A1F26",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2A3038",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 13,
    color: "#888",
  },
  participantCard: {
    flexDirection: "row",
    backgroundColor: "#1A1F26",
    borderWidth: 1,
    borderColor: "#2A3038",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: "flex-start",
    gap: 10,
  },
  participantNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D41D77",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  participantNumText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  participantForm: {
    flex: 1,
    gap: 8,
  },
  input: {
    backgroundColor: "#0F1419",
    borderWidth: 1,
    borderColor: "#2A3038",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: "#fff",
  },
  deleteBtn: {
    padding: 8,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#2A3038",
    backgroundColor: "#0F1419",
    marginBottom: 70,
  },
  footerBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
  },
  draftBtn: {
    backgroundColor: "#1A1F26",
    borderWidth: 1,
    borderColor: "#2A3038",
  },
  draftBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
  },
  submitBtn: {
    backgroundColor: "#D41D77",
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
});

export default TeamRegistrationForm;
