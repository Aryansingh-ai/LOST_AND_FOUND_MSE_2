import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Duplicate email registration or invalid data');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card glass-card tilt-card mb-5">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4">Create Account</h3>
              {error && <div className="alert alert-danger" style={{background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid #ef4444'}}>{error}</div>}
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" required className="form-control" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input type="email" required className="form-control" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input type="password" required className="form-control" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <div className="form-text mt-2" style={{color: '#94a3b8', fontSize: '0.8rem'}}>
                    <i className="bi bi-info-circle me-1"></i>
                    Password must be at least 8 characters long, and contain a mix of letters and numbers for maximum security.
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 py-2">Start Journey</button>
              </form>
              <div className="text-center mt-4">
                <p className="text-muted">Already have an account? <Link to="/login" className="text-info text-decoration-none">Login here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
