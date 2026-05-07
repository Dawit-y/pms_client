import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { COPYRIGHT_YEAR } from '../../constants/constantTexts';
const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>{COPYRIGHT_YEAR} ©LT ICT SOLUTION PLC</Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">{'John Doe'}</div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
