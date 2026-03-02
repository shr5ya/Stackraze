import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, About, Auth, Login, Signup, Connect, Profile, Contact } from './pages';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute';
import Navbar from './components/header/navbar';

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
