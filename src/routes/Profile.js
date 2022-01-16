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
    <div className="container">
      <form className="profileForm" onSubmit={onSubmit}>
        <input
          className="formInput"
          type="text"
          placeholder="Display name"
          value={displayName}
          autoFocus
          onChange={onChange}
        />
        <input
          className="formBtn"
          type="submit"
          value="Update Profile"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={logout}>
        Log Out
      </span>
      {nweets.map(nweet => (
        <Nweet key={nweet.id} nweet={nweet} isOwner />
      ))}
    </div>
  );
};
export default Profile;
