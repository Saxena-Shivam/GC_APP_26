import { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import OngoingEventCard from "../../Components/OngoingEventCard";
import Loader from "../../Components/Loader";
import { EventsContext } from "../../store/EventsContext"; // Import EventsContext

const sortData = (data) => {
  return data.sort(
    (a, b) => new Date(b.details.timestamp) - new Date(a.details.timestamp),
  ); // Sort by date descending
};

function PastScreen({ search }) {
  const { pastEvents, isLoading } = useContext(EventsContext); // Get state directly
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (pastEvents.length > 0) {
      setFilteredData(sortData(pastEvents)); // Set state when events are loaded
    }
  }, [pastEvents]);

  useEffect(() => {
    if (!pastEvents.length) return; // Prevent unnecessary filtering if no data is available

    if (search.length === 0) {
      setFilteredData(sortData(pastEvents)); // Reset if search is empty
      return;
    }

    const data = pastEvents.filter((item) => {
      let teamA = item?.teamA.toLowerCase();
      let teamB = item?.teamB.toLowerCase();
      let gameName = item?.gameName.toLowerCase();
      const id = item?.id.toLowerCase();

      return (
        teamA.includes(search.toLowerCase()) ||
        teamB.includes(search.toLowerCase()) ||
        gameName.includes(search.toLowerCase()) ||
        id.includes(search.toLowerCase())
      );
    });

    setFilteredData(sortData(data));
  }, [search, pastEvents]);

  return (
    <View style={styles.eventsContainer}>
      <FlatList
        key={1}
        data={filteredData}
        renderItem={({ item }) => (
          <OngoingEventCard
            details={item.details}
            gameName={item.gameName}
            id={item.id}
            teamA={item.teamA}
            teamB={item.teamB}
            scoreA={item.scoreA}
            scoreB={item.scoreB}
          />
        )}
        keyExtractor={(item, index) => `${item.id}-${item.gameName}-${index}`}
        alwaysBounceVertical={false}
      />
      <View style={{ minHeight: 0 }}>
        <Loader
          visible={isLoading}
          top={300}
          bottom={0}
          setModalVisible={() => {}}
        />
      </View>
    </View>
  );
}

export default PastScreen;

const styles = StyleSheet.create({
  eventsContainer: {
    flex: 5,
    maxHeight: "60%",
  },
});
