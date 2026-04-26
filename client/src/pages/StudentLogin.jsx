import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/students/login`, form);
      localStorage.setItem('studentToken', res.data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-8 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome <span className="text-green-600 italic">back</span>
          </h2>
          <p className="mt-2 text-sm text-gray-500">Good to have you here. Sign in to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-100 rounded-md p-3 text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded focus:border-green-600 focus:ring-0 outline-none"
              placeholder="student@uniport.edu"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded focus:border-green-600 focus:ring-0 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white rounded-full py-3 font-semibold text-sm hover:bg-green-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
