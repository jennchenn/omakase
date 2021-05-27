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
  marginTop: '30px',
};

const body = {
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '15px',
  textAlign: 'center',
};

function Splash() {
  const googleRegisterUrl = createRegisterUrl();
  return (
    <div>
      <title>omakase</title>
      <div style={pageStyles}>
        <Row>
          <h1 style={title}>omakase</h1>
        </Row>
        <Row style={body}>
          <p>
            inspired by omakase sushi, omakase eliminates decision fatigue by
            scheduling meetings for you.
          </p>
        </Row>
        <Row>
          <h3 style={title}>how it works</h3>
        </Row>
        <Row>
          <p style={body}>
            connect to your google account, create a group, select the group
            that you would like to meet with, enter in some meeting details, and
            an event invite with call details will be automatically sent to all
            members for the earliest slot available.
          </p>
        </Row>
        <Row>
          <h3 style={title}>coming soon</h3>
        </Row>
        <Row>
          <p style={body}>
            <li>support for adding new members</li>
            <li>ability to see past event history</li>
            <li>integration with different calendars</li>
          </p>
        </Row>
        <Row>
          <a style={title} href={googleRegisterUrl}>
            get started
          </a>
        </Row>
      </div>
    </div>
  );
}

export default Splash;
