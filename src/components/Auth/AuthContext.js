import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create auth context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On mount, check if user is already logged in via localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedAadhaar = localStorage.getItem('userAadhaarNumber');
    
    if (storedName && storedAadhaar) {
      setUser({
        name: storedName,
        aadhaarNumber: storedAadhaar
      });
    }
    setLoading(false);
  }, []);

  // Login function to be called from the Login component
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userAadhaarNumber', userData.aadhaarNumber);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userName');
    localStorage.removeItem('userAadhaarNumber');
    navigate('/login');
  };

  // Value to be provided to consumers of this context
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 