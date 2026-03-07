import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  Alert,
  Button,
} from "react-native";

import axios from "axios";
import { LoginContext } from "../store/LoginContext";
import { backend_link } from "../utils/constants";

const CheckUpdateEvent = ({ navigation }) => {
  const LoginCtx = useContext(LoginContext);
  const [title, setTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(true);

  const handleProceed = async () => {
    if (!title.trim()) {
      alert("Please enter a valid title/eventid");
      return;
    }

    try {
      const eventid = title
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("+");

      const response = await axios.get(
        backend_link + "api/event/getAllEventById?eventId=" + eventid,
      );

      const eventData = response?.data?.event;
      if (!eventData) {
        alert("Event not found");
        return;
      }

      if ((eventData?.data?.category || "").toLowerCase() === "sports") {
        Alert.alert(
          "Sport route is different. Here only Tech/Cult events are allowed to be updated",
        );
        return;
      }

      navigation.navigate("UpdateTechCultEvent", {
        data: eventData,
        eventId: eventid,
      });
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message ||
          "Event Id /Title doesn't exist. Check spaces and spelling.",
      );
    }
  };
  const onClose = () => {
    navigation.navigate("LiveEvents");
    // setModalVisible(false);
  };
  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Enter a valid Event ID / Title to be updated
          </Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => setTitle(text)}
            placeholder="Event ID"
          />
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Proceed" onPress={handleProceed} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default CheckUpdateEvent;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
