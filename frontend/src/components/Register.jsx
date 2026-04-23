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
    <div className="container mt-5 animate-in">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card-saas mb-5">
            <div className="card-body-saas">
              <h4 className="text-center mb-1">Create an account</h4>
              <p className="text-center text-muted small mb-4">Enter your details below</p>
              
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" required className="form-control" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input type="email" required className="form-control" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input type="password" required className="form-control mb-1" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <div className="text-muted" style={{fontSize: '0.75rem'}}>
                    Must be at least 8 characters long and contain a mix of letters and numbers.
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Register</button>
              </form>
              
              <div className="text-center mt-4">
                <p className="text-muted small mb-0">Already have an account? <Link to="/login">Sign in</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
