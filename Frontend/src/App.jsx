import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { Home, About, Auth, Login, Signup, Connect, Profile, Contact, NewsLetter, Community, Settings, OtpVerification } from './pages';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute';
import Navbar from './components/header/navbar';
import { useAuth } from './context/AuthContext';

// Component to handle Google OAuth success redirect
function GoogleAuthSuccess() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        login(user, token);
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Failed to parse Google auth data:", err);
        navigate("/login?error=auth_failed", { replace: true });
      }
    } else {
      navigate("/login?error=auth_failed", { replace: true });
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400">Completing sign in...</p>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <div className='App'>
      <Navbar />
      <Routes>
        {/* Protected Home */}
        <Route path='/' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        {/* Login */}
        <Route path='/login' element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        {/* Signup */}
        <Route path='/signup' element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />

        {/* OTP Verification */}
        <Route path='/verify-otp' element={<OtpVerification />} />

        {/* Google OAuth Success Callback */}
        <Route path='/auth/google/success' element={<GoogleAuthSuccess />} />

        {/* Old Auth Route */}
        <Route path='/auth' element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        } />

        {/* Connect page */}
        <Route path='/connect' element={
          <ProtectedRoute>
            <Connect />
          </ProtectedRoute>
        } />

        {/* Contact page */}
        <Route path='/contact' element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        } />

        {/* Newsletter page */}
        <Route path='/newsletter' element={
          <ProtectedRoute>
            <NewsLetter />
          </ProtectedRoute>
        } />

        {/* Community page */}
        <Route path='/community' element={
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        } />

        {/* Settings page */}
        <Route path='/settings' element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path='/settings/:tab' element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />

        {/* Public Profile page */}
        <Route path='/profile/:username' element={<Profile />} />

        {/* Public About Route */}
        <Route path='/about' element={<About />} />

        <Route path='*' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

export default App;
