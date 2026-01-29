import { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import OngoingEventCard from "../../Components/OngoingEventCard";
import Loader from "../../Components/Loader";

const sortData = (data) => {
  return data.sort(
    (a, b) => new Date(b.details.timestamp) - new Date(a.details.timestamp),
  ); // Sort by date descending
};

function AllEventsScreen({ search, allEvents }) {
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (allEvents.length > 0) {
      setFilteredData(sortData(allEvents)); // Set state when events are loaded
    }
  }, [allEvents]);

  useEffect(() => {
    if (!allEvents.length) return; // Prevent unnecessary filtering if no data is available

    if (search.length === 0) {
      setFilteredData(sortData(allEvents)); // Reset if search is empty
      return;
    }

    const data = allEvents.filter((item) => {
      let teamA = item?.teamA?.toLowerCase();
      let teamB = item?.teamB?.toLowerCase();
      let gameName = item?.gameName?.toLowerCase();
      const id = item?.id?.toLowerCase();

      return (
        teamA?.includes(search.toLowerCase()) ||
        teamB?.includes(search.toLowerCase()) ||
        gameName?.includes(search.toLowerCase()) ||
        id?.includes(search.toLowerCase())
      );
    });

    setFilteredData(sortData(data));
  }, [search, allEvents]);

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

export default AllEventsScreen;

const styles = StyleSheet.create({
  eventsContainer: {
    flex: 5,
    maxHeight: "60%",
  },
});
