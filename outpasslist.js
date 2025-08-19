// src/components/OutpassList.js
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import QRCode from 'qrcode.react';

export default function OutpassList() {
  const [outpasses, setOutpasses] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Query outpasses where userId matches current user, ordered by newest first
    const q = query(
      collection(db, 'outpasses'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    // Listen realtime updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setOutpasses(results);
    });

    return () => unsubscribe();  // Cleanup listener on component unmount
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h3>My Outpass Requests</h3>
      {outpasses.length === 0 ? <p>No outpass requests found.</p> : null}
      {outpasses.map(o => (
        <div 
          key={o.id} 
          style={{ border: '1px solid grey', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}
        >
          <p><b>Reason:</b> {o.reason}</p>
          <p><b>Date:</b> {o.date}</p>
          <p><b>Type:</b> {o.type === 'friday_prayer' ? 'Friday Prayer' : 'Regular'}</p>
          <p><b>Status:</b> {o.status.charAt(0).toUpperCase() + o.status.slice(1)}</p>
          {o.status === 'approved' && (
            <div style={{ marginTop: '10px' }}>
              <QRCode 
                value={`outpass:${o.id}:user:${o.userId}`} 
                size={128} 
                bgColor="#ffffff" 
                fgColor="#000000" 
                level="Q" 
                includeMargin={true} 
              />
              <p style={{ fontSize: '0.8rem', color: 'grey', marginTop: '5px' }}>Show this QR code at exit</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
