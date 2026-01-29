import { StyleSheet, Text, View, ScrollView, FlatList,Dimensions } from "react-native";
import React from "react";
import { height } from "deprecated-react-native-prop-types/DeprecatedImagePropType";

const sortPointsTable = (data) => {
  const pointsTable = data?.pointsTable;
  if (pointsTable) {
    const pointsTableArray = Object.entries(pointsTable);
    pointsTableArray.sort((a, b) => {
      if (parseInt(b[1].points) - parseInt(a[1].points) === 0) {
        return parseInt(a[1].position) - parseInt(b[1].position); // sorting the array in ascending order
      }
      return parseInt(b[1].points) - parseInt(a[1].points); // sorting the array in descending order
    });
    return Object.fromEntries(pointsTableArray); // Return the sorted points table
  }
  return {};
};
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const SpecificEvents = ({ route }) => {
  let data = route.params?.data;

  const sortedTable = sortPointsTable(data);

  const timestamp = data.details?.timestamp;
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString(); // Date component
  let hour = date.getHours();
  const minute = date.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12;
  const formattedTime = `${hour}:${minute < 10 ? "0" : ""}${minute} ${ampm}`;

  console.log("data", data);
  const renderItem = ({ item }) => (
    console.log(item, pointsTable[item].points),
    (
      <View style={styles.row}>
        <Text style={styles.cell}>{item}</Text>
        <Text style={styles.cell}>{pointsTable[item].points}</Text>
        <Text style={styles.cell}>{pointsTable[item].position}</Text>
      </View>
    )
  );

  return (
    
    <View
      style={{
        paddingTop: 0.02 * deviceHeight,
        backgroundColor: "black",
        flexDirection: "column",
        height: "100%",
      }}
    >
       <ScrollView style={{ flex: 2, padding: 15 }}>
        <View
          style={{
            marginBottom: 10,
            marginLeft: 10,
            alignItems: "center",
            
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold",fontSize:33 }}>
            {data.details.title}
          </Text>
          <View style={{ flexDirection: "row",justifyContent:"space-evenly",alignItems:"center",width:"100%",margin:10 }}>
          <Text style={{ color: "#b0afac",fontSize:16}}>
            {data.details.location}
          </Text>
          <Text style={{ color: "#b0afac" ,fontSize:16}}>{formattedDate}</Text>
          <Text style={{ color: "#b0afac" ,fontSize:16}}>{formattedTime}</Text>
          </View>
          <Text style={{ color: "white", marginTop: 4 ,paddingLeft:2,paddingRight:2,fontSize:13 }}>
            {data.details.description}
          </Text>
        </View>
        
        {sortedTable && (
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={[styles.cell, styles.headerText]}>Branch</Text>
              <Text style={[styles.cell, styles.headerText]}>Points</Text>
              <Text style={[styles.cell, styles.headerText]}>Position</Text>
            </View>
          </View>
        )}
        {/* <FlatList
            data={Object.keys(pointsTable)}
            renderItem={renderItem}
            keyExtractor={(item) => item}
          /> */}
        {Object.keys(sortedTable).map((item, index) => {
          return (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{item}</Text>
              <Text style={styles.cell}>{sortedTable[item].points}</Text>
              <Text style={styles.cell}>
                {sortedTable[item].position == 0
                  ? "-"
                  : sortedTable[item].position}
              </Text>
            </View>
          );
        })}

      
        <View style={{ Height: 100 }}></View>
     
      <View
            style={{
              width: "100%",
              height: 150,
            }}
          ></View>
           </ScrollView>
    </View>
  );
};

export default SpecificEvents;

// const styles = StyleSheet.create({
//   container: {
//     flex: 2,
//     padding: 12,
//   },
//   header: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderColor: "black",
//     paddingBottom: 5,
//     marginBottom: 5,
//   },
//   row: {
//     flexDirection: "row",
//     marginBottom: 5,
//   },
//   cell: {
//     flex: 1,
//     color: "white",
//     minWidth: 40,
//     // minHeight: 40,
//     padding: 10,
//     textAlign: "center",
//     borderWidth: 1,
//     borderColor: "white",
//     // padding: 15,
//   },
//   headerText: {
//     fontWeight: "bold",
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 2,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "white", // Changed border color
    paddingBottom: 10, // Increased padding
    marginBottom: 10, // Increased margin
    // backgroundColor: "#333", // Added background color

  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
    //backgroundColor: "#555", // Added background color
  },
  cell: {
    flex: 1,
    color: "white",
    minWidth: 40,
    padding: 15, // Increased padding
    textAlign: "center",
    borderWidth: 1,
    borderColor: "white",
    height: 50, // Increased height
    fontSize: 16, // Increased font size
  },
  headerText: {
    fontWeight: "bold",
  },
});