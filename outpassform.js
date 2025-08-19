// src/components/OutpassForm.js
import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function OutpassForm() {
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('regular');  // options: 'regular', 'friday_prayer'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert('You must be logged in to apply for an outpass.');
      return;
    }

    try {
      await addDoc(collection(db, 'outpasses'), {
        userId: auth.currentUser.uid,
        reason,
        date,
        type,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      alert('Outpass application submitted successfully!');
      setReason('');
      setDate('');
      setType('regular');
    } catch (error) {
      alert('Failed to submit outpass: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <h3>Apply for Outpass</h3>
      <label>
        Reason:
        <input 
          type="text" 
          value={reason} 
          onChange={e => setReason(e.target.value)} 
          required 
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }} 
        />
      </label>
      <label>
        Date:
        <input 
          type="date" 
          value={date} 
          onChange={e => setDate(e.target.value)} 
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
      </label>
      <label>
        Type:
        <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '10px' }}>
          <option value="regular">Regular</option>
          <option value="friday_prayer">Friday Prayer</option>
        </select>
      </label>
      <button type="submit" style={{ padding: '10px', width: '100%' }}>Submit</button>
    </form>
  );
}
