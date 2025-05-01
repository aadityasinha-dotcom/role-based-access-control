// src/pages/Login.js
import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/main.css';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { login, isLoggedIn } = useContext(AuthContext);
  
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
      // Use login function from context
      const user = await login(form.email, form.password);
      
      // Check if the user is admin
      if (user.role === 'admin') {
        nav('/admin');
      } else {
        nav('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container page-content">
      <div className="form-container">
        <h2 className="form-title">Login</h2>
        
        {error && <p className="form-error">{error}</p>}
        
        <form onSubmit={onSubmit}>
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
          
          <button className="btn btn-full" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
