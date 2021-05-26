import React, { useState, useEffect } from 'react';
import { Row, Button, Dropdown } from 'react-bootstrap';

import { listCalendars } from '../api/calendar';
import { getGroups } from '../api/group';
import '../styles/global.css';

const pageStyles = {
    margin: '0px auto',
    maxWidth: '723px',
};

const bodyStyle = {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '30px'
};


function Dashboard() {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        if (groups.length === 0) {
            getUserGroups();
        }
    });

    const getUserGroups = async () => {
        const groups = await getGroups();
        setGroups(groups);
    };

    const mapGroups = () => {
        const map = groups.map((group) => { return <Dropdown.Item href={"/group/" + group._id}>{group.name}</Dropdown.Item>; });
        return map;
    };

    return (
        <div style={pageStyles}>
            <title>omakase</title>
            <Row>
                <h1 style={bodyStyle}>
                    dashboard
                </h1>
            </Row>
            <Dropdown>
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    Groups
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {mapGroups()}
                </Dropdown.Menu>
            </Dropdown>
            <Button style={bodyStyle} onClick={listCalendars}>List Calendars</Button>
            <Button style={bodyStyle} onClick={getGroups}>Get Groups</Button>
        </div>
    );
};

export default Dashboard;
