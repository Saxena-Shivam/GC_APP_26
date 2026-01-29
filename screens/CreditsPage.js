import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreditsPage({ navigation }) {
  console.log("navigation test: ", navigation);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Credits Page</Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>App Lead</Text>
        <View style={[styles.section, styles.elevation]}>
          <Image
            source={require("../assets/DevTeam/Chaitanya.jpg")}
            style={styles.image}
          />
          <Text style={styles.member}>Chaitanya Bharadwaj</Text>
        </View>
        <View style={[styles.section, styles.elevation]}>
            <Image
              source={require("../assets/DevTeam/rachit.jpeg")}
              style={styles.image}
            />
            <Text style={styles.member}>Rachit Jain</Text>
          </View>
          <View style={[styles.section, styles.elevation]}>
            <Image
              source={require("../assets/DevTeam/gupta.jpeg")}
              style={styles.image}
            />
            <Text style={styles.member}>Ayush Gupta</Text>
          </View>

        {/* <Text style={styles.sectionTitle}>Design Lead</Text>
        <View style={[styles.section, styles.elevation]}>
          <Image source={require("../assets/DevTeam/manish.jpg")} style={styles.image} />
          <Text style={styles.member}>Manish Mondal</Text>
        </View> */}

        <Text style={styles.sectionTitle}>Developers</Text>
        
        <View style={[styles.section, styles.elevation]}>
          <Image
            source={require("../assets/DevTeam/adarsh.jpg")}
            style={styles.image}
          />
          <Text style={styles.member}>Adarsh Chandra</Text>
        </View>
        <View style={[styles.section, styles.elevation]}>
          <Image
            source={require("../assets/DevTeam/avirat.jpeg")}
            style={styles.image}
          />
          <Text style={styles.member}>Avirat Joshi</Text>
        </View>
        <View style={[styles.section, styles.elevation]}>
          <Image
            source={require("../assets/DevTeam/jeeban.jpeg")}
            style={styles.image}
          />
          <Text style={styles.member}>Jeeban Jyoti Patra</Text>
        </View>
        <View style={[styles.section, styles.elevation]}>
          <Image
            source={require("../assets/DevTeam/prince.jpeg")}
            style={styles.image}
          />
          <Text style={styles.member}>Prince Kumar</Text>
        </View>
        <View style={[styles.section, styles.elevation]}>
          <Image
            source={require("../assets/DevTeam/siddarth.jpeg")}
            style={styles.image}
          />
          <Text style={styles.member}>Siddarth.K</Text>
        </View>

        <Text style={styles.sectionTitle}>Special Thanks</Text>
        {/* <View style={[styles.section, styles.elevation]}>
          <Image source={require("../assets/DevTeam/Sambit.jpg")} style={styles.image} />
          <View style={{ alignItems: "center" }}>
            <Text style={styles.member}>Aditya Upadhyay</Text>
            <Text style={styles.subText}>General Secretary</Text>
            <Text style={styles.subText}>STC, Students' Gymkhana</Text>
          </View>
        </View> */}

        <View style={[styles.section, styles.elevation, { marginBottom: 30 }]}>
          <Image
            source={require("../assets/DevTeam/upadhyay.jpeg")}
            style={styles.image}
          />
          <View style={{ alignItems: "center" }}>
            <Text style={[styles.member, { fontSize: 20, marginBottom: 5 }]}>
              Aditya Upadhyay
            </Text>
            <Text style={styles.subText}>General Secretary</Text>
            <Text style={styles.subText}>STC, Students' Gymkhana</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DDD0C8",
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  title: {
    color: "#323232",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#323232",
    marginTop: 20,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#323232",
    padding: 10,
    borderRadius: 30,
    marginVertical: 5,
  },
  elevation: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 15,
  },
  member: {
    fontSize: 20,
    color: "white",
  },
  subText: {
    fontSize: 12,
    color: "lightgray",
  },
});
