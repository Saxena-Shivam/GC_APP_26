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
    if (title.trim().length === "") {
      alert("Please enter a valid title/eventid");
      return;
    }
    console.log(title);
    try {
      const eventid = title
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("+");
      console.log(eventid);
      const response = await axios.get(
        backend_link + "api/event/getAllEventById?eventId=" + eventid
      );
      console.log(response.data);
      if (response.data.length !== 0) {
        console.log("ji", response.data.event);
        if (response.data?.event?.data?.category === "sports") {
          navigation.navigate("UpdateSportEventResult", {
            data: response.data.event,
            eventId: eventid,
          });
        } else {
          alert("Sport Event not found");
        }
      } else {
        alert("Event not found");
      }
    } catch (error) {
      console.log(error);
      alert("Event Id /Title doesn't exist Check for spaces");
    }
  };
  const onClose = () => {
    navigation.navigate("SportPoints");
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
