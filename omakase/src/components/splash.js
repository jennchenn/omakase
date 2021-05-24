import * as React from 'react';
import { Row } from 'react-bootstrap';

import '../styles/global.css';

import { createRegisterUrl } from '../utils/login';

const pageStyles = {
  margin: '0px auto',
  maxWidth: '723px',
};

const title = {
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '30px'
};

const Splash = () => {
  const googleRegisterUrl = createRegisterUrl();
  return (
    <div>
      <title>omakase</title>
      <div style={pageStyles}>
        <Row>
          <h1 style={title}>omakase</h1>
        </Row>
        <Row>
          <a style={title} href={googleRegisterUrl}>get started</a>
        </Row>
      </div>
    </div>
  );
};

export default Splash;
