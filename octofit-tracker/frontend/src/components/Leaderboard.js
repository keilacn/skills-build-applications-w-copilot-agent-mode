import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Card, Table } from 'react-bootstrap';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Determine the API endpoint based on environment
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        let endpoint;

        if (codespaceName) {
          endpoint = `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`;
        } else {
          endpoint = 'http://localhost:8000/api/leaderboard/';
        }

        setApiEndpoint(endpoint);
        console.log('Fetching leaderboard from:', endpoint);

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw API response:', data);

        // Handle both paginated and plain array responses
        const leaderboardData = data.results || data;
        console.log('Processed leaderboard data:', leaderboardData);

        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
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
            <Card.Header className="bg-danger text-white">
              <Card.Title className="mb-0">🏆 Leaderboard</Card.Title>
            </Card.Header>
            <Card.Body>
              <p className="text-muted small">API Endpoint: {apiEndpoint}</p>
              {error && <Alert variant="danger" className="mb-3">Error: {error}</Alert>}
              {leaderboard.length === 0 ? (
                <Alert variant="info" className="mb-0">No leaderboard data found</Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Rank</th>
                        <th>ID</th>
                        <th>User</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, index) => (
                        <tr key={entry.id}>
                          <td><strong>{index + 1}</strong></td>
                          <td>{entry.id}</td>
                          <td>{entry.user || 'N/A'}</td>
                          <td><strong>{entry.score || 'N/A'}</strong></td>
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

export default Leaderboard;
