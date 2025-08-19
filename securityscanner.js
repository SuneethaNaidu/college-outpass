// src/components/SecurityScanner.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { QrReader } from 'react-qr-reader';

export default function SecurityScanner() {
  const [scanResult, setScanResult] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Function to verify outpass data from QR code
  const verifyOutpass = async (data) => {
    if (!data) return;
    
    // Example QR code data format: "outpass:<outpassId>:user:<userId>"
    const regex = /outpass:(.+):user:(.+)/;
    const match = data.match(regex);

    if (!match) {
      setVerificationMessage('Invalid QR code format.');
      return;
    }

    const outpassId = match[1];
    const userId = match[1];
    setVerifying(true);

    try {
      const outpassRef = doc(db, 'outpasses', outpassId);
      const outpassSnap = await getDoc(outpassRef);

      if (!outpassSnap.exists()) {
        setVerificationMessage('Outpass record not found.');
      } else {
        const outpassData = outpassSnap.data();

        // Check if userId matches and status is approved
        if (outpassData.userId !== userId) {
          setVerificationMessage('User ID does not match outpass.');
        } else if (outpassData.status !== 'approved') {
          setVerificationMessage('Outpass is not approved.');
        } else {
          // Check if outpass date matches today (optional)
          const today = new Date().toISOString().split('T');
          if (outpassData.date === today) {
            setVerificationMessage('Outpass is VALID for today. Access granted.');
          } else {
            setVerificationMessage(`Outpass is for ${outpassData.date}. Access denied.`);
          }
        }
      }
    } catch (error) {
      setVerificationMessage('Error verifying outpass: ' + error.message);
    }
    setVerifying(false);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', textAlign: 'center' }}>
      <h2>Security Gate Scanner</h2>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setScanResult(result?.text);
            verifyOutpass(result?.text);
          }
          if (!!error) {
            // handle scan errors or ignore
          }
        }}
        constraints={{ facingMode: 'environment' }}
        containerStyle={{ width: '100%' }}
        videoStyle={{ width: '100%' }}
      />
      <p><b>Scanned QR Data:</b> {scanResult}</p>
      <p><b>Status:</b> {verifying ? 'Verifying...' : verificationMessage}</p>
    </div>
  );
}
