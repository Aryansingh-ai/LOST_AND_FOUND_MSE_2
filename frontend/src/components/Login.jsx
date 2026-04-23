import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid login credentials');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card glass-card tilt-card mb-5">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4 text-white">Welcome Back</h3>
              {error && <div className="alert alert-danger" style={{background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid #ef4444'}}>{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input type="email" required className="form-control" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input type="password" required className="form-control" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary w-100 py-2">Login</button>
              </form>
              <div className="text-center mt-4">
                <p className="text-muted">Don't have an account? <Link to="/register" className="text-info text-decoration-none">Register here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
