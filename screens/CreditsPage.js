import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreditsPage({ navigation }) {
  const organisingMembers = [
    { title: "Aarav Patel", role: "President" },
    { title: "Meera Singh", role: "Vice President" },
    { title: "Rohan Kapoor", role: "General Secretary" },
  ];

  const leadBy = [
    { title: "Suvansh Sharma" },
    { title: "Siddarth.K", image: require("../assets/DevTeam/siddarth.jpeg") },
  ];

  const developedBy = [
    // { title: "Adarsh Chandra", image: require("../assets/DevTeam/adarsh.jpg") },
    // { title: "Avirat Joshi", image: require("../assets/DevTeam/avirat.jpeg") },
    // {
    //   title: "Jeeban Jyoti Patra",
    //   image: require("../assets/DevTeam/jeeban.jpeg"),
    // },
    { title: "Shivam Saxena", image: require("../assets/DevTeam/shivam1.jpg") },
  ];

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Credits</Text>
        <Text style={styles.subtitle}>Organizing and development team</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Organising Committee</Text>
          <View style={styles.sectionRule} />
        </View>

        {organisingMembers.map((member) => (
          <View key={member.title} style={styles.card}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{getInitials(member.role)}</Text>
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{member.title}</Text>
              <Text style={styles.cardSubtitle}>{member.role}</Text>
            </View>
          </View>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lead By</Text>
          <View style={styles.sectionRule} />
        </View>

        {leadBy.map((member) => (
          <View key={member.title} style={styles.card}>
            {member.image ? (
              <Image source={member.image} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {getInitials(member.title)}
                </Text>
              </View>
            )}
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{member.title}</Text>
              <Text style={styles.cardSubtitle}>Lead</Text>
            </View>
          </View>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Developed By</Text>
          <View style={styles.sectionRule} />
        </View>

        {developedBy.map((member) => (
          <View key={member.title} style={styles.card}>
            {member.image ? (
              <Image source={member.image} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {getInitials(member.title)}
                </Text>
              </View>
            )}
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{member.title}</Text>
              <Text style={styles.cardSubtitle}>Developer</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1419",
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  title: {
    color: "#D41D77",
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  subtitle: {
    color: "#9AA3AF",
    fontSize: 14,
    marginTop: 6,
  },
  sectionHeader: {
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E5E7EB",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  sectionRule: {
    height: 2,
    width: 48,
    backgroundColor: "#D41D77",
    marginTop: 6,
    borderRadius: 2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1F26",
    borderWidth: 1,
    borderColor: "#2A3038",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
    backgroundColor: "#2A3038",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFB6A6",
    fontSize: 16,
    fontWeight: "700",
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F9FAFB",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#9AA3AF",
    marginTop: 2,
  },
});
