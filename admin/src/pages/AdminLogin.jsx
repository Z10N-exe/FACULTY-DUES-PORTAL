import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShieldAlt, FaLock } from 'react-icons/fa';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-900 p-8 text-center">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <FaShieldAlt className="text-xl text-white" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Admin Access</h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-2">Faculty Management System</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-xs font-bold text-center border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
                className="w-full p-3 border border-gray-200 rounded focus:border-primary outline-none transition-all font-medium text-gray-800" 
                placeholder="admin@uniport.edu"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Security Key</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
                className="w-full p-3 border border-gray-200 rounded focus:border-primary outline-none transition-all font-medium text-gray-800" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 bg-gray-900 text-white font-bold rounded hover:bg-black transition-all flex items-center justify-center uppercase tracking-widest text-xs ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Authorizing...' : 'LOGIN TO DASHBOARD'}
          </button>
        </form>
        
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
};
export default AdminLogin;
