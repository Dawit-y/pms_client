import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaLifeRing } from 'react-icons/fa';
import { Link } from 'react-router';

const NotFound = () => {
  useEffect(() => {
    document.title = '404 Not Found';
  }, []);
  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-5">
        <Container className="mt-5">
          <Row>
            <Col lg="12">
              <div className="text-center mb-5">
                <h1 className="display-2 fw-medium">
                  4<FaLifeRing className="text-primary display-3 spin" />4
                </h1>
                <h4 className="text-uppercase">Sorry, page not found</h4>
                <div className="mt-5 text-center">
                  <Link className="btn btn-primary " to="/">
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default NotFound;
