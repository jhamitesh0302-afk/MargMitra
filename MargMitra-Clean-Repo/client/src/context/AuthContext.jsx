import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('margmitra_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('margmitra_token') || null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (phone, password) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('margmitra_user', JSON.stringify(data.user));
      localStorage.setItem('margmitra_token', data.token);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('margmitra_user', JSON.stringify(data.user));
      localStorage.setItem('margmitra_token', data.token);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('margmitra_user');
    localStorage.removeItem('margmitra_token');
  };

  // Helper to quickly log in with mock demo accounts
  const demoLogin = (demoRole = 'ENTREPRENEUR') => {
    if (demoRole === 'ENTREPRENEUR') {
      const demoFarmer = {
        id: 'usr-ent-1',
        name: 'Ramesh Patil (Farmer)',
        phone: '9876543210',
        email: 'ramesh@margmitra.org',
        role: 'ENTREPRENEUR',
        village: 'Niphad',
        district: 'Nashik',
        state: 'Maharashtra',
        rating: 4.8
      };
      setUser(demoFarmer);
      setToken('demo_token_farmer_123');
      localStorage.setItem('margmitra_user', JSON.stringify(demoFarmer));
      localStorage.setItem('margmitra_token', 'demo_token_farmer_123');
      return demoFarmer;
    } else {
      const demoTransporter = {
        id: 'usr-trans-1',
        name: 'Balwant Singh (Transporter)',
        phone: '9876543220',
        email: 'balwant@margmitra.org',
        role: 'TRANSPORTER',
        village: 'Sinnar',
        district: 'Nashik',
        state: 'Maharashtra',
        rating: 4.9
      };
      setUser(demoTransporter);
      setToken('demo_token_transporter_123');
      localStorage.setItem('margmitra_user', JSON.stringify(demoTransporter));
      localStorage.setItem('margmitra_token', 'demo_token_transporter_123');
      return demoTransporter;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        demoLogin,
        isAuthenticated: !!user,
        isEntrepreneur: user?.role === 'ENTREPRENEUR',
        isTransporter: user?.role === 'TRANSPORTER'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
