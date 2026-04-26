import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSignOutAlt, FaSearch, FaFileCsv, FaUniversity, FaBullhorn, FaTrash } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [tab, setTab] = useState('payments');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Announcements state
  const [announcements, setAnnouncements] = useState([]);
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [annLoading, setAnnLoading] = useState(false);
  const [annError, setAnnError] = useState('');

  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchPayments();
    fetchAnnouncements();
  }, [departmentFilter]);

  const fetchPayments = async () => {
    try {
      const url = departmentFilter
        ? `${API}/admin/payments?department=${departmentFilter}`
        : `${API}/admin/payments`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setPayments(res.data);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem('adminToken'); navigate('/login'); }
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${API}/announcements`);
      setAnnouncements(res.data);
    } catch {}
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    setAnnError('');
    if (!annTitle.trim() || !annBody.trim()) { setAnnError('Title and body are required.'); return; }
    setAnnLoading(true);
    try {
      await axios.post(`${API}/announcements`, { title: annTitle, body: annBody }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnTitle('');
      setAnnBody('');
      fetchAnnouncements();
    } catch (err) {
      setAnnError(err.response?.data?.message || 'Failed to post announcement.');
    } finally {
      setAnnLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Remove this announcement?')) return;
    try {
      await axios.delete(`${API}/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAnnouncements();
    } catch {}
  };

  const handleLogout = () => { localStorage.removeItem('adminToken'); navigate('/login'); };

  const filteredPayments = payments.filter(p =>
    p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.regNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = filteredPayments.reduce((acc, curr) => acc + curr.amount, 0);

  const exportCSV = () => {
    const headers = ['Matric No', 'Name', 'Department', 'Email', 'Amount', 'Date', 'Reference'];
    const rows = filteredPayments.map(p => [
      `"${p.regNo}"`, `"${p.firstName} ${p.surname}"`, `"${p.department}"`,
      `"${p.email}"`, p.amount, `"${new Date(p.createdAt).toLocaleDateString()}"`, `"${p.paymentReference}"`
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900 pb-20">

      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white">
            <FaUniversity className="text-sm" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-tight">Admin <span className="text-green-600">Panel</span></h1>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">NACOS UNIPORT</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-800">
          <FaSignOutAlt /> Sign out
        </button>
      </nav>

      <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full flex-1">

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-200">
          {['payments', 'announcements'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                tab === t ? 'border-green-600 text-green-600' : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Payments Tab ── */}
        {tab === 'payments' && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Contribution records</h2>
                <p className="text-xs text-gray-400 mt-0.5">All verified member contributions</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-white border border-gray-200 px-5 py-4 rounded-lg text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Members</p>
                  <p className="text-xl font-bold">{filteredPayments.length}</p>
                </div>
                <div className="bg-white border border-gray-200 px-5 py-4 rounded-lg text-center">
                  <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Collected</p>
                  <p className="text-xl font-bold">₦{totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              <div className="lg:col-span-2 relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                <input
                  type="text"
                  placeholder="Search by name or matric number..."
                  className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded focus:border-green-600 outline-none text-sm"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:border-green-600 outline-none text-sm"
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
              >
                <option value="">All departments</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Computer Science">Computer Science</option>
              </select>
              <button
                onClick={exportCSV}
                className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded text-sm hover:bg-gray-50 transition-colors"
              >
                <FaFileCsv /> Export records
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {['Student', 'Matric No', 'Department', 'Level', 'Date', 'Status'].map(h => (
                        <th key={h} className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPayments.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={p.passportUrl} className="h-9 w-9 rounded-full object-cover border border-gray-200" alt="" crossOrigin="anonymous" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{p.surname} {p.firstName}</p>
                              <p className="text-[10px] text-gray-400">{p.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-600">{p.regNo}</td>
                        <td className="px-6 py-4 text-xs text-green-600 font-semibold">{p.department}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">{p.level}</td>
                        <td className="px-6 py-4 text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className="text-[9px] font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full">
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredPayments.length === 0 && !loading && (
                      <tr>
                        <td colSpan="6" className="px-6 py-16 text-center text-xs text-gray-300 uppercase tracking-widest">
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Announcements Tab ── */}
        {tab === 'announcements' && (
          <div className="space-y-8 max-w-2xl">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
              <p className="text-xs text-gray-400 mt-0.5">Post updates visible to all students</p>
            </div>

            {/* Post form */}
            <form onSubmit={handlePostAnnouncement} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              {annError && (
                <div className="bg-red-50 text-red-700 border border-red-100 rounded p-3 text-sm">{annError}</div>
              )}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Title</label>
                <input
                  value={annTitle}
                  onChange={e => setAnnTitle(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded focus:border-green-600 outline-none text-sm"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Body</label>
                <textarea
                  value={annBody}
                  onChange={e => setAnnBody(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded focus:border-green-600 outline-none text-sm resize-none"
                  placeholder="Write your announcement here..."
                />
              </div>
              <button
                type="submit"
                disabled={annLoading}
                className={`bg-green-600 text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-green-700 transition-colors ${annLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {annLoading ? 'Posting...' : 'Post announcement'}
              </button>
            </form>

            {/* Announcements list */}
            <div className="space-y-3">
              {announcements.length === 0 ? (
                <p className="text-sm text-gray-400">No announcements yet.</p>
              ) : (
                announcements.map(a => (
                  <div key={a._id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{a.body}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnouncement(a._id)}
                      className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 mt-0.5"
                      title="Remove"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
