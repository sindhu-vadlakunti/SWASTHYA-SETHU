import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import './Login.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
// Import logo directly if it's available in your project
// import logo from '../../assets/logo.png';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    otp: '',
    name: '',
    phoneNumber: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleRequestOtp = async () => {
    if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaarNumber: formData.aadhaarNumber })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP.');
      setSuccess(data.message);
      setOtpSent(true);
      setShowNameInput(data.isNewUser); // Conditionally show signup fields
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        aadhaarNumber: formData.aadhaarNumber,
        otp: formData.otp,
        ...(showNameInput && { name: formData.name, phoneNumber: formData.phoneNumber })
      };
      const response = await fetch(`${API_BASE_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'OTP verification failed.');
      
      login({ 
        aadhaarNumber: data.user.aadhaarNumber, 
        name: data.user.name 
      });

      setSuccess(data.message || 'Login successful!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      handleRequestOtp();
    } else {
      handleVerifyOtp();
    }
  };

  return (
    <div className="login-container">
       <div className="floating-images">
        <img src="https://img.icons8.com/color/96/000000/caduceus.png" alt="Medical Symbol" className="floating-image img1" />
        <img src="https://img.icons8.com/color/96/000000/heart-with-pulse.png" alt="Heart" className="floating-image img2" />
        <img src="https://img.icons8.com/color/96/000000/stethoscope.png" alt="Stethoscope" className="floating-image img3" />
        <img src="https://img.icons8.com/color/96/000000/ambulance.png" alt="Ambulance" className="floating-image img4" />
      </div>
      <div className="login-box">
        <div className="login-logo">
          <img src="https://img.icons8.com/color/96/000000/hospital-3.png" alt="HealthCare Plus Logo" />
          <h1 className="logo-text">HealthCare<span>Plus</span></h1>
        </div>
        <h2>Login or Sign Up</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          {!otpSent ? (
            <div className="form-group">
              <label>Aadhaar Number</label>
              <input
                type="text"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                required
                placeholder="Enter your 12-digit Aadhaar number"
                disabled={isLoading}
                maxLength="12"
              />
              <div className="input-icon">
                 <img src="https://img.icons8.com/material-outlined/24/0a6ebd/user.png" alt="User" />
              </div>
            </div>
          ) : (
            <>
              {showNameInput && (
                <>
                  <div className="form-group">
                    <label>Name</label>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phoneNumber"
                      placeholder="Enter your 10-digit phone number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  placeholder="Enter the 6-digit OTP"
                  disabled={isLoading}
                  maxLength="6"
                />
                <div className="input-icon">
                   <img src="https://img.icons8.com/material-outlined/24/0a6ebd/password.png" alt="Password" />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Processing...' : (otpSent ? 'Verify OTP & Login' : 'Request OTP')}
          </button>
        </form>

        <div className="form-footer">
          <div className="trust-badges">
            <img src="https://img.icons8.com/color/24/000000/verified-badge.png" alt="Secure" />
            <span>Secure Login</span>
          </div>
          <p>© 2024 HealthCare Plus. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Login; 