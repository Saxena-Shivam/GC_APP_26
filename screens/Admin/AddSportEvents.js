import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LoginContext } from "../../store/LoginContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { backend_link } from "../../utils/constants";
import axios from "axios";

import { getCorrectTimeStamp } from "../../utils/helperFunctions";

const AddLiveEvents = () => {
  const LoginCtx = useContext(LoginContext);
  const [eventID, setEventID] = useState("");
  const [subEventID, setSubEventID] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const [venue, setVenue] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [teamA, setTeamA] = useState("");
  const [teamApoints, setTeamApoints] = useState("0");
  const [teamBpoints, setTeamBpoints] = useState("0");
  const [teamB, setTeamB] = useState("");

  const [showDatepicker, setShowDatepicker] = useState(false);
  const [showTimepicker, setShowTimepicker] = useState(false);
  const [showEndTimepicker, setShowEndTimepicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    console.log(currentDate);
    setShowDatepicker(false);
    setDate(currentDate);
    console.log(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimepicker(false);
    setTime(currentTime);
    console.log(currentTime);
  };

  const handleEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndTimepicker(false);
    setEndTime(currentTime);
    console.log(currentTime);
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
        { text: "Yes", onPress: handleSubmit },
      ],
      { cancelable: false }
    );
  };

  const handleCancel = () => {
    console.log("Cancel Pressed");
  };
  const handleSubmit = async () => {
    if (teamA === "" || teamB === "" || status === "") {
      alert("Please fill all the fields");
      return;
    }
    if (teamA === teamB) {
      alert("Both teams can't be same");
      return;
    }
    if (
      eventID === "" ||
      subEventID === "" ||
      description === "" ||
      venue === "" ||
      type === "" ||
      date === "" ||
      time === "" ||
      endTime === "" ||
      teamA === "" ||
      teamB === "" ||
      teamApoints === "" ||
      teamBpoints === ""
    ) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    const eventIdFormatted = eventID
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    const ts = getCorrectTimeStamp(date.toISOString(), time.toISOString());
    const te = getCorrectTimeStamp(date.toISOString(), endTime.toISOString());
    let timestamp = ts;
    let endTimestamp = te;
    let teamApointsnumber = parseInt(teamApoints);
    let teamBpointsnumber = parseInt(teamBpoints);
    if (isNaN(teamApointsnumber) || isNaN(teamBpointsnumber)) {
      Alert.alert("Error", "Please enter valid points");
      return;
    }

    console.log('sending this date: ', new Date(timestamp));
    const data = {
      eventId: eventIdFormatted,
      subEventId: subEventID,
      email: LoginCtx?.user?.email,
      title: teamA + " vs " + teamB,
      description,
      location: venue,
      timestamp,
      endTimestamp,
      type,
      status,
      points: {
        teamA: {
          name: teamA,
          points: teamApointsnumber,
        },
        teamB: {
          name: teamB,
          points: teamBpointsnumber,
        },
      },
    };
    console.log(data);
    try {
      const response = await axios.post(
        backend_link + "api/event/scheduleLiveEvent",
        data
      );
      console.log(response.data);
      Alert.alert("Success", "Event added successfully");
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Something went wrong" + e.message);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.liveEventsContainer}>
          <Text style={styles.liveEventsText}>Event</Text>
        </View>

        <View style={styles.addLiveEventContainer}>
          <Text style={styles.addLiveEventText}>Add Sport Events</Text>
        </View>

        <View style={styles.formContainer1} borderColor={"white"}>
          <TextInput
            placeholder="Name/Title (eg. Football Boys )"
            style={styles.formContainer}
            placeholderTextColor={"grey"}
            value={eventID}
            onChangeText={(text) => setEventID(text)}
          />
        </View>
        <View style={styles.formContainer1} borderColor={"white"}>
          <TextInput
            placeholder="EventID (eg. Match 1)"
            style={styles.formContainer}
            value={subEventID}
            placeholderTextColor={"grey"}
            onChangeText={(text) => setSubEventID(text)}
          />
        </View>
        <View style={styles.formContainer1} borderColor={"white"}>
          <TextInput
            placeholder="Description"
            style={styles.formContainer}
            multiline={true}
            numberOfLines={8}
            value={description}
            placeholderTextColor={"grey"}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
        <View style={styles.formContainer1}>
          <TextInput
            placeholder="Venue/Location"
            style={styles.formContainer}
            value={venue}
            placeholderTextColor={"grey"}
            onChangeText={(text) => setVenue(text)}
          />
        </View>
        <View style={styles.formContainer1}>
          <TextInput
            placeholder="Type eg. Final, Semi-Final, etc."
            style={styles.formContainer}
            placeholderTextColor={"grey"}
            value={type}
            onChangeText={(text) => setType(text)}
          />
        </View>

        <View style={styles.formContainer1}>
          <TouchableOpacity
            style={styles.dropdowntime}
            onPress={() => setShowDatepicker(true)}
          >
            <Text style={{ color: "white" }}>
              {" "}
              Date: {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>
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

        <View style={styles.formContainer1}>
          <TouchableOpacity
            style={styles.dropdowntime}
            onPress={() => setShowTimepicker(true)}
          >
            <Text style={{ color: "white" }}>
              {" "}
              Start Time: {time.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
        </View>
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

        <View style={styles.formContainer1}>
          <TouchableOpacity
            style={styles.dropdowntime}
            onPress={() => setShowEndTimepicker(true)}
          >
            <Text style={{ color: "white" }}>
              {" "}
              End Time: {endTime.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
        </View>
        {showEndTimepicker && (
          <DateTimePicker
            testID="timePicker"
            value={endTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleEndTimeChange}
          />
        )}

        <View style={styles.formContainer1}>
          <TouchableOpacity style={styles.dropdown}>
            <Picker
              selectedValue={status}
              style={{ height: 50, width: 300, color: "white" }}
              onValueChange={(itemValue, itemIndex) => setStatus(itemValue)}
            >
              <Picker.Item label="Select status" value="" />
              <Picker.Item label="Ongoing" value="live" />
              <Picker.Item label="Upcoming" value="upcoming" />
              <Picker.Item label="Past/Completed" value="concluded" />
            </Picker>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer1}>
          <TouchableOpacity style={styles.dropdown}>
            <Picker
              selectedValue={teamA}
              style={{ height: 50, width: 300, color: "white" }}
              onValueChange={(itemValue, itemIndex) => setTeamA(itemValue)}
            >
              <Picker.Item label="Select Team1" value="" />
              <Picker.Item label="Mtech" value="MTech" />
              <Picker.Item label="ECE+META+EP" value="ECE_META" />
              <Picker.Item label="CSE" value="CSE" />
              <Picker.Item label="CIVIL" value="CIVIL" />
              <Picker.Item label="EE" value="EE" />
              <Picker.Item label="PhD" value="PHD" />
              <Picker.Item label="MECH" value="MECH" />
              <Picker.Item label="MSC+ITEP" value="MSc_ITEP" />
            </Picker>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer1}>
          <TextInput
            keyboardType="numeric"
            placeholder="Team 1 Points (eg. 0)"
            style={styles.formContainer}
            value={teamApoints}
            placeholderTextColor={"grey"}
            onChangeText={(text) => setTeamApoints(text)}
          />
        </View>
        <View style={styles.formContainer1}>
          <TouchableOpacity style={styles.dropdown}>
            <Picker
              selectedValue={teamB}
              style={{ height: 50, width: 300, color: "white" }}
              onValueChange={(itemValue, itemIndex) => setTeamB(itemValue)}
            >
              <Picker.Item label="Select Team 2" value="" />
              <Picker.Item label="Mtech" value="MTech" />
              <Picker.Item label="ECE+META+EP" value="ECE_META" />
              <Picker.Item label="CSE" value="CSE" />
              <Picker.Item label="CIVIL" value="CIVIL" />
              <Picker.Item label="EE" value="EE" />
              <Picker.Item label="PhD" value="PHD" />
              <Picker.Item label="MECH" value="MECH" />
              <Picker.Item label="MSC+ITEP" value="MSc_ITEP" />
            </Picker>
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer1}>
          <TextInput
            keyboardType="numeric"
            placeholder="Team 2 Points (eg. 0)"
            style={styles.formContainer}
            value={teamBpoints}
            placeholderTextColor={"grey"}
            onChangeText={(text) => setTeamBpoints(text)}
          />
        </View>
        <View style={styles.addLiveEventSubmitButton}>
          <Button
            title="Submit"
            onPress={showConfirmationAlert}
            style={styles.submitButton}
          />
        </View>
        <View style={{ minHeight: 80 }}></View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "center",
    padding: 20,
    // maxHeight: "80%",
    backgroundColor: "#000000", // Black background color
  },
  liveEventsContainer: {
    // textAlign:"center",
    // justifyContent:"center",
    // alignItems:"center",
    marginTop: 20,
    fontWeight: "bold",
    marginLeft: -7,

    // color: "#D41D77",
    // fontSize: 40,
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
    borderColor: "white",
  },
  liveEventsText: {
    color: "#D41D77",
    fontSize: 40,
  },
  addLiveEventContainer: {
    marginTop: 40,
    marginBottom: 10,
    fontWeight: "bold",
    // color: "#D41D77",
    // fontSize: 40,
  },
  addLiveEventText: {
    color: "#0066FF",
    fontSize: 20,
  },
  formContainer: {
    color: "white",
    // borderColor: "black",
    borderColor: "white",
    fontWeight: "bold",
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
    // backgroundColor: "#F2F3F4",
    borderRadius: 7,
    // placeholder: "white"
    // marginBottom: 10
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
  formContainer1: {
    color: "white",
    borderColor: "black",
    padding: 7,
    fontSize: 20,
    // backgroundColor: "#F2F3F4",
    borderRadius: 7,
    // marginBottom: 5,
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

export default AddLiveEvents;
