import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://faculty-dues-api-72mv.onrender.com/api';

const DEPARTMENTS = ['Computer Science', 'Information Technology', 'Cyber Security'];
const LEVELS = ['100L', '200L', '300L', '400L', '500L'];

const StudentRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', surname: '', middleName: '',
    email: '', regNo: '', department: '', level: '', password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/students/register`, form);
      localStorage.setItem('studentToken', res.data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (label, name, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required={name !== 'middleName'}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-200 rounded focus:border-green-600 focus:ring-0 outline-none"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-100 px-8 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Join <span className="text-green-600 italic">NACOS</span>
          </h2>
          <p className="mt-2 text-sm text-gray-500">Set up your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-100 rounded-md p-3 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('First Name', 'firstName')}
            {field('Surname', 'surname')}
          </div>

          {field('Middle Name (optional)', 'middleName')}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Email Address', 'email', 'email', 'student@uniport.edu')}
            {field('Matric Number', 'regNo', 'text', 'CSC/XXXX/XXX')}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Department
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-200 rounded focus:border-green-600 focus:ring-0 outline-none bg-white"
              >
                <option value="">Select...</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Level
              </label>
              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-200 rounded focus:border-green-600 focus:ring-0 outline-none bg-white"
              >
                <option value="">Select...</option>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {field('Password', 'password', 'password', '••••••••')}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white rounded-full py-3 font-semibold text-sm hover:bg-green-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Just a moment...' : 'Get started'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default StudentRegister;
