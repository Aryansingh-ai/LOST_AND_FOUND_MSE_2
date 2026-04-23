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
    <div className="flex items-center justify-center min-h-screen p-4 animate-fade-in-up">
      <div className="w-full max-w-md bg-app-surface border border-app-border rounded-xl p-8 shadow-xl">
        
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-white tracking-tight">Create an account</h3>
          <p className="text-sm text-gray-400 mt-2">Enter your details below</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-app-danger/20 border border-app-danger/50 text-red-300 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input 
              type="text" 
              required 
              className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent transition-colors" 
              placeholder="John Doe" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
            <input 
              type="email" 
              required 
              className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent transition-colors" 
              placeholder="name@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="pb-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-app-accent focus:ring-1 focus:ring-app-accent transition-colors mb-2" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <p className="text-xs text-gray-500">
              Must be at least 8 characters long and contain a mix of letters and numbers.
            </p>
          </div>
          <button 
            type="submit" 
            className="w-full bg-app-accent hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-app-accent hover:text-blue-400 transition-colors">Sign in</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
