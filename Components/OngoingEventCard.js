import { Text, View, StyleSheet, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import logoPaths from "../utils/logoPaths";
import setProperTeamName from "../utils/setProperTeamName";
import teamColors from "../utils/teamColors";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

function OngoingEventCard(props) {
  const teamA = setProperTeamName(props.teamA || "");
  const teamB = setProperTeamName(props.teamB || "");

  const teamAName = props.teamA === "ECE_META" ? "ECE_META_EP" : props.teamA;
  const teamBName = props.teamB === "ECE_META" ? "ECE_META_EP" : props.teamB;
  const scoreA = Number.isFinite(Number(props.scoreA))
    ? Number(props.scoreA)
    : 0;
  const scoreB = Number.isFinite(Number(props.scoreB))
    ? Number(props.scoreB)
    : 0;

  const timestamp = props.details?.timestamp;
  const date = new Date(timestamp);
  const isValidDate = !Number.isNaN(date.getTime());
  const formattedDate = isValidDate ? date.toLocaleDateString() : "TBA";
  const formattedTime = isValidDate
    ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : "TBA";

  const logoA = logoPaths[teamA];
  const logoB = logoPaths[teamB];

  return (
    <View>
      <LinearGradient
        start={{ x: -0.4, y: 0.0 }}
        end={{ x: 0.7, y: 1 }}
        locations={[0.2, 0.8]}
        colors={["#A7D8CC", "#C9E7DF"]}
        style={styles.cardTop}
      >
        <View style={styles.topContent}>
          <Text
            style={styles.teamsTitle}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {teamAName || "Team A"} v/s {teamBName || "Team B"}
          </Text>

          <View style={styles.scoreRow}>
            <View style={styles.teamSlot}>
              {logoA ? (
                <Image style={styles.teamLogo} source={logoA} />
              ) : (
                <View style={styles.logoFallback} />
              )}
              <Text style={styles.scoreText}>{scoreA}</Text>
            </View>

            <Text style={styles.matchIdText} numberOfLines={1}>
              {props.id || "-"}
            </Text>

            <View style={styles.teamSlot}>
              <Text style={styles.scoreText}>{scoreB}</Text>
              {logoB ? (
                <Image style={styles.teamLogo} source={logoB} />
              ) : (
                <View style={styles.logoFallback} />
              )}
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.cardBottom}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Text style={styles.BottomTextGame}>{props.gameName}</Text>
          <Text style={styles.BottomTextTeams}>{props.details.location}</Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Text style={styles.BottomTextGame}>{formattedDate}</Text>
          <Text style={styles.BottomTextTime}>{formattedTime}</Text>
        </View>
      </View>
    </View>
  );
}

export default OngoingEventCard;

const styles = StyleSheet.create({
  cardTop: {
    minHeight: 0.15 * deviceHeight,
    marginTop: 12,
    marginHorizontal: 0.04 * deviceWidth,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "black",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    elevation: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.75,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  topContent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  teamsTitle: {
    fontWeight: "700",
    fontSize: 24,
    maxWidth: "95%",
    textAlign: "center",
  },
  scoreRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  teamSlot: {
    width: "35%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  teamLogo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  logoFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#BEBEBE",
  },
  scoreText: {
    fontSize: 36,
    color: "#322d2d",
    fontWeight: "800",
    minWidth: 24,
    textAlign: "center",
  },
  matchIdText: {
    width: "30%",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
    color: "#111",
  },
  cardBottom: {
    marginBottom: 0.01 * deviceHeight,
    height: 0.07 * deviceHeight,
    marginHorizontal: "4%",
    padding: 10,
    backgroundColor: "#0B4B4D",
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    elevation: 6,
    shadowColor: "#0A747A",
    // shadowColor: "#1A1A2E",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 0.5,
    shadowOpacity: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  BottomTextGame: {
    color: "white",
    fontSize: 16,
  },
  BottomTextTeams: {
    color: "gray",
  },
  BottomTextTime: {
    color: "gray",
  },
});
