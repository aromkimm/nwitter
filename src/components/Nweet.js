import { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

const Nweet = ({ nweet, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweet.text);

  const toogleEditing = () => {
    setEditing(prev => !prev);
  };

  const deleteNweet = () => {
    const ok = window.confirm('Are you sure you want to delete this nweet?');

    if (ok) {
      if (nweet.attachmentUrl) {
        const fileRef = ref(storage, nweet.attachmentUrl);
        deleteObject(fileRef);
      }
      deleteDoc(doc(db, `nweets/${nweet.id}`));
    }
  };

  const onChange = event => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  const onSubmit = event => {
    event.preventDefault();
    updateDoc(doc(db, `nweets/${nweet.id}`), {
      text: newNweet,
    });
    setEditing(false);
  };

  return (
    <li>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              value={newNweet}
              onChange={onChange}
              placeholder="Edit you nweet"
              required
            />
            <input type="submit" value="Update Nweet" />
          </form>
          <button onClick={toogleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweet.text}</h4>
          {nweet.attachmentUrl && (
            <img src={nweet.attachmentUrl} width="50px" height="50px" alt="" />
          )}
          {isOwner && (
            <>
              <button onClick={deleteNweet}>Delete Nweet</button>
              <button onClick={toogleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </li>
  );
};

export default Nweet;
