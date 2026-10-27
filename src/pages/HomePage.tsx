import React, { useEffect, useState } from 'react';
import { Hero } from '../components/Hero';
import { SquadsSection } from '../components/SquadsSection';
import { AlumniSection } from '../components/AlumniSection';
import { NewsSection } from '../components/NewsSection';
import { AduraMapSection } from '../components/AduraMapSection';
import { Fixture } from '../types';
import { api, COACH_WHATSAPP_LINK, SOCIAL_LINKS } from '../services/api';
import { MessageCircle, MapPin, Calendar, Clock, ChevronRight, Radio } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loadingFixtures, setLoadingFixtures] = useState(true);

  useEffect(() => {
    api.getFixtures().then(data => {
      setFixtures(data);
      setLoadingFixtures(false);
    });
  }, []);

  const upcoming = fixtures.filter(f => !f.isResult && f.status !== 'Completed');
  const results  = fixtures.filter(f =>  f.isResult || f.status === 'Completed').slice(0, 3);

  return (
    <>
      <Hero onNavigate={onNavigate} />

      {/* ── MATCH FIXTURES QUICK-ACCESS SECTION ── */}
      <section className="section" style={{ background: '#0A2352', padding: '64px 0' }}>
        <div className="container">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.12)', color: '#FFD700',
                fontSize: 12, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase',
                padding: '5px 14px', borderRadius: 99, marginBottom: 10
              }}>
                <Radio size={13} /> Live Fixtures &amp; Results
              </span>
              <h2 style={{ color: '#fff', fontSize: 'clamp(26px, 4vw, 38px)', margin: 0 }}>
                Match Fixtures &amp; Results
              </h2>
              <p style={{ color: '#9FB0D0', fontSize: 14.5, marginTop: 8, margin: 0 }}>
                All Dialight FA matches — updated pitchside by our coaching staff.
              </p>
            </div>
            <button
              onClick={() => onNavigate('matches')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 22px', borderRadius: 12,
                background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)',
                color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            >
              Full Schedule <ChevronRight size={16} />
            </button>
          </div>

          {loadingFixtures ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: 80, background: 'rgba(255,255,255,0.06)', borderRadius: 16, animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : fixtures.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', background: 'rgba(255,255,255,0.06)', borderRadius: 20, border: '1.5px dashed rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>📅</div>
              <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Season Fixtures Coming Soon</h3>
              <p style={{ color: '#9FB0D0', fontSize: 14.5, maxWidth: 400, margin: '0 auto 20px' }}>
                Match fixtures will appear here once the season schedule is confirmed by our coaching staff.
              </p>
              <button
                onClick={() => onNavigate('matches')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 22px', borderRadius: 12,
                  background: '#1448A8', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', border: 'none'
                }}
              >
                Check Matches Page <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 16 }}>
              {/* Upcoming Fixtures */}
              {upcoming.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#5B86D6', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={13} /> Upcoming
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {upcoming.slice(0, 4).map((f, idx) => (
                      <HomeFixtureCard key={f.id || f._id || idx} fixture={f} isResult={false} onClick={() => onNavigate('matches')} />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Results */}
              {results.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#4ADE80', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={13} /> Recent Results
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {results.map((f, idx) => (
                      <HomeFixtureCard key={f.id || f._id || idx} fixture={f} isResult={true} onClick={() => onNavigate('matches')} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* About Strip */}
      <section className="section" style={{ background: '#F8FAFD', padding: '60px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 28
          }}>
            {[
              { icon: '⚽', title: 'Elite Coaching', desc: 'UEFA-certified methodology adapted for Lagos grassroots excellence.' },
              { icon: '📍', title: 'Adura Field, Alagbado', desc: 'Professional training environment right in our community.' },
              { icon: '🏆', title: 'Competitive Pathway', desc: 'Regular league fixtures, cup tournaments and showcases for scouts.' },
              { icon: '📱', title: 'Mobile Updates', desc: 'Live scores, photos and news updated pitchside by coaching staff.' }
            ].map((item, i) => (
              <div key={i} style={{
                background: '#fff',
                borderRadius: 16,
                padding: '24px 20px',
                border: '1px solid #D6E0F2',
                boxShadow: '0 4px 16px rgba(10,35,82,0.04)'
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 20, marginBottom: 8, color: '#0A2352' }}>{item.title}</h3>
                <p style={{ fontSize: 14.5, color: '#5A6A88', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Squads */}
      <SquadsSection onNavigate={onNavigate} />

      {/* Academy Alumni & Success Stories */}
      <AlumniSection onNavigate={onNavigate} />

      {/* Gallery Teaser */}
      <section className="section" style={{ background: '#0A2352', padding: '72px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-block', background: 'rgba(255,255,255,0.1)', color: '#B9C9EA',
            fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '6px 16px', borderRadius: 99, marginBottom: 16
          }}>Academy Life</span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(32px, 5vw, 52px)', marginBottom: 16 }}>
            The Beautiful Game Lives Here
          </h2>
          <p style={{ color: '#9FB0D0', fontSize: 17, maxWidth: 540, margin: '0 auto 36px' }}>
            Hundreds of players, thousands of moments. See our academy in action.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-green"
              onClick={() => onNavigate('gallery')}
              style={{ fontSize: 16, padding: '14px 28px' }}
            >
              View Photo Gallery
            </button>
            <button
              className="btn btn-ghost-white"
              onClick={() => onNavigate('videos')}
              style={{ fontSize: 16, padding: '14px 28px' }}
            >
              Watch Videos
            </button>
          </div>
        </div>
      </section>

      {/* CTA Join Section */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 40,
            alignItems: 'center'
          }}>
            <div>
              <span className="section-tag">Open Trials</span>
              <h2 className="section-title" style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 16 }}>
                Is Your Child The Next Star?
              </h2>
              <p className="section-desc" style={{ marginBottom: 28 }}>
                We welcome players of all ability levels. Our coaches evaluate technical skill, attitude, and potential — not just current performance.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => onNavigate('join')}
                  style={{ fontSize: 16, padding: '14px 28px' }}
                >
                  Apply for a Trial
                </button>
                <a
                  href={COACH_WHATSAPP_LINK}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-green"
                  style={{ fontSize: 16, padding: '14px 28px' }}
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp Coach</span>
                </a>
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(145deg, #0A2352, #1448A8)',
              borderRadius: 20,
              padding: '36px 32px',
              color: '#fff',
              boxShadow: '0 12px 36px rgba(10,35,82,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ color: '#fff', fontSize: 24, margin: 0 }}>Training Schedule</h3>
                <span style={{ background: '#1F9D55', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase' }}>
                  Adura Field
                </span>
              </div>
              <p style={{ color: '#C5D6F5', fontSize: 13.5, marginBottom: 20 }}>
                Weekly training sessions under Coach Imole Tobi and senior technical staff.
              </p>

              {[
                { squad: 'U10 Foundation Squad', days: 'Mondays, Wednesdays & Fridays', time: '3:00 PM – 5:00 PM' },
                { squad: 'U13 Junior Development', days: 'Mondays, Wednesdays & Fridays', time: '3:00 PM – 5:00 PM' },
                { squad: 'U17 Championship Squad', days: 'Mondays, Wednesdays & Fridays', time: '4:00 PM – 6:00 PM' },
                { squad: 'Free Age Senior Showcase', days: 'Mondays, Wednesdays & Fridays', time: '4:00 PM – 6:00 PM' }
              ].map((s, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  fontSize: 14
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{s.squad}</div>
                    <div style={{ color: '#9FB0D0', fontSize: 12.5 }}>{s.days}</div>
                  </div>
                  <div style={{ background: 'rgba(31,157,85,0.25)', border: '1px solid #1F9D55', color: '#4ADE80', padding: '4px 12px', borderRadius: 99, fontWeight: 800, fontSize: 13 }}>
                    {s.time}
                  </div>
                </div>
              ))}

              {/* Morning Alternative Session */}
              <div style={{
                marginTop: 18,
                background: 'rgba(255,255,255,0.08)',
                padding: '12px 16px',
                borderRadius: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: '#FFD700' }}>Open Training &amp; Conditioning</div>
                  <div style={{ fontSize: 12, color: '#C5D6F5' }}>Mondays, Wednesdays &amp; Fridays</div>
                </div>
                <div style={{ background: 'rgba(255,215,0,0.2)', color: '#FFD700', padding: '4px 10px', borderRadius: 8, fontWeight: 800, fontSize: 13 }}>
                  4:00 PM
                </div>
              </div>

              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, color: '#9FB0D0', fontSize: 13 }}>
                <MapPin size={16} color="#FFD700" />
                <span>Under the Powerline, Adura Field, Alagbado, Lagos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Bulletins Section */}
      <NewsSection onNavigate={onNavigate} />

      {/* Adura Field Map Section */}
      <AduraMapSection />

      {/* Social Connect */}
      <section style={{ background: '#F4F8FE', padding: '48px 0', borderTop: '1px solid #D6E0F2' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 15, color: '#5A6A88', fontWeight: 600, marginBottom: 20 }}>
            FOLLOW US · STAY CONNECTED
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 99, background: '#fff', border: '1px solid #D6E0F2', fontWeight: 700, fontSize: 14, color: '#0A2352' }}>
              📷 Instagram
            </a>
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 99, background: '#fff', border: '1px solid #D6E0F2', fontWeight: 700, fontSize: 14, color: '#0A2352' }}>
              📘 Facebook
            </a>
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 99, background: '#fff', border: '1px solid #D6E0F2', fontWeight: 700, fontSize: 14, color: '#0A2352' }}>
              ▶ YouTube
            </a>
            <a href={COACH_WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 99, background: '#25D366', color: '#fff', fontWeight: 700, fontSize: 14 }}>
              <MessageCircle size={18} /> WhatsApp Coach
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

