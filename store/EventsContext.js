import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { backend_link } from "../utils/constants";

const EventsContext = createContext({
  events: [],
  liveEvents: [],
  upcomingEvents: [],
  pastEvents: [],
  isLoading: false,
  fetchAllLiveEvents: async () => {},
});

const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [liveEvents, setLiveEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to convert timestamp to milliseconds
  const getTimestampInMs = (timestamp) => {
    if (!timestamp) return 0;

    // If it's a string (ISO format), convert to Date
    if (typeof timestamp === "string") {
      return new Date(timestamp).getTime();
    }

    // If it's already a number in seconds (10 digits), convert to milliseconds
    if (typeof timestamp === "number" && timestamp < 10000000000) {
      return timestamp * 1000;
    }

    // If it's already in milliseconds
    return timestamp;
  };

  const sortData = (data) => data.sort((a, b) => a.id.localeCompare(b.id));

  const fetchAllLiveEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${backend_link}api/event/getAllLiveEvents`,
      );
      const data = response.data.events;
      console.log("Raw events data:", data);

      let events = data.flatMap((item) => {
        const eventName = item.eventId;
        const subEvents = item.subEvents;
        const gameName = eventName;

        return subEvents.map((match_item) => {
          const teamA = match_item.data.points.teamA;
          const teamB = match_item.data.points.teamB;
          const details = match_item.data.details;

          // Get timestamps and convert to milliseconds for consistent comparison
          const startTimestampMs = getTimestampInMs(details?.timestamp);
          const endTimestampMs = getTimestampInMs(
            match_item.data?.endTimeStamp,
          );

          return {
            details: details,
            status: match_item.data.status, // Live, Upcoming, Past
            gameName: gameName,
            id: match_item.subEventId,
            timeStamp: startTimestampMs, // Event start time in milliseconds
            endTimeStamp: endTimestampMs, // Event end time in milliseconds
            teamA: teamA?.name || match_item.subEventId.split(" vs ")[0],
            teamB: teamB?.name || match_item.subEventId.split(" vs ")[1],
            scoreA: teamA?.points || 0,
            scoreB: teamB?.points || 0,
            betsA: teamA?.bets,
            betsB: teamB?.bets,
            playersA: teamA?.players,
            playersB: teamB?.players,
          };
        });
      });

      events = sortData(events);
      setEvents(events);
      await AsyncStorage.setItem("events", JSON.stringify(events));

      // Categorizing events into Live, Upcoming, and Past using current time
      const now = Date.now();
      console.log("Current time (ms):", now);

      const live = events.filter((event) => {
        const isLive = event.timeStamp <= now && event.endTimeStamp >= now;
        console.log(
          `Event ${event.id}: start=${event.timeStamp}, end=${event.endTimeStamp}, isLive=${isLive}`,
        );
        return isLive;
      });

      const upcoming = events.filter((event) => event.timeStamp > now);
      const past = events.filter((event) => event.endTimeStamp < now);

      console.log(
        `Categorized - Live: ${live.length}, Upcoming: ${upcoming.length}, Past: ${past.length}`,
      );

      setLiveEvents(live);
      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (err) {
      console.error("Error fetching events:", err);
      // Alert.alert("Error", "Something went wrong", [{ text: "Okay" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchAllLiveEvents();
  // }, []);

  return (
    <EventsContext.Provider
      value={{
        events,
        liveEvents,
        upcomingEvents,
        pastEvents,
        isLoading,
        fetchAllLiveEvents,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export { EventsProvider, EventsContext };
