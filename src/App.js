import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/Auth/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import AppointmentBooking from './components/AppointmentBooking';
import Dashboard from './components/Dashboard/Dashboard';
import UpdateProfile from './components/Dashboard/UpdateProfile';
import PreviousBookings from './components/PreviousBookings/PreviousBookings';
import GlobalStyles from './components/GlobalStyles';
import EmergencyButton from './components/EmergencyButton';

function AppContent() {
  const { user } = useAuth();
  
  return (
    <>
      <GlobalStyles />
      <div>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointment" element={<AppointmentBooking />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/previous-bookings" element={<PreviousBookings />} />
          </Route>
        </Routes>
        
        {/* Emergency Button - Only show when user is logged in */}
        {user && <EmergencyButton />}
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;