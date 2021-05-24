import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import Logo from '../assets/logo.png';
import '../styles/global.css';

const header = {
  width: '800px',
  marginTop: '100px',
  marginLeft: 'auto',
  marginRight: 'auto'
};

const image = {
  width: '60px',
  height: '60px',
  display: 'block',
  margin: 'auto',
};

const col = {
  paddingLeft: '0px',
};

function Header() {
  return (
    <Container style={header}>
      <Row>
        <Col style={col}>
          <div>
            <a href='/'>
              <img className='logo' src={Logo} style={image} alt='Home' />
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Header;
