import { View, Text, StyleSheet, Dimensions, Image } from "react-native";

const LeaderBoardElement = (props) => {
  console.log("LeaderBoardElement", props);
  return (
    
      <View style={styles.LeaderBoardElement}>
        <View style={styles.LeaderBoardElementText}>
          <Text style={styles.LeaderBoardSNo}>{props.branchData.rank}</Text>
          <Image
            source={
              props.logoPaths[
                props.branchData.Name.replace(".", "").replace("+", "")
              ]
            }
            style={styles.LeaderBoardLogo}
          />
        </View>
        <View style={styles.branchname}>
          <Text style={styles.LeaderBoardNameHolder}>
            {(props.branchData.Name === "ECE_META" ? "ECE_META_EP" : props.branchData.Name)}
          </Text>
        </View>
        <View style={styles.points}>
          <Text style={styles.LeaderBoardPoints}>{props.branchData.Score}</Text>
        </View>
      </View>
    
  );
};

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  LeaderBoardElement: {
    flexDirection: "row",
    flex: 0.07,
    backgroundColor: "#252728",
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth * 0.85,
    height: 72,
    borderRadius: 12,
  },
  LeaderBoardElementLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginRight: "30%",
    marginLeft: "3%",
    padding: 10,
    gap: 10,
  },
  LeaderBoardNameHolder: {
    color: "white",
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  LeaderBoardLogo: {
    width: 35,
    height: 35,
    marginLeft: 10,
  },
  LeaderBoardSNo: {
    color: "white",
    fontSize: 14.4,
    fontWeight: "bold",
  },
  LeaderBoardPoints: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  LeaderBoardElementText: {
    flexDirection: "row",
    alignItems:"center",
    justifyContent:"space-between",
    flex: 0.75,
    padding: 20,
  },
  branchname: {
    flex: 2,
  },
  points: {
    flex: 0.75,
  },
});

export default LeaderBoardElement;
