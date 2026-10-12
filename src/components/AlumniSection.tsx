import React, { useState, useEffect, useCallback } from 'react';
import { Award, Globe, Shield, Star, ArrowRight, MessageCircle, X, ZoomIn } from 'lucide-react';
import { COACH_WHATSAPP_LINK } from '../services/api';

interface AlumniSectionProps {
  onNavigate?: (page: string) => void;
}

export const AlumniSection: React.FC<AlumniSectionProps> = ({ onNavigate }) => {
  const alumni = [
    {
      id: 'ibrahim',
      name: 'Opebi Ibrahim',
      role: 'International Pathway Graduate',
      image: '/alumni/opebi-ibrahim.jpg',
      headline: 'FC Ebedei & FC Midtjylland (Denmark)',
      story:
        'Developed his fundamental technical mastery and physical discipline at Dialight Football Academy, Adura Field. His performances earned him a place with Nigeria’s renowned talent factory FC Ebedei, progressing to international scouting and travelling to European powerhouse FC Midtjylland in Denmark.',
      tags: [
        { label: 'FC Midtjylland (Denmark)', color: '#D92534', bg: '#FFF1F0' },
        { label: 'FC Ebedei (Nigeria)', color: '#1448A8', bg: '#E8F0FC' },
        { label: 'European Pathway', color: '#1F9D55', bg: '#E6F6EC' }
      ],
      highlights: [
        'Transited from Dialight FA Adura Field to professional football',
        'Signed with FC Ebedei',
        'Travelled to FC Midtjylland (Denmark) for European training & scouting'
      ]
    },
    {
      id: 'gideon',
      name: 'Fabiola Gideon',
      role: 'National Team Representative',
      image: '/alumni/fabiola-gideon.jpg',
      headline: 'Nigeria Under-17 & Giant Brillars FC',
      story:
        'Honed his dynamic attacking intelligence, pace, and match mentality under Coach Imole Tobi at Dialight FA. He achieved the prestigious milestone of representing the Nigeria Under-17 National Team and starring in professional league football with Giant Brillars FC.',
      tags: [
        { label: 'Nigeria Under-17 National Team', color: '#1F9D55', bg: '#E6F6EC' },
        { label: 'Giant Brillars FC', color: '#7C3AED', bg: '#F3E8FF' },
        { label: 'Golden Eaglets Honouree', color: '#D97706', bg: '#FFF4E5' }
      ],
      highlights: [
        'Selected for Nigeria Under-17 (Golden Eaglets)',
        'Starred competitively for Giant Brillars FC',
        'Demonstrates our grassroots-to-national-team pipeline'
      ]
    }
  ];

  type AlumniPlayer = typeof alumni[0];
  const [lightbox, setLightbox] = useState<AlumniPlayer | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLightbox(); };
    if (lightbox) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightbox, closeLightbox]);

  return (
    <section id="academy-alumni" className="section" style={{ background: '#F8FAFD', padding: '80px 0' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-head" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 50px' }}>
          <span className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Award size={14} /> Proven Academy Pathways
          </span>
          <h2 className="section-title" style={{ fontSize: 'clamp(30px, 4.5vw, 46px)' }}>
            Academy Alumni &amp; Success Stories
          </h2>
          <p className="section-desc" style={{ fontSize: 16 }}>
            From the turf at Adura Field, Alagbado to national teams and European clubs — our graduates prove that our coaching philosophy, discipline, and mentorship breed real future stars.
          </p>
        </div>

        {/* Alumni Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 32,
          marginBottom: 48
        }}>
          {alumni.map((player) => (
            <div
              key={player.id}
              style={{
                background: '#ffffff',
                borderRadius: 24,
                overflow: 'hidden',
                border: '1.5px solid #D6E0F2',
                boxShadow: '0 16px 40px rgba(10, 35, 82, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}
              className="alumni-card"
            >
              {/* Full-portrait photo — shows entire body */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '3 / 4',
                  background: '#0A1A3A',
                  overflow: 'hidden',
                  cursor: 'zoom-in'
                }}
                onClick={() => setLightbox(player)}
                title="Click to view full picture"
              >
                <img
                  src={player.image}
                  alt={player.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                    transition: 'transform 0.4s ease'
                  }}
                  className="alumni-img"
                />
                {/* Zoom hint */}
                <div style={{
                  position: 'absolute', top: 14, right: 14,
                  background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255,255,255,0.22)', color: '#fff',
                  borderRadius: 8, padding: '5px 8px', fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 4, pointerEvents: 'none'
                }}>
                  <ZoomIn size={13} /> Full View
                </div>
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(6, 22, 53, 0.95) 0%, rgba(6, 22, 53, 0.3) 50%, transparent 100%)'
                }} />

                {/* Badge top-left */}
                <div style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  background: 'rgba(6, 22, 53, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFD700',
                  padding: '5px 12px',
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}>
                  <Star size={13} fill="#FFD700" /> Dialight FA Graduate
                </div>

                {/* Player Name on overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 16,
                  left: 20,
                  right: 20
                }}>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#4ADE80',
                    letterSpacing: '0.06em',
                    marginBottom: 4
                  }}>
                    {player.role}
                  </div>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: 26,
                    fontWeight: 900,
                    margin: 0,
                    letterSpacing: '0.01em'
                  }}>
                    {player.name}
                  </h3>
                </div>
              </div>

              {/* Content Body */}
              <div style={{ padding: '26px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {/* Headline */}
                  <div style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: '#0A2352',
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <Globe size={16} color="#1448A8" />
                    <span>{player.headline}</span>
                  </div>

                  {/* Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {player.tags.map((t, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: 99,
                          background: t.bg,
                          color: t.color,
                          border: `1px solid ${t.color}33`
                        }}
                      >
                        {t.label}
                      </span>
                    ))}
                  </div>

                  {/* Story */}
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.65, marginBottom: 18 }}>
                    {player.story}
                  </p>

                  {/* Career Milestones */}
                  <div style={{
                    background: '#F8FAFD',
                    borderRadius: 12,
                    padding: '12px 14px',
                    border: '1px solid #E2E8F0',
                    marginBottom: 16
                  }}>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: '#0A2352', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                      Career Milestones:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#334155', lineHeight: 1.55 }}>
                      {player.highlights.map((h, i) => (
                        <li key={i} style={{ marginBottom: 4 }}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  {/* View Full Photo button */}
                  <button
                    onClick={() => setLightbox(player)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '9px 18px', borderRadius: 10, background: '#0A2352',
                      color: '#fff', fontWeight: 700, fontSize: 13, border: 'none',
                      cursor: 'pointer', marginBottom: 16, transition: 'opacity 0.2s'
                    }}
                  >
                    <ZoomIn size={14} /> View Full Photo
                  </button>
                </div>

                {/* Footer verification badge */}
                <div style={{
                  paddingTop: 12,
                  borderTop: '1px solid #EEF2F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  color: '#64748B'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Shield size={14} color="#1F9D55" />
                    <span>Nurtured at Adura Field</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#1448A8' }}>Elite Pathway</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pathway Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0A2352 0%, #1448A8 100%)',
          borderRadius: 20,
          padding: '36px 32px',
          color: '#ffffff',
          boxShadow: '0 16px 36px rgba(10,35,82,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 24
        }}>
          <div style={{ maxWidth: 620 }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.15)',
              color: '#FFD700',
              fontWeight: 800,
              fontSize: 11.5,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '4px 12px',
              borderRadius: 99,
              marginBottom: 10
            }}>
              Join Our Talent Pipeline
            </span>
            <h3 style={{ color: '#fff', fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 800, margin: '0 0 8px' }}>
              Your Child Could Be Our Next Success Story
            </h3>
            <p style={{ color: '#C5D6F5', fontSize: 14.5, margin: 0, lineHeight: 1.6 }}>
              Open registration and scouting trials are active for Under-10, Under-13, Under-17, and Free Age squads at Adura Field, Alagbado.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {onNavigate && (
              <button
                onClick={() => onNavigate('join')}
                style={{
                  padding: '14px 24px',
                  borderRadius: 12,
                  background: '#ffffff',
                  color: '#0A2352',
                  fontWeight: 800,
                  fontSize: 15,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <span>Request Player Trial</span>
                <ArrowRight size={16} />
              </button>
            )}

            <a
              href={COACH_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '14px 22px',
                borderRadius: 12,
                background: '#25D366',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: 15,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(37,211,102,0.3)'
              }}
            >
              <MessageCircle size={18} />
              <span>WhatsApp Coach</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .alumni-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 24px 50px rgba(10, 35, 82, 0.14);
        }
        .alumni-card:hover .alumni-img {
          transform: scale(1.04);
        }
        @keyframes fadeInModal {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUpModal {
          from { transform: translateY(22px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>

      {/* ── FULL-SCREEN LIGHTBOX ─────────────────────────────────── */}
      {lightbox && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(4,12,28,0.97)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
            animation: 'fadeInModal 0.2s ease'
          }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute', top: 18, right: 18,
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.22)', color: '#fff',
              borderRadius: '50%', width: 46, height: 46,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10001
            }}
            title="Close (Esc)"
          >
            <X size={22} />
          </button>

          {/* Photo + info panel */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              maxWidth: 500, width: '100%',
              animation: 'slideUpModal 0.24s ease'
            }}
          >
            <div style={{
              position: 'relative', width: '100%', borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.75)',
              border: '2px solid rgba(255,255,255,0.1)'
            }}>
              <img
                src={lightbox.image}
                alt={lightbox.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '74vh',
                  objectFit: 'contain',
                  display: 'block',
                  background: '#060F22'
                }}
              />
              {/* Bottom gradient overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(4,12,28,0.95) 0%, rgba(4,12,28,0.2) 65%, transparent 100%)',
                padding: '36px 22px 20px'
              }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: '#4ADE80', letterSpacing: '0.07em', marginBottom: 3 }}>
                  {lightbox.role}
                </div>
                <div style={{ color: '#fff', fontSize: 28, fontWeight: 900 }}>{lightbox.name}</div>
                <div style={{ color: '#93C5FD', fontSize: 13.5, fontWeight: 600, marginTop: 3 }}>{lightbox.headline}</div>
              </div>
              {/* Graduate badge */}
              <div style={{
                position: 'absolute', top: 14, left: 14,
                background: 'rgba(6,22,53,0.85)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.18)', color: '#FFD700',
                padding: '5px 12px', borderRadius: 99, fontSize: 11.5, fontWeight: 800,
                textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5
              }}>
                <Star size={12} fill="#FFD700" /> Dialight FA Graduate
              </div>
            </div>

            {/* Tag pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14, justifyContent: 'center' }}>
              {lightbox.tags.map((t, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, background: t.bg, color: t.color, border: `1px solid ${t.color}44` }}>
                  {t.label}
                </span>
              ))}
            </div>

            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
              Press <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 4 }}>Esc</kbd> or click outside to close
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
