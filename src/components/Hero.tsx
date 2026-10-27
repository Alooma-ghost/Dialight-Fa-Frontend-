import React, { useEffect, useState } from 'react';
import { ArrowRight, MessageCircle, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { Fixture } from '../types';
import { api, COACH_WHATSAPP_LINK } from '../services/api';

interface HeroProps {
  onNavigate: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  useEffect(() => {
    api.getFixtures().then(data => setFixtures(data.slice(0, 3)));
  }, []);

  const upcoming = fixtures.filter(f => !f.isResult && f.status !== 'Completed').slice(0, 3);
  const recent   = fixtures.filter(f =>  f.isResult || f.status === 'Completed').slice(0, 2);
  const displayFixtures = upcoming.length > 0 ? upcoming : recent;

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

          {/* Right Column: Match Fixtures Widget */}
          <div>
            {/* Header */}
            <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#C5D6F5', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} style={{ flexShrink: 0 }} />
                {upcoming.length > 0 ? 'Upcoming Fixtures' : recent.length > 0 ? 'Recent Results' : 'Match Fixtures'}
              </span>
              <button
                onClick={() => onNavigate('matches')}
                style={{ fontSize: 13, color: '#5B86D6', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                All Fixtures <ChevronRight size={14} />
              </button>
            </div>

            {/* Fixtures List */}
            <div style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 18,
              overflow: 'hidden'
            }}>
              {displayFixtures.length === 0 ? (
                // No fixtures yet — show training schedule
                <div style={{ padding: '20px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: '#9FB0D0',
                      fontSize: 11.5, fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      padding: '4px 12px', borderRadius: 99
                    }}>Season Starting Soon</span>
                  </div>
                  <div style={{ fontSize: 16.5, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                    Training Sessions
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9FB0D0', fontSize: 12.5, marginTop: 10 }}>
                    <MapPin size={15} color="#FFD700" style={{ flexShrink: 0 }} />
                    <span>Mon, Wed & Fri · Adura Field, Alagbado</span>
                  </div>
                </div>
              ) : (
                displayFixtures.map((f, idx) => {
                  const isResult = f.isResult || f.status === 'Completed';
                  return (
                    <div
                      key={f.id || f._id || idx}
                      onClick={() => onNavigate('matches')}
                      style={{
                        padding: '14px 18px',
                        borderBottom: idx < displayFixtures.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Competition & Status badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: '#9FB0D0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {f.competition}
                        </span>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '2px 10px',
                          borderRadius: 99,
                          background: isResult ? 'rgba(31,157,85,0.18)' : 'rgba(20,72,168,0.25)',
                          color: isResult ? '#4ADE80' : '#93BBFF',
                          letterSpacing: '0.03em'
                        }}>
                          {isResult ? (f.result || 'FT') : f.status || 'Upcoming'}
                        </span>
                      </div>

                      {/* Teams */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontWeight: 800, fontSize: 14, color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.homeTeam}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                          {isResult && f.result ? (
                            <span style={{ fontSize: 16, fontWeight: 900, color: '#FFD700', letterSpacing: '0.06em' }}>{f.result}</span>
                          ) : (
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#B9C9EA', background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: 6 }}>vs</span>
                          )}
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 14, color: '#C5D6F5', flex: 1, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.awayTeam}
                        </span>
                      </div>

                      {/* Date & time */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5, color: '#9FB0D0', fontSize: 11.5 }}>
                        <Calendar size={11} style={{ flexShrink: 0 }} />
                        <span>{f.date}</span>
                        {f.time && <><span>·</span><span>{f.time}</span></>}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Footer */}
              <div
                onClick={() => onNavigate('matches')}
                style={{
                  padding: '11px 18px',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#5B86D6',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#93BBFF')}
                onMouseLeave={e => (e.currentTarget.style.color = '#5B86D6')}
              >
                View all fixtures & results <ChevronRight size={14} />
              </div>
            </div>

            {/* Location badge */}
            <div
              style={{
                marginTop: 14,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 14,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(31, 157, 85, 0.2)',
                  color: '#1F9D55',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0
                }}
              >
                <MapPin size={17} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: '#fff' }}>Adura Field, Alagbado</div>
                <div style={{ fontSize: 11.5, color: '#9FB0D0', lineHeight: 1.4 }}>Training: Mon, Wed & Fri · 3–5 PM (U10/U13) & 4–6 PM (U17/Senior)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
