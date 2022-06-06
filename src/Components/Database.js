import React from "react";
import { listSongs } from "../graphql/queries";

export default function Database({ API, graphqlOperation }) {
  const [songs, setSongs] = React.useState([]);

  React.useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const songData = await API.graphql(graphqlOperation(listSongs));
      const songList = songData.data.listSongs.items;
      console.log("song list", songList);
      setSongs(songList);
    } catch (error) {
      console.log("error on fetching songs", error);
    }
  };

  return <div>Database</div>;
}
