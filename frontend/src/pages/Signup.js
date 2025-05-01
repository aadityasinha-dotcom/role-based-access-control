// src/pages/Signup.js
import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { signup } from '../services/auth.service';
import '../styles/main.css';

export default function Signup() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '',
    role: 'user' // Default role is 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  
  // Redirect if already logged in
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }
  
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Pass the selected role to the signup function
      await signup(form.name, form.email, form.password, form.role);
      nav('/');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container page-content">
      <div className="form-container">
        <h2 className="form-title">Sign Up</h2>
        
        {error && <p className="form-error">{error}</p>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input 
              className="form-input"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={onChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <input 
              className="form-input"
              name="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <input 
              className="form-input"
              name="password"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Select Role:</label>
            <select
              className="form-select"
              name="role"
              value={form.role}
              onChange={onChange}
              disabled={loading}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button className="btn btn-full btn-secondary" type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
