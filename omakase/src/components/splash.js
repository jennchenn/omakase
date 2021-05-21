import * as React from 'react';

import '../styles/global.css';
import '../styles/fade.css';

import { createLoginUrl, parseCodeFromUrl } from '../utils/login';

const pageStyles = {
  margin: '0px auto',
  maxWidth: '723px',
};

const Splash = () => {
  const urlParams = parseCodeFromUrl(window.location.search);
  if (urlParams.code) {
    console.log(urlParams);
  }
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
