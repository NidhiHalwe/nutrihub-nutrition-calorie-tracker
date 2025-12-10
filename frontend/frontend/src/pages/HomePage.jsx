import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth.jsx';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePrimaryClick = () => {
    if (user) navigate('/dashboard');
    else navigate('/signup');
  };

  const handleSecondaryClick = () => {
    if (user) navigate('/calculator');
    else navigate('/login');
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem 3rem',
        background:
          'radial-gradient(circle at top left, rgba(92,103,242,0.18), transparent 55%), radial-gradient(circle at bottom right, rgba(250,177,59,0.18), transparent 55%)',
      }}
    >
      <div
        style={{
          maxWidth: 980,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '2.2rem',
          alignItems: 'center',
        }}
      >
        {/* Left: Hero text */}
        <div>
          <p
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '3px 10px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(148,163,184,0.4)',
              fontSize: 11,
              marginBottom: 14,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--color-accent)',
              }}
            />
            Track · Calculate · Get AI Meals
          </p>

          <h1
            style={{
              fontSize: 'clamp(2.3rem, 3vw, 3rem)',
              lineHeight: 1.1,
              margin: 0,
              color: 'var(--color-text)',
            }}
          >
            Your daily
            <span
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), #ec4899)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {' '}
              nutrition companion
            </span>
            , simplified.
          </h1>

          <p
            style={{
              marginTop: 16,
              marginBottom: 18,
              color: '#4b5563',
              fontSize: 14,
              maxWidth: 520,
            }}
          >
            Log your meals in seconds, understand your calories at a glance, and let AI build
            personalized meal ideas around your goals – all in one clean dashboard.
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
            <button
              type="button"
              onClick={handlePrimaryClick}
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), #7c3aed)',
                color: '#fff',
                border: 'none',
                padding: '0.7em 1.6em',
                borderRadius: 999,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
                boxShadow: '0 10px 25px rgba(88,80,236,0.35)',
              }}
            >
              {user ? 'Open Dashboard' : 'Start tracking for free'}
            </button>

            <button
              type="button"
              onClick={handleSecondaryClick}
              style={{
                background: '#ffffff',
                color: 'var(--color-primary)',
                border: '1px solid rgba(148,163,184,0.7)',
                padding: '0.7em 1.4em',
                borderRadius: 999,
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              {user ? 'Try Calorie Calculator' : 'Log in to continue'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#6b7280' }}>
            <div>• No credit card · free to start</div>
            <div>• AI suggestions tuned to your intake</div>
          </div>
        </div>

        {/* Right: Minimal stats / illustration card */}
        <div>
          <div
            style={{
              background: '#ffffff',
              borderRadius: 18,
              padding: 16,
              boxShadow: '0 15px 35px rgba(15,23,42,0.18)',
              border: '1px solid rgba(226,232,240,0.95)',
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Today&apos;s calories</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-primary)' }}>
                1,420
                <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 4 }}>kcal</span>
              </div>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: '#e5e7eb', overflow: 'hidden', marginBottom: 14 }}>
              <div
                style={{
                  width: '60%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 11 }}>
              <span style={{ color: '#6b7280' }}>Goal: 2,100 kcal</span>
              <span style={{ color: '#16a34a' }}>On track</span>
            </div>
            <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#6b7280', marginBottom: 4 }}>Protein</div>
                <div style={{ fontWeight: 600 }}>78g</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#6b7280', marginBottom: 4 }}>Carbs</div>
                <div style={{ fontWeight: 600 }}>165g</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#6b7280', marginBottom: 4 }}>Fats</div>
                <div style={{ fontWeight: 600 }}>54g</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
