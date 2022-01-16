import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Nweet from '../components/Nweet';

const Profile = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [nweets, setNweets] = useState([]);

  const logout = () => {
    auth.signOut();
    navigate('/');
  };

  const onChange = event => {
    const {
      target: { value },
    } = event;
    setDisplayName(value);
  };

  const onSubmit = async event => {
    event.preventDefault();
    if (displayName === user.displayName) return;
    await updateProfile(auth.currentUser, {
      displayName,
    });
    refreshUser();
  };

  const getMyNweets = async () => {
    const q = query(
      collection(db, 'nweets'),
      where('creatorId', '==', user.uid),
      orderBy('createdAt', 'asc'),
    );
    const nweets = await getDocs(q);
    const myNweets = nweets.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setNweets(myNweets);
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display name"
          onChange={onChange}
          value={displayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={logout}>Log Out</button>
      {nweets.map(nweet => (
        <Nweet key={nweet.id} nweet={nweet} isOwner />
      ))}
    </>
  );
};
export default Profile;
