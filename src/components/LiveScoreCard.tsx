import React from 'react';
import { Match } from '../types';
import { ExternalLink, Radio } from 'lucide-react';

interface LiveScoreCardProps {
  match: Match;
}

export const LiveScoreCard: React.FC<LiveScoreCardProps> = ({ match }) => {
  const isLive = match.status === 'Live';

  return (
    <div className="live-score-card">
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: isLive ? '#E6F6EC' : '#FFF4E5',
              color: isLive ? '#1F9D55' : '#D97706',
              fontSize: 11.5,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '3px 9px',
              borderRadius: 99
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: isLive ? '#1F9D55' : '#D97706',
                animation: isLive ? 'pulse-dot 1.5s infinite' : 'none'
              }}
            />
            {match.status}
          </span>
          <span style={{ fontSize: 12.5, color: '#5A6A88', fontWeight: 600 }}>
            {match.competition} {match.minute ? `· ${match.minute}` : ''}
          </span>
        </div>

        <span style={{ fontSize: 11.5, color: '#9FB0D0', fontWeight: 500 }}>Pitchside Update</span>
      </div>

      {/* Teams & Score */}
      <div className="live-score-teams">
        {/* Home Team */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div
            className="live-score-crest"
            style={{
              background: '#0A2352',
              color: '#fff'
            }}
          >
            {match.homeShort || 'DFA'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#0A2352', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {match.homeTeam}
            </div>
            <span style={{ fontSize: 11.5, color: '#1F9D55', fontWeight: 600 }}>Home Squad</span>
          </div>
        </div>

        {/* Big Score */}
        <div className="live-score-box">
          <span>{match.homeScore ?? '–'}</span>
          <span style={{ color: '#D6E0F2', fontSize: '0.7em' }}>:</span>
          <span>{match.awayScore ?? '–'}</span>
        </div>

        {/* Away Team */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end', textAlign: 'right', minWidth: 0 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#0A2352', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {match.awayTeam}
            </div>
            <span style={{ fontSize: 11.5, color: '#5A6A88', fontWeight: 600 }}>Opponent</span>
          </div>
          <div
            className="live-score-crest"
            style={{
              background: '#F4F8FE',
              border: '1px solid #D6E0F2',
              color: '#5A6A88'
            }}
          >
            {match.awayShort || 'OPP'}
          </div>
        </div>
      </div>

      {/* Footer Info & SofaScore Link */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #F0F4FC', fontSize: 12.5, flexWrap: 'wrap', gap: 8 }}>
        <span style={{ color: '#5A6A88' }}>{match.note || 'Official match scores verified by academy staff.'}</span>
        {match.sofaScoreUrl && (
          <a
            href={match.sofaScoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#1448A8', fontWeight: 700 }}
          >
            <span>View on SofaScore</span>
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </div>
  );
};
