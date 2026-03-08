import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Icon } from "react-native-elements";
import { LoginContext } from "../../store/LoginContext";
import { backend_link } from "../../utils/constants";
import axios from "axios";

const { width } = Dimensions.get("window");

const AddContention = ({ navigation }) => {
  const LoginCtx = useContext(LoginContext);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [teamInvolved, setTeamInvolved] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceDetails, setEvidenceDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCoordinator, setIsCoordinator] = useState(true);
  const [coordinatorBranch, setCoordinatorBranch] = useState("Your Branch");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if user is a coordinator
  useEffect(() => {
    const checkCoordinatorStatus = async () => {
      try {
        const email = LoginCtx?.user?.email;
        if (!email) {
          setIsCoordinator(false);
          setCheckingAuth(false);
          return;
        }

        // Admins should not submit contentions.
        if (LoginCtx?.isAdmin) {
          setIsCoordinator(false);
          setCheckingAuth(false);
          return;
        }

        const response = await axios.get(
          `${backend_link}api/event/getBranchCoord`,
        );
        const coordData = response?.data?.branch_coordinators || {};
        const normalizedEmail = email.toLowerCase();

        // Check if user email matches any coordinator
        let foundBranch = "";
        Object.keys(coordData).forEach((branch) => {
          const coords = coordData[branch];

          if (typeof coords === "string") {
            if (coords.toLowerCase() === normalizedEmail) {
              foundBranch = branch;
            }
            return;
          }

          if (Array.isArray(coords)) {
            const matched = coords.some((coord) => {
              if (typeof coord === "string") {
                return coord.toLowerCase() === normalizedEmail;
              }
              return coord?.email?.toLowerCase?.() === normalizedEmail;
            });
            if (matched) {
              foundBranch = branch;
            }
            return;
          }

          if (
            coords &&
            typeof coords === "object" &&
            coords?.email?.toLowerCase?.() === normalizedEmail
          ) {
            foundBranch = branch;
          }
        });

        if (foundBranch) {
          setIsCoordinator(true);
          setCoordinatorBranch(foundBranch);
        } else {
          setIsCoordinator(false);
          setCoordinatorBranch("Your Branch");
        }
      } catch (error) {
        console.error("Error checking coordinator status:", error);
        setIsCoordinator(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkCoordinatorStatus();
  }, [LoginCtx?.user]);

  const showConfirmationAlert = () => {
    Alert.alert(
      "Submit Complaint?",
      "This will be reviewed by administrators.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Submit", onPress: handleSubmit },
      ],
      { cancelable: false },
    );
  };

  const handleSubmit = async () => {
    if (!eventName || !eventType || !teamInvolved || !description) {
      Alert.alert("Error", "Please fill all required fields marked with *");
      return;
    }

    const contentionData = {
      eventName,
      eventType,
      teamInvolved,
      description,
      evidenceDetails,
      submittedBy: LoginCtx?.user?.email,
      submitterBranch: coordinatorBranch,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `${backend_link}api/contentions/addContention`,
        contentionData,
      );
      console.log(response.data, "Response");
      Alert.alert("Success", "Complaint submitted successfully.");

      // Reset form
      setEventName("");
      setEventType("");
      setTeamInvolved("");
      setDescription("");
      setEvidenceDetails("");

      navigation.navigate("AdminDashboardStack");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to submit contention: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#d41d77" />
        <Text style={styles.loadingText}>Checking authorization...</Text>
      </View>
    );
  }

  if (!isCoordinator) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 30,
          },
        ]}
      >
        <Icon
          name="alert-circle"
          type="material-community"
          size={80}
          color="#D41D77"
        />
        <Text style={styles.accessDeniedTitle}>Access Denied</Text>
        <Text style={styles.accessDeniedText}>
          Only branch coordinators can submit contentions. Admin accounts are
          not allowed to report cheating.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Icon
            name="alert-octagon"
            type="material-community"
            size={40}
            color="#D41D77"
          />
          <Text style={styles.headerTitle}>Submit Complaint</Text>
        </View>

        {/* Form */}
        <View style={styles.formContent}>
          {/* Event Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              <Text style={styles.required}>*</Text> Event Name
            </Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="calendar-multiple"
                type="material-community"
                size={20}
                color="#d41d77"
                containerStyle={styles.inputIcon}
              />
              <TextInput
                placeholder="Cricket Finals"
                style={styles.textInput}
                placeholderTextColor="#666"
                value={eventName}
                onChangeText={setEventName}
              />
            </View>
          </View>

          {/* Event Type */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              <Text style={styles.required}>*</Text> Event Type
            </Text>
            <View style={styles.pickerWrapper}>
              <Icon
                name="tag-multiple"
                type="material-community"
                size={20}
                color="#d41d77"
                containerStyle={styles.pickerIcon}
              />
              <Picker
                selectedValue={eventType}
                style={styles.picker}
                onValueChange={setEventType}
              >
                <Picker.Item label="Select Event Type" value="" />
                <Picker.Item label="Sports" value="sports" />
                <Picker.Item label="Technical" value="tech" />
                <Picker.Item label="Cultural" value="cult" />
              </Picker>
            </View>
          </View>

          {/* Team Involved */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              <Text style={styles.required}>*</Text> Team Involved
            </Text>
            <View style={styles.pickerWrapper}>
              <Icon
                name="account-group"
                type="material-community"
                size={20}
                color="#d41d77"
                containerStyle={styles.pickerIcon}
              />
              <Picker
                selectedValue={teamInvolved}
                style={styles.picker}
                onValueChange={setTeamInvolved}
              >
                <Picker.Item label="Select Team" value="" />
                <Picker.Item label="MTech" value="MTech" />
                <Picker.Item label="ECE+META" value="ECE_META" />
                <Picker.Item label="CSE" value="CSE" />
                <Picker.Item label="CIVIL" value="CIVIL" />
                <Picker.Item label="EE" value="EE" />
                <Picker.Item label="PhD" value="PHD" />
                <Picker.Item label="MECH" value="MECH" />
                <Picker.Item label="MSc+ITEP" value="MSc_ITEP" />
              </Picker>
            </View>
          </View>

          {/* Description */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              <Text style={styles.required}>*</Text> Description
            </Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <Icon
                name="text-box"
                type="material-community"
                size={20}
                color="#d41d77"
                containerStyle={styles.textAreaIcon}
              />
              <TextInput
                placeholder="Describe the incident"
                style={styles.textArea}
                placeholderTextColor="#666"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Evidence Details */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Evidence</Text>
            <Text style={styles.fieldHelper}>Optional</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <Icon
                name="paperclip"
                type="material-community"
                size={20}
                color="#4169E1"
                containerStyle={styles.textAreaIcon}
              />
              <TextInput
                placeholder="Add supporting details"
                style={styles.textArea}
                placeholderTextColor="#666"
                value={evidenceDetails}
                onChangeText={setEvidenceDetails}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={showConfirmationAlert}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.submitButtonText}>Submitting...</Text>
              </>
            ) : (
              <>
                <Icon
                  name="check-circle"
                  type="material-community"
                  size={20}
                  color="#fff"
                />
                <Text style={styles.submitButtonText}>Submit Contention</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Icon
              name="information"
              type="material-community"
              size={18}
              color="#4169E1"
            />
            <Text style={styles.infoText}>
              Admin review required. False reports will be penalized.
            </Text>
          </View>
        </View>

        <View style={{ minHeight: 80 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginTop: 20,
  },
  headerTitle: {
    color: "#D41D77",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 12,
  },
  headerSubtitle: {
    color: "#888",
    fontSize: 14,
    marginTop: 8,
  },
  formContent: {
    padding: 20,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  fieldLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  required: {
    color: "#D41D77",
    fontSize: 18,
  },
  fieldHelper: {
    color: "#888",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: "#fff",
    paddingVertical: 14,
    fontSize: 15,
    paddingHorizontal: 8,
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 55,
  },
  pickerIcon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    color: "#fff",
  },
  textAreaWrapper: {
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  textAreaIcon: {
    marginRight: 10,
    marginTop: 12,
  },
  textArea: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    paddingHorizontal: 8,
    width: "100%",
  },
  loadingText: {
    color: "#fff",
    marginTop: 15,
    fontSize: 16,
  },
  accessDeniedTitle: {
    color: "#D41D77",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 12,
  },
  accessDeniedText: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: "#d41d77",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: "#D41D77",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#0a3a5c",
    borderLeftWidth: 4,
    borderLeftColor: "#4169E1",
    padding: 15,
    borderRadius: 8,
    alignItems: "flex-start",
  },
  infoText: {
    color: "#ccc",
    fontSize: 13,
    flex: 1,
    marginLeft: 12,
    lineHeight: 18,
  },
});

export default AddContention;
