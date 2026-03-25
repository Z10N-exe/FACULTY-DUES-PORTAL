import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { FaDownload, FaCheckCircle, FaPrint, FaArrowLeft, FaUniversity, FaUserGraduate } from 'react-icons/fa';

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
          window.history.replaceState(null, '', `/receipt/${res.data.payment._id}`);
        } else if (id) {
          const res = await axios.get(`http://localhost:5000/api/payments/receipt/${id}`);
          setPayment(res.data);
        }
      } catch (err) {
        setErrorMsg('Verification unsuccessful. Please try again or contact support.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrVerify();
  }, [id, reference]);

  const downloadPDF = () => {
    const element = document.getElementById('receipt-download-area');
    const opt = {
      margin: 0.2,
      filename: `Receipt_${payment.regNo.replace(/\//g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 3, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    const button = document.getElementById('download-btn');
    button.style.display = 'none';
    html2pdf().set(opt).from(element).save().then(() => {
      button.style.display = 'flex';
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-20 h-20 relative">
        <div className="absolute inset-0 border-8 border-secondary rounded-full"></div>
        <div className="absolute inset-0 border-8 border-primary rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h2 className="mt-8 text-2xl font-black text-gray-900 animate-pulse">Confirming Transaction...</h2>
    </div>
  );

  if (!payment) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl text-center border-b-8 border-red-500">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">⚠️</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2 italic uppercase tracking-tighter">Session Expired</h2>
        <p className="text-gray-500 mb-8 font-medium">{errorMsg || 'We could not authenticate this transaction.'}</p>
        <Link to="/" className="inline-block py-4 px-8 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-lg active:translate-y-1">BACK TO HOME</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4 shadow-inner relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/4 left-1/4 text-9xl font-black text-primary rotate-12 select-none">PAID</div>
        <div className="absolute bottom-1/4 right-1/4 text-9xl font-black text-primary -rotate-12 select-none uppercase">Verified</div>
      </div>

      <div className="max-w-2xl w-full z-10 mb-8 flex justify-between items-center sm:px-6">
        <Link to="/" className="flex items-center text-sm font-black text-gray-500 hover:text-primary transition-colors tracking-widest uppercase">
          <FaArrowLeft className="mr-2" /> Home
        </Link>
        <p className="text-[10px] font-black text-primary bg-secondary/50 px-3 py-1 rounded-full uppercase tracking-[0.2em]">Official E-Document</p>
      </div>

      <div id="receipt-download-area" className="w-full max-w-2xl bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden border border-gray-100 relative">
        {/* Top Branding Bar */}
        <div className="h-4 bg-primary"></div>
        
        <div className="p-8 sm:p-12">
          {/* Header Branding */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8 mb-12 border-b border-gray-100 pb-10">
            <div className="flex items-center space-x-4 group">
               <img src="/UNIPORT-LOGO-PNG.png" alt="Logo" className="h-16 w-auto grayscale transition group-hover:grayscale-0" />
               <div className="text-center sm:text-left">
                  <h4 className="font-black text-gray-900 leading-tight uppercase tracking-tighter italic">University of <br/> Port Harcourt</h4>
                  <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mt-1">Faculty of Computing</p>
               </div>
            </div>
            <div className="text-center sm:text-right">
                <div className="bg-primary text-white p-4 rounded-3xl inline-block mb-3 shadow-lg shadow-primary/20">
                   <FaCheckCircle className="text-3xl" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none uppercase italic">Official<br/>Receipt</h3>
            </div>
          </div>

          {/* Student Info Group */}
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-12">
            <div className="relative group">
              <div className="absolute -inset-2 bg-secondary rounded-[2rem] scale-90 group-hover:scale-100 transition duration-500 opacity-50 blur-lg"></div>
              {payment.passportUrl ? (
                <img 
                  src={payment.passportUrl} 
                  alt="Student Identification" 
                  crossOrigin="anonymous"
                  className="w-40 h-40 rounded-[2rem] object-cover relative z-10 border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-40 h-40 rounded-[2rem] bg-gray-100 flex items-center justify-center relative z-10 border-4 border-white shadow-xl italic font-black text-gray-200">NO PHOTO</div>
              )}
              <div className="absolute -bottom-3 -right-3 h-10 w-10 bg-primary text-white rounded-2xl flex items-center justify-center z-20 shadow-lg group-hover:rotate-12 transition-transform">
                <FaUserGraduate />
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-1">Student / Owner</p>
                <h3 className="text-3xl font-black text-gray-900 leading-tight uppercase tracking-tighter italic lg:text-4xl">
                  {payment.surname} <br className="hidden lg:block"/> {payment.firstName}
                </h3>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                 <div className="bg-gray-900 text-white px-5 py-2 rounded-2xl shadow-md">
                   <p className="text-[9px] text-primary font-black uppercase tracking-widest opacity-80 leading-none mb-1">Matric No</p>
                   <p className="font-black text-sm italic tracking-widest">{payment.regNo}</p>
                 </div>
                 <div className="bg-secondary/40 text-primary border-2 border-primary/10 p-2.5 px-5 rounded-2xl font-black text-xs uppercase tracking-widest self-center h-fit">
                    {payment.department}
                 </div>
              </div>
            </div>
          </div>

          {/* Payment breakdown */}
          <div className="bg-gray-50 rounded-[2rem] p-8 space-y-6 mb-12 border border-gray-100/50">
            <div className="flex justify-between items-center group">
               <span className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Description</span>
               <span className="text-gray-900 font-black text-sm uppercase italic">Annual Faculty Dues</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Reference</span>
               <span className="text-gray-500 font-black text-xs font-mono uppercase tracking-widest select-all">{payment.paymentReference.slice(0, 16)}...</span>
            </div>
            <div className="flex justify-between items-center border-t-2 border-dashed border-gray-200 pt-6">
               <span className="text-gray-900 font-black uppercase tracking-[0.2em] text-[10px] italic">Amount Paid</span>
               <span className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter italic">₦2,000<span className="text-lg opacity-30">.00</span></span>
            </div>
          </div>

          {/* Verification Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100 pt-10 px-2">
            <div className="flex items-center space-x-3 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition cursor-default">
               <FaUniversity className="text-xl" />
               <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Digital Authentication System <br/> UNIPORT FACULTY OF COMPUTING</div>
            </div>
            <div className="text-center sm:text-right">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Transaction Date</p>
               <p className="text-gray-900 font-black italic">{new Date(payment.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-2xl px-4">
          <button 
            id="download-btn"
            onClick={downloadPDF}
            className="flex-1 flex items-center justify-center space-x-3 bg-gray-900 hover:bg-black text-white py-6 rounded-3xl font-black text-lg shadow-2xl transition hover:-translate-y-2 active:translate-y-0 active:scale-95 group uppercase tracking-tight"
          >
            <FaDownload className="group-hover:bounce" />
            <span>Download PDF</span>
          </button>
          
          <button 
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-800 py-6 rounded-3xl font-black text-lg shadow-xl shadow-gray-200 transition hover:-translate-y-2 active:translate-y-0 active:scale-95 border-2 border-gray-100 uppercase tracking-tight"
          >
            <FaPrint />
            <span>Print Receipt</span>
          </button>
      </div>
      
      <p className="mt-12 text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] mb-4">Verification Secured by NACOS</p>
    </div>
  );
};

export default Receipt;
