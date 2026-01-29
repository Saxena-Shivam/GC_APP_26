import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const UpdateEvent = () => {
  const [name, setName] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedTeam1, setSelectedTeam1] = useState("");
  const [selectedTeam2, setSelectedTeam2] = useState("");

  const [date, setDate] = useState(new Date());
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [time, setTime] = useState(new Date());
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Events</Text>
      <Text style={styles.subtitle}>Update Existing Live Event</Text>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Event Name"
          value={name}
          onChangeText={(text) => setName(text)}
          placeholderTextColor="#5C6168"
        />
        <TouchableOpacity
          style={styles.dropdowntime}
          onPress={() => setShowDatepicker(true)}
        >
          <Text style={{ color: "#5C6168" }}>
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
          <Text style={{ color: "#5C6168" }}>
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

        <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
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
        </TouchableOpacity>

        <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
          <Picker
            selectedValue={selectedType}
            style={{ height: 50, width: 300, color: "#5C6168" }}
            onValueChange={(itemValue, itemIndex) => setSelectedType(itemValue)}
          >
            <Picker.Item label="Event Type" value="" />
            <Picker.Item label="Technical" value="T" />
            <Picker.Item label="Sports" value="S" />
            <Picker.Item label="Cultural" value="C" />
          </Picker>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
          <Picker
            selectedValue={selectedTeam1}
            style={{ height: 50, width: 300, color: "#5C6168" }}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedTeam1(itemValue)
            }
          >
            <Picker.Item label="Team 1" value="" />
            <Picker.Item label="Mechanical" value="java" />
            <Picker.Item label="CSE" value="js" />
            <Picker.Item label="Electrical" value="python" />
            <Picker.Item label="Ece and Meta" value="ruby" />
            <Picker.Item label="Civil" value="civil" />
          </Picker>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
          <Picker
            selectedValue={selectedTeam2}
            style={{ height: 50, width: 300, color: "#5C6168" }}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedTeam2(itemValue)
            }
          >
            <Picker.Item label="Team 2" value="" />
            <Picker.Item label="Mechanical" value="M" />
            <Picker.Item label="CSE" value="C" />
            <Picker.Item label="Electrical" value="E" />
            <Picker.Item label="Ece and Meta" value="EM" />
            <Picker.Item label="Civil" value="CI" />
          </Picker>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: "#257CFF",
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderRadius: 15,
          width: "100%",
          marginVertical: 20,
        }}
        onTouchEnd={() => {
          console.log("submitted");
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
          {" "}
          Update Event
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
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
    borderWidth: 1,
    borderColor: "#5C6168",
    borderRadius: 5,
    borderWidth: 2,
    paddingHorizontal: 30,
    width: "98%",
    height: 60,
    margin: 3,
    color: "#5C6168",
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
    borderWidth: 2,
    margin: 3,
    borderColor: "#5C6168",
    borderRadius: 5,
    height: 60,
    width: "98%",
  },
});

export default UpdateEvent;
