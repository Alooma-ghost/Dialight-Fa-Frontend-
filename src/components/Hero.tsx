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
    <section
      style={{
        background: 'linear-gradient(145deg, #0A2352 0%, #071635 100%)',
        color: '#ffffff',
        paddingTop: 140,
        paddingBottom: 90,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
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
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 50, alignItems: 'center' }}>
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
                fontSize: 13,
                fontWeight: 700,
                color: '#E8F0FC',
                marginBottom: 20
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1F9D55' }} />
              <span>OFFICIAL ACADEMY PORTAL · ALAGBADO, LAGOS</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(42px, 6vw, 68px)',
                color: '#ffffff',
                marginBottom: 20,
                lineHeight: 0.98,
                letterSpacing: '0.01em'
              }}
            >
              BREEDING THE FUTURE <span style={{ color: '#5B86D6' }}>STARS</span> OF FOOTBALL.
            </h1>

            <p style={{ fontSize: 18, color: '#C5D6F5', lineHeight: 1.6, marginBottom: 36, maxWidth: 540 }}>
              Dialight Football Academy delivers comprehensive youth development, elite tactical mentoring, and scouting exposure for U10, U13, U17, and Free Age players at Adura Field.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 44 }}>
              <button
                className="btn btn-primary"
                onClick={() => onNavigate('join')}
                style={{ padding: '14px 28px', fontSize: 16 }}
              >
                <span>Request a Player Trial</span>
                <ArrowRight size={18} />
              </button>

              <a
                href={COACH_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost-white"
                style={{ padding: '14px 24px', fontSize: 16 }}
              >
                <MessageCircle size={18} color="#25D366" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 16,
                paddingTop: 28,
                borderTop: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, color: '#fff' }}>4</div>
                <div style={{ fontSize: 13, color: '#9FB0D0', fontWeight: 600 }}>Age Categories</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, color: '#fff' }}>60+</div>
                <div style={{ fontSize: 13, color: '#9FB0D0', fontWeight: 600 }}>Active Talents</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, color: '#1F9D55' }}>Adura</div>
                <div style={{ fontSize: 13, color: '#9FB0D0', fontWeight: 600 }}>Home Training Pitch</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Matchcard or Training Info */}
          <div>
            {match.homeTeam ? (
              <>
                <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#C5D6F5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 20,
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#9FB0D0',
                    fontSize: 12, fontWeight: 800,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    padding: '4px 12px', borderRadius: 99
                  }}>No Match Today</span>
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>
                  Next Training Session
                </div>
                {[
                  { squad: 'U10 & U13', time: '3:00 PM – 5:00 PM' },
                  { squad: 'U17 & Free Age', time: '4:00 PM – 6:00 PM' }
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ fontWeight: 600, color: '#C5D6F5', fontSize: 14 }}>{s.squad}</span>
                    <span style={{ background: 'rgba(31,157,85,0.2)', color: '#4ADE80', fontWeight: 800, fontSize: 13, padding: '3px 12px', borderRadius: 99 }}>{s.time}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9FB0D0', fontSize: 13 }}>
                  <MapPin size={15} color="#FFD700" />
                  <span>Mon, Wed & Fri · Adura Field, Alagbado</span>
                </div>
                <button
                  onClick={() => onNavigate('matches')}
                  style={{ marginTop: 4, fontSize: 14, color: '#5B86D6', fontWeight: 700, textAlign: 'left' }}
                >
                  View fixtures & results →
                </button>
              </div>
            )}

            {/* Quick Training Schedule Badge */}
            {match.homeTeam && (
              <div
                style={{
                  marginTop: 20,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 14,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'rgba(31, 157, 85, 0.2)',
                    color: '#1F9D55',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0
                  }}
                >
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Adura Field, Alagbado</div>
                  <div style={{ fontSize: 13, color: '#9FB0D0' }}>Training: Mon, Wed & Fri · 3–5 PM (U10/U13) & 4–6 PM (U17/Senior)</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section {
            padding-top: 110px !important;
          }
          .container > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
};
