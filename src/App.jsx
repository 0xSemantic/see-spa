import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import ReceiptPage from './pages/ReceiptPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminGuard from './components/Admin/AdminGuard';
import ChatWidget from './components/UI/ChatWidget';  // <-- add this import

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/book" element={<HomePage />} />
            <Route path="/receipt/:code" element={<ReceiptPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'white',
            color: '#2c3e2d',
            border: '1px solid rgba(199,233,192,0.6)',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
      <ChatWidget />  
    </BrowserRouter>
  );
}