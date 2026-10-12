import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, MessageCircle, X, Paperclip, ExternalLink } from 'lucide-react';
import { NewsItem } from '../types';
import { api, COACH_WHATSAPP_LINK } from '../services/api';

interface NewsSectionProps {
  onNavigate?: (page: string) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onNavigate }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    api.getNews().then(setNews);
  }, []);

  const categories = ['all', 'Training', 'Trials', 'Match', 'Announcement'];

  const filteredNews = activeTab === 'all'
    ? news
    : news.filter(n => (n.category || '').toLowerCase() === activeTab.toLowerCase());

  return (
    <section id="academy-news" className="section" style={{ background: '#ffffff', padding: '64px 0' }}>
      <div className="container">
        <div className="section-head">
          <span className="section-tag">Updates &amp; Bulletins</span>
          <h2 className="section-title">Academy News &amp; Announcements</h2>
          <p className="section-desc">
            Stay up to date with match announcements, upcoming trials, pitchside reports and official training schedules at Adura Field.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 36
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 99,
                fontWeight: 700,
                fontSize: 13.5,
                cursor: 'pointer',
                border: 'none',
                background: activeTab === cat ? '#0A2352' : '#F0F4FC',
                color: activeTab === cat ? '#ffffff' : '#475569',
                transition: 'all 0.2s ease',
                textTransform: 'capitalize'
              }}
            >
              {cat === 'all' ? 'All Updates' : cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 24
        }}>
          {filteredNews.map(item => (
            <div
              key={item.id || item._id}
              onClick={() => setSelectedNews(item)}
              style={{
                background: '#F8FAFD',
                borderRadius: 18,
                padding: '24px 22px',
                border: '1.5px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
              }}
              className="news-card"
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginBottom: 14
                }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '3px 10px',
                    borderRadius: 99,
                    background: item.category === 'Training' ? '#E6F6EC' : item.category === 'Trials' ? '#FFF4E5' : item.category === 'Match' ? '#E8F0FC' : '#F3E8FF',
                    color: item.category === 'Training' ? '#1F9D55' : item.category === 'Trials' ? '#D97706' : item.category === 'Match' ? '#1448A8' : '#7C3AED'
                  }}>
                    {item.badge || item.category || 'News'}
                  </span>

                  {/* Date & Time pill */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#64748B'
                  }}>
                    <Calendar size={13} color="#94A3B8" />
                    <span>{item.date}</span>
                    {item.time && (
                      <>
                        <span>•</span>
                        <Clock size={13} color="#94A3B8" />
                        <span>{item.time}</span>
                      </>
                    )}
                  </div>
                </div>

                <h3 style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: '#0A2352',
                  lineHeight: 1.35,
                  marginBottom: 10
                }}>
                  {item.title}
                </h3>

                <p style={{
                  fontSize: 13.5,
                  color: '#475569',
                  lineHeight: 1.6,
                  marginBottom: 16
                }}>
                  {item.content}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #E2E8F0',
                paddingTop: 12,
                marginTop: 6
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  color: '#64748B'
                }}>
                  <MapPin size={13} color="#0A2352" />
                  <span>{item.location || 'Adura Field, Alagbado'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {item.attachmentUrl && (
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#1448A8',
                      background: '#E8F0FC',
                      padding: '3px 8px',
                      borderRadius: 6,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <Paperclip size={11} />
                      Attachment
                    </span>
                  )}
                  <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#1448A8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    Details <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedNews && (
        <div
          onClick={() => setSelectedNews(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(6, 22, 53, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: '32px 28px',
              maxWidth: 520,
              width: '100%',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setSelectedNews(null)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                border: 'none',
                background: '#F1F5F9',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} color="#475569" />
            </button>

            <span style={{
              display: 'inline-block',
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '4px 12px',
              borderRadius: 99,
              marginBottom: 14,
              background: '#E8F0FC',
              color: '#1448A8'
            }}>
              {selectedNews.badge || selectedNews.category}
            </span>

            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0A2352', marginBottom: 14, lineHeight: 1.3 }}>
              {selectedNews.title}
            </h3>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 13,
              color: '#64748B',
              marginBottom: 20,
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} color="#1448A8" />
                <span>{selectedNews.date}</span>
              </div>
              {selectedNews.time && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} color="#1448A8" />
                  <span>{selectedNews.time}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} color="#1F9D55" />
                <span>{selectedNews.location || 'Adura Field, Alagbado'}</span>
              </div>
            </div>

            <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.7, marginBottom: selectedNews.attachmentUrl ? 16 : 26 }}>
              {selectedNews.content}
            </p>

            {/* Attachment link */}
            {selectedNews.attachmentUrl && (
              <a
                href={selectedNews.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  borderRadius: 10,
                  background: '#F0F4FC',
                  color: '#1448A8',
                  fontWeight: 700,
                  fontSize: 13.5,
                  textDecoration: 'none',
                  marginBottom: 20,
                  border: '1px solid #D6E0F2'
                }}
              >
                <Paperclip size={16} />
                <span>View Attachment</span>
                <ExternalLink size={13} style={{ marginLeft: 'auto' }} />
              </a>
            )}
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
                  textDecoration: 'none'
                }}
              >
                <MessageCircle size={16} />
                <span>Inquire on WhatsApp</span>
              </a>

              <button
                onClick={() => setSelectedNews(null)}
                style={{
                  padding: '12px 20px',
                  borderRadius: 12,
                  background: '#F1F5F9',
                  color: '#334155',
                  fontWeight: 600,
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

      <style>{`
        .news-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(10,35,82,0.08);
          border-color: #B9C9EA;
        }
      `}</style>
    </section>
  );
};
