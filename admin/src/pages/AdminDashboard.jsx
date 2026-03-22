import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GREEN = '#0A8F3C';

const AdminDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPassport, setSelectedPassport] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const url = departmentFilter
          ? `http://localhost:5000/api/admin/payments?department=${departmentFilter}`
          : 'http://localhost:5000/api/admin/payments';
        const res = await axios.get(url);
        setPayments(res.data);
      } catch (err) {
        console.error('Failed to fetch payments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [departmentFilter]);

  const exportCSV = () => {
    const headers = ['Matric No', 'First Name', 'Surname', 'Level', 'Department', 'Email', 'Amount', 'Date', 'Reference'];
    const rows = filteredPayments.map(p => [
      p.regNo, p.firstName, p.surname, p.level || '', p.department,
      p.email, p.amount, new Date(p.createdAt).toLocaleDateString(), p.paymentReference || ''
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'faculty_dues_payments.csv';
    a.click();
  };

  const filteredPayments = payments.filter(p =>
    (p.firstName + ' ' + p.surname + ' ' + p.regNo).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = filteredPayments.reduce((acc, p) => acc + p.amount, 0);

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'ui-sans-serif, system-ui, sans-serif' },
    nav: { backgroundColor: '#111827', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' },
    navTitle: { fontSize: '18px', fontWeight: '900', letterSpacing: '0.1em', textTransform: 'uppercase', color: GREEN },
    main: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' },
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' },
    cardLabel: { fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' },
    cardValue: { fontSize: '36px', fontWeight: '900', color: '#111827', marginTop: '8px' },
    cardValueGreen: { fontSize: '36px', fontWeight: '900', color: GREEN, marginTop: '8px' },
    exportCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px', border: `2px solid ${GREEN}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    exportBtn: { background: 'none', border: 'none', color: GREEN, fontWeight: '800', fontSize: '14px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
    tableWrap: { backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', overflow: 'hidden' },
    toolbar: { padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '16px', flexWrap: 'wrap' },
    input: { padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', outline: 'none', flex: 1, minWidth: '200px' },
    select: { padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', outline: 'none', minWidth: '180px', backgroundColor: '#fff' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' },
    td: { padding: '16px 20px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' },
    avatarImg: { width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', cursor: 'pointer' },
    avatarPlaceholder: { width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#e5e7eb' },
    nameCell: { display: 'flex', alignItems: 'center', gap: '12px' },
    namePrimary: { fontWeight: '800', color: '#111827', fontSize: '14px' },
    nameSecondary: { color: '#6b7280', fontSize: '13px' },
    badge: { display: 'inline-block', padding: '3px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: '700', backgroundColor: '#dcfce7', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em' },
    emptyRow: { padding: '64px', textAlign: 'center', color: '#9ca3af', fontWeight: '600', fontSize: '14px' },
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
    modalImg: { maxWidth: '90vw', maxHeight: '90vh', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' },
  };

  return (
    <div style={s.page}>
      {selectedPassport && (
        <div style={s.modalOverlay} onClick={() => setSelectedPassport(null)}>
          <img src={selectedPassport} alt="Passport" style={s.modalImg} />
        </div>
      )}

      <nav style={s.nav}>
        <span style={s.navTitle}>Faculty Admin Dashboard</span>
        <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '600' }}>Faculty of Computing, UniPort</span>
      </nav>

      <main style={s.main}>
        <div style={s.statsGrid}>
          <div style={s.card}>
            <div style={s.cardLabel}>Total Payments</div>
            <div style={s.cardValue}>{filteredPayments.length}</div>
          </div>
          <div style={s.card}>
            <div style={s.cardLabel}>Total Revenue</div>
            <div style={s.cardValueGreen}>₦{totalAmount.toLocaleString()}</div>
          </div>
          <div style={s.exportCard} onClick={exportCSV}>
            <button style={s.exportBtn}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export to CSV
            </button>
          </div>
        </div>

        <div style={s.tableWrap}>
          <div style={s.toolbar}>
            <input
              style={s.input}
              type="text"
              placeholder="Search by name or matric no..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <select style={s.select} value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Cyber Security">Cyber Security</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '64px', textAlign: 'center', color: '#6b7280', fontWeight: '600' }}>
                Loading payments...
              </div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Student</th>
                    <th style={s.th}>Matric No</th>
                    <th style={s.th}>Level</th>
                    <th style={s.th}>Department</th>
                    <th style={s.th}>Date</th>
                    <th style={s.th}>Amount</th>
                    <th style={s.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map(p => (
                    <tr key={p._id}
                      style={{ backgroundColor: '#fff' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}>
                      <td style={s.td}>
                        <div style={s.nameCell}>
                          {p.passportUrl
                            ? <img style={s.avatarImg} src={p.passportUrl} alt="passport" onClick={() => setSelectedPassport(p.passportUrl)} title="Click to enlarge" />
                            : <div style={s.avatarPlaceholder} />
                          }
                          <div>
                            <div style={s.namePrimary}>{p.firstName} {p.surname}</div>
                            <div style={s.nameSecondary}>{p.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...s.td, fontWeight: '700' }}>{p.regNo}</td>
                      <td style={s.td}>{p.level || '—'}</td>
                      <td style={s.td}>{p.department}</td>
                      <td style={s.td}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td style={{ ...s.td, fontWeight: '800', color: GREEN }}>₦{p.amount.toLocaleString()}</td>
                      <td style={s.td}><span style={s.badge}>Paid</span></td>
                    </tr>
                  ))}
                  {filteredPayments.length === 0 && (
                    <tr>
                      <td colSpan="7" style={s.emptyRow}>No payments found.</td>
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
