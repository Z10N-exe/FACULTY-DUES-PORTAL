import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import PaymentForm from './pages/PaymentForm';
import Receipt from './pages/Receipt';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pay" element={<PaymentForm />} />
            <Route path="/receipt/:id" element={<Receipt />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
