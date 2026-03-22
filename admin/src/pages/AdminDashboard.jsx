import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSignOutAlt, FaDownload, FaEye } from 'react-icons/fa';

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

  const exportCSV = () => {
    const csvRows = [];
    const headers = ['Matric No', 'Name', 'Department', 'Email', 'Amount', 'Date Paid', 'Reference'];
    csvRows.push(headers.join(','));

    const itemsToExport = filteredPayments;
    
    for (const row of itemsToExport) {
      const values = [
        row.regNo,
        `${row.firstName} ${row.surname}`,
        row.department,
        row.email,
        row.amount,
        new Date(row.createdAt).toLocaleDateString(),
        row.paymentReference
      ];
      csvRows.push(values.join(','));
    }

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'faculty_dues_payments.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredPayments = payments.filter(p => 
    p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.surname.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.regNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = filteredPayments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center z-10">
        <h1 className="text-xl font-bold uppercase tracking-wider text-primary">Admin Dashboard</h1>
        <button onClick={handleLogout} className="flex items-center text-sm font-bold bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition">
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Payments</h3>
            <p className="text-4xl font-black text-gray-900 mt-2">{filteredPayments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Revenue</h3>
            <p className="text-4xl font-black text-primary mt-2">₦{totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-primary flex items-center justify-center bg-secondary/20 hover:bg-secondary/40 transition">
             <button onClick={exportCSV} className="w-full h-full flex flex-col items-center justify-center text-primary font-bold transition">
               <FaDownload className="text-3xl mb-2" />
               <span className="text-sm uppercase tracking-wide">Export to CSV</span>
             </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <input 
              type="text" 
              placeholder="Search by Name or Matric No..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-1/3 p-3.5 border border-gray-300 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none shadow-sm"
            />
            <select 
               value={departmentFilter}
               onChange={(e) => setDepartmentFilter(e.target.value)}
               className="w-full sm:w-1/4 p-3.5 border border-gray-300 rounded-xl focus:ring-4 focus:ring-primary/20 focus:border-primary bg-white outline-none shadow-sm font-semibold text-gray-700"
            >
              <option value="">All Departments</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-16 text-center">
                 <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                 <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Loading Data...</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                     <th scope="col" className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Student Name</th>
                     <th scope="col" className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Matric No</th>
                     <th scope="col" className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Department</th>
                     <th scope="col" className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Date</th>
                     <th scope="col" className="px-6 py-5 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50 transition">
                       <td className="px-6 py-5 whitespace-nowrap">
                         <div className="flex items-center">
                           <div className="flex-shrink-0 h-12 w-12">
                             {payment.passportUrl ? (
                               <img className="h-12 w-12 rounded-xl object-cover border-2 border-primary/20 shadow-sm" crossOrigin="anonymous" src={payment.passportUrl} alt="" />
                             ) : (
                               <div className="h-12 w-12 rounded-xl bg-gray-200"></div>
                             )}
                           </div>
                           <div className="ml-4">
                             <div className="text-sm font-black text-gray-900">{payment.firstName} {payment.surname}</div>
                             <div className="text-sm font-medium text-gray-500">{payment.email}</div>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-gray-700">{payment.regNo}</td>
                       <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-600">{payment.department}</td>
                       <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</td>
                       <td className="px-6 py-5 whitespace-nowrap">
                         <span className="px-4 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800 uppercase tracking-widest">
                           Paid
                         </span>
                       </td>
                    </tr>
                  ))}
                  {filteredPayments.length === 0 && (
                    <tr>
                       <td colSpan="5" className="px-6 py-16 text-center text-sm font-bold text-gray-400 bg-gray-50/50">
                         No payments found matching your criteria.
                       </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
export default AdminDashboard;
