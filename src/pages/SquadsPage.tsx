import React from 'react';
import { SquadsSection } from '../components/SquadsSection';
import { AlumniSection } from '../components/AlumniSection';
import { COACH_WHATSAPP_LINK } from '../services/api';
import { MessageCircle } from 'lucide-react';

interface SquadsPageProps {
  onNavigate: (page: string) => void;
}

export const SquadsPage: React.FC<SquadsPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#F8FAFD' }}>
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="section-head">
          <span className="section-tag">Player Pathways</span>
          <h1 className="section-title">Squads & Age-Grade Programs</h1>
          <p className="section-desc">
            Structured development pathways from grassroots to senior competitive football. Find the right program for your age and ability.
          </p>
        </div>
      </div>

      <SquadsSection onNavigate={onNavigate} />

      {/* Academy Alumni & Success Stories */}
      <AlumniSection onNavigate={onNavigate} />

      {/* Coaching Philosophy */}
      <section className="section" style={{ background: '#0A2352', paddingTop: 80, paddingBottom: 80 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', color: '#B9C9EA', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: 99, marginBottom: 16 }}>
                Our Philosophy
              </span>
              <h2 style={{ color: '#fff', fontSize: 'clamp(28px, 4vw, 42px)', marginBottom: 16 }}>
                More Than Just Football
              </h2>
              <p style={{ color: '#9FB0D0', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
                At Dialight FA, we believe great footballers are built through discipline, character, and intelligent training. Our coaches invest in the whole player — on and off the pitch.
              </p>
              <a
                href={COACH_WHATSAPP_LINK}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-green"
                style={{ fontSize: 16 }}
              >
                <MessageCircle size={18} />
                <span>Speak with Head Coach</span>
              </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Technical Excellence', desc: 'Ball mastery, first touch, and 1v1 skills at every age.' },
                { label: 'Tactical Intelligence', desc: 'Positional play, transitions, and game understanding.' },
                { label: 'Physical Conditioning', desc: 'Age-appropriate fitness, speed, and injury prevention.' },
                { label: 'Mental Fortitude', desc: 'Resilience, focus, and competitive mentality.' }
              ].map((v, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1F9D55', marginBottom: 6 }}>{v.label}</div>
                  <div style={{ fontSize: 13.5, color: '#9FB0D0', lineHeight: 1.5 }}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
