import * as React from 'react';
import { Redirect } from 'react-router-dom';
import '../styles/global.css';

import { parseCodeFromUrl } from '../utils/login';
import { getAccessTokenFromCode } from '../api/login';

function Authenticate() {
  const urlParams = parseCodeFromUrl(window.location.search);
  if (urlParams.code) {
    getAccessTokenFromCode(urlParams.code);
    return <Redirect to='/dashboard' />;
  }
  return (
    <div>
      <title>omakase</title>
    </div>
  );
};

export default Authenticate;
