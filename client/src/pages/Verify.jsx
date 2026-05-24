import { TannurClient } from '@tannur/sdk';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'https://faculty-dues-api-72mv.onrender.com/api';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const reference = searchParams.get('reference');

    if (!reference) {
      setError('No payment reference found. Please try again.');
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.get(`${API}/payments/verify?reference=${reference}`);
        const paymentId = res.data.payment._id;
        navigate(`/receipt/${paymentId}`, { replace: true });
      } catch (err) {
        setError(err.response?.data?.message || 'Payment verification failed. Please contact support.');
      }
    };

    verify();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-10 max-w-md w-full">
          <p className="text-red-600 font-semibold text-lg mb-2">Something went wrong</p>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Link
            to="/pay"
            className="inline-block bg-green-600 text-white rounded-full px-6 py-2 text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Try again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
      <div className="h-10 w-10 rounded-full border-4 border-green-600 border-t-transparent animate-spin" />
      <p className="text-sm font-medium tracking-wide">Confirming your contribution...</p>
    </div>
  );
};

export default Verify;


const tannur = new TannurClient({
  apiKey: 'e108166dccfce78ba4f94e868dd09cbbf9e8134678d5431546aac209dea4f146',
  streamId: 'str_c9f65c352a8230db',
});

// Track events
tannur.events.publish({
  type: 'user.action',
  data: { /* your event data */ }
});
