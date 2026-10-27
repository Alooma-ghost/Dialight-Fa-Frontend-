import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MatchesPage } from './pages/MatchesPage';
import { SquadsPage } from './pages/SquadsPage';
import { GalleryPage } from './pages/GalleryPage';
import { VideosPage } from './pages/VideosPage';
import { JoinPage } from './pages/JoinPage';
import { AdminPage } from './pages/AdminPage';
import { NewsTicker } from './components/NewsTicker';
import { Match } from './types';
import { api, FALLBACK_MATCH } from './services/api';

type Page = 'home' | 'matches' | 'squads' | 'gallery' | 'videos' | 'join' | 'admin';

export const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [liveMatch, setLiveMatch] = useState<Match>(FALLBACK_MATCH);

  useEffect(() => {
    api.getLiveMatch().then(setLiveMatch);
    const interval = setInterval(() => api.getLiveMatch().then(setLiveMatch), 30000);
    return () => clearInterval(interval);
  }, []);

  const navigate = (p: string) => {
    setPage(p as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin page gets its own full-screen layout (no navbar/footer)
  if (page === 'admin') {
    return <AdminPage onNavigate={navigate} />;
  }

  return (
    <>
      <Navbar currentPage={page} onNavigate={navigate} />
      <main style={{ minHeight: '100vh' }}>
        {page === 'home'    && <HomePage onNavigate={navigate} />}
        {page === 'matches' && <MatchesPage match={liveMatch} />}
        {page === 'squads'  && <SquadsPage onNavigate={navigate} />}
        {page === 'gallery' && <GalleryPage />}
        {page === 'videos'  && <VideosPage />}
        {page === 'join'    && <JoinPage />}
      </main>
      <Footer onNavigate={navigate} />
      <FloatingWhatsApp />
      <NewsTicker onNavigate={navigate} />
    </>
  );
};
