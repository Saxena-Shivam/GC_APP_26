import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";

const TextWithLinks = ({ children }) => {
  const handlePress = (url) => {
    Linking.openURL(url);
  };

  const renderTextWithLinks = (text) => {
    const regex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(regex);
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <TouchableOpacity key={index} onPress={() => handlePress(part)}>
            <Text style={{ color: "#0099ff", fontSize: 18 }}>{part}</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <Text style={styles.description} key={index}>
            {part}
          </Text>
        );
      }
    });
  };

  return <Text>{renderTextWithLinks(children)}</Text>;
};

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const SpecificNewsPage = ({ route }) => {
  const data = route.params?.data;
  const timestamp = data.timestamp;
  const date = new Date(
    timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
  );
  const formattedDate = date.toLocaleDateString(); // Date component
  let hour = date.getHours();
  const minute = date.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12;
  const formattedTime = `${hour}:${minute < 10 ? "0" : ""}${minute} ${ampm}`;
  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          source={{ uri: data.imageUrl }}
          style={{ width: width * 0.9, height: 150, borderRadius: 15 }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 0.9 * width,
            padding: 10,
            paddingBottom: 0,
            flexWrap: "wrap",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>{data.title}</Text>
          <View>
            <Text style={styles.date}>
              {formattedDate} || {formattedTime}{" "}
            </Text>
          </View>
        </View>
        <TextWithLinks>{data.description}</TextWithLinks>
        <View style={{ minHeight: 70 }}></View>
      </ScrollView>
    </View>
  );
};

export default SpecificNewsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    // marginBottom: 20,
    textAlign: "left",
  },
  date: {
    color: "white",
    fontSize: 15,
  },
  time: {
    color: "white",
    fontSize: 15,
    marginBottom: 10,
  },
  description: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
    paddingVertical: 15,
  },
});
