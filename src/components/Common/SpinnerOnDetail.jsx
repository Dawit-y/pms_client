import { Container, Spinner } from 'react-bootstrap';

function SpinnerOnDetail() {
  return (
    <div className="page-content">
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '50vh' }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    </div>
  );
}

export default SpinnerOnDetail;
