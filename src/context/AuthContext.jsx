import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined' && storedUser !== '') {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      localStorage.removeItem('user');
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const safeUser = {
      id: userData.id,
      fullName: userData.fullName,
      email: userData.email,
      address: userData.address || null,
      phNumber: userData.phNumber || null,
      city: userData.city || null,
      createdAt: userData.createdAt,
    };

    setUser(safeUser);
    localStorage.setItem('user', JSON.stringify(safeUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updatedData) => {
    const updatedUser = {
      ...user,
      ...updatedData,
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout,
    updateUser, // ✅ Expose this to context
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
