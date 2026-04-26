import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [payment, setPayment] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        const [meRes, annRes] = await Promise.all([
          axios.get(`${API}/students/me`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API}/announcements`)
        ]);
        setStudent(meRes.data.student);
        setPayment(meRes.data.payment);
        setAnnouncements(annRes.data.slice(0, 3));
      } catch (err) {
        // Token invalid or expired — redirect to login
        localStorage.removeItem('studentToken');
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('studentToken');
    navigate('/login', { replace: true });
  };

  const isPaid = payment?.status === 'paid';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3 text-gray-400">
        <div className="h-8 w-8 rounded-full border-4 border-green-600 border-t-transparent animate-spin" />
        <span className="text-sm font-medium">Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            My <span className="text-green-600 italic">Dashboard</span>
          </h1>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Sign out
          </button>
        </div>

        {/* Profile card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Profile</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Full Name</p>
              <p className="text-sm font-semibold text-gray-900">
                {student.surname} {student.firstName}{student.middleName ? ` ${student.middleName}` : ''}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Matric No</p>
              <p className="text-sm font-semibold text-gray-900">{student.regNo}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Department</p>
              <p className="text-sm font-semibold text-gray-900">{student.department}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Level</p>
              <p className="text-sm font-semibold text-gray-900">{student.level}</p>
            </div>
          </div>
        </div>

        {/* Payment status card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Membership Status</p>
          {isPaid ? (
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full px-4 py-1.5 text-sm font-semibold">
                  ✓ All settled
                </span>
                <span className="text-xs text-gray-400 font-mono">{payment.paymentReference}</span>
              </div>
              <Link
                to={`/receipt/${payment._id}`}
                className="text-sm text-green-600 font-medium hover:underline"
              >
                View receipt
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-4 py-1.5 text-sm font-semibold">
                ⏳ Contribution pending
              </span>
              <Link
                to="/pay"
                className="bg-green-600 text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                Make your contribution
              </Link>
            </div>
          )}
        </div>

        {/* Announcements */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Latest Announcements</p>
          {announcements.length === 0 ? (
            <p className="text-sm text-gray-400">No announcements at the moment.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {announcements.map((a) => (
                <li key={a._id} className="py-3">
                  <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{a.body}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
