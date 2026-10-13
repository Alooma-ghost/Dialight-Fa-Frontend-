import React from 'react';
import { Shield, Users, Trophy, Award, ChevronRight } from 'lucide-react';

interface SquadsSectionProps {
  onSelectSquad?: (squad: string) => void;
  onNavigate: (page: string) => void;
}

export const SquadsSection: React.FC<SquadsSectionProps> = ({ onNavigate }) => {
  const squads = [
    {
      name: 'Under-10',
      badge: 'U10',
      title: 'Grassroots Foundation',
      age: 'Ages 6 to 10',
      desc: 'Building fundamental technique: ball mastery, 1v1 confidence, dynamic balance, and early game understanding in an inspiring environment.',
      schedule: 'Monday, Wednesday & Friday · 3:00 PM – 5:00 PM',
      color: '#1448A8',
      bgLight: '#E8F0FC'
    },
    {
      name: 'Under-13',
      badge: 'U13',
      title: 'Junior Development',
      age: 'Ages 11 to 13',
      desc: 'Developing positional discipline, quick decision making under pressure, spatial intelligence, and transitional passing patterns.',
      schedule: 'Monday, Wednesday & Friday · 3:00 PM – 5:00 PM',
      color: '#0A2352',
      bgLight: '#F4F8FE'
    },
    {
      name: 'Under-17',
      badge: 'U17',
      title: 'Championship & Showcase',
      age: 'Ages 14 to 17',
      desc: 'Elite competitive conditioning, 11v11 tactical mastery, set-piece execution, and regional tournament exposure for top scouts.',
      schedule: 'Monday, Wednesday & Friday · 4:00 PM – 6:00 PM',
      color: '#1F9D55',
      bgLight: '#E6F6EC'
    },
    {
      name: 'Free Age',
      badge: 'Senior',
      title: 'Competitive Showcase',
      age: 'Age 18 and Above',
      desc: 'High-level competitive squad competing in open showcase matches, senior leagues, and direct trial preparations for professional teams.',
      schedule: 'Monday, Wednesday & Friday · 4:00 PM – 6:00 PM',
      color: '#0A2352',
      bgLight: '#0A2352',
      dark: true
    }
  ];

  return (
    <section className="section" style={{ background: '#ffffff' }}>
      <div className="container">
        <div className="section-head">
          <span className="section-tag">Development Pathway</span>
          <h2 className="section-title">Academy Squads & Age Categories</h2>
          <p className="section-desc">
            A structured football curriculum designed to take a child from their very first touches all the way to senior competitive football.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 24 }}>
          {squads.map((s, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: 20,
                border: s.dark ? 'none' : '1px solid #D6E0F2',
                background: s.dark ? 'linear-gradient(145deg, #0A2352, #061635)' : '#ffffff',
                color: s.dark ? '#ffffff' : '#12203D',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 24px rgba(10, 35, 82, 0.05)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 14,
                      background: s.dark ? 'rgba(255,255,255,0.1)' : s.bgLight,
                      color: s.dark ? '#5B86D6' : s.color,
                      display: 'grid',
                      placeItems: 'center',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 900,
                      fontSize: 18
                    }}
                  >
                    {s.badge}
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: s.dark ? '#A5C1F5' : '#5A6A88',
                      background: s.dark ? 'rgba(255,255,255,0.06)' : '#F0F4FC',
                      padding: '4px 10px',
                      borderRadius: 99
                    }}
                  >
                    {s.age}
                  </span>
                </div>

                <h3 style={{ fontSize: 26, color: s.dark ? '#ffffff' : '#0A2352', marginBottom: 6 }}>
                  {s.name}
                </h3>
                <div style={{ fontSize: 13, fontWeight: 700, color: s.dark ? '#1F9D55' : '#1448A8', marginBottom: 14 }}>
                  {s.title}
                </div>

                <p style={{ fontSize: 14.5, color: s.dark ? '#B9C9EA' : '#5A6A88', lineHeight: 1.6, marginBottom: 20 }}>
                  {s.desc}
                </p>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: s.dark ? '#9FB0D0' : '#5A6A88',
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: s.dark ? 'rgba(255,255,255,0.05)' : '#F8FAFD',
                    marginBottom: 18
                  }}
                >
                  <strong style={{ color: s.dark ? '#fff' : '#0A2352' }}>Training: </strong>
                  {s.schedule}
                </div>

                <button
                  onClick={() => onNavigate('join')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 12,
                    background: s.dark ? '#1F9D55' : '#F4F8FE',
                    color: s.dark ? '#ffffff' : '#1448A8',
                    fontWeight: 700,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>Request Trial ({s.name})</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
