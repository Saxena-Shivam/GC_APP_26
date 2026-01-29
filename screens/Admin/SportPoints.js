import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  ScrollView,
} from "react-native";

const SportPoints = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Add/Update Sport Live Events</Text>
          <Text style={styles.subtitle}></Text>

          <Image
            source={require("../../assets/liveEvent.png")}
            style={styles.logo}
          />
          <View style={{ flex: 1, paddingTop: 10 }}>
            <Text style={[styles.input, { color: "white" }]}>
              NOTE: {"\n"}This page is for adding a new sport event that does
              not exist previously and updating a sport points{" "}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <View
              style={[styles.buttonWrapper, { backgroundColor: "#240A34" }]}
            >
              <Button
                title="Add Sport Event Result"
                onPress={() => navigation.navigate("AddSportEventResult")}
                style={styles.button}
                color="#240A34"
              />
            </View>
            <View
              style={[styles.buttonWrapper, { backgroundColor: "#240A34" }]}
            >
              <Button
                title="Update Sport Event Result"
                onPress={() => navigation.navigate("CheckUpdateSportsEvent")}
                style={styles.button}
                color="#240A34"
              />
            </View>

            {/* <View
              style={[styles.buttonWrapper, { backgroundColor: "#240A34" }]}
            >
              <Button
                title="Update Sport Event"
                onPress={() => navigation.navigate("AdminAddScoreStack")}
                style={styles.button}
                color="#240A34"
              />
            </View> */}
          </View>
        </View>
      </ScrollView>
      <View style={{ minHeight: 70, backgroundColor: "black" }}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000", // Black background color
    padding: 40,
  },
  logo: {
    width: 450,
    height: 320,
    resizeMode: "contain",
    // marginBottom: 10,
    marginTop: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    marginTop: 10,
    position: "absolute",
    top: 0,
    left: 0,
    // backgroundColor: '#FF0000',
    padding: 30,
    color: "#D41D77",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "medium",
    color: "gray",
    marginBottom: 30,
    marginTop: 20,
    position: "absolute",
    top: 50,
    left: 0,
    // backgroundColor: '#FF0000',
    padding: 30,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  buttonWrapper: {
    marginBottom: 25,
    width: 320,
    height: 60,
    borderRadius: 15, // Set the border radius to make the button rounded
    overflow: "hidden", // Ensure that the button content is clipped to the rounded border
    padding: 10,
    elevation: 10, // Set the elevation to make the button shadow appear
    //  paddingVertical: 20, // Increased the height here
  },
  button: {
    // width: 200,
    height: 200,
    paddingVertical: 40,

    fontSize: 32,
  },
});

export default SportPoints;
