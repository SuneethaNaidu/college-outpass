import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if(currentUser) {
        window.localStorage.setItem('user', JSON.stringify(currentUser));
      } else {
        window.localStorage.removeItem('user');
      }
    });
    return unsubscribe;
  }, []);

  if(user === null) return <p>Loading...</p>; // or spinner

  return (
    <>
      {children}
    </>
  );
}
