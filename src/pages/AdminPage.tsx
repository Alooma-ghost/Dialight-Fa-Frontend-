import React, { useState, useRef, useEffect } from 'react';
import {
  Camera, Upload, LogOut, BarChart2, Image, Video, Users,
  CheckCircle, AlertCircle, Plus, Trash2, Edit3, X, Menu,
  Calendar, Shield, Radio, Eye, EyeOff, Bell, ExternalLink, RefreshCw, Settings, Paperclip,
  Play, Search, Film
} from 'lucide-react';

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

const getAuthHeaders = (): Record<string, string> => {
  const token = sessionStorage.getItem('dfa_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

type AdminSection = 'dashboard' | 'photos' | 'scores' | 'fixtures' | 'videos' | 'trials' | 'news';

interface AdminPageProps {
  onNavigate?: (page: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem('dfa_admin_token'));
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [mobileNav, setMobileNav] = useState(false);

  if (!authed) {
    return <LoginScreen
      username={username} setUsername={setUsername}
      pw={pw} setPw={setPw}
      error={pwError}
      loading={loggingIn}
      onNavigate={onNavigate}
      onLogin={async () => {
        setLoggingIn(true);
        setPwError('');
        try {
          const res = await fetch(`${getBaseUrl()}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.trim() || 'admin', password: pw })
          });
          const data = await res.json();
          if (res.ok && data.token) {
            sessionStorage.setItem('dfa_admin_token', data.token);
            setAuthed(true);
            setPwError('');
          } else {
            setPwError(data.error || 'Invalid username or password. Please try again.');
          }
        } catch (err: any) {
          setPwError(`Cannot reach backend server (${getBaseUrl() || 'same-origin'}). Ensure backend is running.`);
        } finally {
          setLoggingIn(false);
        }
      }}
    />;
  }

  const logout = () => {
    sessionStorage.removeItem('dfa_admin_token');
    setAuthed(false);
  };

  const navItems: { key: AdminSection; icon: React.ReactNode; label: string }[] = [
    { key: 'dashboard', icon: <BarChart2 size={20} />, label: 'Dashboard' },
    { key: 'photos', icon: <Camera size={20} />, label: 'Photos & Gallery' },
    { key: 'videos', icon: <Video size={20} />, label: 'Videos & Clips' },
    { key: 'news', icon: <Bell size={20} />, label: 'News & Ticker' },
    { key: 'scores', icon: <Radio size={20} />, label: 'Live Score' },
    { key: 'fixtures', icon: <Calendar size={20} />, label: 'Fixtures & Results' },
    { key: 'trials', icon: <Users size={20} />, label: 'Trial Requests' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F4F8FE', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#0A2352', color: '#fff',
        padding: '0 20px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(10,35,82,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setMobileNav(!mobileNav)}
            style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <Menu size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fff', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo.png" alt="DFA Crest" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1 }}>Coach Portal</div>
              <div style={{ fontSize: 11, color: '#9FB0D0' }}>Dialight Football Academy</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onNavigate && (
            <button onClick={() => onNavigate('home')} style={{ fontSize: 13, color: '#9FB0D0', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}>
              ← Main Site
            </button>
          )}
          <button
            onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '7px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar (desktop) */}
        <nav style={{
          width: 220, background: '#fff', borderRight: '1px solid #D6E0F2',
          padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4,
          position: 'sticky', top: 60, height: 'calc(100vh - 60px)', overflowY: 'auto'
        }} className="admin-sidebar">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', borderRadius: 10, fontWeight: 600, fontSize: 14,
                color: section === item.key ? '#1448A8' : '#5A6A88',
                background: section === item.key ? '#E8F0FC' : 'transparent',
                transition: 'all 0.15s', cursor: 'pointer', textAlign: 'left', border: 'none'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Mobile Nav Drawer */}
        {mobileNav && (
          <div
            onClick={() => setMobileNav(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,35,82,0.5)', backdropFilter: 'blur(4px)' }}
          >
            <div onClick={e => e.stopPropagation()} style={{ width: 260, background: '#fff', height: '100%', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: '0 4px' }}>
                <span style={{ fontWeight: 700, color: '#0A2352' }}>Navigation</span>
                <button onClick={() => setMobileNav(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} color="#5A6A88" /></button>
              </div>
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => { setSection(item.key); setMobileNav(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '14px 14px', borderRadius: 10, fontWeight: 600, fontSize: 15,
                    color: section === item.key ? '#1448A8' : '#5A6A88',
                    background: section === item.key ? '#E8F0FC' : 'transparent',
                    cursor: 'pointer', textAlign: 'left', border: 'none'
                  }}
                >
                  {item.icon}<span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main style={{ flex: 1, padding: '24px 20px', maxWidth: '100%', overflowX: 'hidden' }}>
          {section === 'dashboard' && <DashboardSection onNavigate={setSection} />}
          {section === 'photos' && <PhotoUploadSection />}
          {section === 'videos' && <VideoSection />}
          {section === 'news' && <NewsAdminSection />}
          {section === 'scores' && <LiveScoreSection />}
          {section === 'fixtures' && <FixturesSection />}
          {section === 'trials' && <TrialsSection />}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
        }
        @media (min-width: 769px) {
          .admin-sidebar { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

/* ─── LOGIN SCREEN ─────────────────────────────────────────────────────── */
const LoginScreen: React.FC<{
  username: string; setUsername: (v: string) => void;
  pw: string; setPw: (v: string) => void;
  error: string; loading: boolean; onLogin: () => void;
  onNavigate?: (page: string) => void;
}> = ({ username, setUsername, pw, setPw, error, loading, onLogin, onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #061635, #0A2352, #1448A8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 440, boxShadow: '0 24px 64px rgba(0,0,0,0.4)', position: 'relative' }}>
        
        {/* Return to site button */}
        {onNavigate && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button
              onClick={() => onNavigate('home')}
              style={{ fontSize: 13, color: '#1448A8', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              ← Back to Main Site
            </button>
            <span style={{ fontSize: 11, background: '#E8F0FC', color: '#1448A8', fontWeight: 800, padding: '3px 8px', borderRadius: 99 }}>
              STAFF ONLY
            </span>
          </div>
        )}

        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: '#ffffff',
            boxShadow: '0 8px 24px rgba(10,35,82,0.15)',
            border: '2px solid #D6E0F2',
            padding: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <img src="/logo.png" alt="Dialight Football Academy Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h2 style={{ color: '#0A2352', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Coach & Staff Portal</h2>
          <p style={{ color: '#5A6A88', fontSize: 13.5 }}>Dialight Football Academy · Adura Field, Lagos</p>
        </div>

        {error && (
          <div style={{ padding: '12px 14px', background: '#FFF1F0', border: '1px solid #FCA5A5', borderRadius: 12, marginBottom: 20, fontSize: 13.5, color: '#D92534', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={e => { e.preventDefault(); onLogin(); }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#0A2352', marginBottom: 6 }}>Username</label>
            <input
              type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="Enter admin username"
              autoFocus
              style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '1.5px solid #D6E0F2', fontSize: 15, outline: 'none', fontFamily: 'inherit', background: '#F8FAFD' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#0A2352', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={pw} onChange={e => setPw(e.target.value)}
                placeholder="Enter admin password"
                style={{ width: '100%', padding: '13px 44px 13px 16px', borderRadius: 12, border: '1.5px solid #D6E0F2', fontSize: 15, outline: 'none', fontFamily: 'inherit', background: '#F8FAFD' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#5A6A88', cursor: 'pointer', padding: 4 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '15px', borderRadius: 12, background: loading ? '#6B8AC7' : '#1448A8', color: '#fff', fontWeight: 800, fontSize: 15.5, cursor: loading ? 'not-allowed' : 'pointer', border: 'none', boxShadow: '0 4px 16px rgba(20,72,168,0.3)', transition: 'all 0.2s' }}
          >
            {loading ? 'Authenticating Coach…' : 'Sign in to Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ─── DASHBOARD ─────────────────────────────────────────────────────────── */
const DashboardSection: React.FC<{ onNavigate: (s: AdminSection) => void }> = ({ onNavigate }) => (
  <div>
    <h1 style={{ fontSize: 26, color: '#0A2352', marginBottom: 6 }}>Coach Dashboard</h1>
    <p style={{ color: '#5A6A88', marginBottom: 28, fontSize: 14 }}>Welcome back, Coach. Manage media, match day scores, fixtures and player trials.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 16 }}>
      {[
        { icon: <Camera size={28} />, label: 'Photos & Gallery', sub: 'Upload & delete match-day photos', color: '#1448A8', bg: '#E8F0FC', key: 'photos' },
        { icon: <Video size={28} />, label: 'Videos & Clips', sub: 'Add & delete YouTube highlights', color: '#7C3AED', bg: '#F3E8FF', key: 'videos' },
        { icon: <Bell size={28} />, label: 'News & Ticker', sub: 'Live announcements & scrolling ticker', color: '#D97706', bg: '#FFF4E5', key: 'news' },
        { icon: <Radio size={28} />, label: 'Live Score', sub: 'Update current match score', color: '#D92534', bg: '#FFF1F0', key: 'scores' },
        { icon: <Calendar size={28} />, label: 'Fixtures', sub: 'Manage upcoming games & results', color: '#1F9D55', bg: '#E6F6EC', key: 'fixtures' },
        { icon: <Users size={28} />, label: 'Trial Requests', sub: 'Review player applications', color: '#0A2352', bg: '#F0F4FC', key: 'trials' }
      ].map(item => (
        <button
          key={item.key}
          onClick={() => onNavigate(item.key as AdminSection)}
          style={{
            padding: '20px 16px', borderRadius: 16, textAlign: 'left',
            background: item.bg, border: `1.5px solid ${item.color}22`,
            cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
            display: 'flex', flexDirection: 'column', gap: 10
          }}
        >
          <div style={{ color: item.color }}>{item.icon}</div>
          <div>
            <div style={{ fontWeight: 700, color: '#0A2352', fontSize: 14 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: '#5A6A88', marginTop: 2 }}>{item.sub}</div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

/* ─── PHOTO UPLOAD & DELETE ────────────────────────────────────────────── */
const PhotoUploadSection: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('match');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<any[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const loadPhotos = async () => {
    setLoadingPhotos(true);
    try {
      const res = await fetch(`${getBaseUrl()}/api/photos`);
      if (res.ok) {
        const data = await res.json();
        setExistingPhotos(Array.isArray(data) ? data : []);
      }
    } catch (_) {}
    setLoadingPhotos(false);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const arr = Array.from(incoming);
    setFiles(prev => [...prev, ...arr]);
    arr.forEach(f => {
      const reader = new FileReader();
      reader.onload = e => setPreviews(prev => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeSelectedFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (files.length === 0) { setResult({ type: 'error', msg: 'Please select at least one photo.' }); return; }
    setUploading(true);
    setResult(null);
    let uploaded = 0, failed = 0;
    for (const file of files) {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('category', category);
      fd.append('title', title || file.name.replace(/\.[^.]+$/, ''));
      fd.append('caption', caption);
      try {
        const res = await fetch(`${getBaseUrl()}/api/photos/upload`, { method: 'POST', headers: getAuthHeaders(), body: fd });
        if (res.ok) uploaded++; else failed++;
      } catch { failed++; }
    }
    setUploading(false);
    if (uploaded > 0) {
      setResult({ type: 'success', msg: `✅ ${uploaded} photo${uploaded > 1 ? 's' : ''} uploaded successfully!${failed > 0 ? ` (${failed} failed)` : ''}` });
      setFiles([]); setPreviews([]); setTitle(''); setCaption('');
      loadPhotos();
    } else {
      setResult({ type: 'error', msg: `❌ Upload failed. Check server connection.` });
    }
  };

  const handleDeletePhoto = async (photoId: string, photoTitle?: string) => {
    if (!window.confirm(`Are you sure you want to delete "${photoTitle || 'this photo'}"?`)) return;
    setDeletingId(photoId);
    try {
      const res = await fetch(`${getBaseUrl()}/api/photos/${photoId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setResult({ type: 'success', msg: '✅ Photo deleted successfully!' });
        setExistingPhotos(prev => prev.filter(p => (p.id || p._id) !== photoId));
      } else {
        setResult({ type: 'error', msg: '❌ Failed to delete photo.' });
      }
    } catch (_) {
      setResult({ type: 'error', msg: '❌ Network error while deleting photo.' });
    }
    setDeletingId(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 24, color: '#0A2352', margin: 0 }}>Photos & Gallery</h1>
          <p style={{ color: '#5A6A88', fontSize: 14, margin: '4px 0 0' }}>Upload new photos from your phone and manage or delete existing images.</p>
        </div>
        <button
          onClick={loadPhotos}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, background: '#fff', border: '1px solid #D6E0F2', color: '#1448A8', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
        >
          <RefreshCw size={14} /> Refresh Photos
        </button>
      </div>

      {result && (
        <div style={{ padding: '12px 16px', borderRadius: 12, margin: '16px 0', fontSize: 14, fontWeight: 600, background: result.type === 'success' ? '#E6F6EC' : '#FFF1F0', color: result.type === 'success' ? '#1F9D55' : '#D92534', border: `1px solid ${result.type === 'success' ? '#86EFAC' : '#FCA5A5'}` }}>
          {result.msg}
        </div>
      )}

      {/* Upload Box */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #D6E0F2', padding: 20, marginBottom: 32 }}>
        <h2 style={{ fontSize: 17, color: '#0A2352', marginBottom: 16 }}>Upload New Photos</h2>

        {/* Mobile Camera Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => cameraRef.current?.click()}
            style={{ padding: '14px 12px', borderRadius: 12, background: '#0A2352', color: '#fff', fontWeight: 700, fontSize: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', border: 'none' }}
          >
            <Camera size={24} />
            <span>Take Photo</span>
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            style={{ padding: '14px 12px', borderRadius: 12, background: '#1448A8', color: '#fff', fontWeight: 700, fontSize: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', border: 'none' }}
          >
            <Image size={24} />
            <span>Choose Files</span>
          </button>
        </div>

        <input ref={cameraRef} type="file" accept="image/*" capture="environment" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />

        {/* Previews */}
        {previews.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 10, marginBottom: 16 }}>
            {previews.map((src, i) => (
              <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '1', border: '1px solid #D6E0F2' }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <button
                  onClick={() => removeSelectedFile(i)}
                  style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(217,37,52,0.9)', color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
                >×</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0A2352', marginBottom: 6 }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #D6E0F2', fontSize: 14, background: '#F8FAFD', outline: 'none' }}>
              <option value="match">Match Day</option>
              <option value="train">Training</option>
              <option value="team">Team Photo</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0A2352', marginBottom: 6 }}>Photo Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. U17 Match Day Action" style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #D6E0F2', fontSize: 14, background: '#F8FAFD', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0A2352', marginBottom: 6 }}>Caption</label>
            <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Short description" style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #D6E0F2', fontSize: 14, background: '#F8FAFD', outline: 'none' }} />
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          style={{ width: '100%', padding: '14px', borderRadius: 10, background: uploading ? '#9FB0D0' : '#1F9D55', color: '#fff', fontWeight: 700, fontSize: 15, cursor: uploading ? 'not-allowed' : 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Upload size={18} />
          {uploading ? 'Uploading Photos...' : `Upload ${files.length > 0 ? files.length : ''} Photo${files.length !== 1 ? 's' : ''}`}
        </button>
      </div>

      {/* Existing Uploaded Photos Gallery with DELETE Button */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #D6E0F2', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, color: '#0A2352', margin: 0 }}>
            Uploaded Academy Photos ({existingPhotos.length})
          </h2>
          <span style={{ fontSize: 12, color: '#5A6A88' }}>Click delete to remove any photo from website</span>
        </div>

        {loadingPhotos ? (
          <p style={{ color: '#5A6A88', fontSize: 14 }}>Loading gallery photos...</p>
        ) : existingPhotos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: '#5A6A88' }}>
            <Camera size={36} color="#D6E0F2" style={{ margin: '0 auto 8px' }} />
            <p style={{ margin: 0 }}>No photos uploaded to database yet. Use the upload box above.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {existingPhotos.map(p => {
              const pId = p.id || p._id;
              const imgSrc = p.dataUrl || p.url || '/logo.png';
              return (
                <div key={pId} style={{ border: '1px solid #D6E0F2', borderRadius: 12, overflow: 'hidden', background: '#F8FAFD', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#0A2352', overflow: 'hidden' }}>
                    <img src={imgSrc} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(10,35,82,0.85)', color: '#fff', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 99 }}>
                      {p.category}
                    </span>
                  </div>

                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 700, color: '#0A2352', fontSize: 13.5, marginBottom: 4 }}>
                      {p.title || 'Academy Photo'}
                    </div>
                    {p.caption && <div style={{ fontSize: 12, color: '#5A6A88', marginBottom: 8, lineHeight: 1.4 }}>{p.caption}</div>}

                    <button
                      onClick={() => handleDeletePhoto(pId, p.title)}
                      disabled={deletingId === pId}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: '#FFF1F0',
                        color: '#D92534',
                        border: '1px solid #FCA5A5',
                        fontWeight: 700,
                        fontSize: 12.5,
                        cursor: deletingId === pId ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <Trash2 size={14} />
                      {deletingId === pId ? 'Deleting...' : 'Delete Photo'}
                    </button>
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

/* ─── VIDEOS SECTION (FILE ATTACHMENT & EASY YOUTUBE) ────────────────────── */
const VideoSection: React.FC = () => {
  const [tab, setTab] = useState<'upload' | 'youtube'>('upload');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewingVideo, setPreviewingVideo] = useState<any | null>(null);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'highlight' | 'training' | 'feature'>('highlight');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // YouTube State
  const [ytInput, setYtInput] = useState('');
  const [ytTitle, setYtTitle] = useState('');
  const [ytCategory, setYtCategory] = useState<'highlight' | 'training' | 'feature'>('highlight');
  const [ytCaption, setYtCaption] = useState('');
  const [savingYt, setSavingYt] = useState(false);

  const load = () => {
    setLoading(true);
    fetch(`${getBaseUrl()}/api/videos`)
      .then(r => r.json())
      .then(d => {
        setVideos(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (filePreview && filePreview.startsWith('blob:')) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  // Universal YouTube ID extraction (links, shorts, embed, raw 11-char ID)
  const extractYtId = (str: string): string => {
    if (!str) return '';
    const trimmed = str.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const m = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/);
    return m && m[1] ? m[1] : '';
  };

  const detectedYtId = extractYtId(ytInput);

  // Handle Video File Selection
  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
    if (!uploadTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setUploadTitle(cleanName);
    }
  };

  const removeSelectedFile = () => {
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview('');
  };

  // Submit Video File Attachment
  const handleUploadVideo = async () => {
    if (!selectedFile) {
      setMsg('❌ Please choose a video file to upload.');
      return;
    }
    setUploading(true);
    setMsg('');

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('title', uploadTitle.trim() || selectedFile.name);
      formData.append('category', uploadCategory);
      formData.append('caption', uploadCaption.trim());

      const res = await fetch(`${getBaseUrl()}/api/videos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });
      const data = await res.json();

      if (res.ok) {
        setMsg('✅ Video attachment uploaded successfully!');
        removeSelectedFile();
        setUploadTitle('');
        setUploadCaption('');
        load();
      } else {
        setMsg(`❌ ${data.error || 'Failed to upload video.'}`);
      }
    } catch (err: any) {
      setMsg(`❌ Network error uploading video: ${err.message || 'Check connection.'}`);
    } finally {
      setUploading(false);
    }
  };

  // Submit YouTube Video
  const handleAddYouTube = async () => {
    const trimmed = ytInput.trim();
    const id = detectedYtId || trimmed;
    if (!id) {
      setMsg('❌ Please provide a YouTube video ID, link or keywords.');
      return;
    }
    if (!ytTitle.trim()) {
      setMsg('❌ Please enter a video title.');
      return;
    }

    setSavingYt(true);
    setMsg('');

    try {
      const res = await fetch(`${getBaseUrl()}/api/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          title: ytTitle.trim(),
          youtubeId: detectedYtId,
          url: detectedYtId ? `https://www.youtube.com/watch?v=${detectedYtId}` : trimmed,
          category: ytCategory,
          caption: ytCaption.trim()
        })
      });
      const data = await res.json();

      if (res.ok) {
        setMsg('✅ YouTube video added successfully!');
        setYtInput('');
        setYtTitle('');
        setYtCaption('');
        load();
      } else {
        setMsg(`❌ ${data.error || 'Failed to add YouTube video.'}`);
      }
    } catch (err: any) {
      setMsg('❌ Network error adding YouTube video.');
    } finally {
      setSavingYt(false);
    }
  };

  // Delete Video
  const del = async (id: string, title?: string) => {
    if (!window.confirm(`Are you sure you want to delete video "${title || ''}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${getBaseUrl()}/api/videos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setMsg('✅ Video deleted successfully!');
        load();
      } else {
        setMsg('❌ Failed to delete video.');
      }
    } catch (_) {
      setMsg('❌ Network error deleting video.');
    }
    setDeletingId(null);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, color: '#0A2352', margin: '0 0 6px', fontWeight: 800 }}>Videos &amp; Match Clips</h1>
        <p style={{ color: '#5A6A88', margin: 0, fontSize: 14.5 }}>
          Upload direct video file attachments (like photos) or easily add YouTube match highlights &amp; drills.
        </p>
      </div>

      {msg && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 12,
          marginBottom: 20,
          fontSize: 14,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: msg.startsWith('✅') ? '#E6F6EC' : '#FFF1F0',
          color: msg.startsWith('✅') ? '#1F9D55' : '#D92534',
          border: `1px solid ${msg.startsWith('✅') ? '#86EFAC' : '#FCA5A5'}`
        }}>
          {msg.startsWith('✅') ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{msg}</span>
        </div>
      )}

      {/* Main Creation Card */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #D6E0F2', padding: 24, marginBottom: 32, boxShadow: '0 6px 20px rgba(10,35,82,0.04)' }}>
        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid #EEF2F6', paddingBottom: 16 }}>
          <button
            onClick={() => setTab('upload')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 14.5,
              cursor: 'pointer',
              border: 'none',
              background: tab === 'upload' ? '#0A2352' : '#F1F5F9',
              color: tab === 'upload' ? '#fff' : '#475569',
              transition: 'all 0.15s ease'
            }}
          >
            <Paperclip size={16} />
            <span>Upload Video File (Attachment)</span>
          </button>

          <button
            onClick={() => setTab('youtube')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 14.5,
              cursor: 'pointer',
              border: 'none',
              background: tab === 'youtube' ? '#D92534' : '#F1F5F9',
              color: tab === 'youtube' ? '#fff' : '#475569',
              transition: 'all 0.15s ease'
            }}
          >
            <Film size={16} />
            <span>Add from YouTube (Easy)</span>
          </button>
        </div>

        {/* ── TAB 1: DIRECT VIDEO FILE ATTACHMENT UPLOAD ─────────────────── */}
        {tab === 'upload' && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 17, color: '#0A2352', margin: '0 0 4px', fontWeight: 800 }}>
                Upload Video File from Device
              </h2>
              <p style={{ fontSize: 13.5, color: '#64748B', margin: 0 }}>
                Attach an MP4, MOV, or WebM video directly from your phone or computer.
              </p>
            </div>

            {/* Quick Action Buttons (Like Photos) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                style={{
                  padding: '16px 14px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #0A2352, #1448A8)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(10,35,82,0.2)'
                }}
              >
                <Camera size={20} />
                <span>Record Video (Camera)</span>
              </button>

              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                style={{
                  padding: '16px 14px',
                  borderRadius: 14,
                  background: '#F0F4FC',
                  color: '#1448A8',
                  fontWeight: 700,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  border: '2px dashed #B9C9EA'
                }}
              >
                <Upload size={20} />
                <span>Choose Video File</span>
              </button>
            </div>

            {/* Hidden Inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="video/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={e => handleFileSelect(e.target.files?.[0] || null)}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-m4v,video/*"
              style={{ display: 'none' }}
              onChange={e => handleFileSelect(e.target.files?.[0] || null)}
            />

            {/* Selected Video Preview Card */}
            {selectedFile && filePreview && (
              <div style={{
                background: '#F8FAFD',
                borderRadius: 16,
                border: '1.5px solid #D6E0F2',
                padding: 16,
                marginBottom: 20
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 700, color: '#0A2352' }}>
                    <Paperclip size={16} color="#1448A8" />
                    <span>{selectedFile.name}</span>
                    <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                      ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                    </span>
                  </div>
                  <button
                    onClick={removeSelectedFile}
                    style={{ background: '#FFF1F0', border: '1px solid #FCA5A5', color: '#D92534', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Change Video
                  </button>
                </div>

                <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000', maxHeight: 240, display: 'flex', justifyContent: 'center' }}>
                  <video
                    src={filePreview}
                    controls
                    playsInline
                    style={{ width: '100%', maxHeight: 240, display: 'block' }}
                  />
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
              <AdminInput
                label="Video Title"
                value={uploadTitle}
                onChange={e => setUploadTitle(e.target.value)}
                placeholder="e.g. U17 Finishing & Sprint Drills"
              />

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0A2352', marginBottom: 6 }}>
                  Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={e => setUploadCategory(e.target.value as any)}
                  style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #D6E0F2', fontSize: 14, background: '#F8FAFD', outline: 'none' }}
                >
                  <option value="highlight">Match Highlight</option>
                  <option value="training">Training Clip</option>
                  <option value="feature">Player Feature</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0A2352', marginBottom: 6 }}>
                  Caption / Notes
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={e => setUploadCaption(e.target.value)}
                  placeholder="Short description (optional)"
                  style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #D6E0F2', fontSize: 14, background: '#F8FAFD', outline: 'none' }}
                />
              </div>
            </div>

            <button
              onClick={handleUploadVideo}
              disabled={uploading || !selectedFile}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                background: uploading ? '#9FB0D0' : '#1F9D55',
                color: '#fff',
                fontWeight: 800,
                fontSize: 15,
                cursor: uploading || !selectedFile ? 'not-allowed' : 'pointer',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(31,157,85,0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <Upload size={18} />
              <span>{uploading ? 'Uploading Video Attachment…' : 'Upload Video Attachment'}</span>
            </button>
          </div>
        )}

        {/* ── TAB 2: EASY YOUTUBE ADD ───────────────────────────────────── */}
        {tab === 'youtube' && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 17, color: '#0A2352', margin: '0 0 4px', fontWeight: 800 }}>
                Easy YouTube Video Add
              </h2>
              <p style={{ fontSize: 13.5, color: '#64748B', margin: 0 }}>
                Paste any YouTube link, short link, video ID, or search YouTube directly.
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#0A2352' }}>
                  YouTube Link, Video ID, or Code *
                </label>
                {ytInput && (
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ytInput)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, color: '#1448A8', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Search size={12} />
                    <span>Search on YouTube ↗</span>
                  </a>
                )}
              </div>
              <input
                type="text"
                value={ytInput}
                onChange={e => setYtInput(e.target.value)}
                placeholder="e.g. dQw4w9WgXcQ or youtu.be/... or paste full link"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #D6E0F2', fontSize: 14, background: '#F8FAFD', outline: 'none' }}
              />
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 5 }}>
                💡 Tip: You can paste full URLs, shorts, or just the 11-digit video ID.
              </div>
            </div>

            {/* Instant Live Preview of Detected YouTube Video */}
            {detectedYtId && (
              <div style={{
                background: '#F8FAFD',
                borderRadius: 16,
                border: '1.5px solid #86EFAC',
                padding: 16,
                marginBottom: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#1F9D55', fontWeight: 700, marginBottom: 10 }}>
                  <CheckCircle size={15} />
                  <span>Detected YouTube Video ID: <code>{detectedYtId}</code></span>
                </div>
                <div style={{ position: 'relative', paddingBottom: '45%', borderRadius: 12, overflow: 'hidden', background: '#000' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${detectedYtId}`}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
              <AdminInput
                label="Video Title *"
                value={ytTitle}
                onChange={e => setYtTitle(e.target.value)}
                placeholder="e.g. U17 Championship Match Highlights"
              />

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0A2352', marginBottom: 6 }}>
                  Category
                </label>
                <select
                  value={ytCategory}
                  onChange={e => setYtCategory(e.target.value as any)}
                  style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #D6E0F2', fontSize: 14, background: '#F8FAFD', outline: 'none' }}
                >
                  <option value="highlight">Match Highlight</option>
                  <option value="training">Training Clip</option>
                  <option value="feature">Player Feature</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0A2352', marginBottom: 6 }}>
                  Caption (optional)
                </label>
                <input
                  type="text"
                  value={ytCaption}
                  onChange={e => setYtCaption(e.target.value)}
                  placeholder="Short description"
                  style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #D6E0F2', fontSize: 14, background: '#F8FAFD', outline: 'none' }}
                />
              </div>
            </div>

            <button
              onClick={handleAddYouTube}
              disabled={savingYt || !ytInput.trim() || !ytTitle.trim()}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 12,
                background: savingYt || !ytInput.trim() || !ytTitle.trim() ? '#9FB0D0' : '#D92534',
                color: '#fff',
                fontWeight: 800,
                fontSize: 15,
                cursor: savingYt || !ytInput.trim() || !ytTitle.trim() ? 'not-allowed' : 'pointer',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(217,37,52,0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={18} />
              <span>{savingYt ? 'Adding YouTube Video…' : 'Add YouTube Video'}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── ACTIVE VIDEOS LIST ────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #D6E0F2', padding: 24, boxShadow: '0 6px 20px rgba(10,35,82,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, color: '#0A2352', margin: 0, fontWeight: 800 }}>
            Published Academy Videos ({videos.length})
          </h2>
          <span style={{ fontSize: 12.5, color: '#5A6A88' }}>
            Direct uploads and YouTube clips live on website
          </span>
        </div>

        {loading ? (
          <p style={{ color: '#5A6A88', fontSize: 14 }}>Loading videos…</p>
        ) : videos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: '#5A6A88' }}>
            <Video size={40} color="#D6E0F2" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px', color: '#0A2352' }}>No videos in database yet</p>
            <p style={{ fontSize: 13, margin: 0 }}>Use the file upload or YouTube tab above to post your first video.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {videos.map((v: any) => {
              const vId = v._id || v.id;
              const isUpload = v.videoType === 'upload' || (v.url && v.url.startsWith('/uploads'));
              const ytId = v.youtubeId || extractYtId(v.url);

              return (
                <div
                  key={vId}
                  style={{
                    background: '#F8FAFD',
                    borderRadius: 16,
                    border: '1.5px solid #D6E0F2',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Thumbnail / Preview Area */}
                  <div style={{ position: 'relative', paddingBottom: '52%', background: '#061635', overflow: 'hidden' }}>
                    {ytId ? (
                      <img
                        src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                        alt={v.title}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <video
                        src={v.url?.startsWith('http') ? v.url : `${getBaseUrl()}${v.url}`}
                        preload="metadata"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                      />
                    )}

                    {/* Source Badge */}
                    <span style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: isUpload ? 'rgba(20,72,168,0.9)' : 'rgba(217,37,52,0.9)',
                      backdropFilter: 'blur(4px)',
                      color: '#fff',
                      fontSize: 10.5,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 99,
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      {isUpload ? <Paperclip size={10} /> : <Film size={10} />}
                      <span>{isUpload ? 'File Attachment' : 'YouTube'}</span>
                    </span>

                    {/* Play Button Overlay */}
                    <button
                      onClick={() => setPreviewingVideo(v)}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      title="Preview video"
                    >
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                      }}>
                        <Play size={18} fill="#0A2352" color="#0A2352" style={{ marginLeft: 2 }} />
                      </div>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0A2352', fontSize: 15, marginBottom: 4 }}>
                        {v.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ textTransform: 'capitalize', fontWeight: 700, color: '#1448A8' }}>
                          {v.category || 'Highlight'}
                        </span>
                        <span>•</span>
                        <span>{isUpload ? (v.filename || 'Direct MP4') : 'YouTube ID: ' + (ytId || 'Link')}</span>
                      </div>
                      {v.caption && (
                        <p style={{ fontSize: 12.5, color: '#475569', margin: '0 0 12px', lineHeight: 1.4 }}>
                          {v.caption}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button
                        onClick={() => setPreviewingVideo(v)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          background: '#E8F0FC',
                          color: '#1448A8',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: 8,
                          fontWeight: 700,
                          fontSize: 12.5,
                          cursor: 'pointer'
                        }}
                      >
                        <Play size={13} />
                        <span>Watch</span>
                      </button>

                      <button
                        onClick={() => del(vId, v.title)}
                        disabled={deletingId === vId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          background: '#FFF1F0',
                          color: '#D92534',
                          border: '1px solid #FCA5A5',
                          padding: '8px 14px',
                          borderRadius: 8,
                          fontWeight: 700,
                          fontSize: 12.5,
                          cursor: deletingId === vId ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <Trash2 size={13} />
                        <span>{deletingId === vId ? '…' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── VIDEO PREVIEW MODAL ───────────────────────────────────────── */}
      {previewingVideo && (
        <div
          onClick={() => setPreviewingVideo(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(6,22,53,0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 760, position: 'relative' }}>
            <button
              onClick={() => setPreviewingVideo(null)}
              style={{
                position: 'absolute',
                top: -46,
                right: 0,
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: 20,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>

            {previewingVideo.youtubeId || extractYtId(previewingVideo.url) ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 16, overflow: 'hidden', background: '#000' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${previewingVideo.youtubeId || extractYtId(previewingVideo.url)}?autoplay=1`}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div style={{ borderRadius: 16, overflow: 'hidden', background: '#000' }}>
                <video
                  src={previewingVideo.url?.startsWith('http') ? previewingVideo.url : `${getBaseUrl()}${previewingVideo.url}`}
                  controls
                  autoPlay
                  playsInline
                  style={{ width: '100%', maxHeight: '75vh', display: 'block' }}
                />
              </div>
            )}

            <div style={{ marginTop: 14, textAlign: 'center', color: '#fff' }}>
              <h3 style={{ fontSize: 20, margin: 0, fontWeight: 800 }}>{previewingVideo.title}</h3>
              {previewingVideo.caption && (
                <p style={{ fontSize: 14, color: '#B9C9EA', marginTop: 4 }}>{previewingVideo.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── NEWS & TICKER SECTION (WITH ADD & DELETE) ────────────────────────── */
const NewsAdminSection: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Announcement',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: '4:00 PM',
    location: 'Adura Field, Alagbado, Lagos',
    badge: 'Latest'
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${getBaseUrl()}/api/news`);
      if (res.ok) {
        const d = await res.json();
        setNews(Array.isArray(d) ? d : []);
      }
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const add = async () => {
    if (!form.title) { setMsg('Headline title is required.'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('content', form.content);
      fd.append('category', form.category);
      fd.append('date', form.date);
      fd.append('time', form.time);
      fd.append('location', form.location);
      fd.append('badge', form.badge);
      if (attachmentFile) {
        fd.append('attachment', attachmentFile);
      }

      const res = await fetch(`${getBaseUrl()}/api/news`, {
        method: 'POST',
        headers: { ...getAuthHeaders() }, // NO Content-Type — browser sets it with boundary
        body: fd
      });
      if (res.ok) {
        setMsg('✅ News announcement published! It is now scrolling on the website ticker.');
        setForm({
          title: '',
          content: '',
          category: 'Announcement',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          time: '4:00 PM',
          location: 'Adura Field, Alagbado, Lagos',
          badge: 'Latest'
        });
        setAttachmentFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        load();
      } else {
        const errData = await res.json().catch(() => ({}));
        setMsg(`❌ Failed to publish: ${errData.error || 'Unknown error'}`);
      }
    } catch (e: any) {
      setMsg(`❌ Network error: ${e.message}`);
    }
    setSaving(false);
  };

  const del = async (id: string, title?: string) => {
    if (!window.confirm(`Delete news item "${title || ''}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${getBaseUrl()}/api/news/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setMsg('✅ News deleted.');
        load();
      } else {
        setMsg('❌ Failed to delete news.');
      }
    } catch (_) {
      setMsg('❌ Network error deleting news.');
    }
    setDeletingId(null);
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, color: '#0A2352', marginBottom: 6 }}>News & Live Ticker</h1>
      <p style={{ color: '#5A6A88', marginBottom: 20, fontSize: 14 }}>Post announcements that appear on the scrolling ticker and news section across the site.</p>

      {msg && <div style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 16, fontSize: 14, fontWeight: 600, background: msg.startsWith('✅') ? '#E6F6EC' : '#FFF1F0', color: msg.startsWith('✅') ? '#1F9D55' : '#D92534' }}>{msg}</div>}

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #D6E0F2', padding: 20, marginBottom: 24 }}>
        <h2 style={{ fontSize: 17, color: '#0A2352', marginBottom: 16 }}>Create New Bulletin / Ticker Story</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
          <AdminInput label="Headline *" value={form.title} onChange={set('title')} placeholder="e.g. Open Trials for U10 & U13 Squads" />
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0A2352', marginBottom: 6 }}>Category</label>
            <select value={form.category} onChange={set('category')} style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #D6E0F2', fontSize: 14, background: '#F8FAFD', outline: 'none' }}>
              <option value="Announcement">Announcement</option>
              <option value="Training">Training</option>
              <option value="Trials">Trials</option>
              <option value="Match">Match</option>
            </select>
          </div>
          <AdminInput label="Date (required)" value={form.date} onChange={set('date')} placeholder="Mon, 12 Oct 2026" />
          <AdminInput label="Time (required)" value={form.time} onChange={set('time')} placeholder="4:00 PM – 6:00 PM" />
          <AdminInput label="Location" value={form.location} onChange={set('location')} placeholder="Adura Field, Alagbado, Lagos" />
          <AdminInput label="Ticker Tag" value={form.badge} onChange={set('badge')} placeholder="Schedule, Open Trials, Fixture" />
          {/* --- FILE ATTACHMENT --- */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0A2352', marginBottom: 6 }}>
              <Paperclip size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} />
              Attachment (optional — image, PDF, video, doc)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <label
                htmlFor="news-attachment-input"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '10px 18px', borderRadius: 10,
                  background: attachmentFile ? '#E6F6EC' : '#F0F4FF',
                  border: `1.5px dashed ${attachmentFile ? '#1F9D55' : '#1448A8'}`,
                  color: attachmentFile ? '#1F9D55' : '#1448A8',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Upload size={15} />
                {attachmentFile ? 'Change File' : 'Choose File to Upload'}
              </label>
              <input
                id="news-attachment-input"
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setAttachmentFile(f);
                }}
              />
              {attachmentFile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: '#F8FAFD', border: '1px solid #D6E0F2', fontSize: 13 }}>
                  <Paperclip size={13} color="#1448A8" />
                  <span style={{ color: '#0A2352', fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {attachmentFile.name}
                  </span>
                  <span style={{ color: '#8899B5', fontSize: 11 }}>({(attachmentFile.size / 1024).toFixed(1)} KB)</span>
                  <button
                    onClick={() => { setAttachmentFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D92534', display: 'flex', padding: 0, marginLeft: 4 }}
                    title="Remove attachment"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0A2352', marginBottom: 6 }}>Details / Body</label>
          <textarea
            value={form.content}
            onChange={set('content')}
            rows={3}
            placeholder="Detailed description of the announcement..."
            style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #D6E0F2', fontSize: 14, background: '#F8FAFD', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <button onClick={add} disabled={saving} style={{ padding: '12px 24px', borderRadius: 10, background: '#1448A8', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', border: 'none' }}>
          {saving ? 'Publishing...' : '+ Publish Bulletin'}
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #D6E0F2', padding: 20 }}>
        <h2 style={{ fontSize: 17, color: '#0A2352', marginBottom: 14 }}>Live News Items ({news.length})</h2>

        {loading ? <p style={{ color: '#5A6A88' }}>Loading news...</p> : news.length === 0 ? (
          <p style={{ color: '#5A6A88', fontSize: 14 }}>No news announcements added yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {news.map((item: any) => {
              const nId = item._id || item.id;
              return (
                <div key={nId} style={{ background: '#F8FAFD', borderRadius: 12, border: '1px solid #D6E0F2', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 99, background: '#0A2352', color: '#fff' }}>
                        {item.badge || item.category}
                      </span>
                      <span style={{ fontSize: 12, color: '#5A6A88', fontWeight: 600 }}>
                        {item.date} · {item.time}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, color: '#0A2352', fontSize: 14.5 }}>{item.title}</div>
                    {item.content && <div style={{ fontSize: 13, color: '#5A6A88', marginTop: 4 }}>{item.content}</div>}
                    <div style={{ fontSize: 11.5, color: '#8899B5', marginTop: 4 }}>📍 {item.location}</div>
                    {item.attachmentUrl && (
                      <div style={{ marginTop: 8 }}>
                        {/\.(jpeg|jpg|png|webp|gif|svg|avif)$/i.test(item.attachmentUrl) && (
                          <img
                            src={item.attachmentUrl.startsWith('http') ? item.attachmentUrl : `${getBaseUrl()}${item.attachmentUrl}`}
                            alt={item.title}
                            style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, border: '1.5px solid #D6E0F2', display: 'block', marginBottom: 6 }}
                          />
                        )}
                        <div style={{ fontSize: 12, color: '#1448A8', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Paperclip size={13} />
                          <a
                            href={item.attachmentUrl.startsWith('http') ? item.attachmentUrl : `${getBaseUrl()}${item.attachmentUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#1448A8', textDecoration: 'underline', fontWeight: 600 }}
                          >
                            {item.attachmentName || item.attachmentUrl.split('/').pop() || 'View Attachment'}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => del(nId, item.title)}
                    disabled={deletingId === nId}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: '#FFF1F0', color: '#D92534', border: '1px solid #FCA5A5',
                      padding: '8px 12px', borderRadius: 8, fontWeight: 700, fontSize: 12.5,
                      cursor: deletingId === nId ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Trash2 size={14} />
                    <span>{deletingId === nId ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── LIVE SCORE ────────────────────────────────────────────────────────── */
const LiveScoreSection: React.FC = () => {
  const [form, setForm] = useState({ homeTeam: 'Dialight U17', awayTeam: '', homeShort: 'DFA', awayShort: '', homeScore: 0, awayScore: 0, status: 'Live', minute: '', competition: '', note: '', sofaScoreUrl: '' });
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${getBaseUrl()}/api/match/live`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(form)
      });
      if (res.ok) setResult({ type: 'success', msg: '✅ Live score updated on the website!' });
      else setResult({ type: 'error', msg: '❌ Failed to update. Check connection.' });
    } catch { setResult({ type: 'error', msg: '❌ Network error. Try again.' }); }
    setSaving(false);
  };

  const scoreBtn = (team: 'home' | 'away', delta: number) => () =>
    setForm(p => team === 'home'
      ? { ...p, homeScore: Math.max(0, p.homeScore + delta) }
      : { ...p, awayScore: Math.max(0, p.awayScore + delta) });

  return (
    <div>
      <h1 style={{ fontSize: 24, color: '#0A2352', marginBottom: 6 }}>Live Score</h1>
      <p style={{ color: '#5A6A88', marginBottom: 24, fontSize: 14 }}>Update the match score that appears on the main website in real-time.</p>

      {result && (
        <div style={{ padding: '12px 16px', borderRadius: 12, marginBottom: 20, fontSize: 14, fontWeight: 600, background: result.type === 'success' ? '#E6F6EC' : '#FFF1F0', color: result.type === 'success' ? '#1F9D55' : '#D92534' }}>
          {result.msg}
        </div>
      )}

      {/* Big Score Controls */}
      <div style={{ background: '#0A2352', borderRadius: 20, padding: '28px 20px', marginBottom: 24, textAlign: 'center' }}>
        <div style={{ color: '#9FB0D0', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}>
          {form.competition || 'Match'} · {form.status}{form.minute ? ` · ${form.minute}` : ''}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 12 }}>{form.homeTeam || 'Home'}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center' }}>
              <button onClick={scoreBtn('home', -1)} style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 22, cursor: 'pointer', border: 'none' }}>–</button>
              <span style={{ fontSize: 48, fontWeight: 900, color: '#fff', minWidth: 40, textAlign: 'center', lineHeight: 1 }}>{form.homeScore}</span>
              <button onClick={scoreBtn('home', 1)} style={{ width: 44, height: 44, borderRadius: 10, background: '#1F9D55', color: '#fff', fontSize: 22, cursor: 'pointer', border: 'none' }}>+</button>
            </div>
          </div>
          <div style={{ color: '#D6E0F2', fontSize: 28, fontWeight: 900 }}>:</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 12 }}>{form.awayTeam || 'Away'}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center' }}>
              <button onClick={scoreBtn('away', -1)} style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 22, cursor: 'pointer', border: 'none' }}>–</button>
              <span style={{ fontSize: 48, fontWeight: 900, color: '#fff', minWidth: 40, textAlign: 'center', lineHeight: 1 }}>{form.awayScore}</span>
              <button onClick={scoreBtn('away', 1)} style={{ width: 44, height: 44, borderRadius: 10, background: '#1F9D55', color: '#fff', fontSize: 22, cursor: 'pointer', border: 'none' }}>+</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <AdminInput label="Home Team" value={form.homeTeam} onChange={set('homeTeam')} placeholder="Dialight U17" />
          <AdminInput label="Away Team" value={form.awayTeam} onChange={set('awayTeam')} placeholder="Opponent FC" />
          <AdminInput label="Home Short" value={form.homeShort} onChange={set('homeShort')} placeholder="DFA" />
          <AdminInput label="Away Short" value={form.awayShort} onChange={set('awayShort')} placeholder="OPP" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0A2352', marginBottom: 6 }}>Status</label>
            <select value={form.status} onChange={set('status')} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #D6E0F2', fontSize: 15, background: '#F8FAFD', fontFamily: 'inherit', outline: 'none' }}>
              <option value="Live">Live</option>
              <option value="Half Time">Half Time</option>
              <option value="Full Time">Full Time</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>
          <AdminInput label="Minute" value={form.minute} onChange={set('minute')} placeholder="63'" />
        </div>
        <AdminInput label="Competition" value={form.competition} onChange={set('competition')} placeholder="Lagos Youth League" />
        <AdminInput label="Match Note" value={form.note} onChange={set('note')} placeholder="Score updated pitchside by coaching staff" />
        <AdminInput label="SofaScore URL (optional)" value={form.sofaScoreUrl} onChange={set('sofaScoreUrl')} placeholder="https://sofascore.com/..." />
      </div>

      <button onClick={handleSave} disabled={saving} style={{ width: '100%', padding: '16px', borderRadius: 12, background: saving ? '#9FB0D0' : '#D92534', color: '#fff', fontWeight: 700, fontSize: 16, cursor: saving ? 'not-allowed' : 'pointer', border: 'none' }}>
        {saving ? 'Saving...' : 'Update Live Score'}
      </button>
    </div>
  );
};

/* ─── FIXTURES ──────────────────────────────────────────────────────────── */
const FixturesSection: React.FC = () => {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: '', time: '', homeTeam: '', awayTeam: '', competition: '', status: 'Upcoming', result: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    fetch(`${getBaseUrl()}/api/fixtures`).then(r => r.json()).then(data => { setFixtures(Array.isArray(data) ? data : []); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const add = async () => {
    if (!form.homeTeam || !form.awayTeam || !form.date) { setMsg('Fill in required fields.'); return; }
    setSaving(true);
    try {
      const res = await fetch(`${getBaseUrl()}/api/fixtures`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }, body: JSON.stringify({ ...form, isResult: form.status === 'Completed' }) });
      if (res.ok) { setMsg('✅ Fixture added!'); setForm({ date: '', time: '', homeTeam: '', awayTeam: '', competition: '', status: 'Upcoming', result: '' }); load(); }
      else setMsg('❌ Failed to add.');
    } catch { setMsg('❌ Network error.'); }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!window.confirm('Delete this fixture?')) return;
    await fetch(`${getBaseUrl()}/api/fixtures/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    load();
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, color: '#0A2352', marginBottom: 6 }}>Fixtures & Results</h1>
      {msg && <div style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 16, fontSize: 14, fontWeight: 600, background: msg.startsWith('✅') ? '#E6F6EC' : '#FFF1F0', color: msg.startsWith('✅') ? '#1F9D55' : '#D92534' }}>{msg}</div>}

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #D6E0F2', padding: '20px', marginBottom: 24 }}>
        <h2 style={{ fontSize: 17, color: '#0A2352', marginBottom: 16 }}>Add Fixture / Result</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 12 }}>
          <AdminInput label="Date *" value={form.date} onChange={set('date')} placeholder="Sat 17 Oct" />
          <AdminInput label="Time" value={form.time} onChange={set('time')} placeholder="3:00 pm" />
          <AdminInput label="Home Team *" value={form.homeTeam} onChange={set('homeTeam')} placeholder="Dialight U17" />
          <AdminInput label="Away Team *" value={form.awayTeam} onChange={set('awayTeam')} placeholder="Opponent FC" />
          <AdminInput label="Competition" value={form.competition} onChange={set('competition')} placeholder="Youth League" />
          <AdminInput label="Result / Score" value={form.result} onChange={set('result')} placeholder="W 2–0 or 3:00 pm" />
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0A2352', marginBottom: 6 }}>Status</label>
            <select value={form.status} onChange={set('status')} style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #D6E0F2', fontSize: 14, background: '#F8FAFD', fontFamily: 'inherit', outline: 'none' }}>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Postponed">Postponed</option>
            </select>
          </div>
        </div>
        <button onClick={add} disabled={saving} style={{ padding: '12px 24px', borderRadius: 10, background: '#1448A8', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', border: 'none' }}>
          {saving ? 'Adding...' : '+ Add Fixture'}
        </button>
      </div>

      <h2 style={{ fontSize: 17, color: '#0A2352', marginBottom: 14 }}>All Fixtures</h2>
      {loading ? <p style={{ color: '#5A6A88' }}>Loading...</p> : fixtures.length === 0 ? (
        <p style={{ color: '#5A6A88', fontSize: 14 }}>No fixtures added yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {fixtures.map((f: any) => (
            <div key={f._id || f.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #D6E0F2', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0A2352', fontSize: 14 }}>{f.homeTeam} vs {f.awayTeam}</div>
                <div style={{ fontSize: 12, color: '#5A6A88' }}>{f.date} · {f.time} · {f.competition}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: f.status === 'Completed' ? '#E6F6EC' : '#E8F0FC', color: f.status === 'Completed' ? '#1F9D55' : '#1448A8' }}>{f.result || f.status}</span>
                <button onClick={() => del(f._id || f.id)} style={{ color: '#D92534', padding: 6, cursor: 'pointer', display: 'flex', background: 'none', border: 'none' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── TRIALS ────────────────────────────────────────────────────────────── */
const TrialsSection: React.FC = () => {
  const [trials, setTrials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${getBaseUrl()}/api/trials`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(d => { setTrials(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${getBaseUrl()}/api/trials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status })
    });
    setTrials(prev => prev.map(t => (t._id === id || t.id === id) ? { ...t, status } : t));
  };

  const deleteTrial = async (id: string) => {
    if (!window.confirm('Delete this registration?')) return;
    await fetch(`${getBaseUrl()}/api/trials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    setTrials(prev => prev.filter(t => (t._id !== id && t.id !== id)));
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, color: '#0A2352', marginBottom: 6 }}>Trial Requests</h1>
      <p style={{ color: '#5A6A88', marginBottom: 24, fontSize: 14 }}>{trials.length} application{trials.length !== 1 ? 's' : ''} received.</p>

      {loading ? <p style={{ color: '#5A6A88' }}>Loading...</p> : trials.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Users size={40} color="#D6E0F2" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: '#5A6A88' }}>No trial requests yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {trials.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).map((t: any) => {
            const tId = t._id || t.id;
            return (
              <div key={tId} style={{ background: '#fff', borderRadius: 16, border: '1px solid #D6E0F2', padding: '18px 20px', boxShadow: '0 2px 10px rgba(10,35,82,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0A2352', fontSize: 17 }}>{t.playerName}</div>
                    <div style={{ fontSize: 13, color: '#5A6A88' }}>{t.ageGroup} · {t.position || 'Any position'} · {t.preferredFoot || 'Any foot'}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <select value={t.status || 'pending'} onChange={e => updateStatus(tId, e.target.value)} style={{ padding: '6px 12px', borderRadius: 99, border: '1.5px solid #D6E0F2', fontWeight: 700, fontSize: 13, background: t.status === 'approved' ? '#E6F6EC' : t.status === 'contacted' ? '#E8F0FC' : t.status === 'rejected' ? '#FFF1F0' : '#FFF4E5', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button onClick={() => deleteTrial(tId)} style={{ color: '#D92534', padding: 6, background: 'none', border: 'none', cursor: 'pointer' }} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, fontSize: 13 }}>
                  <div><span style={{ color: '#9FB0D0' }}>Phone: </span><a href={`tel:${t.phone}`} style={{ color: '#0A2352', fontWeight: 600 }}>{t.phone}</a></div>
                  {t.parentName && <div><span style={{ color: '#9FB0D0' }}>Parent: </span><span style={{ color: '#0A2352' }}>{t.parentName}</span></div>}
                  {t.previousClub && <div><span style={{ color: '#9FB0D0' }}>Prev Club: </span><span style={{ color: '#0A2352' }}>{t.previousClub}</span></div>}
                </div>
                {t.message && <div style={{ marginTop: 10, fontSize: 13, color: '#5A6A88', background: '#F8FAFD', padding: '8px 12px', borderRadius: 8 }}>"{t.message}"</div>}
                {t.submittedAt && <div style={{ marginTop: 8, fontSize: 12, color: '#9FB0D0' }}>{new Date(t.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── SHARED UI HELPERS ─────────────────────────────────────────────────── */
const AdminInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: '#0A2352', marginBottom: 6 }}>{label}</label>
    <input type="text" value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: '100%', padding: '11px 12px', borderRadius: 10, border: '1.5px solid #D6E0F2', fontSize: 14, background: '#F8FAFD', fontFamily: 'inherit', outline: 'none' }} />
  </div>
);
