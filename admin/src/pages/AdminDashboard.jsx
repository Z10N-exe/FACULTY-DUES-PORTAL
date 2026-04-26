import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSignOutAlt, FaSearch, FaFileCsv, FaUniversity, FaBullhorn, FaTrash } from 'react-icons/fa';

const API = 'https://faculty-dues-api-72mv.onrender.com/api';

const AdminDashboard = () => {
  const [tab, setTab] = useState('payments');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Users state
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);

  // Announcements state
  const [announcements, setAnnouncements] = useState([]);
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [annLoading, setAnnLoading] = useState(false);
  const [annError, setAnnError] = useState('');

  // Blog state
  const [blogs, setBlogs] = useState([]);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogBody, setBlogBody] = useState('');
  const [blogCategory, setBlogCategory] = useState('General');
  const [blogTags, setBlogTags] = useState('');
  const [blogCoverImage, setBlogCoverImage] = useState(null);
  const [blogImages, setBlogImages] = useState([]);
  const [blogImagePreviews, setBlogImagePreviews] = useState([]);
  const [blogSocial, setBlogSocial] = useState({ twitter: '', linkedin: '', instagram: '', facebook: '' });
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchPayments();
    fetchAnnouncements();
    fetchUsers();
    fetchBlogs();
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

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await axios.get(`${API}/admin/students`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch {}
    finally { setUsersLoading(false); }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API}/blog`);
      setBlogs(res.data);
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

  const handlePostBlog = async (e) => {
    e.preventDefault();
    setBlogError('');
    if (!blogTitle.trim() || !blogBody.trim()) { setBlogError('Title and body are required.'); return; }
    setBlogLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', blogTitle);
      formData.append('body', blogBody);
      formData.append('category', blogCategory);
      formData.append('tags', JSON.stringify(blogTags ? blogTags.split(',').map(t => t.trim()) : []));
      formData.append('socialLinks', JSON.stringify(blogSocial));
      if (blogCoverImage) formData.append('coverImage', blogCoverImage);
      blogImages.forEach(img => formData.append('images', img));

      await axios.post(`${API}/blog`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setBlogTitle('');
      setBlogBody('');
      setBlogCategory('General');
      setBlogTags('');
      setBlogCoverImage(null);
      setBlogImages([]);
      setBlogImagePreviews([]);
      setBlogSocial({ twitter: '', linkedin: '', instagram: '', facebook: '' });
      fetchBlogs();
    } catch (err) {
      setBlogError(err.response?.data?.message || 'Failed to post blog.');
    } finally {
      setBlogLoading(false);
    }
  };

  const handleBlogCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlogCoverImage(file);
    }
  };

  const handleBlogImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setBlogImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setBlogImagePreviews(previews);
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axios.delete(`${API}/blog/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchBlogs();
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900 pb-10 sm:pb-16 md:pb-20">

      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white flex-shrink-0">
            <FaUniversity className="text-sm" />
          </div>
          <div className="hidden sm:block min-w-0">
            <h1 className="text-xs sm:text-sm font-bold uppercase tracking-tight truncate">Admin <span className="text-green-600">Panel</span></h1>
            <p className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase tracking-widest truncate">NACOS UNIPORT</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium text-gray-500 hover:text-gray-800 px-2 sm:px-3 py-2 rounded hover:bg-gray-50 transition-colors flex-shrink-0">
          <FaSignOutAlt className="text-sm" /> <span className="hidden sm:inline">Sign out</span>
        </button>
      </nav>

      <main className="p-3 sm:p-4 md:p-6 lg:p-10 max-w-7xl mx-auto w-full flex-1">

        {/* Tabs */}
        <div className="flex gap-1 mb-6 md:mb-8 border-b border-gray-200 overflow-x-auto -mx-3 sm:-mx-4 md:mx-0 px-3 sm:px-4 md:px-0">
          {['payments', 'users', 'announcements', 'blog'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-2 sm:px-3 md:px-5 py-2 md:py-2.5 text-[11px] sm:text-xs md:text-sm font-semibold capitalize transition-colors border-b-2 -mb-px whitespace-nowrap ${
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 mb-6 md:mb-8">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Contribution records</h2>
                <p className="text-xs text-gray-400 mt-0.5">All verified member contributions</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full">
                <div className="bg-white border border-gray-200 px-3 md:px-5 py-3 md:py-4 rounded-lg text-center flex-1">
                  <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest">Members</p>
                  <p className="text-lg md:text-xl font-bold mt-1">{filteredPayments.length}</p>
                </div>
                <div className="bg-white border border-gray-200 px-3 md:px-5 py-3 md:py-4 rounded-lg text-center flex-1">
                  <p className="text-[8px] md:text-[9px] font-bold text-green-600 uppercase tracking-widest">Collected</p>
                  <p className="text-lg md:text-xl font-bold mt-1">₦{totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
              <div className="sm:col-span-2 relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                <input
                  type="text"
                  placeholder="Search by name or matric..."
                  className="w-full pl-9 pr-4 py-2 md:py-3 bg-white border border-gray-200 rounded focus:border-green-600 outline-none text-xs md:text-sm"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-200 rounded focus:border-green-600 outline-none text-xs md:text-sm"
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
                className="flex items-center justify-center gap-1 md:gap-2 py-2 md:py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded text-xs md:text-sm hover:bg-gray-50 transition-colors"
              >
                <FaFileCsv className="text-sm" /> <span className="hidden sm:inline">Export</span>
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {['Student', 'Matric No', 'Department', 'Level', 'Date', 'Status'].map(h => (
                        <th key={h} className="px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPayments.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50/50">
                        <td className="px-3 md:px-6 py-2 md:py-4">
                          <div className="flex items-center gap-2">
                            <img src={p.passportUrl} className="h-8 w-8 md:h-9 md:w-9 rounded-full object-cover border border-gray-200 flex-shrink-0" alt="" crossOrigin="anonymous" />
                            <div className="min-w-0">
                              <p className="text-xs md:text-sm font-semibold text-gray-900 truncate">{p.surname} {p.firstName}</p>
                              <p className="text-[9px] md:text-[10px] text-gray-400 truncate">{p.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-xs font-mono text-gray-600">{p.regNo}</td>
                        <td className="px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-xs text-green-600 font-semibold">{p.department}</td>
                        <td className="px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-xs text-gray-500">{p.level}</td>
                        <td className="px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="px-3 md:px-6 py-2 md:py-4">
                          <span className="text-[8px] md:text-[9px] font-bold text-green-600 bg-green-50 border border-green-100 px-2 md:px-3 py-0.5 md:py-1 rounded-full whitespace-nowrap">
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredPayments.length === 0 && !loading && (
                      <tr>
                        <td colSpan="6" className="px-3 md:px-6 py-8 md:py-16 text-center text-xs text-gray-300 uppercase tracking-widest">
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filteredPayments.length === 0 && !loading ? (
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center text-xs text-gray-300 uppercase tracking-widest">
                  No records found
                </div>
              ) : (
                filteredPayments.map(p => (
                  <div key={p._id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={p.passportUrl} className="h-10 w-10 rounded-full object-cover border border-gray-200 flex-shrink-0" alt="" crossOrigin="anonymous" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{p.surname} {p.firstName}</p>
                        <p className="text-xs text-gray-400 truncate">{p.email}</p>
                      </div>
                      <span className="text-[8px] font-bold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                        Verified
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Matric</p>
                        <p className="font-mono text-gray-600 mt-0.5">{p.regNo}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Level</p>
                        <p className="text-gray-500 mt-0.5">{p.level}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Department</p>
                        <p className="text-green-600 font-semibold mt-0.5">{p.department}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
                        <p className="text-gray-500 mt-0.5">{new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* ── Users Tab ── */}
        {tab === 'users' && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 mb-6 md:mb-8">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Registered users</h2>
                <p className="text-xs text-gray-400 mt-0.5">All students with accounts on the portal</p>
              </div>
              <div className="bg-white border border-gray-200 px-3 md:px-5 py-3 md:py-4 rounded-lg text-center">
                <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                <p className="text-lg md:text-xl font-bold">{users.length}</p>
              </div>
            </div>

            <div className="relative mb-4 md:mb-6 max-w-full md:max-w-md">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
              <input
                type="text"
                placeholder="Search by name, email..."
                className="w-full pl-9 pr-4 py-2 md:py-3 bg-white border border-gray-200 rounded focus:border-green-600 outline-none text-xs md:text-sm"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
              />
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {['Name', 'Matric No', 'Email', 'Department', 'Level', 'Joined'].map(h => (
                        <th key={h} className="px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users
                      .filter(u =>
                        `${u.firstName} ${u.surname}`.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.regNo.toLowerCase().includes(userSearch.toLowerCase())
                      )
                      .map(u => (
                        <tr key={u._id} className="hover:bg-gray-50/50">
                          <td className="px-3 md:px-6 py-2 md:py-4">
                            <p className="text-xs md:text-sm font-semibold text-gray-900 truncate">{u.surname} {u.firstName}</p>
                            {u.middleName && <p className="text-[9px] md:text-[10px] text-gray-400 truncate">{u.middleName}</p>}
                          </td>
                          <td className="px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-xs font-mono text-gray-600">{u.regNo}</td>
                          <td className="px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-xs text-gray-500 truncate">{u.email}</td>
                          <td className="px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-xs text-green-600 font-semibold">{u.department}</td>
                          <td className="px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-xs text-gray-500">{u.level}</td>
                          <td className="px-3 md:px-6 py-2 md:py-4 text-[9px] md:text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    {!usersLoading && users.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-3 md:px-6 py-8 md:py-16 text-center text-xs text-gray-300 uppercase tracking-widest">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {!usersLoading && users.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center text-xs text-gray-300 uppercase tracking-widest">
                  No users found
                </div>
              ) : (
                users
                  .filter(u =>
                    `${u.firstName} ${u.surname}`.toLowerCase().includes(userSearch.toLowerCase()) ||
                    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                    u.regNo.toLowerCase().includes(userSearch.toLowerCase())
                  )
                  .map(u => (
                    <div key={u._id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{u.surname} {u.firstName}</p>
                        {u.middleName && <p className="text-xs text-gray-400">{u.middleName}</p>}
                        <p className="text-xs text-gray-500 mt-1">{u.email}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Matric</p>
                          <p className="font-mono text-gray-600 mt-0.5">{u.regNo}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Level</p>
                          <p className="text-gray-500 mt-0.5">{u.level}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded col-span-2">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Department</p>
                          <p className="text-green-600 font-semibold mt-0.5">{u.department}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded col-span-2">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Joined</p>
                          <p className="text-gray-500 mt-0.5">{new Date(u.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </>
        )}

        {/* ── Announcements Tab ── */}
        {tab === 'announcements' && (
          <div className="space-y-6 md:space-y-8 max-w-2xl">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Announcements</h2>
              <p className="text-xs text-gray-400 mt-0.5">Post updates visible to all students</p>
            </div>

            <form onSubmit={handlePostAnnouncement} className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 space-y-3 md:space-y-4">
              {annError && (
                <div className="bg-red-50 text-red-700 border border-red-100 rounded p-2 md:p-3 text-xs md:text-sm">{annError}</div>
              )}
              <div>
                <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Title</label>
                <input
                  value={annTitle}
                  onChange={e => setAnnTitle(e.target.value)}
                  className="w-full p-2 md:p-3 border border-gray-200 rounded focus:border-green-600 outline-none text-xs md:text-sm"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Body</label>
                <textarea
                  value={annBody}
                  onChange={e => setAnnBody(e.target.value)}
                  rows={4}
                  className="w-full p-2 md:p-3 border border-gray-200 rounded focus:border-green-600 outline-none text-xs md:text-sm resize-none"
                  placeholder="Write your announcement here..."
                />
              </div>
              <button
                type="submit"
                disabled={annLoading}
                className={`w-full md:w-auto bg-green-600 text-white rounded-full px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-semibold hover:bg-green-700 transition-colors ${annLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {annLoading ? 'Posting...' : 'Post announcement'}
              </button>
            </form>

            <div className="space-y-2 md:space-y-3">
              {announcements.length === 0 ? (
                <p className="text-xs md:text-sm text-gray-400">No announcements yet.</p>
              ) : (
                announcements.map(a => (
                  <div key={a._id} className="bg-white border border-gray-200 rounded-xl p-3 md:p-5 flex items-start justify-between gap-3 md:gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-semibold text-gray-900">{a.title}</p>
                      <p className="text-[9px] md:text-xs text-gray-500 mt-0.5 line-clamp-2">{a.body}</p>
                      <p className="text-[9px] md:text-[10px] text-gray-400 mt-1">
                        {new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteAnnouncement(a._id)}
                      className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 mt-0.5 p-1"
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

        {/* ── Blog Tab ── */}
        {tab === 'blog' && (
          <div className="space-y-6 md:space-y-8 max-w-2xl">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Blog Posts</h2>
              <p className="text-xs text-gray-400 mt-0.5">Create and manage blog articles</p>
            </div>

            <form onSubmit={handlePostBlog} className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 space-y-3 md:space-y-4">
              {blogError && (
                <div className="bg-red-50 text-red-700 border border-red-100 rounded p-2 md:p-3 text-xs md:text-sm">{blogError}</div>
              )}
              <div>
                <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Title</label>
                <input
                  value={blogTitle}
                  onChange={e => setBlogTitle(e.target.value)}
                  className="w-full p-2 md:p-3 border border-gray-200 rounded focus:border-green-600 outline-none text-xs md:text-sm"
                  placeholder="Blog post title"
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Category</label>
                <select
                  value={blogCategory}
                  onChange={e => setBlogCategory(e.target.value)}
                  className="w-full p-2 md:p-3 border border-gray-200 rounded focus:border-green-600 outline-none text-xs md:text-sm"
                >
                  <option value="General">General</option>
                  <option value="News">News</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Event">Event</option>
                </select>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBlogCoverImageChange}
                  className="w-full p-1 md:p-2 border border-gray-200 rounded text-xs md:text-sm"
                />
                {blogCoverImage && <p className="text-[9px] md:text-xs text-green-600 mt-1">✓ {blogCoverImage.name}</p>}
              </div>

              <div>
                <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Content (HTML supported)</label>
                <textarea
                  value={blogBody}
                  onChange={e => setBlogBody(e.target.value)}
                  rows={6}
                  className="w-full p-2 md:p-3 border border-gray-200 rounded focus:border-green-600 outline-none text-xs md:text-sm resize-none font-mono"
                  placeholder="Write your blog post here..."
                />
                <p className="text-[9px] md:text-[10px] text-gray-400 mt-1">💡 Tip: Use HTML for rich formatting</p>
              </div>

              {/* Content Images Upload */}
              <div>
                <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Upload Images (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleBlogImagesChange}
                  className="w-full p-1 md:p-2 border border-gray-200 rounded text-xs md:text-sm"
                />
                {blogImages.length > 0 && <p className="text-[9px] md:text-xs text-green-600 mt-1">✓ {blogImages.length} image(s) selected</p>}
                {blogImagePreviews.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {blogImagePreviews.map((preview, idx) => (
                      <img key={idx} src={preview} alt="preview" className="h-12 w-12 md:h-16 md:w-16 rounded border border-gray-200 object-cover" />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tags (comma-separated)</label>
                <input
                  value={blogTags}
                  onChange={e => setBlogTags(e.target.value)}
                  className="w-full p-2 md:p-3 border border-gray-200 rounded focus:border-green-600 outline-none text-xs md:text-sm"
                  placeholder="e.g. tech, news, update"
                />
              </div>

              {/* Social Links */}
              <div className="border-t border-gray-200 pt-3 md:pt-4">
                <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-3">Social Links (optional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {['twitter', 'linkedin', 'instagram', 'facebook'].map(platform => (
                    <div key={platform}>
                      <label className="block text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 capitalize">{platform}</label>
                      <input
                        value={blogSocial[platform]}
                        onChange={e => setBlogSocial({ ...blogSocial, [platform]: e.target.value })}
                        className="w-full p-1.5 md:p-2 border border-gray-200 rounded focus:border-green-600 outline-none text-xs md:text-sm"
                        placeholder={`https://${platform}.com/...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={blogLoading}
                className={`w-full md:w-auto bg-green-600 text-white rounded-full px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-semibold hover:bg-green-700 transition-colors ${blogLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {blogLoading ? 'Publishing...' : 'Publish post'}
              </button>
            </form>

            <div className="space-y-2 md:space-y-3">
              {blogs.length === 0 ? (
                <p className="text-xs md:text-sm text-gray-400">No blog posts yet.</p>
              ) : (
                blogs.map(b => (
                  <div key={b._id} className="bg-white border border-gray-200 rounded-xl p-3 md:p-5 flex items-start justify-between gap-3 md:gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 md:gap-2 mb-1 flex-wrap">
                        <span className="text-[8px] md:text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">{b.category}</span>
                      </div>
                      <p className="text-xs md:text-sm font-semibold text-gray-900">{b.title}</p>
                      <p className="text-[9px] md:text-xs text-gray-500 mt-0.5 line-clamp-2">{b.body.replace(/<[^>]*>/g, '')}</p>
                      <p className="text-[9px] md:text-[10px] text-gray-400 mt-1">
                        {new Date(b.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteBlog(b._id)}
                      className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 mt-0.5 p-1"
                      title="Delete"
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
