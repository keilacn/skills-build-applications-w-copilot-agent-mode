import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Card, Table } from 'react-bootstrap';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Determine the API endpoint based on environment
        const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
        let endpoint;

        if (codespaceName) {
          endpoint = `https://${codespaceName}-8000.app.github.dev/api/users/`;
        } else {
          endpoint = 'http://localhost:8000/api/users/';
        }

        setApiEndpoint(endpoint);
        console.log('Fetching users from:', endpoint);

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw API response:', data);

        // Handle both paginated and plain array responses
        const usersData = data.results || data;
        console.log('Processed users data:', usersData);

        setUsers(Array.isArray(usersData) ? usersData : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
            <Card.Header className="bg-primary text-white">
              <Card.Title className="mb-0">👥 Users</Card.Title>
            </Card.Header>
            <Card.Body>
              <p className="text-muted small">API Endpoint: {apiEndpoint}</p>
              {error && <Alert variant="danger" className="mb-3">Error: {error}</Alert>}
              {users.length === 0 ? (
                <Alert variant="info" className="mb-0">No users found</Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.username || 'N/A'}</td>
                          <td>{user.email || 'N/A'}</td>
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

export default Users;
