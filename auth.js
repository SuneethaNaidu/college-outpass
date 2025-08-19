// src/components/Auth.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Your login function here
  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Fetch user role from Firestore
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      
      let role = "student"; // default if role not set
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        role = userData.role || "student";
      }
      
      // Save user info and role
      localStorage.setItem("user", JSON.stringify({
        uid: userId,
        email: userCredential.user.email,
        role: role
      }));

      alert(`Logged in as ${role}`);
      // Redirect or update UI here, e.g.,
      window.location.href = "/dashboard";

    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(email, password);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
