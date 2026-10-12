import React, { useEffect, useState } from 'react';
import { Fixture, Match } from '../types';
import { api } from '../services/api';
import { Calendar, Clock, MapPin, ExternalLink, Radio } from 'lucide-react';
import { LiveScoreCard } from '../components/LiveScoreCard';

interface MatchesPageProps {
  match: Match;
}

export const MatchesPage: React.FC<MatchesPageProps> = ({ match }) => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFixtures().then(data => {
      setFixtures(data);
      setLoading(false);
    });
  }, []);

  const results = fixtures.filter(f => f.isResult || f.status === 'Completed');
  const upcoming = fixtures.filter(f => !f.isResult && f.status !== 'Completed');

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#F8FAFD' }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>

        {/* Page Header */}
        <div className="section-head">
          <span className="section-tag"><Radio size={14} /> Live & Fixtures</span>
          <h1 className="section-title">Matches, Fixtures & Results</h1>
          <p className="section-desc">
            All Dialight FA matches updated pitchside by our coaching team. Live scores, upcoming fixtures, and recent results.
          </p>
        </div>

        {/* Live Score Card */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 20, color: '#0A2352', marginBottom: 16 }}>Current Match</h2>
          <div style={{ maxWidth: 600 }}>
            <LiveScoreCard match={match} />
          </div>
        </div>

        {/* Upcoming Fixtures */}
        {upcoming.length > 0 && (
          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 24, color: '#0A2352', marginBottom: 20 }}>
              Upcoming Fixtures
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {loading ? (
                [1, 2].map(i => (
                  <div key={i} style={{ height: 90, background: '#fff', borderRadius: 16, border: '1px solid #D6E0F2', animation: 'pulse 1.5s infinite' }} />
                ))
              ) : upcoming.map(f => (
                <FixtureCard key={f.id || f._id} fixture={f} />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h2 style={{ fontSize: 24, color: '#0A2352', marginBottom: 20 }}>
              Recent Results
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {results.map(f => (
                <FixtureCard key={f.id || f._id} fixture={f} isResult />
              ))}
            </div>
          </div>
        )}

        {!loading && fixtures.length === 0 && (
          <EmptyState
            icon="📅"
            title="No fixtures yet"
            desc="Fixtures will appear here once the season schedule is confirmed."
          />
        )}
      </div>
    </div>
  );
};

const FixtureCard: React.FC<{ fixture: Fixture; isResult?: boolean }> = ({ fixture, isResult }) => (
  <div style={{
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #D6E0F2',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    boxShadow: '0 2px 12px rgba(10,35,82,0.04)',
    flexWrap: 'wrap'
  }}>
    <div style={{ minWidth: 80 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#5A6A88', textTransform: 'uppercase' }}>
        {fixture.date}
      </div>
      <div style={{ fontSize: 13, color: '#9FB0D0' }}>{fixture.time}</div>
    </div>
    <div style={{ flex: 1, minWidth: 200 }}>
      <div style={{ fontWeight: 800, fontSize: 17, color: '#0A2352', marginBottom: 4 }}>
        {fixture.homeTeam} vs {fixture.awayTeam}
      </div>
      <div style={{ fontSize: 13, color: '#5A6A88' }}>{fixture.competition}</div>
    </div>
    <div>
      <span style={{
        padding: '6px 16px',
        borderRadius: 99,
        fontWeight: 700,
        fontSize: 14,
        background: isResult ? '#E6F6EC' : '#E8F0FC',
        color: isResult ? '#1F9D55' : '#1448A8'
      }}>
        {fixture.result || fixture.status}
      </span>
    </div>
  </div>
);

const EmptyState: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
    <div style={{ fontSize: 52, marginBottom: 16 }}>{icon}</div>
    <h3 style={{ color: '#0A2352', fontSize: 22, marginBottom: 10 }}>{title}</h3>
    <p style={{ color: '#5A6A88', maxWidth: 360, margin: '0 auto' }}>{desc}</p>
  </div>
);
