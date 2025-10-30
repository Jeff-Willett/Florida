import React, { useState } from 'react';
import './ActionsList.css';

function ActionsList({ actions, onUpdate, onDelete, onCreate }) {
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    status: 'pending',
    priority: 'medium',
    owner: '',
    due_date: '',
    dependencies: '',
    notes: '',
    on_critical_path: false,
    estimated_hours: ''
  });

  const filteredActions = actions.filter(action => {
    if (filter === 'all') return true;
    if (filter === 'critical') return action.on_critical_path;
    return action.status === filter;
  });

  const handleEdit = (action) => {
    setFormData(action);
    setEditingId(action.id);
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
      owner: '',
      due_date: '',
      dependencies: '',
      notes: '',
      on_critical_path: false,
      estimated_hours: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const quickToggleStatus = (action) => {
    const statusOrder = ['pending', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(action.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    onUpdate(action.id, { ...action, status: nextStatus });
  };

  return (
    <div className="actions-list">
      <div className="list-header">
        <h2>Action Items</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Action
        </button>
      </div>

      <div className="filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({actions.length})
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending ({actions.filter(a => a.status === 'pending').length})
        </button>
        <button
          className={filter === 'in_progress' ? 'active' : ''}
          onClick={() => setFilter('in_progress')}
        >
          In Progress ({actions.filter(a => a.status === 'in_progress').length})
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed ({actions.filter(a => a.status === 'completed').length})
        </button>
        <button
          className={filter === 'critical' ? 'active' : ''}
          onClick={() => setFilter('critical')}
        >
          Critical Path ({actions.filter(a => a.on_critical_path).length})
        </button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingId ? 'Edit Action' : 'New Action'}</h3>
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
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="blocked">Blocked</option>
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
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Estimated Hours</label>
                  <input
                    type="number"
                    value={formData.estimated_hours}
                    onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.on_critical_path}
                    onChange={(e) => setFormData({ ...formData, on_critical_path: e.target.checked })}
                  />
                  On Critical Path
                </label>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
        {filteredActions.map(action => (
          <div key={action.id} className={`action-card ${action.on_critical_path ? 'critical' : ''}`}>
            <div className="card-header">
              <h3>{action.title}</h3>
              <div className="badges">
                {action.on_critical_path && (
                  <span className="critical-badge">Critical Path</span>
                )}
                <span className={`priority-badge ${action.priority}`}>
                  {action.priority}
                </span>
                <span
                  className={`status-badge ${action.status} clickable`}
                  onClick={() => quickToggleStatus(action)}
                  title="Click to cycle status"
                >
                  {action.status}
                </span>
              </div>
            </div>

            {action.category && (
              <div className="card-field">
                <strong>Category:</strong> {action.category}
              </div>
            )}

            {action.owner && (
              <div className="card-field">
                <strong>Owner:</strong> {action.owner}
              </div>
            )}

            {action.due_date && (
              <div className="card-field">
                <strong>Due Date:</strong> {action.due_date}
              </div>
            )}

            {action.estimated_hours && (
              <div className="card-field">
                <strong>Estimated:</strong> {action.estimated_hours} hours
              </div>
            )}

            {action.notes && (
              <div className="card-field">
                <strong>Notes:</strong>
                <p>{action.notes}</p>
              </div>
            )}

            {action.dependencies && (
              <div className="card-field">
                <strong>Dependencies:</strong> {action.dependencies}
              </div>
            )}

            <div className="card-actions">
              <button className="btn-edit" onClick={() => handleEdit(action)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => onDelete(action.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredActions.length === 0 && (
        <div className="empty-state">
          No actions found. Click "Add Action" to create one.
        </div>
      )}
    </div>
  );
}

export default ActionsList;
