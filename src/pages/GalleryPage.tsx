import React, { useEffect, useState } from 'react';
import { Photo } from '../types';
import { api, DEFAULT_PLACEHOLDERS } from '../services/api';
import { Camera, Image } from 'lucide-react';

type Category = 'all' | 'match' | 'train' | 'team' | 'alumni';

const CATS: { value: Category; label: string }[] = [
  { value: 'all', label: 'All Photos' },
  { value: 'match', label: 'Match Day' },
  { value: 'train', label: 'Training' },
  { value: 'team', label: 'Team Shots' },
  { value: 'alumni', label: 'Alumni' }
];

const CATEGORY_LABELS: Record<string, string> = {
  match: 'Match Day',
  train: 'Training',
  team: 'Team',
  alumni: 'Alumni'
};

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  match: { bg: '#E8F0FC', color: '#1448A8' },
  train: { bg: '#E6F6EC', color: '#1F9D55' },
  team: { bg: '#FFF4E5', color: '#D97706' },
  alumni: { bg: '#F3E8FF', color: '#7C3AED' }
};

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [photos, setPhotos] = useState<Photo[]>(DEFAULT_PLACEHOLDERS);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [usingReal, setUsingReal] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getPhotos(activeCategory === 'all' ? undefined : activeCategory).then(data => {
      const hasReal = data.some(p => p.url && p.url.startsWith('http'));
      setUsingReal(hasReal);
      setPhotos(data);
      setLoading(false);
    });
  }, [activeCategory]);

  const filtered = activeCategory === 'all'
    ? photos
    : photos.filter(p => p.category === activeCategory);

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#F8FAFD' }}>
      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(6,22,53,0.95)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 900, width: '100%' }}>
            {lightbox.url ? (
              <img
                src={lightbox.url}
                alt={lightbox.title}
                style={{ width: '100%', borderRadius: 16, maxHeight: '75vh', objectFit: 'contain' }}
              />
            ) : (
              <PlaceholderCard photo={lightbox} large />
            )}
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <h3 style={{ color: '#fff', fontSize: 20, marginBottom: 6 }}>{lightbox.title}</h3>
              {lightbox.caption && <p style={{ color: '#9FB0D0', fontSize: 15 }}>{lightbox.caption}</p>}
            </div>
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: 'absolute', top: 20, right: 20,
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >×</button>
          </div>
        </div>
      )}

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Header */}
        <div className="section-head">
          <span className="section-tag"><Camera size={14} /> Photo Gallery</span>
          <h1 className="section-title">Academy Photo Moments</h1>
          <p className="section-desc">
            {usingReal
              ? 'Live photos from our academy – uploaded by coaching staff directly from the pitch.'
              : 'Photos coming soon! Our coaching staff will upload match-day and training shots here.'
            }
          </p>
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
          {CATS.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              style={{
                padding: '9px 20px',
                borderRadius: 99,
                fontWeight: 700,
                fontSize: 14,
                border: '2px solid',
                borderColor: activeCategory === cat.value ? '#1448A8' : '#D6E0F2',
                background: activeCategory === cat.value ? '#1448A8' : '#fff',
                color: activeCategory === cat.value ? '#fff' : '#5A6A88',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ height: 220, borderRadius: 16, background: '#E8F0FC', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Image size={48} color="#D6E0F2" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: '#0A2352', fontSize: 20, marginBottom: 8 }}>No photos yet in this category</h3>
            <p style={{ color: '#5A6A88' }}>Check back soon – coaching staff upload photos after every session.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20
          }}>
            {filtered.map(photo => (
              <div
                key={photo.id || photo._id || photo.title}
                onClick={() => setLightbox(photo)}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(10,35,82,0.06)',
                  border: '1px solid #D6E0F2',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
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
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt={photo.title}
                    style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <PlaceholderCard photo={photo} />
                )}
                <div style={{ padding: '14px 16px', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#0A2352', marginBottom: 4 }}>{photo.title}</div>
                      {photo.caption && <div style={{ fontSize: 13, color: '#5A6A88' }}>{photo.caption}</div>}
                    </div>
                    <span style={{
                      flexShrink: 0,
                      fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                      padding: '3px 9px', borderRadius: 99,
                      ...((CATEGORY_COLORS[photo.category]) || { bg: '#F0F4FC', color: '#5A6A88' }),
                      background: CATEGORY_COLORS[photo.category]?.bg || '#F0F4FC',
                      color: CATEGORY_COLORS[photo.category]?.color || '#5A6A88'
                    }}>
                      {CATEGORY_LABELS[photo.category] || photo.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Coming soon notice if using placeholders */}
        {!usingReal && !loading && (
          <div style={{
            marginTop: 40, padding: '20px 24px',
            background: 'linear-gradient(135deg, #E8F0FC, #F4F8FE)',
            border: '1px solid #B9C9EA', borderRadius: 16,
            display: 'flex', alignItems: 'center', gap: 16
          }}>
            <Camera size={28} color="#1448A8" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#0A2352', fontSize: 15, marginBottom: 4 }}>
                Photos Coming Soon
              </div>
              <div style={{ color: '#5A6A88', fontSize: 14 }}>
                Coaching staff will upload real match-day and training photos directly from their phones. Check back after each session!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PlaceholderCard: React.FC<{ photo: Photo; large?: boolean }> = ({ photo, large }) => {
  const gradients: Record<string, string> = {
    match: 'linear-gradient(145deg, #0A2352 0%, #1448A8 100%)',
    train: 'linear-gradient(145deg, #1F9D55 0%, #0A2352 100%)',
    team: 'linear-gradient(145deg, #D97706 0%, #0A2352 100%)',
    alumni: 'linear-gradient(145deg, #7C3AED 0%, #0A2352 100%)',
    all: 'linear-gradient(145deg, #0A2352 0%, #1448A8 100%)'
  };
  const emoji: Record<string, string> = {
    match: '⚽', train: '🏃', team: '👥', alumni: '🏆', all: '📷'
  };

  return (
    <div style={{
      height: large ? 380 : 220,
      background: gradients[photo.category] || gradients.match,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06, background: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '16px 16px' }} />
      <div style={{ fontSize: large ? 52 : 36, zIndex: 1 }}>{emoji[photo.category] || '📷'}</div>
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, zIndex: 1 }}>Photo Coming Soon</div>
      {!large && (
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, color: '#fff' }}>
          {CATEGORY_LABELS[photo.category] || photo.category}
        </div>
      )}
    </div>
  );
};
