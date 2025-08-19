// src/components/HodDashboard.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import QRCode from 'qrcode.react';

export default function HodDashboard() {
  const [pendingOutpasses, setPendingOutpasses] = useState([]);

  useEffect(() => {
    // Create query to get all outpasses where status is 'pending', newest first
    const q = query(
      collection(db, 'outpasses'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    // Listen realtime updates for pending outpasses
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = [];
      snapshot.forEach(docSnap => {
        requests.push({ id: docSnap.id, ...docSnap.data() });
      });
      setPendingOutpasses(requests);
    });

    return () => unsubscribe();
  }, []);

  // Approve outpass request
  const approveRequest = async (id) => {
    const ref = doc(db, 'outpasses', id);
    await updateDoc(ref, { status: 'approved' });
    alert('Outpass approved');
  };

  // Reject outpass request
  const rejectRequest = async (id) => {
    const ref = doc(db, 'outpasses', id);
    await updateDoc(ref, { status: 'rejected' });
    alert('Outpass rejected');
  };

  return (
    <div style={{ maxWidth: '700px', margin: '20px auto' }}>
      <h2>Pending Outpass Requests</h2>
      {pendingOutpasses.length === 0 && <p>No pending requests.</p>}
      {pendingOutpasses.map(o => (
        <div key={o.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '6px' }}>
          <p><b>Reason:</b> {o.reason}</p>
          <p><b>Date:</b> {o.date}</p>
          <p><b>Type:</b> {o.type === 'friday_prayer' ? 'Friday Prayer' : 'Regular'}</p>
          <p><b>User ID:</b> {o.userId}</p>
          <button onClick={() => approveRequest(o.id)} style={{ marginRight: '10px', padding: '8px 12px' }}>Approve</button>
          <button onClick={() => rejectRequest(o.id)} style={{ padding: '8px 12px' }}>Reject</button>
        </div>
      ))}
    </div>
  );
}
