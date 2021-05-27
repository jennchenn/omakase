import React from 'react';
import { Card } from 'react-bootstrap';

const cardStyle = {
  marginTop: '10px',
  marginBottom: '10px',
  marginLeft: '10px',
  marginRight: '10px',
  width: '18rem',
  textAlign: 'center',
};

function Member({ member }) {
  return (
    <Card bg="light" border="primary" variant="top" style={cardStyle}>
      <Card.Img variant="top" src={member.picture} />
      <Card.Body>
        <Card.Header>{member.name}</Card.Header>
        <Card.Text>{member.email}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Member;
