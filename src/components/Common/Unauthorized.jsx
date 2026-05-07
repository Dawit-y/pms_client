import React from 'react';
import { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';

import error from '../../assets/images/error-img.png';

const Unauthorized = () => {
  useEffect(() => {
    document.title = 'Unauthorized';
  }, []);

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-5">
        <Container style={{ marginTop: '100px' }}>
          <Row>
            <Col lg="12">
              <div className="text-center mb-5">
                <h3 className="text-uppercase">Unauthorized</h3>
                <div className="mt-5 text-center">
                  <Link className="btn btn-primary " to="/dashboard">
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md="8" xl="6">
              <div>
                <img src={error} alt="" className="img-fluid" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Unauthorized;
