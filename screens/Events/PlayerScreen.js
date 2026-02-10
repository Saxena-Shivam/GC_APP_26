import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import logoPaths from "../../utils/logoPaths";
import setProperTeamName from "../../utils/setProperTeamName";
import { backend_link } from "../../utils/constants";
import { LoginContext } from "../../store/LoginContext";
import { useContext, useState, useEffect } from "react";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    maxHeight: "70%",
  },
  modalButtonText: {
    fontSize: 16,
    marginVertical: 5,
  },
  participantItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  participantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  participantDetails: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
});

export default function PlayerScreen({ route }) {
  const props = route.params.data;
  const eventData = props.data.item.data;
  const eventId = props.data.item.id || props.data.item.data.eventId;
  const eventName = eventData.details.title;

  const [registrations, setRegistrations] = useState({});
  const [loading, setLoading] = useState(true);

  // State for modal visibility for each team
  const [modalVisible, setModalVisible] = useState({
    CIVIL: false,
    CSE: false,
    ECE_META: false,
    EE: false,
    MECH: false,
    MTech: false,
    PHD: false,
    MSc_ITEP: false,
  });

  const openModal = (key) =>
    setModalVisible((prev) => ({ ...prev, [key]: true }));
  const closeModal = (key) =>
    setModalVisible((prev) => ({ ...prev, [key]: false }));

  useEffect(() => {
    fetchRegistrations();
  }, [eventId]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const branches = [
        "CIVIL",
        "CSE",
        "ECE_META",
        "EE",
        "MECH",
        "MTech",
        "PHD",
        "MSc_ITEP",
      ];
      const regData = {};

      for (const branch of branches) {
        try {
          const response = await axios.get(
            `${backend_link}api/registration/team/${eventId}/${branch}`,
          );
          if (response.data?.registration) {
            regData[branch] = response.data.registration.participants || [];
          }
        } catch (error) {
          // 404 means no registration for this branch, which is OK
          if (error.response?.status !== 404) {
            console.error(`Error fetching ${branch} registration:`, error);
          }
        }
      }

      setRegistrations(regData);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare team data mapping from registrations
  const teamData = {
    CIVIL: registrations.CIVIL || [],
    CSE: registrations.CSE || [],
    ECE_META: registrations.ECE_META || [],
    EE: registrations.EE || [],
    MECH: registrations.MECH || [],
    MTech: registrations.MTech || [],
    PHD: registrations.PHD || [],
    MSc_ITEP: registrations.MSc_ITEP || [],
  };

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.title}>{eventName}</Text>

      {loading ? (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator size="large" color="#d42070" />
          <Text style={{ color: "white", marginTop: 10, textAlign: "center" }}>
            Loading registrations...
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.buttonview}>
            {Object.entries(teamData).map(([key, data]) => (
              <TouchableOpacity
                key={key}
                onPress={() => openModal(key)}
                style={styles.voteButton}
              >
                <Text style={styles.voteButtonText}>
                  {key === "ECE_META" ? "ECE_META_EP" : key}
                </Text>
                <Text style={[styles.voteButtonText, { fontSize: 10 }]}>
                  ({data.length})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.subTitle}>Click a team to see participants!</Text>
        </>
      )}

      {Object.entries(teamData).map(([key, data]) => (
        <Modal
          key={key}
          visible={modalVisible[key]}
          transparent
          animationType="slide"
        >
          <View style={modalStyles.modalContainer}>
            <View style={modalStyles.modalContent}>
              <Text
                style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}
              >
                {key} - {data.length} Participant(s)
              </Text>
              <ScrollView style={{ maxHeight: 400 }}>
                {data.length === 0 ? (
                  <Text
                    style={{ color: "#666", textAlign: "center", padding: 20 }}
                  >
                    No participants registered yet
                  </Text>
                ) : (
                  data.map((participant, index) => (
                    <View key={index} style={modalStyles.participantItem}>
                      <Text style={modalStyles.participantName}>
                        {index + 1}. {participant.name || "Unknown"}
                      </Text>
                      {participant.rollNumber && (
                        <Text style={modalStyles.participantDetails}>
                          Roll: {participant.rollNumber}
                        </Text>
                      )}
                      {participant.email && (
                        <Text style={modalStyles.participantDetails}>
                          Email: {participant.email}
                        </Text>
                      )}
                    </View>
                  ))
                )}
              </ScrollView>
              <TouchableOpacity
                onPress={() => closeModal(key)}
                style={[
                  styles.voteButton,
                  { marginTop: 10, alignSelf: "flex-end", width: 100 },
                ]}
              >
                <Text style={styles.voteButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
    alignItems: "center",
  },
  title: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  subTitle: {
    marginTop: 60,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  buttonview: {
    marginVertical: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  voteButton: {
    backgroundColor: "#d42070",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    width: 115,
    margin: 10,
  },
  voteButtonText: {
    color: "white",
    fontSize: 13,
  },
});
