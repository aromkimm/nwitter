import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase';
import AuthForm from '../components/AuthForm';

const Auth = () => {
  const continueWithSNS = async event => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === 'google') {
      provider = new GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(auth, provider);
  };

  return (
    <div>
      <AuthForm />
      <div>
        <button name="google" onClick={continueWithSNS}>
          Continue with Google
        </button>
        <button name="github" onClick={continueWithSNS}>
          Continue with Github
        </button>
      </div>
    </div>
  );
};

export default Auth;
