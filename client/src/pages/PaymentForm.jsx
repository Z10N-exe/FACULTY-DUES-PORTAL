import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PaymentForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('regNo', data.regNo);
      formData.append('email', data.email);
      formData.append('firstName', data.firstName);
      formData.append('surname', data.surname);
      formData.append('middleName', data.middleName || '');
      formData.append('level', data.level);
      formData.append('department', data.department);
      
      if (data.passport && data.passport[0]) {
        formData.append('passport', data.passport[0]);
      } else {
        throw new Error('Passport photo is required');
      }

      const res = await axios.post('http://localhost:5000/api/payments/initialize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      window.location.href = res.data.authorization_url;
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Payment initialization failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="payment-main" className="min-h-screen bg-[#F9FCFA] pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Title Section */}
      <section id="payment-header" aria-labelledby="form-heading" className="text-center mb-10 max-w-3xl mx-auto">
        <h1 id="form-heading" className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
          Welcome to Your Faculty Payment Portal
        </h1>
        <p className="text-gray-500 font-semibold text-sm md:text-base">
          Pay your faculty dues securely in just a few clicks.
        </p>
      </section>

      {/* Main Card Container */}
      <section id="payment-card-container" className="max-w-6xl w-full mx-auto relative mt-16">
        {/* Background Green Shape */}
        <div className="absolute inset-0 bg-[#0A8F3C] rounded-[2rem] transform scale-y-[1.03] scale-x-[0.98] -z-10 shadow-2xl" aria-hidden="true"></div>
        
        {/* Foreground White Card */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-8 lg:gap-16">
          
          {/* Left Column - Form */}
          <div className="flex-1">
            <Link to="/" id="back-to-home-link" className="text-gray-500 hover:text-primary font-semibold text-sm mb-6 inline-flex items-center transition-colors">
               <span className="mr-2">&larr;</span> Back to Home
            </Link>
            
            <div className="flex items-center gap-3 mb-10 mt-4">
              <img src="/UNIPORT-LOGO-PNG.png" alt="UniPort Logo" className="h-10 w-auto" />
              <img src="/NACOSLOGO.jpeg" alt="NACOS Logo" className="h-10 w-auto rounded-full" />
              <div className="pl-2 border-l-2 border-primary/20">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-tight">Faculty of Computing<br/>University of Port Harcourt</h3>
              </div>
            </div>

            <h2 className="text-gray-500 font-bold text-sm uppercase mb-4 tracking-wider">Student Information</h2>

            {errorMsg && (
              <div role="alert" className="bg-red-50 text-red-600 p-4 rounded-xl font-medium border border-red-100 flex items-center mb-6 text-sm">
                <span className="mr-3 text-lg" aria-hidden="true">⚠️</span>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-label="Student Payment Form">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="regNo" className="sr-only">Matriculation or Registration Number</label>
                  <input 
                    id="regNo"
                    {...register('regNo', { required: 'Matric/Reg number is required' })} 
                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder-gray-400 font-medium text-sm"
                    placeholder="Mat No./Reg. No (e.g U2023/557000)"
                  />
                  {errors.regNo && <p className="text-red-500 text-xs font-bold mt-1.5" role="alert">{errors.regNo.message}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email Address</label>
                  <input 
                    id="email"
                    type="email"
                    {...register('email', { required: 'Email is required' })} 
                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder-gray-400 font-medium text-sm"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-xs font-bold mt-1.5" role="alert">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label htmlFor="firstName" className="sr-only">First Name</label>
                  <input 
                    id="firstName"
                    {...register('firstName', { required: 'Required' })} 
                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder-gray-400 font-medium text-sm"
                    placeholder="First Name"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs font-bold mt-1.5" role="alert">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label htmlFor="surname" className="sr-only">Surname</label>
                  <input 
                    id="surname"
                    {...register('surname', { required: 'Required' })} 
                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder-gray-400 font-medium text-sm"
                    placeholder="Surname"
                  />
                  {errors.surname && <p className="text-red-500 text-xs font-bold mt-1.5" role="alert">{errors.surname.message}</p>}
                </div>
                <div>
                  <label htmlFor="middleName" className="sr-only">Middle Name</label>
                  <input 
                    id="middleName"
                    {...register('middleName')} 
                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all placeholder-gray-400 font-medium text-sm"
                    placeholder="Middle (Optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="studentLevel" className="sr-only">Student Level</label>
                  <select 
                    id="studentLevel"
                    {...register('level', { required: 'Level is required' })}
                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all font-medium text-sm text-gray-600 bg-white"
                  >
                    <option value="">Select Level</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                  </select>
                  {errors.level && <p className="text-red-500 text-xs font-bold mt-1.5" role="alert">{errors.level.message}</p>}
                </div>
                <div>
                  <label htmlFor="studentDepartment" className="sr-only">Student Department</label>
                  <select 
                    id="studentDepartment"
                    {...register('department', { required: 'Department is required' })}
                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all font-medium text-sm text-gray-600 bg-white"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Cyber Security">Cyber Security</option>
                  </select>
                  {errors.department && <p className="text-red-500 text-xs font-bold mt-1.5" role="alert">{errors.department.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="passportPhoto" className="text-gray-500 font-bold text-xs uppercase mb-2 block tracking-wider">Upload Passport Photograph</label>
                <input 
                  id="passportPhoto"
                  type="file"
                  accept="image/*"
                  {...register('passport', { required: 'Passport photo is required' })} 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all font-medium text-sm bg-gray-50 text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                {errors.passport && <p className="text-red-500 text-xs font-bold mt-1.5" role="alert">{errors.passport.message}</p>}
              </div>

              <div className="pt-6">
                <button 
                  id="submitPaymentBtn"
                  type="submit" 
                  disabled={loading}
                  className={`w-full py-4 rounded-full text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-primary/30 transition-all duration-300 transform ${loading ? 'bg-primary/70 cursor-not-allowed' : 'bg-[#0A8F3C] hover:bg-green-700 hover:-translate-y-1'}`}
                >
                  {loading ? 'Initializing...' : 'Make Payment >'}
                </button>
              </div>

            </form>
          </div>

          {/* Right Column - Info */}
          <aside className="w-full lg:w-[400px] bg-[#F5F9F6] rounded-2xl p-8 flex flex-col pt-12" aria-labelledby="instructions-heading">
            
            <div className="text-center mb-10">
              <p className="text-gray-500 font-semibold mb-1">Total amount</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">₦2,000</h2>
              <p className="text-[#0A8F3C] font-semibold text-sm mt-2 flex items-center justify-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#0A8F3C] inline-block" aria-hidden="true"></span> Secure payment
              </p>
            </div>

            <div className="mt-8">
              <h3 id="instructions-heading" className="text-[#DA4436] font-extrabold mb-6 tracking-wider uppercase text-sm">Instructions</h3>
              
              <div className="mb-6">
                <h4 className="font-bold text-[#0A8F3C] text-sm mb-2">Step 1 - Carefully Fill the Form</h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  Ensure that you provide accurate and complete information while filling out the payment form. Double-check all entries before submitting.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#0A8F3C] text-sm mb-2">Step 2 - Print and Label Your Receipt</h4>
                <p className="text-sm text-gray-600 font-medium leading-relaxed mb-3">
                  After completing your payment, print the Paystack receipt. On the printed receipt, attach your passport photograph and clearly write the following in <strong>BLOCK LETTERS (ALL CAPS)</strong>:
                </p>
                <ul className="text-sm text-gray-600 font-medium leading-relaxed list-disc pl-5 space-y-1">
                  <li>Your Full Name</li>
                  <li>Matriculation Number</li>
                  <li>Department</li>
                </ul>
              </div>
            </div>

          </aside>

        </div>
      </section>
    </main>
  );
};

export default PaymentForm;
