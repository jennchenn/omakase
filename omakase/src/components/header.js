import React from "react";
// import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import { Container, Row, Col } from "react-bootstrap";
// import { Container, Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import "../styles/global.css";

const header = {
  paddingLeft: "40px",
  paddingRight: "40px",
  paddingTop: "40px",
  marginLeft: "0px",
  marginRight: "0px",
};

const image = {
  width: "40px",
  height: "40px",
  marginLeft: "15px",
};

// const menu = {
//   float: "right",
// };

const col = {
  paddingLeft: "0px",
};

function Header() {
  // const getSize = () => {
  //   return {
  //     width: window.innerWidth,
  //     height: window.innerHeight,
  //   };
  // };
  // const [windowSize, setWindowSize] = useState(getSize());

  // useEffect(() => {
  //   const handleResize = () => setWindowSize(getSize());
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <Container style={header}>
      <Row>
        <Col style={col}>
          <div>
            <a href="/">
              <img className="logo" src={Logo} style={image} alt="Home" />
            </a>
          </div>
        </Col>
        {/* <Col>
          {windowSize.width > 800 && (
            <Row style={menu}>
              <Col md={4} lg={4}>
                <div>about</div>
              </Col>
              <Col md={4} lg={4}>
                <div>projects</div>
              </Col>
              <Col md={4} lg={4}>
                <div>resume</div>
              </Col>
            </Row>
          )}
          {windowSize.width <= 800 && (
            <DropdownButton
              variant="outline-dark"
              style={menu}
              menuAlign="right"
              title=""
              id="dropdown-menu-align-right"
            >
              <Dropdown.Item eventKey="1">about</Dropdown.Item>
              <Dropdown.Item eventKey="2">projects</Dropdown.Item>
              <Dropdown.Item eventKey="3">resume</Dropdown.Item>
            </DropdownButton>
          )}
        </Col> */}
      </Row>
    </Container>
  );
}

export default Header;
