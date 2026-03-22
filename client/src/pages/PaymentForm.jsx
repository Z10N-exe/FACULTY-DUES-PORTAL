import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

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
      setErrorMsg(err.response?.data?.message || 'Payment initialization failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Faculty <span className="text-primary">Payment</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-6 mb-4 rounded-full"></div>
          <p className="text-gray-500 font-medium text-lg">Fill in your exact details to proceed</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 sm:p-10 border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl font-medium border border-red-100 flex items-center">
              <span className="mr-3 text-xl">⚠️</span>
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-wider">Matric/Reg Number *</label>
              <input 
                {...register('regNo', { required: 'Registration number is required' })} 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder-gray-400 bg-gray-50/50 focus:bg-white"
                placeholder="e.g CSC/2023/001"
              />
              {errors.regNo && <p className="text-red-500 text-xs font-bold mt-2">{errors.regNo.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-wider">Email Address *</label>
              <input 
                type="email"
                {...register('email', { required: 'Email is required' })} 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder-gray-400 bg-gray-50/50 focus:bg-white"
                placeholder="student@domain.com"
              />
              {errors.email && <p className="text-red-500 text-xs font-bold mt-2">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-wider">First Name *</label>
              <input 
                {...register('firstName', { required: 'First name is required' })} 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all bg-gray-50/50 focus:bg-white"
              />
              {errors.firstName && <p className="text-red-500 text-xs font-bold mt-2">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-wider">Surname *</label>
              <input 
                {...register('surname', { required: 'Surname is required' })} 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all bg-gray-50/50 focus:bg-white"
              />
              {errors.surname && <p className="text-red-500 text-xs font-bold mt-2">{errors.surname.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-wider">Middle Name</label>
              <input 
                {...register('middleName')} 
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder-gray-400 bg-gray-50/50 focus:bg-white"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-wider">Department *</label>
              <select 
                {...register('department', { required: 'Department is required' })}
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-gray-50/50 focus:bg-white outline-none transition-all text-gray-700"
              >
                <option value="">Select Department...</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Computer Science">Computer Science</option>
              </select>
              {errors.department && <p className="text-red-500 text-xs font-bold mt-2">{errors.department.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2 text-xs uppercase tracking-wider">Passport Photo URL *</label>
            <input 
              {...register('passportUrl', { required: 'Passport URL is required' })} 
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder-gray-400 bg-gray-50/50 focus:bg-white"
              placeholder="e.g https://i.imgur.com/example.jpg"
            />
            {errors.passportUrl && <p className="text-red-500 text-xs font-bold mt-2">{errors.passportUrl.message}</p>}
          </div>

          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <span className="text-gray-700 font-extrabold text-sm uppercase tracking-wider">Total Dues Amount:</span>
            <span className="text-3xl font-black text-primary tracking-tight">₦2,000</span>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 mt-8 rounded-full text-white font-bold text-lg tracking-wide shadow-lg shadow-primary/30 transition-all duration-300 transform ${loading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-green-700 hover:-translate-y-1'}`}
          >
            {loading ? 'Initializing Secure Payment...' : 'Proceed to Pay with Paystack'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
