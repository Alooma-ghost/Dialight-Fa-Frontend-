import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell, Clock, Calendar, MapPin, Paperclip, ChevronDown, ChevronUp,
  X, ExternalLink, MessageCircle
} from 'lucide-react';
import { NewsItem } from '../types';
import { api, COACH_WHATSAPP_LINK } from '../services/api';

interface NewsTickerProps {
  onSelectNews?: (item: NewsItem) => void;
  onNavigate?: (page: string) => void;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ onSelectNews, onNavigate }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [minimized, setMinimized] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<NewsItem | null>(null);

  useEffect(() => {
    api.getNews().then(setNews);
    const interval = setInterval(() => {
      api.getNews().then(setNews);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // Live Lagos time update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Africa/Lagos',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setCurrentTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };
    updateTime();
    const tInterval = setInterval(updateTime, 1000);
    return () => clearInterval(tInterval);
  }, []);

  const closeDetail = useCallback(() => setActiveItem(null), []);

  // Escape key handler for detail modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDetail();
    };
    if (activeItem) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeItem, closeDetail]);

  const handleItemClick = (item: NewsItem) => {
    setActiveItem(item);
    if (onSelectNews) onSelectNews(item);
  };

  if (!news || news.length === 0) return null;

  return (
    <>
      {/* ── MINIMIZED FLOATING PILL ───────────────────────────────────── */}
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="ticker-reopen-btn"
          title="Show Academy Live News Ticker"
          aria-label="Expand News Ticker"
        >
          <span className="ticker-pulse-dot" />
          <Bell size={14} className="ticker-bell-icon" />
          <span className="ticker-reopen-text">Live News Ticker</span>
          <span className="ticker-reopen-count">{news.length}</span>
          <ChevronUp size={14} />
        </button>
      ) : (
        /* ── FIXED BOTTOM DOCKED TICKER BAR ─────────────────────────── */
        <aside aria-label="Live Academy News Ticker" className="news-ticker-fixed-dock">
          {/* Ticker Lead Badge */}
          <div className="ticker-lead">
            <span className="ticker-pulse-dot" />
            <Bell size={13} className="ticker-icon" />
            <span className="ticker-label">ACADEMY NEWS</span>
          </div>

          {/* Live Lagos Clock on Desktop */}
          <div className="ticker-clock" title="West Africa Time (Lagos, Nigeria)">
            <Clock size={12} />
            <span>{currentTime || 'Lagos WAT'}</span>
          </div>

          {/* Marquee Content */}
          <div className="ticker-marquee-track">
            <div className="ticker-marquee-inner">
              {/* Double mapped for seamless loop */}
              {[...news, ...news].map((item, idx) => (
                <div
                  key={`${item.id || item._id || idx}-${idx}`}
                  className="ticker-item"
                  onClick={() => handleItemClick(item)}
                  role="button"
                  tabIndex={0}
                  title="Click to read full bulletin & view attachment"
                >
                  <span className={`ticker-cat-tag cat-${(item.category || 'news').toLowerCase()}`}>
                    {item.badge || item.category || 'Update'}
                  </span>
                  <span className="ticker-datetime">
                    <Calendar size={11} />
                    <span>{item.date}</span>
                    {item.time && (
                      <>
                        <span className="ticker-dot">•</span>
                        <Clock size={11} />
                        <span>{item.time}</span>
                      </>
                    )}
                  </span>
                  <span className="ticker-headline">{item.title}</span>
                  {item.attachmentUrl && (
                    <span className="ticker-attachment-badge" title="Has document or media attachment">
                      <Paperclip size={10} />
                      <span>Attachment</span>
                    </span>
                  )}
                  <span className="ticker-loc">
                    <MapPin size={11} />
                    <span>{item.location || 'Adura Field, Alagbado'}</span>
                  </span>
                  <span className="ticker-separator">✦</span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls Right */}
          <div className="ticker-controls">
            <button
              onClick={() => setMinimized(true)}
              className="ticker-minimize-btn"
              title="Minimize News Ticker"
              aria-label="Minimize News Ticker"
            >
              <ChevronDown size={15} />
            </button>
          </div>
        </aside>
      )}

      {/* ── NEWS BULLETIN DETAIL MODAL ─────────────────────────────── */}
      {activeItem && (
        <div
          onClick={closeDetail}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(6, 22, 53, 0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            animation: 'fadeInModal 0.2s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 20,
              maxWidth: 540,
              width: '100%',
              padding: 28,
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              animation: 'slideUpModal 0.22s ease'
            }}
          >
            {/* Close button */}
            <button
              onClick={closeDetail}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569'
              }}
              title="Close bulletin (Esc)"
            >
              <X size={18} />
            </button>

            {/* Category tag */}
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 12,
                background: '#E8F0FC',
                color: '#1448A8'
              }}
            >
              {activeItem.category || 'Announcement'}
            </span>

            {/* Title */}
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0A2352', marginBottom: 14, paddingRight: 32, lineHeight: 1.3 }}>
              {activeItem.title}
            </h3>

            {/* Meta details */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13, color: '#64748B', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #EEF2F6' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Calendar size={14} color="#1448A8" />
                <span>{activeItem.date}</span>
              </span>
              {activeItem.time && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={14} color="#1448A8" />
                  <span>{activeItem.time}</span>
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <MapPin size={14} color="#D92534" />
                <span>{activeItem.location || 'Adura Field, Alagbado, Lagos'}</span>
              </span>
            </div>

            {/* Content body */}
            <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.7, marginBottom: 24, whiteSpace: 'pre-line' }}>
              {activeItem.content}
            </p>

            {/* Attachment Button */}
            {activeItem.attachmentUrl && (
              <a
                href={activeItem.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 18px',
                  borderRadius: 12,
                  background: '#F8FAFD',
                  color: '#1448A8',
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  marginBottom: 20,
                  border: '1.5px solid #D6E0F2',
                  transition: 'background 0.2s ease'
                }}
              >
                <Paperclip size={16} />
                <span>View / Download Attached File</span>
                <ExternalLink size={14} style={{ marginLeft: 'auto' }} />
              </a>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <a
                href={COACH_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 18px',
                  borderRadius: 12,
                  background: '#25D366',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(37,211,102,0.3)'
                }}
              >
                <MessageCircle size={16} />
                <span>Inquire on WhatsApp</span>
              </a>

              <button
                onClick={closeDetail}
                style={{
                  padding: '12px 20px',
                  borderRadius: 12,
                  background: '#F1F5F9',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: 14,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STYLES ─────────────────────────────────────────────────── */}
      <style>{`
        /* Fixed docked bottom bar */
        .news-ticker-fixed-dock {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 890;
          background: rgba(6, 22, 53, 0.96);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          color: #ffffff;
          display: flex;
          align-items: center;
          height: 42px;
          border-top: 1.5px solid rgba(255, 215, 0, 0.35);
          box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          font-size: 12.5px;
          user-select: none;
        }

        .ticker-lead {
          display: flex;
          align-items: center;
          gap: 7px;
          background: linear-gradient(135deg, #D92534, #B01725);
          color: #ffffff;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 0 14px;
          height: 100%;
          flex-shrink: 0;
          z-index: 2;
          box-shadow: 4px 0 14px rgba(0,0,0,0.3);
          font-family: var(--font-display, sans-serif);
        }

        .ticker-pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff;
          animation: tickerPulse 1.5s infinite;
        }

        @keyframes tickerPulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }

        .ticker-clock {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.08);
          color: #B9C9EA;
          font-weight: 600;
          font-size: 11px;
          padding: 0 12px;
          height: 100%;
          flex-shrink: 0;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          font-variant-numeric: tabular-nums;
        }

        @media (max-width: 768px) {
          .ticker-clock { display: none; }
          .ticker-lead { padding: 0 10px; font-size: 11px; }
          .ticker-label { font-size: 11px; }
        }

        .ticker-marquee-track {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
          display: flex;
          align-items: center;
        }

        .ticker-marquee-inner {
          display: inline-flex;
          align-items: center;
          animation: marqueeScroll 45s linear infinite;
        }

        .ticker-marquee-track:hover .ticker-marquee-inner {
          animation-play-state: paused;
        }

        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .ticker-item:hover .ticker-headline {
          color: #FFD700;
          text-decoration: underline;
        }

        .ticker-cat-tag {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 7px;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.14);
          color: #fff;
        }

        .ticker-cat-tag.cat-training { background: #1F9D55; }
        .ticker-cat-tag.cat-trials { background: #E68A00; }
        .ticker-cat-tag.cat-match { background: #1448A8; }
        .ticker-cat-tag.cat-announcement { background: #7C3AED; }

        .ticker-datetime {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #9FB0D0;
          font-size: 11.5px;
          font-weight: 600;
        }

        .ticker-dot {
          color: rgba(255, 255, 255, 0.4);
          margin: 0 2px;
        }

        .ticker-headline {
          font-weight: 600;
          color: #ffffff;
          font-size: 12.5px;
        }

        .ticker-attachment-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: rgba(255, 215, 0, 0.2);
          border: 1px solid rgba(255, 215, 0, 0.4);
          color: #FFD700;
          padding: 1px 7px;
          border-radius: 99px;
          font-size: 10px;
          font-weight: 700;
        }

        .ticker-loc {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #B9C9EA;
          font-size: 11px;
          opacity: 0.85;
        }

        .ticker-separator {
          color: #D92534;
          margin-left: 8px;
          font-size: 11px;
          opacity: 0.8;
        }

        .ticker-controls {
          display: flex;
          align-items: center;
          padding: 0 10px;
          flex-shrink: 0;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          height: 100%;
        }

        .ticker-minimize-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #B9C9EA;
          border-radius: 6px;
          padding: 4px 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justifyContent: center;
          transition: all 0.15s ease;
        }

        .ticker-minimize-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        /* Floating Reopen Pill Button */
        .ticker-reopen-btn {
          position: fixed;
          bottom: 18px;
          left: 20px;
          z-index: 890;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #061635;
          color: #ffffff;
          padding: 9px 14px;
          border-radius: 99px;
          border: 1.5px solid rgba(255, 215, 0, 0.4);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
          font-weight: 700;
          font-size: 12.5px;
          cursor: pointer;
          animation: slideUpModal 0.2s ease;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .ticker-reopen-btn:hover {
          transform: translateY(-2px);
          background: #0A2352;
        }

        .ticker-reopen-count {
          background: #D92534;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 99px;
        }

        @media (max-width: 500px) {
          .ticker-reopen-text { display: none; }
        }
      `}</style>
    </>
  );
};
