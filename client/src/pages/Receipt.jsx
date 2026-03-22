import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { FaCheckCircle, FaDownload, FaArrowLeft } from 'react-icons/fa';

const Receipt = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchOrVerify = async () => {
      try {
        if (reference) {
          const res = await axios.get(`http://localhost:5000/api/payments/verify?reference=${reference}`);
          setPayment(res.data.payment);
          // Clean up URL so refresh doesn't trigger verification again
          window.history.replaceState(null, '', `/receipt/${res.data.payment._id}`);
        } else if (id) {
          const res = await axios.get(`http://localhost:5000/api/payments/receipt/${id}`);
          setPayment(res.data);
        } else {
          setErrorMsg("Invalid receipt parameters.");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to fetch payment details. It might not be verified yet.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrVerify();
  }, [id, reference]);

  const downloadPDF = () => {
    const element = document.getElementById('receipt-card');
    const opt = {
      margin: 0,
      filename: `Faculty_Receipt_${payment.regNo.replace(/\//g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-primary font-bold text-xl tracking-wider animate-pulse">Processing Payment...</p>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-4 border-red-500">
          <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{errorMsg}</p>
          <Link to="/" className="inline-flex items-center text-primary font-bold hover:underline">
            <FaArrowLeft className="mr-2" /> Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 flex flex-col items-center">
      <Link to="/" className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto bg-white/80 backdrop-blur-md sm:bg-transparent rounded-full border border-gray-100 sm:border-0 shadow-sm sm:shadow-none text-gray-500 hover:text-[#0A8F3C] transition-all group">
        <FaArrowLeft className="sm:mr-2 group-hover:-translate-x-1 transition-transform" /> 
        <span className="hidden sm:inline font-semibold">Back Home</span>
      </Link>
      
      <div id="receipt-card" className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden mb-8 transform transition-all border border-gray-100">
        <div className="bg-[#0A8F3C] p-8 sm:p-10 text-center text-white relative">
          <div className="relative z-10">
            <FaCheckCircle className="text-5xl sm:text-6xl mx-auto mb-4 text-white/90 drop-shadow-lg" />
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest leading-tight">Payment<br/>Successful</h2>
            <p className="opacity-80 mt-2 text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">Official Faculty Receipt</p>
          </div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-5 rounded-full"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-black opacity-5 rounded-full"></div>
          </div>
        </div>
        
        <div className="p-8 sm:p-10">
          <div className="flex justify-between items-end border-b-2 border-gray-100 pb-6 mb-8">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Date Paid</p>
              <p className="text-gray-900 font-bold">{new Date(payment.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Receipt ID</p>
              <p className="text-gray-800 font-bold bg-gray-100 px-3 py-1 rounded-md text-sm font-mono">{payment.paymentReference.slice(0, 12)}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-10 text-center sm:text-left">
            {payment.passportUrl ? (
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-[#0A8F3C]/20 rounded-[2rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <img 
                  src={payment.passportUrl} 
                  alt="Student Passport" 
                  crossOrigin="anonymous"
                  className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] object-cover border-4 border-white shadow-xl"
                  style={{ width: '112px', height: '112px', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">No Passport</div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight truncate">{payment.firstName} {payment.surname}</h3>
              <p className="text-lg sm:text-xl font-black text-[#0A8F3C] mt-1 tracking-tight">{payment.regNo}</p>
              <p className="text-gray-400 font-bold uppercase text-[10px] sm:text-xs mt-2 tracking-widest">{payment.department}</p>
            </div>
          </div>

          <div className="bg-secondary/30 rounded-2xl p-6 border border-primary/10 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-semibold">Payment Purpose</span>
              <span className="text-gray-900 font-bold">Session Dues</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-semibold">Status</span>
              <span className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">Verified</span>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-gray-100 pt-6">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Amount Paid</span>
            <span className="text-4xl font-black text-gray-900">₦2,000</span>
          </div>
        </div>
      </div>

      <button 
        onClick={downloadPDF}
        className="flex items-center space-x-3 bg-gray-900 hover:bg-black text-white py-4 px-10 rounded-full font-bold text-lg shadow-xl shadow-gray-900/20 transition-all hover:-translate-y-1 active:translate-y-0"
      >
        <FaDownload />
        <span>Download Receipt</span>
      </button>
    </div>
  );
};

export default Receipt;
