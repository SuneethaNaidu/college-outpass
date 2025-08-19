// src/components/Navbar.js
import React from 'react';

export default function Navbar() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const role = storedUser?.role;

  return (
    <nav>
      <a href="/dashboard">Dashboard</a>
      {role === 'hod' && <a href="/hod">HOD Panel</a>}
      {role === 'security' && <a href="/security">Security Scanner</a>}
      {/* Add logout button, profile, etc. */}
    </nav>
  );
}
