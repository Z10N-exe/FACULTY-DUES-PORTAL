import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import PaymentForm from './pages/PaymentForm';
import Receipt from './pages/Receipt';
import Verify from './pages/Verify';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import StudentDashboard from './pages/StudentDashboard';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pay" element={<PaymentForm />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/receipt/:id" element={<Receipt />} />
            <Route path="/login" element={<StudentLogin />} />
            <Route path="/register" element={<StudentRegister />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
