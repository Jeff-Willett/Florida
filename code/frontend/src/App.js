import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import DecisionsList from './components/DecisionsList';
import ActionsList from './components/ActionsList';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [decisions, setDecisions] = useState([]);
  const [actions, setActions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [decisionsRes, actionsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/decisions`),
        fetch(`${API_URL}/actions`),
        fetch(`${API_URL}/stats`)
      ]);

      if (!decisionsRes.ok || !actionsRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch data from backend');
      }

      const decisionsData = await decisionsRes.json();
      const actionsData = await actionsRes.json();
      const statsData = await statsRes.json();

      setDecisions(decisionsData);
      setActions(actionsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Cannot connect to backend server. Make sure the backend is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDecision = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/decisions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating decision:', error);
    }
  };

  const handleUpdateAction = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/actions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating action:', error);
    }
  };

  const handleDeleteDecision = async (id) => {
    if (window.confirm('Are you sure you want to delete this decision?')) {
      try {
        const response = await fetch(`${API_URL}/decisions/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting decision:', error);
      }
    }
  };

  const handleDeleteAction = async (id) => {
    if (window.confirm('Are you sure you want to delete this action?')) {
      try {
        const response = await fetch(`${API_URL}/actions/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting action:', error);
      }
    }
  };

  const handleCreateDecision = async (newDecision) => {
    try {
      const response = await fetch(`${API_URL}/decisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDecision)
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error creating decision:', error);
    }
  };

  const handleCreateAction = async (newAction) => {
    try {
      const response = await fetch(`${API_URL}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAction)
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error creating action:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h1>Connection Error</h1>
        <p>{error}</p>
        <button className="btn-primary" onClick={fetchData}>Retry</button>
        <div style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '600px', margin: '2rem auto' }}>
          <h3>Troubleshooting:</h3>
          <ol>
            <li>Make sure you ran <code>./launch.sh</code> from the Florida directory</li>
            <li>Check the terminal for any error messages</li>
            <li>The backend should be running on <code>http://localhost:3001</code></li>
            <li>Try opening <a href="http://localhost:3001/health" target="_blank">http://localhost:3001/health</a> to test the backend</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Florida Project Tracker</h1>
        <nav className="tabs">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={activeTab === 'decisions' ? 'active' : ''}
            onClick={() => setActiveTab('decisions')}
          >
            Decisions
          </button>
          <button
            className={activeTab === 'actions' ? 'active' : ''}
            onClick={() => setActiveTab('actions')}
          >
            Actions
          </button>
        </nav>
      </header>

      <main className="app-content">
        {activeTab === 'dashboard' && <Dashboard stats={stats} decisions={decisions} actions={actions} />}
        {activeTab === 'decisions' && (
          <DecisionsList
            decisions={decisions}
            onUpdate={handleUpdateDecision}
            onDelete={handleDeleteDecision}
            onCreate={handleCreateDecision}
          />
        )}
        {activeTab === 'actions' && (
          <ActionsList
            actions={actions}
            onUpdate={handleUpdateAction}
            onDelete={handleDeleteAction}
            onCreate={handleCreateAction}
          />
        )}
      </main>
    </div>
  );
}

export default App;
