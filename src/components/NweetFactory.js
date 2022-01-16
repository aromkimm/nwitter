import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

import { db, storage } from '../firebase';

const NweetFactory = ({ user }) => {
  const [nweet, setNweet] = useState('');
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

  return (
    <form className="factoryForm" onSubmit={onSubmit}>
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input className="factoryInput__arrow" type="submit" value="&rarr;" />
      </div>
      <label className="factoryInput__label" htmlFor="attach-file">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
            alt=""
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
