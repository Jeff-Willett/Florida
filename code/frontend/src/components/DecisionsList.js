import React, { useState } from 'react';
import './DecisionsList.css';

function DecisionsList({ decisions, onUpdate, onDelete, onCreate }) {
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    status: 'pending',
    priority: 'medium',
    options: '',
    decision: '',
    rationale: '',
    owner: '',
    date_needed: '',
    dependencies: ''
  });

  const filteredDecisions = decisions.filter(decision => {
    if (filter === 'all') return true;
    return decision.status === filter;
  });

  const handleEdit = (decision) => {
    setFormData(decision);
    setEditingId(decision.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onCreate(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      status: 'pending',
      priority: 'medium',
      options: '',
      decision: '',
      rationale: '',
      owner: '',
      date_needed: '',
      dependencies: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="decisions-list">
      <div className="list-header">
        <h2>Decisions</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Decision
        </button>
      </div>

      <div className="filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({decisions.length})
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending ({decisions.filter(d => d.status === 'pending').length})
        </button>
        <button
          className={filter === 'decided' ? 'active' : ''}
          onClick={() => setFilter('decided')}
        >
          Decided ({decisions.filter(d => d.status === 'decided').length})
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingId ? 'Edit Decision' : 'New Decision'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="decided">Decided</option>
                    <option value="deferred">Deferred</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Owner</label>
                  <input
                    type="text"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Date Needed</label>
                  <input
                    type="date"
                    value={formData.date_needed}
                    onChange={(e) => setFormData({ ...formData, date_needed: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Options</label>
                <textarea
                  value={formData.options}
                  onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Decision</label>
                <textarea
                  value={formData.decision}
                  onChange={(e) => setFormData({ ...formData, decision: e.target.value })}
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Rationale</label>
                <textarea
                  value={formData.rationale}
                  onChange={(e) => setFormData({ ...formData, rationale: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Dependencies</label>
                <input
                  type="text"
                  value={formData.dependencies}
                  onChange={(e) => setFormData({ ...formData, dependencies: e.target.value })}
                  placeholder="Comma-separated list"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-grid">
        {filteredDecisions.map(decision => (
          <div key={decision.id} className="decision-card">
            <div className="card-header">
              <h3>{decision.title}</h3>
              <div className="badges">
                <span className={`priority-badge ${decision.priority}`}>
                  {decision.priority}
                </span>
                <span className={`status-badge ${decision.status}`}>
                  {decision.status}
                </span>
              </div>
            </div>

            {decision.category && (
              <div className="card-field">
                <strong>Category:</strong> {decision.category}
              </div>
            )}

            {decision.owner && (
              <div className="card-field">
                <strong>Owner:</strong> {decision.owner}
              </div>
            )}

            {decision.date_needed && (
              <div className="card-field">
                <strong>Date Needed:</strong> {decision.date_needed}
              </div>
            )}

            {decision.options && (
              <div className="card-field">
                <strong>Options:</strong>
                <p>{decision.options}</p>
              </div>
            )}

            {decision.decision && (
              <div className="card-field decision-field">
                <strong>Decision:</strong>
                <p>{decision.decision}</p>
              </div>
            )}

            {decision.rationale && (
              <div className="card-field">
                <strong>Rationale:</strong>
                <p>{decision.rationale}</p>
              </div>
            )}

            {decision.dependencies && (
              <div className="card-field">
                <strong>Dependencies:</strong> {decision.dependencies}
              </div>
            )}

            <div className="card-actions">
              <button className="btn-edit" onClick={() => handleEdit(decision)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => onDelete(decision.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDecisions.length === 0 && (
        <div className="empty-state">
          No decisions found. Click "Add Decision" to create one.
        </div>
      )}
    </div>
  );
}

export default DecisionsList;
