import React, { useState, useEffect } from 'react';
import { Row, Dropdown, Button, Form } from 'react-bootstrap';

import { getGroups, createGroup } from '../api/group';
import '../styles/global.css';

const pageStyles = {
  margin: '0px auto',
  maxWidth: '723px',
};

const bodyStyle = {
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '30px',
  textAlign: 'center',
};

const buttonStyle = {
  textAlign: 'center',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const menu = {
  marginLeft: '30px',
};

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState();
  const [groupDescription, setGroupDescription] = useState();

  useEffect(() => {
    getUserGroups();
  }, []);

  const getUserGroups = async () => {
    const groups = await getGroups();
    setGroups(groups);
  };

  const mapGroups = () => {
    const map = groups.map((group) => {
      return (
        <Dropdown.Item href={'/group/' + group._id}>{group.name}</Dropdown.Item>
      );
    });
    return map;
  };

  const handleChangeName = (event) => {
    setGroupName(event.target.value);
  };

  const handleChangeDescription = (event) => {
    setGroupDescription(event.target.value);
  };

  const createNewGroup = async (event) => {
    event.preventDefault();
    const group = {
      name: groupName,
      description: groupDescription,
    };
    const res = await createGroup(group);
    console.log(res);
    if (res.status === 200) {
      alert(`Created group: ${res.data.name}`);
      getUserGroups();
    }
  };

  return (
    <div style={pageStyles}>
      <title>omakase</title>
      <Row>
        <h1 style={bodyStyle}>dashboard</h1>
      </Row>
      <Row>
        <Dropdown style={menu}>
          <Dropdown.Toggle variant="dark" id="dropdown-basic">
            Groups
          </Dropdown.Toggle>
          <Dropdown.Menu>{mapGroups()}</Dropdown.Menu>
        </Dropdown>
      </Row>
      <Row>
        <p style={bodyStyle}>manage all your meeting groups here.</p>
      </Row>

      <Row>
        <h2 style={bodyStyle}>create a new group</h2>
      </Row>
      <Form style={buttonStyle} onSubmit={createNewGroup}>
        <Form.Group controlId="groupName">
          <Form.Label>group name</Form.Label>
          <Form.Control placeholder="My Group!" onChange={handleChangeName} />
        </Form.Group>
        <Form.Group controlId="groupDescription">
          <Form.Label>group description</Form.Label>
          <Form.Control
            placeholder="group, made with omakase!"
            onChange={handleChangeDescription}
          />
        </Form.Group>
        <Button variant="dark" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Dashboard;
