import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSignOutAlt, FaDownload, FaSearch, FaFilter, FaFileCsv, FaUserGraduate, FaCalendarAlt, FaCheckCircle, FaUniversity } from 'react-icons/fa';

const AdminDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchPayments = async () => {
      try {
        const url = departmentFilter 
          ? `http://localhost:5000/api/admin/payments?department=${departmentFilter}`
          : 'http://localhost:5000/api/admin/payments';
          
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [departmentFilter, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const filteredPayments = payments.filter(p => 
    p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.surname.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.regNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = filteredPayments.reduce((acc, curr) => acc + curr.amount, 0);

  const exportCSV = () => {
    const csvRows = [];
    const headers = ['Matric No', 'Name', 'Department', 'Email', 'Amount', 'Date Paid', 'Reference'];
    csvRows.push(headers.join(','));
    for (const row of filteredPayments) {
      const values = [
        `"${row.regNo}"`,
        `"${row.firstName} ${row.surname}"`,
        `"${row.department}"`,
        `"${row.email}"`,
        row.amount,
        `"${new Date(row.createdAt).toLocaleDateString()}"`,
        `"${row.paymentReference}"`
      ];
      csvRows.push(values.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faculty_payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white border-b-2 border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group hover:rotate-6 transition-transform">
             <FaUniversity className="text-xl" />
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight italic">Control<span className="text-primary">Center</span></h1>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] leading-none">Administration Panel</p>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 hover:bg-red-500 hover:text-white px-5 py-3 rounded-2xl transition-all duration-300 shadow-sm active:scale-95">
          <FaSignOutAlt />
          <span>Exit Session</span>
        </button>
      </nav>

      <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full flex-1">
        {/* Header Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
           <div className="space-y-1">
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase">Revenue <span className="text-primary italic">Intelligence</span></h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.3em]">Monitoring student dues in real-time</p>
           </div>
           
           <div className="flex gap-4 w-full md:w-auto">
              <div className="bg-black text-white p-5 px-8 rounded-[2rem] shadow-2xl flex-1 md:flex-none relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform">
                    <FaCheckCircle className="text-4xl" />
                 </div>
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">Total Clearances</p>
                 <p className="text-3xl font-black italic tracking-tighter">{filteredPayments.length}</p>
              </div>
              <div className="bg-primary text-white p-5 px-8 rounded-[2rem] shadow-2xl shadow-primary/20 flex-1 md:flex-none relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform">
                    <FaDownload className="text-4xl" />
                 </div>
                 <p className="text-[10px] font-black text-green-100 uppercase tracking-[0.4em] mb-1">Gross Revenue</p>
                 <p className="text-3xl font-black italic tracking-tighter">₦{totalAmount.toLocaleString()}</p>
              </div>
           </div>
        </div>

        {/* Filters and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
           <div className="lg:col-span-2 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <FaSearch className="text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Lookup by Matric No or Name..." 
                className="w-full pl-12 pr-4 py-5 bg-white border-2 border-gray-100 rounded-[1.5rem] focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-bold text-gray-700 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           
           <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <FaFilter className="text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <select 
                className="w-full pl-12 pr-4 py-5 bg-white border-2 border-gray-100 rounded-[1.5rem] focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-bold text-gray-700 appearance-none shadow-sm cursor-pointer"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Computer Science">Computer Science</option>
              </select>
           </div>

           <button 
            onClick={exportCSV}
            className="w-full py-5 bg-white border-2 border-gray-900 text-gray-900 font-black rounded-[1.5rem] flex items-center justify-center space-x-3 hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-sm active:translate-y-1 group"
           >
              <FaFileCsv className="text-xl group-hover:bounce" />
              <span className="uppercase tracking-widest text-xs">Export Records</span>
           </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-gray-50/50">
                       <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Student Credential</th>
                       <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Identification</th>
                       <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Category</th>
                       <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Timeline</th>
                       <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-right">Verification</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      [1,2,3].map(i => (
                        <tr key={i} className="animate-pulse">
                           <td colSpan="5" className="px-8 py-10 bg-gray-50/20"></td>
                        </tr>
                      ))
                    ) : (
                      filteredPayments.map((p) => (
                        <tr key={p._id} className="hover:bg-gray-50/80 transition-colors group">
                           <td className="px-8 py-6 border-transparent">
                              <div className="flex items-center space-x-4">
                                 <div className="relative">
                                    <div className="absolute -inset-1 bg-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <img 
                                        src={p.passportUrl} 
                                        className="h-14 w-14 rounded-xl object-cover bg-gray-100 border-2 border-white shadow-sm relative z-10" 
                                        alt={p.surname} 
                                        crossOrigin="anonymous"
                                    />
                                 </div>
                                 <div>
                                    <p className="text-base font-black text-gray-900 leading-none italic uppercase tracking-tighter">
                                       {p.surname} {p.firstName}
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{p.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex flex-col">
                                 <span className="text-sm font-black text-gray-800 tracking-widest italic">{p.regNo}</span>
                                 <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Clearing Record</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center space-x-2 text-primary">
                                 <FaUserGraduate className="text-xs opacity-50" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">{p.department}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center space-x-2 text-gray-500">
                                 <FaCalendarAlt className="text-xs opacity-30" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">{new Date(p.createdAt).toLocaleDateString()}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <span className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border border-green-100 shadow-sm inline-flex items-center">
                                 <FaCheckCircle className="mr-2" /> Verified
                              </span>
                           </td>
                        </tr>
                      ))
                    )}
                    {!loading && filteredPayments.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-8 py-24 text-center">
                           <div className="max-w-xs mx-auto space-y-3">
                              <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">No clearance data found</p>
                              <p className="text-xs text-gray-300 font-medium">Verify your search query or department filter.</p>
                           </div>
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </main>
      
      <footer className="p-8 text-center bg-white border-t border-gray-100">
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.5em]">&copy; Official Faculty Clearance Ledger &bull; Secure Protocol V2.4</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
