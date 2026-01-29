import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";

import { LoginContext } from "../store/LoginContext";
import FollowTeamComponent from "../Components/FollowTeamComponent";
import axios from "axios";
import { backend_link } from "../utils/constants";

export default function FollowTeam() {
  const loginctx = useContext(LoginContext);
  const [loading, setLoading] = useState(false);
  const [teamFollowing, setTeamFollowing] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const getFollow = async () => {
      try {
        const email = loginctx?.user?.email;
        if (email === undefined) {
          return;
        }
        const response = await axios.get(
          backend_link + "api/user/getFollowing?email=" + email
        );
        const data = response.data;
        const teamsCurrentlyFollowing = data.following.team;
        setTeamFollowing(teamsCurrentlyFollowing);
        // console.log(response.data);
        return response;
      } catch (err) {
        console.log("Error", err);
      }
    };
    getFollow();
  }, [reload]);

  const renderItem = (props) => {
    const isFollowing = teamFollowing.includes(props.item);
    return (
      <View style={{ padding: 5 }}>
        <FollowTeamComponent
          setReload={setReload}
          branchData={props.item}
          isFollowing={isFollowing}
        />
      </View>
    );
  };

  const teams = [
    "CSE",
    "ECE_META",
    "EE",
    "CIVIL",
    "MECH",
    "MTech",
    "MSc_ITEP",
    "PHD",
  ];

  const teamNotFollowing = teams.filter(
    (team) => !teamFollowing.includes(team)
  );

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#fff" />}
      {!loading && (
        <>
          <View style={styles.container2}>
            <View>
              <Text
                style={{
                  color: "#d41d77",
                  fontSize: 24,
                  padding: 24,
                  fontWeight: "bold",
                  paddingBottom: 4,
                }}
              >
                Follow your Team!
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  padding: 10,
                  paddingBottom: 20,
                }}
              >
                Stay updated and get all news about GC!
              </Text>
            </View>
            <FlatList
              data={teams}
              renderItem={renderItem}
              keyExtractor={(item, index) => {
                return index;
              }}
              alwaysBounceVertical={false}
            />
          </View>

          <View style={styles.bottomnav}></View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  branchLogoImage: {
    height: 100,
    width: 100,
    marginTop: 30,
  },
  branchTotalPoints: {
    color: "white",
    padding: 30,
    paddingTop: 20,
    fontSize: 38,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 25,
  },
  containertop: {
    flex: 1.2,
    backgroundColor: "#CC9E32",
    color: "white",
    height: "120%",
    marginTop: -60,
    paddingTop: 60,
    flexDirection: "column",
    width: "120%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  containertop1: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  containertop2: {
    flex: 1.25,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  containertop3: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  number1top: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
  },
  number1bottom: {
    flex: 0.75,
    backgroundColor: "#746030",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  number2top: {
    flex: 1.5,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
  },
  number2bottom: {
    flex: 0.75,
    backgroundColor: "#52514F",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  number3top: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
  },
  number3bottom: {
    flex: 0.75,
    backgroundColor: "#795038",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCont: {
    padding: 5,
  },
  container2: {
    flex: 2,
    backgroundColor: "#000000",
    color: "white",
    flexDirection: "column",
    paddingTop: 10,
  },
  leadHeading: {
    fontSize: 15,
    color: "white",

    fontWeight: "bold",
  },
  leadScore: {
    fontSize: 20,
    color: "white",

    fontWeight: "bold",
  },

  text: {
    color: "white",
  },
  LeaderBoardList: {
    flex: 1,
    backgroundColor: "#000000",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  bottomcont: {
    flex: 0.3,
    flexDirection: "row",
    backgroundColor: "#000000",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    bottomMargin: 0,
  },
  text01: {
    color: "#D41D77",
    alignItems: "center",

    paddingBottom: 0,
  },
  text02: {
    color: "white",
    fontWeight: "bold",
    alignContent: "center",

    paddingBottom: 0,
  },
  bottomnav: {
    flex: 0.25,
    backgroundColor: "#000000",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
});
