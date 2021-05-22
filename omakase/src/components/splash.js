import * as React from 'react';

import '../styles/global.css';
import '../styles/fade.css';

import { createRegisterUrl } from '../utils/login';

const pageStyles = {
  margin: '0px auto',
  maxWidth: '723px',
};

const Splash = () => {
  const googleRegisterUrl = createRegisterUrl();
  return (
    <div>
      <title>omakase</title>
      <div style={pageStyles}>
        <a href={googleRegisterUrl}>Register with Google</a>
      </div>
    </div>
  );
};

export default Splash;
