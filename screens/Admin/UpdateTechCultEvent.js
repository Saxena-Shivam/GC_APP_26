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
  BackHandler,
  Pressable,
  Modal,
  Alert,
  Button,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { LoginContext } from "../../store/LoginContext";
import { backend_link } from "../../utils/constants";
import { useNavigation } from "@react-navigation/native";

import { defaultPoint } from "../../utils/initialScoreData";
import { getCorrectTimeStamp } from "../../utils/helperFunctions";

const UpdateEvent = ({ route, navigation }) => {
  let data = route.params?.data;
  data = data?.data;
  const LoginCtx = useContext(LoginContext);

  const name = data?.details?.title || "";
  const description = data?.details?.description || "";
  const timestampMs = data?.details?.timestamp || data?.timestamp || Date.now();

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("LiveEvents");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  console.log(timestampMs);
  // const formattedDateTime = new Date(timestampMs).toLocaleString("en-US", {
  //   month: "2-digit",
  //   day: "2-digit",
  //   year: "numeric",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  //   hour12: true,
  // });
  // const [formattedDate, formattedTime] = formattedDateTime.split(", ");

  const [date, setDate] = useState(
    new Date(data?.details?.timestamp) || new Date()
  );
  const [time, setTime] = useState(
    new Date(data?.details?.timestamp) || new Date()
  );
  console.log("pointsTable", data?.pointsTable);
  const [venue, setVenue] = useState(data?.details?.location || "");
  const [selectedType, setSelectedType] = useState(data?.category || "");
  const [teamPoint, setTeamPoint] = useState(data?.pointsTable || defaultPoint);

  const handlePointChange = (team, points) => {
    setTeamPoint({
      ...teamPoint,
      [team]: { points: points, position: teamPoint[team].position },
    });
  };

  const handlePosChange = (team, position) => {
    setTeamPoint({
      ...teamPoint,
      [team]: { points: teamPoint[team].points, position: position },
    });
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
      if (isNaN(teamPoint[key].points) || isNaN(teamPoint[key].position)) {
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
        position: parseInt(teamPoint[key].position),
      };
    });
    console.log(newTeamPoint);
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
      title: title,
      eventId: title,
      email: LoginCtx?.user?.email,
      description: description,
      category: selectedType,
      location: venue,
      timestamp: timestamp,
      pointsTable: newTeamPoint,
    };
    console.log(body);

    try {
      const response = await axios.post(
        backend_link + "api/event/updateEvent",
        body
      );
      console.log(response.data);
      Alert.alert("Success", response.data.message);
      setSelectedType("");
      setVenue("");
      setDate(new Date());
      setTime(new Date());
      setTeamPoint(defaultPoint);
      navigation.navigate("LiveEvents");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const showConfirmationAlert = () => {
    Alert.alert(
      "Proceed?",
      "Do you want to proceed?",
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

  console.log("data", teamPoint["MTech"].points, teamPoint["MTech"].position);
  console.log(
    "data",
    teamPoint.ECE_META.points,
    teamPoint["ECE_META"].position
  );
  console.log(teamPoint, description, name, date, time, venue, selectedType);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView>
          <Text style={styles.title}>Event</Text>
          <Text style={styles.subtitle}>Add Tech/Cult Event</Text>
          <View>
            <View>
              <Text style={[styles.input, { color: "grey" }]}>{name}</Text>
            </View>
            <View>
              <Text style={[styles.input, { color: "grey" }]}>
                {description}
              </Text>
            </View>

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
              style={[styles.input, { color: "white" }]}
              placeholder="Event Location / Venue  LHC-120-1"
              value={venue}
              onChangeText={(text) => setVenue(text)}
              placeholderTextColor="#5C6168"
            />
            <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
              <Picker
                selectedValue={selectedType}
                style={{ height: 50, width: 300, color: "white" }}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedType(itemValue)
                }
              >
                <Picker.Item label="Event Type" value="" />
                <Picker.Item label="Technical" value="tech" />
                <Picker.Item label="Cultural" value="cult" />
              </Picker>
            </TouchableOpacity>
            <View style={{ paddingVertical: 25 }}>
              <Text style={{ color: "red" }}>NOTE:</Text>
              <Text style={{ color: "white" }}>
                If event has not yet completed
              </Text>
              <Text style={{ color: "white" }}>or</Text>
              <Text style={{ color: "white" }}>
                If a team is not participated add 0 points or leave it.
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
                <Text style={styles.text}>Team</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.input, { color: "white" }]}>Points</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.input, { color: "white" }]}>
                  Position{" "}
                </Text>
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
                <Text style={styles.text}>Team A: Mtech</Text>
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  keyboardType="numeric"
                  style={[styles.input, { color: "white" }]}
                  value={teamPoint["MTech"]?.points.toString()}
                  placeholder="Points"
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("MTech", text)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  keyboardType="numeric"
                  style={[styles.input, { color: "white" }]}
                  placeholder="Position"
                  value={teamPoint["MTech"]?.position.toString()}
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePosChange("MTech", text)}
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
              <View style={{ flex: 1 }}>
                <TextInput
                  style={[styles.input, { color: "white" }]}
                  keyboardType="numeric"
                  placeholder="Points"
                  value={teamPoint["ECE_META"]?.points.toString()}
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("ECE_META", text)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  keyboardType="numeric"
                  style={[styles.input, { color: "white" }]}
                  placeholder="Position"
                  value={teamPoint["ECE_META"]?.position.toString()}
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePosChange("ECE_META", text)}
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
              <View style={{ flex: 1 }}>
                <TextInput
                  style={[styles.input, { color: "white" }]}
                  keyboardType="numeric"
                  placeholder="Points"
                  value={teamPoint["CSE"]?.points.toString()}
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("CSE", text)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  keyboardType="numeric"
                  style={[styles.input, { color: "white" }]}
                  placeholder="Position"
                  value={teamPoint["CSE"]?.position.toString()}
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePosChange("CSE", text)}
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
              <View style={{ flex: 1 }}>
                <TextInput
                  style={[styles.input, { color: "white" }]}
                  placeholder="Points"
                  value={teamPoint["CIVIL"]?.points.toString()}
                  keyboardType="numeric"
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("CIVIL", text)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  keyboardType="numeric"
                  style={[styles.input, { color: "white" }]}
                  placeholder="Position"
                  value={teamPoint["CIVIL"]?.position.toString()}
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePosChange("CIVIL", text)}
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
              <View style={{ flex: 1 }}>
                <TextInput
                  keyboardType="numeric"
                  style={[styles.input, { color: "white" }]}
                  placeholder="Points"
                  value={teamPoint["EE"]?.points.toString()}
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("EE", text)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  keyboardType="numeric"
                  style={[styles.input, { color: "white" }]}
                  placeholder="Position"
                  value={teamPoint["EE"]?.position.toString()}
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePosChange("EE", text)}
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
              <View style={{ flex: 1 }}>
                <TextInput
                  style={[styles.input, { color: "white" }]}
                  keyboardType="numeric"
                  placeholder="Points"
                  value={teamPoint["PHD"]?.points.toString()}
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("PHD", text)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  keyboardType="numeric"
                  style={[styles.input, { color: "white" }]}
                  placeholder="Position"
                  value={teamPoint["PHD"]?.position.toString()}
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePosChange("PHD", text)}
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
              <View style={{ flex: 1 }}>
                <TextInput
                  style={[styles.input, { color: "white" }]}
                  keyboardType="numeric"
                  placeholder="Points"
                  value={teamPoint["MECH"]?.points.toString()}
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("MECH", text)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  keyboardType="numeric"
                  style={[styles.input, { color: "white" }]}
                  placeholder="Position"
                  value={teamPoint["MECH"]?.position.toString()}
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePosChange("MECH", text)}
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
                <Text style={styles.text}>Team H: MSC-ITEP</Text>
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={[styles.input, { color: "white" }]}
                  placeholder="Points"
                  value={teamPoint["MSc_ITEP"]?.points.toString()}
                  keyboardType="numeric"
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePointChange("MSc_ITEP", text)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  keyboardType="numeric"
                  style={[styles.input, { color: "white" }]}
                  placeholder="Position"
                  value={teamPoint["MSc_ITEP"]?.position.toString()}
                  placeholderTextColor="#5C6168"
                  onChangeText={(text) => handlePosChange("MSc_ITEP", text)}
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
                Update Event
              </Text>
            </View>
          </Pressable>
          <View style={{ minHeight: 80 }}></View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
    paddingVertical: 10,
    color: "#D41D77",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#257CFF",
    marginBottom: 6,
    marginTop: 5,
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
    fontSize: 10,
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

export default UpdateEvent;
