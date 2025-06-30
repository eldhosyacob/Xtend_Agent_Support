'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import './page.scss';

export default function AccessDenied() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Redirect to home page after countdown
      router.push('/');
    }
  }, [countdown, router]);
  
  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        <div className="access-denied-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <h1>Access Denied</h1>
        <p>You don&apos;t have permission to access this page.</p>
        <p>Your current role: <strong>{user?.Role || 'User'}</strong></p>
        <p>Redirecting to homepage in {countdown} seconds...</p>
        <button 
          className="primary-button" 
          onClick={() => router.push('/')}
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
} 