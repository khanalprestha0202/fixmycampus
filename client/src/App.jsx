import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import NewReport from './pages/NewReport';
import ReportDetail from './pages/ReportDetail';
import Analytics from './pages/Analytics';
import Guidance from './pages/Guidance';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import PrivacyConsent from './components/PrivacyConsent';
import Footer from './components/Footer';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={
          <PrivateRoute>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <div style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/reports/new" element={<NewReport />} />
                  <Route path="/reports/:id" element={<ReportDetail />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/guidance" element={<Guidance />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </PrivateRoute>
        } />
      </Routes>
      <PrivacyConsent />
    </BrowserRouter>
  );
}

export default App;