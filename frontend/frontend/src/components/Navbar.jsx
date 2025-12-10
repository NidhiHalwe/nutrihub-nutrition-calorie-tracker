import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: '#ffffff',
        boxShadow: '0 6px 18px rgba(15,23,42,0.08)',
      }}
    >
      <nav
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '0.6rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--color-primary), #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            N
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-text)' }}>
              NutriHub
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>AI Nutrition Planner</div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13 }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              padding: '4px 10px',
              borderRadius: 999,
              color: isActive('/') ? '#ffffff' : '#4b5563',
              background: isActive('/') ? 'var(--color-primary)' : 'transparent',
            }}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            style={{
              textDecoration: 'none',
              padding: '4px 10px',
              borderRadius: 999,
              color: isActive('/dashboard') ? '#ffffff' : '#4b5563',
              background: isActive('/dashboard') ? 'var(--color-primary)' : 'transparent',
            }}
          >
            Dashboard
          </Link>
          <Link
            to="/calculator"
            style={{
              textDecoration: 'none',
              padding: '4px 10px',
              borderRadius: 999,
              color: isActive('/calculator') ? '#ffffff' : '#4b5563',
              background: isActive('/calculator') ? 'var(--color-primary)' : 'transparent',
            }}
          >
            Calorie Calculator
          </Link>

          {user ? (
            <>
              <span style={{ fontSize: 11, color: '#6b7280' }}>
                {user.user?.email || 'Logged in'}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  marginLeft: 4,
                  padding: '0.35rem 0.9rem',
                  borderRadius: 999,
                  border: '1px solid #e5e7eb',
                  background: '#f9fafb',
                  color: '#111827',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  fontSize: 12,
                  color: '#4b5563',
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{
                  textDecoration: 'none',
                  marginLeft: 4,
                  padding: '0.4rem 0.95rem',
                  borderRadius: 999,
                  background: 'linear-gradient(135deg, var(--color-primary), #7c3aed)',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
