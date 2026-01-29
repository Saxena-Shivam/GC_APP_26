import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  TextInput,
} from "react-native";

const UpdateLiveEvents = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onBlur" });

  const [name, setName] = useState("");
  const [venue, setVenue] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");

  const updateLiveEventHandler = (event) => {
    const data = [name, venue, type, date, time, team1, team2];
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.liveEventsContainer}>
        <Text style={styles.liveEventsText}>Live Events</Text>
      </View>

      <View style={styles.addLiveEventContainer}>
        <Text style={styles.addLiveEventText}>Add Live Events</Text>
      </View>

      <View style={styles.formContainer1} borderColor={"#323B48"}>
        <TextInput
          placeholder="Name"
          style={styles.formContainer}
          placeholderTextColor={"#323B48"}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <View style={styles.formContainer1}>
        <TextInput
          placeholder="Venue"
          style={styles.formContainer}
          placeholderTextColor={"#323B48"}
          onChangeText={(text) => setVenue(text)}
        />
      </View>
      <View style={styles.formContainer1}>
        <TextInput
          placeholder="Type"
          style={styles.formContainer}
          placeholderTextColor={"#323B48"}
          onChangeText={(text) => setType(text)}
        />
      </View>
      <View style={styles.formContainer1}>
        <TextInput
          placeholder="Date"
          style={styles.formContainer}
          placeholderTextColor={"#323B48"}
          onChangeText={(text) => setDate(text)}
        />
      </View>
      <View style={styles.formContainer1}>
        <TextInput
          placeholder="Time"
          style={styles.formContainer}
          placeholderTextColor={"#323B48"}
          onChangeText={(text) => setTime(text)}
        />
      </View>
      <View style={styles.formContainer1}>
        <TextInput
          placeholder="Team 1"
          style={styles.formContainer}
          placeholderTextColor={"#323B48"}
          onChangeText={(text) => setTeam1(text)}
        />
      </View>
      <View style={styles.formContainer1}>
        <TextInput
          placeholder="Team 2"
          style={styles.formContainer}
          placeholderTextColor={"#323B48"}
          onChangeText={(text) => setTeam2(text)}
        />
      </View>
      <View style={styles.addLiveEventSubmitButton}>
        <Button
          title="Update Event"
          onPress={handleSubmit(updateLiveEventHandler)}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "center",
    padding: 20,
    backgroundColor: "#000000", // Black background color
  },
  liveEventsContainer: {
    marginTop: 20,
    fontWeight: "bold",
    marginLeft: -7,
  },
  liveEventsText: {
    color: "#D41D77",
    fontSize: 40,
  },
  addLiveEventContainer: {
    marginTop: 40,
    marginBottom: 10,
    fontWeight: "bold",
  },
  addLiveEventText: {
    color: "#0066FF",
    fontSize: 20,
  },
  formContainer: {
    color: "white",
    borderColor: "#323B48",
    fontWeight: "bold",
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
    borderRadius: 7,
  },
  formContainer1: {
    color: "#323B48",
    borderColor: "black",
    padding: 7,
    fontSize: 20,
    borderRadius: 7,
    marginTop: 2,
  },
  submitButton: {
    marginTop: 20,
    fontSize: 30,
    padding: 30,
  },
  addLiveEventSubmitButton: {
    marginTop: 20,
    padding: 10,
    fontSize: 30,
  },
});

export default UpdateLiveEvents;
