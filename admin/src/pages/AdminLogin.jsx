import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaUserShield, FaShieldAlt } from 'react-icons/fa';

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
      setError('The credentials provided do not match our administrative records.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full -mr-64 -mt-64 blur-[100px] animate-pulse-soft"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full -ml-32 -mb-32 blur-[80px]"></div>

      <div className="max-w-md w-full z-10">
        <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:shadow-primary/20">
          <div className="bg-primary px-8 py-12 text-center relative border-b-8 border-gray-900/10">
            <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 backdrop-blur-xl shadow-lg border border-white/20">
              <FaShieldAlt className="text-4xl text-white" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest italic">Admin Secure</h2>
            <p className="text-green-100 text-[10px] font-bold uppercase tracking-[0.4em] mt-2 opacity-70">Faculty Management System</p>
          </div>

          <form onSubmit={handleLogin} className="p-10 space-y-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-black uppercase tracking-tight text-center border-2 border-red-100 animate-shake">
                Access Denied: {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="group">
                <label className="block text-gray-400 font-black mb-2 text-[10px] uppercase tracking-[0.3em] group-focus-within:text-primary transition-colors">Credential Email</label>
                <div className="relative">
                   <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800" 
                    placeholder="admin@faculty.edu"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-gray-400 font-black mb-2 text-[10px] uppercase tracking-[0.3em] group-focus-within:text-primary transition-colors">Security Key</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800" 
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-5 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center uppercase tracking-widest italic text-sm ${loading ? 'bg-primary/50' : 'bg-gray-900 hover:bg-black hover:-translate-y-1 active:translate-y-0 active:scale-95 shadow-gray-900/30'}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <FaUserShield className="mr-3 text-lg" /> 
                  Authorize Session
                </>
              )}
            </button>
            
            <div className="text-center">
               <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.5em]">Classified Document Access Only</p>
            </div>
          </form>
        </div>
        
        <p className="text-center mt-12 text-gray-600 font-black text-[10px] uppercase tracking-[0.6em] opacity-50">
          Faculty of Computing & IT &bull; UNIPORT
        </p>
      </div>
    </div>
  );
};
export default AdminLogin;
