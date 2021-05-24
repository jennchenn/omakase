import * as React from 'react';

import '../styles/global.css';
import '../styles/fade.css';

import { GoogleLogin } from 'react-google-login';
import { createRegisterUrl } from '../utils/login';
import { onSignIn } from '../api/login';

const pageStyles = {
  margin: '0px auto',
  maxWidth: '723px',
};

const signIn = async (googleUser) => {
  await onSignIn(googleUser);
  console.log('hi');
  // TODO: fix redirect to dashboard
};

const Splash = () => {
  const googleRegisterUrl = createRegisterUrl();
  return (
    <div>
      <title>omakase</title>
      <div style={pageStyles}>
        <a href={googleRegisterUrl}>Register with Google</a>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText='Login'
          onSuccess={signIn}
          onFailure={() => { console.log('ERROR'); }}
          cookiePolicy={'single_host_origin'}
        />
      </div>
    </div>
  );
};

export default Splash;
