import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaIdCard, FaCheckCircle, FaCloudUploadAlt } from 'react-icons/fa';

const API = 'https://faculty-dues-api-72mv.onrender.com/api';

const DEPARTMENTS = ['Computer Science', 'Information Technology', 'Cyber Security'];
const LEVELS = ['100L', '200L', '300L', '400L', '500L'];
const SESSIONS = ['2023/2024', '2024/2025', '2025/2026'];

const PaymentForm = () => {
  const [form, setForm] = useState({
    regNo: '', email: '', firstName: '', surname: '', middleName: '',
    department: '', level: '', session: ''
  });
  const [passport, setPassport] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-fill if student is logged in
  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    if (!token) return;

    axios.get(`${API}/students/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const s = res.data.student;
      setForm(prev => ({
        ...prev,
        firstName: s.firstName || '',
        surname: s.surname || '',
        middleName: s.middleName || '',
        email: s.email || '',
        regNo: s.regNo || '',
        department: s.department || '',
        level: s.level || ''
      }));
    }).catch(() => {
      // Not logged in or token expired — form stays empty
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePassport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPassport(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passport) { setErrorMsg('Please upload your passport photo.'); return; }
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    formData.append('passport', passport);

    try {
      const res = await axios.post(`${API}/payments/initialize`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      window.location.href = res.data.authorization_url;
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full p-3 border border-gray-200 rounded focus:border-green-600 focus:ring-0 outline-none bg-white';
  const labelClass = 'block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1';

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto border border-gray-100 rounded-xl shadow-sm overflow-hidden">

        <div className="bg-gray-50 border-b border-gray-100 px-8 py-8 text-center">
          <FaIdCard className="text-3xl text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">
            Student <span className="text-green-600 italic">Levy</span>
          </h2>
          <p className="mt-2 text-sm text-gray-500">NACOS UNIPORT — Faculty of Computing</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          {errorMsg && (
            <div className="bg-red-50 text-red-700 border border-red-100 rounded-md p-3 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Matric Number</label>
              <input name="regNo" value={form.regNo} onChange={handleChange} required className={inputClass} placeholder="CSC/XXXX/XXX" />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="student@uniport.edu" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Surname</label>
              <input name="surname" value={form.surname} onChange={handleChange} required className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Middle Name <span className="normal-case font-normal">(optional)</span></label>
            <input name="middleName" value={form.middleName} onChange={handleChange} className={inputClass} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Department</label>
              <select name="department" value={form.department} onChange={handleChange} required className={inputClass}>
                <option value="">Select...</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Level</label>
              <select name="level" value={form.level} onChange={handleChange} required className={inputClass}>
                <option value="">Select...</option>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Session</label>
              <select name="session" value={form.session} onChange={handleChange} required className={inputClass}>
                <option value="">Select...</option>
                {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Passport Photo</label>
            <label className="cursor-pointer block">
              <div className="flex items-center space-x-2 p-3 border border-gray-200 border-dashed rounded hover:bg-gray-50 transition-colors">
                {preview ? <FaCheckCircle className="text-green-600" /> : <FaCloudUploadAlt className="text-gray-300" />}
                <span className="text-sm text-gray-600 font-medium">
                  {preview ? 'Photo selected' : 'Select JPEG or PNG'}
                </span>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handlePassport} />
            </label>
            {preview && <img src={preview} className="mt-2 w-20 h-20 rounded border border-gray-100 object-cover" alt="Preview" />}
          </div>

          <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Annual levy</p>
              <p className="text-3xl font-bold text-gray-900">₦2,000</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`bg-green-600 text-white rounded-full px-8 py-3 font-semibold text-sm hover:bg-green-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Just a moment...' : 'Proceed to checkout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
