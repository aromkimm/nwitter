import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import Nweet from '../components/Nweet';

const Home = ({ user }) => {
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState(null);

  const onChange = event => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onSubmit = async event => {
    event.preventDefault();
    let attachmentUrl = '';
    if (attachment) {
      const fileRef = ref(storage, `${user.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, attachment, 'data_url');
      attachmentUrl = await getDownloadURL(response.ref);
    }
    await addDoc(collection(db, 'nweets'), {
      text: nweet,
      createdAt: Date.now(),
      creatorId: user.uid,
      attachmentUrl,
    });
    setNweet('');
    setAttachment(null);
  };

  const onFileChange = event => {
    const {
      target: { files },
    } = event;
    const image = files[0];
    if (image) {
      const reader = new FileReader();
      reader.onloadend = finishedEvent => {
        const {
          currentTarget: { result },
        } = finishedEvent;
        setAttachment(result);
      };
      reader.readAsDataURL(image);
    }
  };

  const onClearAttachment = () => {
    setAttachment(null);
  };

  useEffect(() => {
    onSnapshot(collection(db, 'nweets'), snapshot => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(docs);
    });
  }, []);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind?"
          value={nweet}
          onChange={onChange}
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" alt="" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <ul>
        {nweets.map(content => (
          <Nweet
            key={content.id}
            nweet={content}
            isOwner={user.uid === content.creatorId}
          />
        ))}
      </ul>
    </div>
  );
};

export default Home;
