import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { apiFetch } from '../services/api';
import { useAuth } from '../services/auth.jsx';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSignup(email, password) {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      login(data);
      navigate('/dashboard');
    } catch(e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AuthForm mode="signup" onSubmit={handleSignup} loading={loading} />
      {error && <div className="container" style={{color: 'red'}}>{error}</div>}
    </>
  );
}
