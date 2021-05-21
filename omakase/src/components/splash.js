import * as React from 'react';

import '../styles/global.css';
import '../styles/fade.css';

import { createLoginUrl } from '../utils/login';

const pageStyles = {
  margin: '0px auto',
  maxWidth: '723px',
};

const Splash = () => {
  const googleLoginUrl = createLoginUrl();
  return (
    <div>
      <title>omakase</title>
      <div style={pageStyles}>
        <a href={googleLoginUrl}>Login with Google</a>
      </div>
    </div>
  );
};

export default Splash;
