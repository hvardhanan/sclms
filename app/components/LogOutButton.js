'use client';

import React from 'react';

const LogoutButton = () => {
  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;