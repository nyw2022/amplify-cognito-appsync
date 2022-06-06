import React from "react";
import Database from "./Components/Database";
import { Amplify, Auth, API, graphqlOperation } from "aws-amplify";
import { listSongs } from "./graphql/queries";

import { Authenticator, Button } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

export default function App() {
  const [isGuest, setIsGuest] = React.useState(false);
  const [guestId, setGuestId] = React.useState();

  React.useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const songData = await API.graphql(graphqlOperation(listSongs));
      const songList = songData.data.listSongs.items;
      console.log("song list", songList);
      // setSongs(songList);
    } catch (error) {
      console.log("error on fetching songs", error);
    }
  };

  const changeAuthFlow = () => {
    // https://github.com/aws-amplify/amplify-js/issues/711#issuecomment-414100476
    // unauthenticated identity
    setIsGuest(true);
    const getAnon = async () => await Auth.currentCredentials();
    getAnon().then((data) => {
      setGuestId(data.identityId);
    });
  };

  const signOut = () => {
    Auth.signOut();
    setIsGuest(false);
  };

  return (
    <div>
      <Button onClick={changeAuthFlow}>Sign-in as a guest ?</Button>
      {isGuest ? (
        <div>
          <p>Hello Guest ! {guestId}</p>
          {/* <Database API={API} graphqlOperation={graphqlOperation} /> */}
          <Button onClick={signOut}>Sign Out</Button>
        </div>
      ) : (
        <Authenticator>
          {({ signOut, user }) => (
            <main>
              <h1>Hello {user.username}</h1>
              <Database API={API} graphqlOperation={graphqlOperation} />
              <button onClick={signOut}>Sign out</button>
            </main>
          )}
        </Authenticator>
      )}
    </div>
  );
}
