import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FaUserCircle, FaSchool, FaIdCard, FaLock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const PaymentForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await axios.post('http://localhost:5000/api/payments/initialize', {
        ...data,
        amount: 2000
      });
      window.location.href = res.data.authorization_url;
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'We encountered an error initializing your payment. Please ensure your details are correct.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 shadow-inner">
      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        {/* Modern Header */}
        <div className="bg-primary px-8 py-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16 blur-xl"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
              <FaIdCard className="text-3xl" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Student Clearance</h2>
            <p className="mt-2 text-green-100 font-medium opacity-90 max-w-md">
              Securely finalize your annual faculty dues to maintain active membership and access resources.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-10">
          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-5 rounded-2xl font-bold border-2 border-red-100 flex items-start animate-shake">
              <FaExclamationTriangle className="text-xl mr-4 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{errorMsg}</p>
            </div>
          )}

          {/* Section 1: Identity */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-black text-sm">1</div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest text-xs">Identity Verification</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-gray-500 font-bold mb-2 text-[10px] uppercase tracking-[0.2em] transition-colors group-focus-within:text-primary">Matric / Registration Number</label>
                <div className="relative">
                  <input 
                    {...register('regNo', { 
                        required: 'Matric number is essential for clearance',
                        pattern: { value: /^[a-zA-Z0-9/]+$/, message: 'Invalid format' }
                    })} 
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800 placeholder-gray-300"
                    placeholder="CSC/20XX/XXX"
                  />
                </div>
                {errors.regNo && <p className="text-red-500 text-xs font-bold mt-2 ml-2 italic">{errors.regNo.message}</p>}
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-2 text-[10px] uppercase tracking-[0.2em]">Official University Email</label>
                <input 
                  type="email"
                  {...register('email', { required: 'Please provide a valid email' })} 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800"
                  placeholder="name@student.domain.edu"
                />
                {errors.email && <p className="text-red-500 text-xs font-bold mt-2 ml-2 italic">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Personal Profile */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-black text-sm">2</div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest text-xs">Student Profile</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-500 font-bold mb-2 text-[10px] uppercase tracking-[0.2em]">Forename(s)</label>
                <input 
                  {...register('firstName', { required: 'Forename is required' })} 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800"
                  placeholder="First name(s)"
                />
                {errors.firstName && <p className="text-red-500 text-xs font-bold mt-2 ml-2 italic">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-2 text-[10px] uppercase tracking-[0.2em]">Legal Surname</label>
                <input 
                  {...register('surname', { required: 'Surname is required' })} 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800"
                  placeholder="Family name"
                />
                {errors.surname && <p className="text-red-500 text-xs font-bold mt-2 ml-2 italic">{errors.surname.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-500 font-bold mb-2 text-[10px] uppercase tracking-[0.2em]">Middle Name <span className="text-gray-300 font-medium">(Optional)</span></label>
                <input 
                  {...register('middleName')} 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-2 text-[10px] uppercase tracking-[0.2em]">Departmental Choice</label>
                <select 
                  {...register('department', { required: 'Selecting a department is required' })}
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800 appearance-none bg-no-repeat bg-[right_1rem_center]"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='激19l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundSize: '1.25rem' }}
                >
                  <option value="">Choose department...</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
                {errors.department && <p className="text-red-500 text-xs font-bold mt-2 ml-2 italic">{errors.department.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Professional Assets */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-black text-sm">3</div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest text-xs">Official Identification</h3>
            </div>

            <div className="bg-secondary/20 p-6 rounded-[2rem] border-2 border-primary/10 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-focus-within:scale-150 transition-transform duration-500">
                <FaUserCircle className="text-6xl text-primary" />
              </div>
              <label className="block text-gray-700 font-black mb-3 text-sm tracking-tight">Digital Passport URL</label>
              <input 
                {...register('passportUrl', { required: 'Please provide a clear identification image URL' })} 
                className="w-full p-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-medium text-gray-600 shadow-sm"
                placeholder="https://imgur.com/your-image.jpg"
              />
              <p className="mt-3 text-[10px] text-gray-500 font-bold uppercase tracking-tight flex items-center">
                <FaLock className="mr-2 text-primary opacity-50" /> Securely stored for official student records.
              </p>
              {errors.passportUrl && <p className="text-red-500 text-xs font-bold mt-2 italic">{errors.passportUrl.message}</p>}
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-[2.5rem] mt-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-primary/10"></div>
            <div className="relative z-10 text-center md:text-left">
                <h4 className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] mb-1">Clearance Fee</h4>
                <div className="flex items-baseline">
                  <span className="text-sm font-black text-primary mr-1 italic">NGN</span>
                  <span className="text-5xl font-black text-white tracking-tighter italic">2,000<span className="text-lg text-primary">.00</span></span>
                </div>
            </div>
            
            <button 
                type="submit" 
                disabled={loading}
                className={`relative z-10 py-5 px-10 rounded-2xl text-white font-black text-lg tracking-tight uppercase transition-all flex items-center justify-center shadow-lg shadow-primary/30 min-w-[200px] ${loading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-green-700 hover:-translate-y-1 active:translate-y-0 group'}`}
            >
                {loading ? (
                    <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <span>Initialize Payment</span>
                        <FaCheckCircle className="ml-2 group-hover:scale-125 transition-transform" />
                    </div>
                )}
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Protected by Paystack high-grade bank security.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