/* ── Fixture card used inside the home fixtures section ── */
const HomeFixtureCard: React.FC<{ fixture: Fixture; isResult: boolean; onClick: () => void }> = ({ fixture, isResult, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 14,
      padding: '14px 18px',
      cursor: 'pointer',
      transition: 'background 0.2s, border-color 0.2s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
    }}
  >
    {/* Competition & Status */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: '#9FB0D0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {fixture.competition}
      </span>
      <span style={{
        fontSize: 11, fontWeight: 800, padding: '2px 10px', borderRadius: 99,
        background: isResult ? 'rgba(31,157,85,0.2)' : 'rgba(20,72,168,0.3)',
        color: isResult ? '#4ADE80' : '#93BBFF'
      }}>
        {isResult ? (fixture.result || 'FT') : (fixture.status || 'Upcoming')}
      </span>
    </div>

    {/* Teams & score/vs */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <span style={{ fontWeight: 800, fontSize: 14.5, color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {fixture.homeTeam}
      </span>
      {isResult && fixture.result ? (
        <span style={{ fontSize: 17, fontWeight: 900, color: '#FFD700', letterSpacing: '0.06em', flexShrink: 0 }}>{fixture.result}</span>
      ) : (
        <span style={{ fontSize: 12, fontWeight: 700, color: '#B9C9EA', background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: 6, flexShrink: 0 }}>vs</span>
      )}
      <span style={{ fontWeight: 700, fontSize: 14, color: '#C5D6F5', flex: 1, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {fixture.awayTeam}
      </span>
    </div>

    {/* Date */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, color: '#9FB0D0', fontSize: 11.5 }}>
      <Calendar size={11} style={{ flexShrink: 0 }} />
      <span>{fixture.date}</span>
      {fixture.time && <><span>·</span><span>{fixture.time}</span></>}
    </div>
  </div>
);
