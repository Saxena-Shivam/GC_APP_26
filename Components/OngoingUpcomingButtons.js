import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";

function OngoingUpcomingButton({
  children,
  onPress,
  currentScreen,
  currentButton,
}) {
  return (
    <View style={{ height: 80 }}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
        onPress={onPress}
      >
        <View style={styles.textContainer}>
          <Text
            style={
              currentScreen === currentButton
                ? styles.activeButton
                : styles.inactiveButton
            }
          >
            {children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default OngoingUpcomingButton;

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  buttonInnerContainer: {
    borderRadius: 1,
    marginTop: 0.033 * deviceHeight,
    overflow: "hidden",
    // backgroundColor: "white",
    width: 115,
    paddingTop: "0%",
    paddingHorizontal: "3%",
    elevation: 2,
    marginBottom: 0.02 * deviceHeight,
  },
  inactiveButton: {
    color: "white",
    fontSize: 14,
    textAlign: "center",

    lineHeight: 35,
  },
  activeButton: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    // textDecorationLine: "underline",
    backgroundColor: "#d41d77",
    lineHeight: 30,
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.75,
    color: "#d41d77",
  },
  textContainer: {
    borderBottomWidth: 1,
  },
});
