import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FaIdCard, FaCheckCircle, FaExclamationTriangle, FaCloudUploadAlt } from 'react-icons/fa';

const PaymentForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [preview, setPreview] = useState(null);

  const handlePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    const formData = new FormData();
    formData.append('regNo', data.regNo);
    formData.append('email', data.email);
    formData.append('firstName', data.firstName);
    formData.append('surname', data.surname);
    formData.append('middleName', data.middleName || '');
    formData.append('department', data.department);
    formData.append('passport', data.passport[0]);

    try {
      const res = await axios.post('http://localhost:5000/api/payments/initialize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      window.location.href = res.data.authorization_url;
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Payment initialization failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {/* Simple Header */}
        <div className="bg-gray-50 border-b border-gray-100 px-8 py-8 text-center">
            <FaIdCard className="text-3xl text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Student Dues Portal</h2>
            <p className="mt-2 text-sm text-gray-500">Official NACOS clearance system.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-8">
          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-4 border border-red-100 rounded-md text-sm font-bold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Matric Number</label>
              <input {...register('regNo', { required: true })} className="w-full p-3 border border-gray-200 rounded focus:border-primary focus:ring-0 outline-none" placeholder="CSC/XXXX/XXX" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</label>
              <input type="email" {...register('email', { required: true })} className="w-full p-3 border border-gray-200 rounded focus:border-primary focus:ring-0 outline-none" placeholder="student@uniport.edu" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">First Name</label>
              <input {...register('firstName', { required: true })} className="w-full p-3 border border-gray-200 rounded focus:border-primary focus:ring-0 outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Surname</label>
              <input {...register('surname', { required: true })} className="w-full p-3 border border-gray-200 rounded focus:border-primary focus:ring-0 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Department</label>
              <select {...register('department', { required: true })} className="w-full p-3 border border-gray-200 rounded focus:border-primary focus:ring-0 outline-none bg-white">
                <option value="">Select...</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
            <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Passport Photo</label>
                <label className="cursor-pointer">
                  <div className="flex items-center space-x-2 p-3 border border-gray-200 border-dashed rounded hover:bg-gray-50 transition-colors">
                     {preview ? <FaCheckCircle className="text-primary" /> : <FaCloudUploadAlt className="text-gray-300" />}
                     <span className="text-sm text-gray-600 font-medium">{preview ? 'Identity Uploaded' : 'Select JPEG/PNG'}</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" {...register('passport', { required: true, onChange: handlePreview })} />
                </label>
                {preview && <img src={preview} className="mt-2 w-20 h-20 rounded border border-gray-100 object-cover" />}
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900">₦2,000</p>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className={`px-10 py-4 bg-primary text-white font-bold rounded shadow-md hover:bg-green-700 transition-colors ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? 'Processing...' : 'INITIALIZE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
