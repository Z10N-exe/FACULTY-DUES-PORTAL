import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLock } from 'react-icons/fa';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden mt-4">
        <div className="bg-primary text-white py-6 px-4 text-center">
          <FaLock className="text-4xl mx-auto mb-2 text-secondary" />
          <h2 className="text-2xl font-extrabold uppercase tracking-wide">Admin Portal Access</h2>
        </div>
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm text-center font-bold">{error}</div>}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Admin Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
            />
          </div>
          <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition">Login to Dashboard</button>
        </form>
      </div>
    </div>
  );
};
export default AdminLogin;
