import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { backend_link } from "../../utils/constants";
import { LoginContext } from "../../store/LoginContext";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

function TechCultBettingScreen({ route, navigation }) {
  const props = route.params.data;
  const eventData = props?.data?.data || props?.data?.item || props?.data;
  const eventId = eventData?.data?.eventId;

  const LoginCtx = useContext(LoginContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent] = useState([
    "Mtech",
    "ECE+META+EP",
    "CSE",
    "CIVIL",
    "EE",
    "PhD",
    "MECH",
    "MSC+ITEP",
  ]);
  const [selectedOptions, setSelectedOptions] = useState([
    "First",
    "Second",
    "Third",
  ]);
  const [activeButtonIndex, setActiveButtonIndex] = useState(null);
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [updatedBets, setUpdatedBets] = useState({});
  const [loading, setLoading] = useState(false);

  // Open modal when button is pressed
  const handleButtonPress = (index) => {
    setActiveButtonIndex(index);
    setModalVisible(true);
  };

  // Handle option selection inside the modal
  const handleOptionSelect = (option) => {
    if (activeButtonIndex !== null) {
      const newOptions = [...selectedOptions];
      newOptions[activeButtonIndex] = option;
      setSelectedOptions(newOptions);

      setUpdatedBets((prev) => ({
        ...prev,
        [activeButtonIndex]: option,
      }));

      setModalVisible(false);
    }
  };

  // Submit bets **one by one**
  const handleSubmit = async () => {
    setLoading(true);
    for (const [index, option] of Object.entries(updatedBets)) {
      var formattedOption = option;

      if (formattedOption === "Mtech") formattedOption = "MTech";
      if (formattedOption === "ECE+META+EP") formattedOption = "ECE_META";
      if (formattedOption === "PhD") formattedOption = "PHD";
      if (formattedOption === "MSC+ITEP") formattedOption = "MSc_ITEP";

      const body = {
        index: parseInt(index),
        team: formattedOption,
        event: eventId,
        email: LoginCtx?.user?.email,
      };

      try {
        await axios.post(`${backend_link}api/event/betTechCult`, body);
        console.log(
          `✅ Submitted bet: ${formattedOption} for position ${index}`
        );

        // Disable submitted button
        setDisabledButtons((prev) => [...prev, parseInt(index)]);
      } catch (error) {
        console.error(
          `❌ Failed to submit bet ${option}:`,
          error.response?.data || error.message
        );
      }
    }
    setLoading(false);
    setUpdatedBets({}); // Clear pending bets
    Alert.alert("Voted Successflly", "", [
      {
        text: "OK",
        onPress: () =>
          navigation.navigate("EventsStack", {
            reloader: 1,
            // data: route.params.data,
          }),
      },
    ]);
  };

  // Load existing bets
  useEffect(() => {
    setSelectedOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];

      Object.keys(eventData.data.pointsTable).forEach((key) => {
        if (eventData.data.pointsTable[key].bets) {
          if (
            eventData.data.pointsTable[key].bets.first.includes(
              LoginCtx?.user?.email
            )
          ) {
            updatedOptions[0] = key;
            setDisabledButtons((prev) => [...prev, 0]);
          }
          if (
            eventData.data.pointsTable[key].bets.second.includes(
              LoginCtx?.user?.email
            )
          ) {
            updatedOptions[1] = key;
            setDisabledButtons((prev) => [...prev, 1]);
          }
          if (
            eventData.data.pointsTable[key].bets.third.includes(
              LoginCtx?.user?.email
            )
          ) {
            updatedOptions[2] = key;
            setDisabledButtons((prev) => [...prev, 2]);
          }
        }
      });

      //
      const now = Date.now();
      if (eventData.data.details.timestamp < now) {
            setDisabledButtons((prev) => [...prev, 0]);
            setDisabledButtons((prev) => [...prev, 1]);
            setDisabledButtons((prev) => [...prev, 2]);
      }
      return updatedOptions;
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{eventData.data.details?.title}</Text>
      <Text style={styles.votingNote}>
        Note: The "First", "Second", and "Third" buttons are for voting for the
        teams you expect to win.
      </Text>

      <View style={styles.buttonContainer}>
        {selectedOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              disabledButtons.includes(index) && styles.disabledButton,
            ]}
            onPress={() =>
              !disabledButtons.includes(index) && handleButtonPress(index)
            }
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit button */}
      <TouchableOpacity 
        style={[styles.submitButton, (Object.keys(updatedBets).length === 0 || loading) && styles.disabledSubmitButton]} 
        onPress={handleSubmit} 
        disabled={Object.keys(updatedBets).length === 0 || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              {modalContent.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalButton}
                  onPress={() => handleOptionSelect(item)}
                >
                  <Text style={styles.modalButtonText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default TechCultBettingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    height: 0.9 * deviceHeight,
  },
  title: {
    textAlign: "center",
    padding: 10,
    fontWeight: "600",
    fontSize: 30,
    color: "white",
    marginTop: 15,
  },
  votingNote: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 30,
    color: "#ffffff",
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 25,
  },
  button: {
    backgroundColor: "#d42070",
    padding: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#d42070",
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#1DB954",
    padding: 12,
    margin: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledSubmitButton: {
    backgroundColor: "gray",
    opacity: 0.5,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
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
  modalButton: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  modalButtonText: {
    textAlign: "center",
    fontWeight: "600",
  },
});
