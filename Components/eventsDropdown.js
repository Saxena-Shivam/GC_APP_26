import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Menu, Divider } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CustomHeader = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [currentField, setCurrentField] = useState("ALL");
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  const setCurrentFieldHandler = (field) => {
    setCurrentField(field);
    closeMenu();
    navigation.navigate("EventsStack", { field: field });
  };
  return (
    <TouchableOpacity onPress={openMenu} style={styles.headerContainer}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>{currentField} </Text>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<AntDesign name="downcircleo" size={24} color="white" />}
          style={{ backgroundColor: "transparent" }}
        >
          {["ALL", "Sports", "Cultural", "Tech"].map((item, index) => {
            if (currentField !== item) {
              return (
                <React.Fragment key={item}>
                  <Menu.Item
                    onPress={() => {
                      setCurrentFieldHandler(item);
                    }}
                    title={item}
                    titleStyle={{ color: "white", fontWeight: "bold" }}
                    style={{
                      backgroundColor: "#111319",
                      padding: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />

                  {index < 3 && (
                    <Divider style={{ backgroundColor: "white" }} />
                  )}
                </React.Fragment>
              );
            }
            return null;
          })}
        </Menu>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#111319",
    alignItems: "center",
    width: 100,
    height: 100,
    elevation: 4, // for Android
    shadowColor: "#000", // for iOS
    shadowOffset: { width: 0, height: 2 }, // for iOS
    shadowOpacity: 0.25, // for iOS
    shadowRadius: 3.84, // for iOS
  },
  title: {
    fontSize: 16,
    color: "white",
    //fontWeight: "bold",
  },
});

export default CustomHeader;
