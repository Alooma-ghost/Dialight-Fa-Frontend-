import React, { useEffect, useState, useCallback } from 'react';
import { Video } from '../types';
import { api } from '../services/api';
import { Play, Paperclip, Film, X } from 'lucide-react';

const CATEGORY_LABEL: Record<string, string> = {
  highlight: 'Match Highlight',
  training: 'Training',
  feature: 'Feature'
};

const getBaseUrl = (): string => {
  const saved = localStorage.getItem('dfa_api_url');
  if (saved) return saved.replace(/\/+$/, '');
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl.replace(/\/+$/, '');
  if (import.meta.env.PROD) {
    return 'https://dialight-fa-backend.onrender.com';
  }
  return '';
};

const extractYoutubeId = (url?: string): string | null => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/|^)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

export const VideosPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [filter, setFilter] = useState<'all' | 'highlight' | 'training' | 'feature'>('all');

  useEffect(() => {
    api.getVideos().then(data => {
      setVideos(data);
      setLoading(false);
    });
  }, []);

  const closeModal = useCallback(() => setActiveVideo(null), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (activeVideo) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [activeVideo, closeModal]);

  const filtered = filter === 'all' ? videos : videos.filter(v => v.category === filter);

  const resolveVideoUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') || url.startsWith('blob:') ? url : `${getBaseUrl()}${url}`;
  };

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#F8FAFD' }}>
      {/* ── VIDEO PLAYER MODAL ─────────────────────────────────────── */}
      {activeVideo && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(6,22,53,0.96)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 880, position: 'relative' }}>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: -46,
                right: 0,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none'
              }}
              title="Close (Esc)"
            >
              <X size={22} />
            </button>

            {/* YouTube Embed vs Direct Upload HTML5 Player */}
            {activeVideo.youtubeId || extractYoutubeId(activeVideo.url) ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 16, overflow: 'hidden', background: '#000', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId || extractYoutubeId(activeVideo.url)}?autoplay=1`}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div style={{ borderRadius: 16, overflow: 'hidden', background: '#000', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
                <video
                  src={resolveVideoUrl(activeVideo.url)}
                  controls
                  autoPlay
                  playsInline
                  style={{ width: '100%', maxHeight: '74vh', display: 'block' }}
                />
              </div>
            )}

            <div style={{ marginTop: 18, textAlign: 'center' }}>
              <span style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: 99,
                fontSize: 11.5,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 8,
                background: activeVideo.category === 'highlight' ? '#D92534' : activeVideo.category === 'training' ? '#1F9D55' : '#1448A8',
                color: '#fff'
              }}>
                {CATEGORY_LABEL[activeVideo.category] || activeVideo.category}
              </span>
              <h3 style={{ color: '#fff', fontSize: 22, margin: '0 0 6px', fontWeight: 800 }}>{activeVideo.title}</h3>
              {activeVideo.caption && (
                <p style={{ color: '#B9C9EA', fontSize: 14, margin: 0, maxWidth: 600, marginInline: 'auto' }}>
                  {activeVideo.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Header */}
        <div className="section-head">
          <span className="section-tag"><Play size={14} /> Video Hub</span>
          <h1 className="section-title">Videos &amp; Highlights</h1>
          <p className="section-desc">
            Match highlights, training clips, and player features from Dialight Football Academy at Adura Field.
          </p>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
          {['all', 'highlight', 'training', 'feature'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat as typeof filter)}
              style={{
                padding: '9px 20px', borderRadius: 99, fontWeight: 700, fontSize: 14,
                border: '2px solid',
                borderColor: filter === cat ? '#0A2352' : '#D6E0F2',
                background: filter === cat ? '#0A2352' : '#fff',
                color: filter === cat ? '#fff' : '#5A6A88',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {cat === 'all' ? 'All Videos' : CATEGORY_LABEL[cat]}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 280, borderRadius: 16, background: '#E8F0FC', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Play size={48} color="#D6E0F2" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: '#0A2352', fontSize: 20, marginBottom: 8 }}>No videos yet</h3>
            <p style={{ color: '#5A6A88' }}>Coaching staff will upload match highlights and training clips here soon.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {filtered.map(video => {
              const ytId = video.youtubeId || extractYoutubeId(video.url);
              const isUpload = video.videoType === 'upload' || (!ytId && !!video.url);

              return (
                <div
                  key={video.id || video._id}
                  onClick={() => setActiveVideo(video)}
                  style={{
                    borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
                    background: '#fff', border: '1.5px solid #D6E0F2',
                    boxShadow: '0 4px 16px rgba(10,35,82,0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(10,35,82,0.14)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(10,35,82,0.06)';
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#0A2352', overflow: 'hidden' }}>
                    {ytId ? (
                      <img
                        src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                        alt={video.title}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, background: '#061635' }}>
                        <video
                          src={resolveVideoUrl(video.url)}
                          preload="metadata"
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                        />
                      </div>
                    )}

                    {/* Source pill top right */}
                    <span style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'rgba(6, 22, 53, 0.8)', backdropFilter: 'blur(4px)',
                      color: isUpload ? '#93C5FD' : '#FCA5A5',
                      fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
                      display: 'flex', alignItems: 'center', gap: 4
                    }}>
                      {isUpload ? <Paperclip size={10} /> : <Film size={10} />}
                      <span>{isUpload ? 'File Upload' : 'YouTube'}</span>
                    </span>

                    {/* Play Overlay */}
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(10,35,82,0.25)', transition: 'background 0.2s'
                    }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.95)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                      }}>
                        <Play size={22} color="#0A2352" fill="#0A2352" style={{ marginLeft: 3 }} />
                      </div>
                    </div>

                    {/* Category pill top left */}
                    <span style={{
                      position: 'absolute', top: 12, left: 12,
                      background: video.category === 'highlight' ? '#D92534' : video.category === 'training' ? '#1F9D55' : '#1448A8',
                      color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em',
                      textTransform: 'uppercase', padding: '3px 10px', borderRadius: 99
                    }}>
                      {CATEGORY_LABEL[video.category] || video.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: 15.5, fontWeight: 800, color: '#0A2352', marginBottom: 6, lineHeight: 1.4 }}>
                        {video.title}
                      </h3>
                      {video.caption && <p style={{ fontSize: 13, color: '#5A6A88', margin: 0, lineHeight: 1.5 }}>{video.caption}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
