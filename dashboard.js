import React from 'react';
import OutpassForm from './OutpassForm';
import OutpassList from './OutpassList';

export default function Dashboard() {
  return (
    <div>
      <h1>Student Dashboard</h1>
      <OutpassForm />
      <hr style={{ margin: '30px 0' }} />
      <OutpassList />
    </div>
  );
}
