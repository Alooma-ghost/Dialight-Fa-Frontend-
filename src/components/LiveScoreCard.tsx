import React from 'react';
import { Match } from '../types';
import { ExternalLink, Radio } from 'lucide-react';

interface LiveScoreCardProps {
  match: Match;
}

export const LiveScoreCard: React.FC<LiveScoreCardProps> = ({ match }) => {
  const isLive = match.status === 'Live';

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 20,
        padding: '24px 28px',
        border: '1px solid #D6E0F2',
        boxShadow: '0 12px 32px rgba(10, 35, 82, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}
    >
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: isLive ? '#E6F6EC' : '#FFF4E5',
              color: isLive ? '#1F9D55' : '#D97706',
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '4px 10px',
              borderRadius: 99
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: isLive ? '#1F9D55' : '#D97706',
                animation: isLive ? 'pulse-dot 1.5s infinite' : 'none'
              }}
            />
            {match.status}
          </span>
          <span style={{ fontSize: 13, color: '#5A6A88', fontWeight: 600 }}>
            {match.competition} {match.minute ? `· ${match.minute}` : ''}
          </span>
        </div>

        <span style={{ fontSize: 12, color: '#5A6A88', fontWeight: 500 }}>Pitchside Update</span>
      </div>

      {/* Teams & Score */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16, padding: '10px 0' }}>
        {/* Home Team */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#0A2352',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 900,
              fontSize: 16,
              flexShrink: 0
            }}
          >
            {match.homeShort || 'DFA'}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0A2352', lineHeight: 1.2 }}>{match.homeTeam}</div>
            <span style={{ fontSize: 12, color: '#1F9D55', fontWeight: 600 }}>Home Squad</span>
          </div>
        </div>

        {/* Big Score */}
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 44,
            letterSpacing: '0.02em',
            color: '#0A2352',
            background: '#F4F8FE',
            padding: '4px 20px',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          <span>{match.homeScore ?? '–'}</span>
          <span style={{ color: '#D6E0F2', fontSize: 30 }}>:</span>
          <span>{match.awayScore ?? '–'}</span>
        </div>

        {/* Away Team */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end', textAlign: 'right' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0A2352', lineHeight: 1.2 }}>{match.awayTeam}</div>
            <span style={{ fontSize: 12, color: '#5A6A88', fontWeight: 600 }}>Opponent</span>
          </div>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: '#F4F8FE',
              border: '1px solid #D6E0F2',
              color: '#5A6A88',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 900,
              fontSize: 16,
              flexShrink: 0
            }}
          >
            {match.awayShort || 'OPP'}
          </div>
        </div>
      </div>

      {/* Footer Info & SofaScore Link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #F0F4FC', fontSize: 13, flexWrap: 'wrap', gap: 10 }}>
        <span style={{ color: '#5A6A88' }}>{match.note || 'Official match scores verified by academy staff.'}</span>
        {match.sofaScoreUrl && (
          <a
            href={match.sofaScoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#1448A8', fontWeight: 700 }}
          >
            <span>View on SofaScore</span>
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};
