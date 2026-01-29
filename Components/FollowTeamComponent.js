import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  Pressable,
} from "react-native";
import { Button } from "react-native";
import { LoginContext } from "../store/LoginContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { backend_link } from "../utils/constants";
import logoPaths from "../utils/logoPaths";
import { ActivityIndicator } from "react-native-paper";

const FollowTeamComponent = (props) => {
  const LoginCtx = useContext(LoginContext);
  const [loading, setLoading] = useState(false);
  const addFollow = async (teamName) => {
    try {
      setLoading(true);
      console.log("Hi");
      const email = LoginCtx?.user?.email;
      const response = await axios.post(
        backend_link + "api/user/follow?email=" + email + "&team=" + teamName
      );
      const response1 = await axios.post(
        backend_link +
          "api/teams/addFollower?email=" +
          email +
          "&team=" +
          teamName
      );
      console.log(response.data);
      console.log(response1.data);
      Alert.alert("Now you are following team " + teamName);
      props.setReload((prev) => !prev);
      return response;
    } catch (err) {
      console.log("Error", err);
      Alert.alert("Uh-oh! Some Error Occurred");
    } finally {
      setLoading(false);
    }
  };

  const deleteFollow = async (teamName) => {
    try {
      setLoading(true);
      console.log("Bye");
      const email = LoginCtx?.user?.email;
      const response = await axios.post(
        backend_link + "api/user/unfollow?email=" + email + "&team=" + teamName
      );
      const response1 = await axios.post(
        backend_link +
          "api/teams/removeFollower?email=" +
          email +
          "&team=" +
          teamName
      );
      console.log(response.data);
      console.log(response1.data);
      Alert.alert("You have Unfollowed the team " + teamName);
      props.setReload((prev) => !prev);

      return response;
    } catch (err) {
      console.log("Error", err);
      Alert.alert("Uh-oh! Some Occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.LeaderBoardElement}>
        <View>
          <Image
            source={logoPaths[props.branchData]}
            style={{ height: 24, width: 24, borderRadius: 12, padding: 24 }}
          />
        </View>
        <View style={styles.branchname}>
          <Text style={styles.LeaderBoardNameHolder}>{props.branchData}</Text>
        </View>

        {!props.isFollowing ? (
          <View
            style={{ backgroundColor: "#d41d77", padding: 15, borderRadius: 8 }}
          >
            <Pressable
              style={{ backgroundColor: "#d41d77" }}
              onPress={() => {
                addFollow(props.branchData);
              }}
            >
              <View style={{ backgroundColor: "#d41d77", minWidth: 68 }}>
                {!loading && (
                  <Text style={{ color: "white", fontSize: 18 }}>Follow</Text>
                )}
                {loading && (
                  <ActivityIndicator animating={loading} color="black" />
                )}
              </View>
            </Pressable>
          </View>
        ) : (
          <View
            style={{ backgroundColor: "gray", padding: 15, borderRadius: 8 }}
          >
            <Pressable
              onPress={() => {
                deleteFollow(props.branchData);
              }}
            >
              <View style={{ minWidth: 68 }}>
                {!loading && (
                  <Text style={{ color: "white", fontSize: 18 }}>Unfollow</Text>
                )}
                {loading && (
                  <ActivityIndicator animating={loading} color="black" />
                )}
              </View>
            </Pressable>
          </View>
        )}
      </View>
    </>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  LeaderBoardElement: {
    flexDirection: "row",
    flex: 0.08,
    backgroundColor: "#252728",
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth * 0.87,
    height: 72,
    borderRadius: 7,
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
    width: 32,
    height: 32,
    marginLeft: 10,
  },
  LeaderBoardSNo: {
    color: "white",
    fontSize: 14.4,
    fontWeight: "bold",
  },
  LeaderBoardPoints: {
    color: "#0ac410",
    fontSize: 16,
    fontWeight: "bold",
  },
  LeaderBoardPointsNeg: {
    color: "#e3091b",
    fontSize: 16,
    fontWeight: "bold",
  },
  LeaderBoardElementText: {
    flexDirection: "row",
    flex: 0.75,
    padding: 20,
    fontSize: 16,
  },
  branchname: {
    flex: 2,
  },
  points: {
    flex: 0.75,
  },
});

export default FollowTeamComponent;
