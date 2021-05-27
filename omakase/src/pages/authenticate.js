import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import '../styles/global.css';

import { parseCodeFromUrl } from '../utils/login';
import { getAccessTokenFromCode } from '../api/login';

function Authenticate() {
  const [authenticationRes, setAuthenticationRes] = useState();
  const urlParams = parseCodeFromUrl(window.location.search);

  useEffect(() => {
    getAuth(urlParams.code);
  });

  const getAuth = async (code) => {
    if (typeof authenticationRes === 'undefined') {
      const res = await getAccessTokenFromCode(code);
      setAuthenticationRes(res);
    }
  };

  if (typeof authenticationRes === 'undefined') {
    return (
      <div>
        <title>omakase</title>
        <p>Logging you in...</p>
      </div>
    );
  }
  return <Redirect to="/dashboard" />;
}

export default Authenticate;
