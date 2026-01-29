import { StyleSheet, TouchableOpacity, Text } from "react-native";

function VoteButton() {
  return (
    <TouchableOpacity style={styles.VoteButton}>
      <Text style={{ color: "white", fontWeight: "bold" }}>VOTE</Text>
    </TouchableOpacity>
  );
}

export default VoteButton;

const styles = StyleSheet.create({
  VoteButton: {
    backgroundColor: "rgb(212,36,119	)",
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    height: 45,
    padding: 3,
  },
});
