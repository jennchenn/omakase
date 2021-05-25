import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

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
  marginRight: 'auto',
  marginLeft: 'auto'
};


function Header() {
  return (
    <Container style={header}>
      <Row>
        <Col>
          <div>
            <a href='/'>
              <h1 style={image}>🍣</h1>
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Header;
