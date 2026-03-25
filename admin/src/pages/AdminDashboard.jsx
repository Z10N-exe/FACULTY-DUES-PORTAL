import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSignOutAlt, FaDownload, FaSearch, FaFilter, FaFileCsv, FaCheckCircle, FaUniversity } from 'react-icons/fa';

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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900 pb-20">
      {/* Flatter Header */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
             <FaUniversity className="text-sm" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-tight italic">Admin<span className="text-primary italic">Panel</span></h1>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">Faculty Connect</p>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 p-2">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </nav>

      <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full flex-1">
        {/* Simplified Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-gray-200 pb-10">
           <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">Contribution Overview</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Digital Dues Monitoring</p>
           </div>
           
           <div className="flex gap-4 w-full md:w-auto">
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex-1 md:flex-none">
                 <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-bold">Total Students</p>
                 <p className="text-2xl font-black">{filteredPayments.length}</p>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex-1 md:flex-none">
                 <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1 font-bold">Collected Fees</p>
                 <p className="text-2xl font-black">₦{totalAmount.toLocaleString()}</p>
              </div>
           </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
           <div className="lg:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <FaSearch className="text-gray-300 text-xs" />
              </div>
              <input 
                type="text" 
                placeholder="Search by Matric No or Name..." 
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded focus:border-primary outline-none font-medium text-sm text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           
           <select 
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:border-primary outline-none font-medium text-sm text-gray-700 appearance-none cursor-pointer"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Cyber Security">Cyber Security</option>
            <option value="Computer Science">Computer Science</option>
          </select>

           <button 
            onClick={exportCSV}
            className="w-full py-3 bg-white border border-gray-900 text-gray-900 font-bold rounded text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all flex items-center justify-center space-x-2"
           >
              <FaFileCsv className="text-lg" />
              <span>Export CSV</span>
           </button>
        </div>

        {/* Flat Data Table */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                       <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Matric No</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                       <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {filteredPayments.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                         <td className="px-6 py-4">
                            <div className="flex items-center space-x-4">
                                <img src={p.passportUrl} className="h-10 w-10 rounded-full object-cover bg-gray-100 border border-gray-200" alt={p.surname} crossOrigin="anonymous" />
                                <div>
                                  <p className="text-sm font-bold text-gray-900 uppercase italic tracking-tight">{p.surname} {p.firstName}</p>
                                  <p className="text-[9px] text-gray-400 font-medium lowercase tracking-widest">{p.email}</p>
                                </div>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-xs font-bold text-gray-600 font-mono">{p.regNo}</td>
                         <td className="px-6 py-4 text-[10px] font-bold text-primary uppercase tracking-widest">{p.department}</td>
                         <td className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(p.createdAt).toLocaleDateString()}</td>
                         <td className="px-6 py-4 text-right">
                            <span className="text-[9px] font-bold text-green-600 uppercase border border-green-100 bg-green-50 px-3 py-1 rounded-full">
                               Dues Verified
                            </span>
                         </td>
                      </tr>
                    ))}
                    {filteredPayments.length === 0 && !loading && (
                      <tr>
                        <td colSpan="5" className="px-6 py-20 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">
                           No records found
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
