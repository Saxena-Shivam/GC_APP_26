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
import {
  sendNotificationAll,
  sendNotificationTeam,
} from "../../utils/notifications/push";
import { Picker } from "@react-native-picker/picker";
import { LoginContext } from "../../store/LoginContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { backend_link } from "../../utils/constants";
import axios from "axios";

// const teamPicker = (
//   <>
//     <Picker.Item label="Select Team" value="" />
//     <Picker.Item label="Mtech" value="Mtech" />
//     <Picker.Item label="ECE+META" value="ECE_META" />
//     <Picker.Item label="CSE" value="CSE" />
//     <Picker.Item label="CIVIL" value="CIVIL" />
//     <Picker.Item label="EE" value="EE" />
//     <Picker.Item label="PhD" value="Phd" />
//     <Picker.Item label="MECH" value="MECH" />
//     <Picker.Item label="MSC+ITEP" value="MSC_ITEP" />
//   </>
// );

const AddNotification = ({ navigation }) => {
  const LoginCtx = useContext(LoginContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [team, setTeam] = useState("");
  const [loading, setLoading] = useState(false);
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
    if (team === "") {
      alert("Please fill all the fields");
      return;
    }
    if (title === "" || description === "") {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    // console.log(new Date(timestamp));
    const data = {
      title,
      description,
      team,
    };

    setLoading(true);
    console.log(data);
    try {
      if (team === "All") {
        await sendNotificationAll(
          title,
          description,
          data,
          LoginCtx.user?.email
        );
      } else {
        await sendNotificationTeam(
          title,
          description,
          team,
          data,
          LoginCtx.user?.email
        );
      }
      const newtitle = title.split(" ").join("+");
      const newdescription = description.split(" ").join("+");
      const response = await axios.post(
        backend_link +
          "api/announcements/addAnnouncement?title=" +
          newtitle +
          "&description=" +
          newdescription
      );
      console.log(response.data, "Response");
      Alert.alert("Success", "Notification sent successfully");
      setTitle("");
      setDescription("");
      setTeam("");
      setLoading(false);
      navigation.navigate("AdminDashboardStack");
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Something went wrong" + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.liveEventsContainer}>
            <Text style={styles.liveEventsText}>Notification</Text>
          </View>

          <View style={styles.addLiveEventContainer}>
            <Text style={styles.addLiveEventText}>Send Notifications</Text>
          </View>

          <View style={styles.formContainer1} borderColor={"white"}>
            <TextInput
              placeholder="Title"
              style={styles.formContainer}
              placeholderTextColor={"white"}
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
          </View>
          <View style={styles.formContainer1} borderColor={"white"}>
            <TextInput
              placeholder="Description"
              style={styles.formContainer}
              value={description}
              placeholderTextColor={"white"}
              onChangeText={(text) => setDescription(text)}
            />
          </View>

          <View style={styles.formContainer1}>
            <TouchableOpacity style={styles.dropdown}>
              <Picker
                selectedValue={team}
                style={{ height: 50, width: 300, color: "white" }}
                onValueChange={(itemValue, itemIndex) => setTeam(itemValue)}
              >
                <Picker.Item label="Select Team" value="" />
                <Picker.Item label="Notify All" value="All" />
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
          <View style={styles.addLiveEventSubmitButton}>
            <Button
              title="Submit"
              onPress={showConfirmationAlert}
              style={styles.submitButton}
              disabled={loading}
            />
          </View>
        </View>
        <View style={{ minHeight: 80 }}></View>
      </ScrollView>
    </KeyboardAvoidingView>
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

export default AddNotification;
