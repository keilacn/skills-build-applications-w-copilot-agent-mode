import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Card, Table } from 'react-bootstrap';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState('');

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // Determine the API endpoint based on environment
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        let endpoint;

        if (codespaceName) {
          endpoint = `https://${codespaceName}-8000.app.github.dev/api/workouts/`;
        } else {
          endpoint = 'http://localhost:8000/api/workouts/';
        }

        setApiEndpoint(endpoint);
        console.log('Fetching workouts from:', endpoint);

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw API response:', data);

        // Handle both paginated and plain array responses
        const workoutsData = data.results || data;
        console.log('Processed workouts data:', workoutsData);

        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setError(error.message);
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 mb-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-5 mb-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Header className="bg-info text-white">
              <Card.Title className="mb-0">💪 Workouts</Card.Title>
            </Card.Header>
            <Card.Body>
              <p className="text-muted small">API Endpoint: {apiEndpoint}</p>
              {error && <Alert variant="danger" className="mb-3">Error: {error}</Alert>}
              {workouts.length === 0 ? (
                <Alert variant="info" className="mb-0">No workouts found</Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workouts.map((workout) => (
                        <tr key={workout.id}>
                          <td>{workout.id}</td>
                          <td>{workout.name || 'N/A'}</td>
                          <td>{workout.type || 'N/A'}</td>
                          <td>{workout.description || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Workouts;
