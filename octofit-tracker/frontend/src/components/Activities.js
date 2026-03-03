import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Determine the API endpoint based on environment
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        let endpoint;

        if (codespaceName) {
          endpoint = `https://${codespaceName}-8000.app.github.dev/api/activities/`;
        } else {
          endpoint = 'http://localhost:8000/api/activities/';
        }

        setApiEndpoint(endpoint);
        console.log('Fetching activities from:', endpoint);

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw API response:', data);

        // Handle both paginated and plain array responses
        const activitiesData = data.results || data;
        console.log('Processed activities data:', activitiesData);

        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError(error.message);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1>Activities</h1>
          <p className="text-muted">API Endpoint: {apiEndpoint}</p>
          {error && <Alert variant="danger">Error: {error}</Alert>}
          {activities.length === 0 ? (
            <Alert variant="info">No activities found</Alert>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.id}</td>
                      <td>{activity.name || 'N/A'}</td>
                      <td>{activity.description || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Activities;
