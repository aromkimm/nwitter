import { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { db, storage } from '../firebase';

const Nweet = ({ nweet, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweet.text);

  const toggleEditing = () => {
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
    <li className="nweet">
      {editing ? (
        <>
          <form className="container nweetEdit" onSubmit={onSubmit}>
            <input
              className="formInput"
              value={newNweet}
              placeholder="Edit you nweet"
              required
              autoFocus
              onChange={onChange}
            />
            <input className="formBtn" type="submit" value="Update Nweet" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{nweet.text}</h4>
          {nweet.attachmentUrl && <img src={nweet.attachmentUrl} alt="" />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={deleteNweet}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </li>
  );
};

export default Nweet;
