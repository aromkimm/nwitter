import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import Nweet from '../components/Nweet';
import NweetFactory from '../components/NweetFactory';

const Home = ({ user }) => {
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    onSnapshot(collection(db, 'nweets'), snapshot => {
      const nweetsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetsData);
    });
  }, []);

  return (
    <div className="container">
      <NweetFactory user={user} />
      <ul style={{ marginTop: 30 }}>
        {nweets.map(nweet => (
          <Nweet
            key={nweet.id}
            nweet={nweet}
            isOwner={user.uid === nweet.creatorId}
          />
        ))}
      </ul>
    </div>
  );
};

export default Home;
