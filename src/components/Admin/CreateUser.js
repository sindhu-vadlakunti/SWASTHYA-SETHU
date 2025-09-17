import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import './Admin.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

function CreateUser() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminKey: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.adminKey) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return false;
    }
    if (!formData.email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return false;
    }
    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error messages when user starts typing
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'User created successfully!' });
        setFormData({ email: '', password: '', adminKey: '' });
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Failed to create user'
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage({ 
        type: 'error', 
        text: 'Connection error. Please check if the server is running.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-box">
        <h2>Create New User</h2>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter user email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter user password"
              disabled={loading}
            />
            <small className="help-text">Password must be at least 6 characters long</small>
          </div>

          <div className="form-group">
            <label>Admin Key</label>
            <input
              type="password"
              name="adminKey"
              value={formData.adminKey}
              onChange={handleChange}
              required
              placeholder="Enter admin key"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="admin-button"
            disabled={loading}
          >
            {loading ? 'Creating User...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUser; 