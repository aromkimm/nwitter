import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import AppRouter from './Router';
import { auth } from '../firebase';

const App = () => {
  const [init, setInit] = useState(false);
  const [user, setUser] = useState(null);

  const refreshUser = () => {
    const { displayName, uid } = auth.currentUser;
    setUser({ displayName, uid });
  };
  useEffect(() => {
    onAuthStateChanged(auth, currentUser => {
      const { displayName, uid } = currentUser;
      setUser({ displayName, uid });
      setInit(true);
    });
  }, []);

  return init ? (
    <AppRouter
      isLoggedIn={Boolean(user)}
      user={user}
      refreshUser={refreshUser}
    />
  ) : (
    <span>initializing...</span>
  );
};

export default App;
