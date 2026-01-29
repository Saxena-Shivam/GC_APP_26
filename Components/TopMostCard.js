import { Image, StyleSheet, Text, View, Dimensions } from "react-native";

function TopMostCard(props) {
  return (
    <View style={styles.TopContainer}>
      <Image
        style={styles.ImageContainer}
        alt="Header Image"
        source={require("../assets/images/HeaderImage.jpg")}
      ></Image>
    </View>
  );
}

export default TopMostCard;

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  ImageContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    width: "100%",
    height: 0.12 * deviceHeight,
    marginHorizontal: 0.04 * deviceWidth,
  },
  TopContainer: {
    marginTop: 10,
    marginHorizontal: 0.04 * deviceWidth,
    justifyContent: "center",
    alignItems: "center",
  },
});
