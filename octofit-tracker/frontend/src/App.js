import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './App.css';
import Users from './components/Users';
import Activities from './components/Activities';
import Teams from './components/Teams';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';

function Home() {
  return (
    <Container className="mt-5">
      <h1>Welcome to OctoFit Tracker</h1>
      <p>Select a section from the navigation menu to get started.</p>
      <div className="alert alert-info">
        <strong>API Status:</strong> Connected to Django REST API backend
      </div>
    </Container>
  );
}

function App() {
  return (
    <Router>
      <Navbar bg="dark" expand="lg" sticky="top" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            🐙 OctoFit Tracker
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/users">
                Users
              </Nav.Link>
              <Nav.Link as={Link} to="/activities">
                Activities
              </Nav.Link>
              <Nav.Link as={Link} to="/teams">
                Teams
              </Nav.Link>
              <Nav.Link as={Link} to="/leaderboard">
                Leaderboard
              </Nav.Link>
              <Nav.Link as={Link} to="/workouts">
                Workouts
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </Router>
  );
}

export default App;
