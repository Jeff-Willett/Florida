import React from 'react';
import './Dashboard.css';

function Dashboard({ stats, decisions, actions }) {
  if (!stats) return <div>Loading stats...</div>;

  const criticalPathActions = actions.filter(a => a.on_critical_path);
  const upcomingActions = actions
    .filter(a => a.status !== 'completed' && a.due_date)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  const pendingDecisions = decisions.filter(d => d.status === 'pending');

  return (
    <div className="dashboard">
      <h2>Project Overview</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Decisions</h3>
          <div className="stat-number">{stats.decisions.total}</div>
          <div className="stat-details">
            <span className="pending">{stats.decisions.pending} Pending</span>
            <span className="decided">{stats.decisions.decided} Decided</span>
          </div>
        </div>

        <div className="stat-card">
          <h3>Actions</h3>
          <div className="stat-number">{stats.actions.total}</div>
          <div className="stat-details">
            <span className="pending">{stats.actions.pending} Pending</span>
            <span className="in-progress">{stats.actions.in_progress} In Progress</span>
            <span className="completed">{stats.actions.completed} Completed</span>
          </div>
        </div>

        <div className="stat-card critical">
          <h3>Critical Path</h3>
          <div className="stat-number">{stats.actions.critical_path}</div>
          <div className="stat-details">
            <span>Items on critical path</span>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>Pending Decisions ({pendingDecisions.length})</h3>
          {pendingDecisions.length === 0 ? (
            <p className="empty-state">No pending decisions</p>
          ) : (
            <ul className="decision-list">
              {pendingDecisions.map(decision => (
                <li key={decision.id}>
                  <strong>{decision.title}</strong>
                  <span className={`priority-badge ${decision.priority}`}>
                    {decision.priority}
                  </span>
                  {decision.date_needed && (
                    <span className="date-badge">Due: {decision.date_needed}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-section">
          <h3>Critical Path Actions ({criticalPathActions.length})</h3>
          {criticalPathActions.length === 0 ? (
            <p className="empty-state">No critical path actions</p>
          ) : (
            <ul className="action-list">
              {criticalPathActions.map(action => (
                <li key={action.id}>
                  <strong>{action.title}</strong>
                  <span className={`status-badge ${action.status}`}>
                    {action.status}
                  </span>
                  {action.due_date && (
                    <span className="date-badge">{action.due_date}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-section">
          <h3>Upcoming Actions</h3>
          {upcomingActions.length === 0 ? (
            <p className="empty-state">No upcoming actions</p>
          ) : (
            <ul className="action-list">
              {upcomingActions.map(action => (
                <li key={action.id}>
                  <strong>{action.title}</strong>
                  <span className={`status-badge ${action.status}`}>
                    {action.status}
                  </span>
                  <span className="date-badge">{action.due_date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
