import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaLifeRing } from 'react-icons/fa';
import { Link } from 'react-router';

const ErrorElement = () => {
  useEffect(() => {
    document.title = '500 Error';
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <div className="account-pages my-5 pt-5">
            <Container>
              <Row>
                <Col lg="12">
                  <div className="text-center mb-5">
                    <h1 className="display-2 fw-medium">
                      5<FaLifeRing className="text-primary display-3 spin" />0
                    </h1>
                    <h4 className="text-uppercase">Internal Server Error</h4>
                    <div className="mt-5 text-center">
                      <Link className="btn btn-primary " to="/dashboard">
                        Back to Dashboard
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ErrorElement;
