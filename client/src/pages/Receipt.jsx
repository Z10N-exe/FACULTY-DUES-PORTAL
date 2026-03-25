import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaPrint, FaDownload, FaCheckCircle, FaUniversity } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';

const Receipt = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/payments/receipt/${id}`);
        setPayment(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [id]);

  const downloadPDF = () => {
    const element = document.getElementById('receipt-content');
    const opt = {
      margin: 0,
      filename: `Receipt-${payment.regNo}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-gray-400 uppercase tracking-[0.3em] animate-pulse">Verifying...</div>;
  if (!payment) return <div className="h-screen flex items-center justify-center text-red-500 font-bold">ERROR: Receipt Not Found</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      
      {/* Action Buttons */}
      <div className="mb-8 flex gap-4 no-print group">
        <button onClick={() => window.print()} className="bg-white border border-gray-200 p-4 px-6 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-all flex items-center shadow-sm">
          <FaPrint className="mr-3" /> PRINT
        </button>
        <button onClick={downloadPDF} className="bg-primary text-white p-4 px-6 rounded-lg font-bold hover:bg-green-700 transition-all flex items-center shadow-sm">
          <FaDownload className="mr-3" /> DOWNLOAD PDF
        </button>
      </div>

      {/* Flatter Receipt Content */}
      <div id="receipt-content" className="bg-white border border-gray-200 rounded-none shadow-sm max-w-[800px] w-full p-12 relative overflow-hidden text-gray-900">
        
        {/* Verification Label */}
        <div className="absolute top-8 right-8 flex items-center text-green-600 font-bold uppercase tracking-widest text-[10px] border border-green-200 px-3 py-1 rounded-full bg-green-50">
           <FaCheckCircle className="mr-2" /> OFFICIAL RECEIPT
        </div>

        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-100 pb-10 mb-10">
          <div className="flex items-center space-x-6">
            <img src="/UNIPORT-LOGO-PNG.png" className="h-20 w-auto" alt="Logo" />
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight leading-none italic">University of <br/> Port Harcourt</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-2 italic">Faculty of Computing & IT</p>
            </div>
          </div>
          <div className="text-right">
             <img src={payment.passportUrl} className="h-24 w-24 border border-gray-100 object-cover rounded grayscale" alt="Passport" />
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center mb-12">
           <h2 className="text-2xl font-black uppercase tracking-[0.2em] italic underline underline-offset-8">Dues Payment Receipt</h2>
           <p className="mt-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
             Verified Digital Authentication &bull; NACOS UNIPORT Chapter
           </p>
        </div>

        {/* Details Table */}
        <div className="grid grid-cols-2 gap-y-8 border-y border-gray-100 py-10 mb-12">
            <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mb-1">Student Full Name</p>
                <p className="text-lg font-black uppercase tracking-tighter italic">{payment.surname} {payment.firstName} {payment.middleName}</p>
            </div>
            <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mb-1">Registration No</p>
                <p className="text-lg font-black uppercase tracking-tighter italic">{payment.regNo}</p>
            </div>
            <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mb-1">Department</p>
                <p className="text-base font-bold uppercase tracking-widest text-primary">{payment.department}</p>
            </div>
            <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mb-1">Academic Session</p>
                <p className="text-base font-bold uppercase tracking-widest">2023 / 2024</p>
            </div>
        </div>

        {/* Transaction Info */}
        <div className="bg-gray-50 p-8 flex justify-between items-center rounded-lg border border-gray-100">
           <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mb-1">Amount Paid (NGN)</p>
              <p className="text-3xl font-black tracking-tighter italic">₦{payment.amount.toLocaleString()}</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mb-1">Reference ID</p>
              <p className="text-xs font-bold font-mono text-gray-500">{payment.paymentReference}</p>
           </div>
        </div>

        {/* Seals */}
        <div className="mt-16 pt-16 border-t border-gray-100 flex justify-between items-end opacity-60 grayscale scale-90">
            <div className="text-center opacity-30">
               <div className="h-20 w-20 border border-gray-200 rounded-full mx-auto animate-pulse flex items-center justify-center">
                  <span className="text-[8px] font-black italic">SIGNATURE<br/>ENCRYPTED</span>
               </div>
            </div>
            <div className="text-right flex items-center space-x-4">
               <div>
                  <p className="text-[10px] font-black uppercase italic">Official Association Seal</p>
                  <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Dues Payment Protocol</p>
               </div>
               <img src="/NACOSLOGO.jpeg" className="h-12 w-auto" alt="Logo" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
