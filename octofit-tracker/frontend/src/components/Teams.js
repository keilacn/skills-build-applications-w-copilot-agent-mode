import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Card, Table } from 'react-bootstrap';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Determine the API endpoint based on environment
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        let endpoint;

        if (codespaceName) {
          endpoint = `https://${codespaceName}-8000.app.github.dev/api/teams/`;
        } else {
          endpoint = 'http://localhost:8000/api/teams/';
        }

        setApiEndpoint(endpoint);
        console.log('Fetching teams from:', endpoint);

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw API response:', data);

        // Handle both paginated and plain array responses
        const teamsData = data.results || data;
        console.log('Processed teams data:', teamsData);

        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setError(error.message);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
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
            <Card.Header className="bg-warning text-dark">
              <Card.Title className="mb-0">👫 Teams</Card.Title>
            </Card.Header>
            <Card.Body>
              <p className="text-muted small">API Endpoint: {apiEndpoint}</p>
              {error && <Alert variant="danger" className="mb-3">Error: {error}</Alert>}
              {teams.length === 0 ? (
                <Alert variant="info" className="mb-0">No teams found</Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.map((team) => (
                        <tr key={team.id}>
                          <td>{team.id}</td>
                          <td>{team.name || 'N/A'}</td>
                          <td>{team.description || 'N/A'}</td>
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

export default Teams;
