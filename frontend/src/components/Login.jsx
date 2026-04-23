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
    <div className="container mt-5 animate-in">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card-saas mb-5">
            <div className="card-body-saas">
              <h4 className="text-center mb-1">Welcome back</h4>
              <p className="text-center text-muted small mb-4">Sign in to your account</p>
              
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input type="email" required className="form-control" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input type="password" required className="form-control" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary w-100">Sign in</button>
              </form>
              
              <div className="text-center mt-4">
                <p className="text-muted small mb-0">Don't have an account? <Link to="/register">Register here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
