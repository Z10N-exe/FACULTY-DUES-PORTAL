import { TannurClient } from '@tannur/sdk';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="*" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


const tannur = new TannurClient({
  apiKey: 'e108166dccfce78ba4f94e868dd09cbbf9e8134678d5431546aac209dea4f146',
  streamId: 'str_c9f65c352a8230db',
});

// Track events
tannur.events.publish({
  type: 'user.action',
  data: { /* your event data */ }
});
