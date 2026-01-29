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
} from "react-native";
import logoPaths from "../../utils/logoPaths";
import setProperTeamName from "../../utils/setProperTeamName";
import { backend_link } from "../../utils/constants";
import { LoginContext } from "../../store/LoginContext";
import { useContext, useState } from "react";

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
  },
  modalButtonText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default function PlayerScreen({ route }) {
  const props = route.params.data;
  console.log(props.data.item.data);
  const eventName = props.data.item.data.details.title;
  const pointsTable = props.data.item.data.pointsTable;
  console.log(pointsTable);
  const { CIVIL, CSE, ECE_META, EE, MECH, MTech, PHD, MSc_ITEP } = pointsTable;

  // State for modal visibility for each team
  const [modalVisible, setModalVisible] = useState({
    CIVIL: false,
    CSE: false,
    ECE_META: false,
    EE: false,
    MECH: false,
    MTECH: false,
    PHD: false,
    MSc_ITEP: false,
  });

  const openModal = (key) => setModalVisible((prev) => ({ ...prev, [key]: true }));
  const closeModal = (key) => setModalVisible((prev) => ({ ...prev, [key]: false }));

  // Prepare team data mapping
  const teamData = {
    CIVIL: CIVIL.players || [],
    CSE: CSE.players || [],
    ECE_META: ECE_META.players || [],
    EE: EE.players || [],
    MECH: MECH.players || [],
    MTECH: MTech.players || [],
    PHD: PHD.players || [],
    MSc_ITEP: MSc_ITEP.players || [],
  };

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.title}>{eventName}</Text>
      <View style={styles.buttonview}>
        {Object.entries(teamData).map(([key, data]) => (
          <TouchableOpacity
            key={key}
            onPress={() => openModal(key)}
            style={styles.voteButton}
          >
            <Text style={styles.voteButtonText}>{key === "ECE_META" ? "ECE_META_EP" : key}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.subTitle}>Click a team to see participants !</Text>

      {Object.entries(teamData).map(([key, data]) => (
        <Modal key={key} visible={modalVisible[key]} transparent animationType="slide">
          <View style={modalStyles.modalContainer}>
            <View style={modalStyles.modalContent}>
              <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>{key}</Text>
              <ScrollView>
                {data.map((item, index) => (
                  <Text key={index} style={modalStyles.modalButtonText}>{item}</Text>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={() => closeModal(key)}
                style={[styles.voteButton, { marginTop: 10 }]}
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


