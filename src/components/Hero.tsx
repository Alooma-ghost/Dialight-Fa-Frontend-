import React from 'react';
import { ArrowRight, MessageCircle, ShieldCheck, Trophy, Users, MapPin } from 'lucide-react';
import { Match } from '../types';
import { LiveScoreCard } from './LiveScoreCard';
import { COACH_WHATSAPP_LINK } from '../services/api';

interface HeroProps {
  match: Match;
  onNavigate: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ match, onNavigate }) => {
  return (
    <section className="hero-section">
      {/* Background Accent Gradients */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 72, 168, 0.4) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(31, 157, 85, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-grid">
          {/* Left Column: Headlines & Call to Actions */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '6px 14px',
                borderRadius: 99,
                fontSize: 12.5,
                fontWeight: 700,
                color: '#E8F0FC',
                marginBottom: 18
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1F9D55' }} />
              <span>OFFICIAL ACADEMY PORTAL · ALAGBADO, LAGOS</span>
            </div>

            <h1 className="hero-title">
              BREEDING THE FUTURE <span style={{ color: '#5B86D6' }}>STARS</span> OF FOOTBALL.
            </h1>

            <p className="hero-lead">
              Dialight Football Academy delivers comprehensive youth development, elite tactical mentoring, and scouting exposure for U10, U13, U17, and Free Age players at Adura Field.
            </p>

            <div className="hero-buttons">
              <button
                className="btn btn-primary"
                onClick={() => onNavigate('join')}
              >
                <span>Request a Player Trial</span>
                <ArrowRight size={18} />
              </button>

              <a
                href={COACH_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost-white"
              >
                <MessageCircle size={18} color="#25D366" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="hero-metrics">
              <div>
                <div className="hero-metric-val">4</div>
                <div className="hero-metric-lbl">Age Categories</div>
              </div>
              <div>
                <div className="hero-metric-val">60+</div>
                <div className="hero-metric-lbl">Active Talents</div>
              </div>
              <div>
                <div className="hero-metric-val" style={{ color: '#1F9D55' }}>Adura</div>
                <div className="hero-metric-lbl">Home Pitch</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Matchcard or Training Info */}
          <div>
            {match.homeTeam ? (
              <>
                <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#C5D6F5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Matchday Live Center
                  </span>
                  <button
                    onClick={() => onNavigate('matches')}
                    style={{ fontSize: 13, color: '#5B86D6', fontWeight: 700 }}
                  >
                    All Fixtures →
                  </button>
                </div>
                <LiveScoreCard match={match} />
              </>
            ) : (
              <div className="hero-training-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                  <span style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#9FB0D0',
                    fontSize: 11.5, fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    padding: '4px 12px', borderRadius: 99
                  }}>No Match Today</span>
                </div>
                <div style={{ fontSize: 16.5, fontWeight: 700, color: '#fff' }}>
                  Next Training Session
                </div>
                {[
                  { squad: 'U10 & U13', time: '3:00 PM – 5:00 PM' },
                  { squad: 'U17 & Free Age', time: '4:00 PM – 6:00 PM' }
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontWeight: 600, color: '#C5D6F5', fontSize: 13.5 }}>{s.squad}</span>
                    <span style={{ background: 'rgba(31,157,85,0.2)', color: '#4ADE80', fontWeight: 800, fontSize: 12.5, padding: '3px 10px', borderRadius: 99 }}>{s.time}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9FB0D0', fontSize: 12.5 }}>
                  <MapPin size={15} color="#FFD700" style={{ flexShrink: 0 }} />
                  <span>Mon, Wed & Fri · Adura Field, Alagbado</span>
                </div>
                <button
                  onClick={() => onNavigate('matches')}
                  style={{ marginTop: 2, fontSize: 13.5, color: '#5B86D6', fontWeight: 700, textAlign: 'left' }}
                >
                  View fixtures & results →
                </button>
              </div>
            )}

            {/* Quick Training Schedule Badge */}
            {match.homeTeam && (
              <div
                style={{
                  marginTop: 16,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'rgba(31, 157, 85, 0.2)',
                    color: '#1F9D55',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0
                  }}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Adura Field, Alagbado</div>
                  <div style={{ fontSize: 12, color: '#9FB0D0', lineHeight: 1.4 }}>Training: Mon, Wed & Fri · 3–5 PM (U10/U13) & 4–6 PM (U17/Senior)</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
