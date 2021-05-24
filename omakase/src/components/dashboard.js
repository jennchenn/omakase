import * as React from 'react';
import { Row } from 'react-bootstrap';

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

const Splash = () => {
    return (
        <div style={pageStyles}>
            <title>omakase</title>
            <Row>
                <h1 style={bodyStyle}>
                    dashboard
                </h1>
            </Row>
        </div>
    );
};

export default Splash;
