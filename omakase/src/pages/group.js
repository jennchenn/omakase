import React, { useState, useEffect } from 'react';
import { Row, CardGroup, Button, Form, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { getGroupInfo } from '../api/group';
import { createGroupMeeting } from '../api/calendar';
import Member from '../components/member';
import '../styles/global.css';

const pageStyles = {
    margin: '0px auto',
    maxWidth: '723px',
};

const bodyStyle = {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '30px',
};

const subtitleStyle = {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '10px'
};

const centeredText = {
    marginLeft: 'auto',
    marginRight: 'auto',
};

const buttonStyle = {
    textAlign: 'centre',
    marginLeft: '13px',
    marginRight: '10px',
};

function Group() {
    const [groupInfo, setGroupInfo] = useState();
    const [eventName, setEventName] = useState();
    const [eventDescription, setEventDescription] = useState();
    const [meetingLength, setMeetingLength] = useState();
    const { id } = useParams();

    useEffect(() => {
        getGroup();
    }, []);

    const getGroup = async () => {
        const groupInfo = await getGroupInfo(id);
        setGroupInfo(groupInfo);
    };

    const renderMembers = () => {
        const members = [];
        for (let member of groupInfo.members) {
            members.push(<Member member={member} />);
        }
        return members;
    };

    const handleChangeName = (event) => {
        setEventName(event.target.value);
    };

    const handleChangeDescription = (event) => {
        setEventDescription(event.target.value);
    };

    const handleChangeLength = (event) => {
        const length = parseInt(event.target.value);
        setMeetingLength(length);
    };

    const createEvent = async (event) => {
        event.preventDefault();
        const meeting = {
            id: id,
            meeting: {
                title: eventName,
                description: eventDescription,
                lengthMinutes: meetingLength
            }
        };
        const res = await createGroupMeeting(meeting);
        if (res.status === 200) {
            alert(`Created meeting: ${res.data.start.dateTime} - ${res.data.end.dateTime}`);
        }
    };

    if (typeof groupInfo === 'undefined')
        return (
            <div style={pageStyles}>
                <title>omakase</title>
                <Row style={bodyStyle}>
                    <h1 >group info</h1>
                </Row>
        Loading...
            </div >
        );

    return (
        <div style={pageStyles}>
            <title>omakase</title>
            <Row>
                <h1 style={bodyStyle}>{groupInfo.name} info</h1>
            </Row>
            <Row>
                <subtitle style={subtitleStyle}>{groupInfo.description}</subtitle>
            </Row>
            <Row ><p style={centeredText}>•</p></Row>
            <Row>
                <h2 style={subtitleStyle}>members</h2>
            </Row>
            <CardGroup>{renderMembers()}</CardGroup>
            <Row><p style={centeredText}>•</p></Row>
            <Row>
                <h2 style={subtitleStyle}>create new event</h2>
            </Row>
            <Form style={buttonStyle} onSubmit={createEvent}>
                <Form.Group controlId="eventName">
                    <Form.Label>event name</Form.Label>
                    <Form.Control placeholder={`${groupInfo.name} Event`} onChange={handleChangeName} />
                </Form.Group>

                <Form.Group controlId="eventDescription">
                    <Form.Label>event description</Form.Label>
                    <Form.Control placeholder="event, made with omakase!" onChange={handleChangeDescription} />
                </Form.Group>

                <Form.Group controlId="meetingLength">
                    <Form.Label>meeting length (minutes)</Form.Label>
                    <Form.Control placeholder="20" onChange={handleChangeLength} />
                </Form.Group>
                <Button variant="dark" type="submit">
                    Submit
                </Button>
            </Form>
            <div style={buttonStyle}>
                <Button style={bodyStyle} variant="dark" href="/dashboard" >← dashboard</Button>
            </div>
        </div>
    );
}

export default Group;
