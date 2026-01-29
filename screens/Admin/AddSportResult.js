import React, { useState, useContext } from "react";
import {
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { LoginContext } from "../../store/LoginContext";
import { backend_link } from "../../utils/constants";

import { defaultPoint } from "../../utils/initialScoreData";
import { getCorrectTimeStamp } from "../../utils/helperFunctions";

const AddSportEventResult = () => {
  const LoginCtx = useContext(LoginContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [venue, setVenue] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [teamPoint, setTeamPoint] = useState(defaultPoint);

  const handlePointChange = (team, points) => {
    setTeamPoint({ ...teamPoint, [team]: { points: points, position: 0 } });
  };

  const [showDatepicker, setShowDatepicker] = useState(false);
  const [showTimepicker, setShowTimepicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatepicker(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimepicker(false);
    setTime(currentTime);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleCancel = () => {
    console.log("Canceled.");
  };

  const submitHandler = async () => {
    console.log("submitted");
    console.log(name, description, date, time, venue, selectedType, teamPoint);
    let title = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    let flag = true;
    const keys = Object.keys(teamPoint);
    Object.keys(teamPoint).forEach((key) => {
      if (isNaN(teamPoint[key].points)) {
        flag = false;
      }
    });
    if (!flag) {
      Alert.alert("Error", "Please enter valid points and position");
      return;
    }
    const newTeamPoint = {};
    keys.forEach((key) => {
      newTeamPoint[key] = {
        points: parseInt(teamPoint[key].points),
        position: 0,
      };
    });

    let timestamp = getCorrectTimeStamp(date.toISOString(), time.toISOString());
    if (
      !title ||
      !description ||
      !date ||
      !time ||
      !venue ||
      !selectedType ||
      !timestamp ||
      selectedType === "" ||
      venue === "" ||
      description === "" ||
      title === "" ||
      timestamp === "" ||
      date === "" ||
      time === ""
    ) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    const body = {
      title: title.trim(),
      eventId: title.trim(),
      email: LoginCtx?.user?.email,
      description: description.trim(),
      category: selectedType,
      location: venue,
      timestamp: timestamp,
      pointsTable: newTeamPoint,
    };
    console.log(body);

    try {
      const response = await axios.post(
        backend_link + "api/event/addEvent",
        body
      );
      console.log(response.data);
      Alert.alert("Success", response.data.message);

      setSelectedType("");
      setVenue("");
      setDescription("");
      setName("");
      setDate(new Date());
      setTime(new Date());
      setTeamPoint(defaultPoint);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const showConfirmationAlert = () => {
    Alert.alert(
      "Proceed?",
      "The title and description can't be edited later. Do you want to proceed?",
      [
        {
          text: "No",
          onPress: handleCancel,
          style: "cancel",
        },
        { text: "Yes", onPress: submitHandler },
      ],
      { cancelable: false }
    );
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Event</Text>
          <Text style={styles.subtitle}>Add Sport Event Result</Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Event Name (eg: Football Boys)"
              value={name}
              onChangeText={(text) => setName(text)}
              placeholderTextColor="#5C6168"
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              multiline={true}
              numberOfLines={10}
              value={description}
              onChangeText={(text) => setDescription(text)}
              placeholderTextColor="#5C6168"
            />

            <TouchableOpacity
              style={styles.dropdowntime}
              onPress={() => setShowDatepicker(true)}
            >
              <Text style={{ color: "white" }}>
                {" "}
                Date: {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatepicker && (
              <DateTimePicker
                testID="datePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}

            <TouchableOpacity
              style={styles.dropdowntime}
              onPress={() => setShowTimepicker(true)}
            >
              <Text style={{ color: "white" }}>
                {" "}
                Time: {time.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
            {showTimepicker && (
              <DateTimePicker
                testID="timePicker"
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}

            {/* <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
          <Picker
            selectedValue={selectedVenue}
            style={{ height: 50, width: "90%", color: "#5C6168" }}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedVenue(itemValue)
            }
          >
            <Picker.Item label="Event Venue" value="" />
            <Picker.Item label="LBC" value="L" />
            <Picker.Item label="SAC" value="S" />
            <Picker.Item label="Pushpagiri" value="P" />
            <Picker.Item label="SES" value="S" />
          </Picker>
        </TouchableOpacity> */}
            <TextInput
              style={styles.input}
              placeholder="Event Location / Venue  LHC-120-1"
              value={venue}
              onChangeText={(text) => setVenue(text)}
              placeholderTextColor="#5C6168"
            />
            <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
              <Picker
                selectedValue={selectedType}
                style={{ height: 50, width: 300, color: "#5C6168" }}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedType(itemValue)
                }
              >
                <Picker.Item label="Event Type" value="" />
                <Picker.Item label="Sports" value="sports" />
              </Picker>
            </TouchableOpacity>
            <View style={{ paddingVertical: 25 }}>
              <Text style={{ color: "red" }}>NOTE:</Text>
              <Text style={{ color: "white" }}>
                Add Final Score only after all matches of that event have been
                completed!
              </Text>
              <Text style={{ color: "white" }}>AND</Text>
              <Text style={{ color: "white" }}>
                If a team did not participate add 0 points or leave it.
              </Text>
              <Text style={{ color: "white" }}>AND</Text>
              <Text style={{ color: "white" }}>
                Sum all points from ALL matches of that event for a team
                (including Final and league matches).
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              <View style={styles.box}>
                <Text style={styles.text}>Team A: Mtech</Text>
              </View>
              <View>
                <TextInput
                  keyboardType="numeric"
                  style={styles.input}
                  placeholder="Team A Points"
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("MTech", text)}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              <View style={styles.box}>
                <Text style={styles.text}>Team B: ECE-META-EP</Text>
              </View>
              <View>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Team B Points"
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("ECE_META", text)}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              <View style={styles.box}>
                <Text style={styles.text}>Team C: CSE</Text>
              </View>
              <View>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Team C Points"
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("CSE", text)}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              <View style={styles.box}>
                <Text style={styles.text}>Team D: CIVIL</Text>
              </View>
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Team D Points"
                  keyboardType="numeric"
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("CIVIL", text)}
                />
              </View>
            </View>

            {/* //team E */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              <View style={styles.box}>
                <Text style={styles.text}>Team E: EE</Text>
              </View>
              <View>
                <TextInput
                  keyboardType="numeric"
                  style={styles.input}
                  placeholder="Team E Points"
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("EE", text)}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              <View style={styles.box}>
                <Text style={styles.text}>Team F: PhD</Text>
              </View>
              <View>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Team F Points"
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("PHD", text)}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              <View style={styles.box}>
                <Text style={styles.text}>Team G: Mech</Text>
              </View>
              <View>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Team G Points"
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("MECH", text)}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              <View style={styles.box}>
                <Text style={styles.text}>Team H: Msc-Itep</Text>
              </View>
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Team H Points"
                  keyboardType="numeric"
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("MSc_ITEP", text)}
                />
              </View>
            </View>
          </View>

          <Pressable onPress={showConfirmationAlert}>
            <View
              style={{
                backgroundColor: "#257CFF",
                paddingVertical: 15,
                paddingHorizontal: 20,
                borderRadius: 15,
                width: "100%",
                marginVertical: 20,
              }}
            >
              <Text
                style={{
                  color: "white",
                  alignSelf: "center",
                  fontWeight: "600",
                  fontSize: 18,
                }}
              >
                Add Event
              </Text>
            </View>
          </Pressable>
          <View style={{ minHeight: 80 }}></View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginBottom: 1,
    backgroundColor: "black",
    marginTop: StatusBar.currentHeight + 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    // position: "absolute",
    // top: 0,
    // left: 0,
    // backgroundColor: '#FF0000',
    paddingVertical: 10,
    color: "#D41D77",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#257CFF",
    marginBottom: 6,
    marginTop: 5,
    // position: "absolute",
    // top: 30,
    // left: 0,
    // backgroundColor: '#FF0000',
    paddingVertical: 8,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#5C6168",
    borderRadius: 5,
    borderWidth: 2,
    paddingHorizontal: 15,
    height: 60,
    minWidth: "50%",
    margin: 3,
    color: "white",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    // paddingVertical: ,
    borderWidth: 2,
    margin: 3,
    borderColor: "#5C6168",
    borderRadius: 5,
  },
  dropdowntime: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    // paddingVertical: ,
    borderWidth: 2,
    margin: 3,
    borderColor: "#5C6168",
    borderRadius: 5,
    height: 60,
    width: "98%",
  },
  text: {
    color: "white",
    flex: 1,
  },
  box: {
    padding: 10,
    borderWidth: 2,
    borderColor: "white",
    margin: 5,
    flex: 1,
    flexWrap: "wrap",
    width: "auto",
    borderRadius: 5,
  },
});

export default AddSportEventResult;
