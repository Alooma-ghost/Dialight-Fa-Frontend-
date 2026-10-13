import React, { useState, useEffect } from 'react';
import { MessageCircle, Menu, X, Shield, Calendar, Users, Camera, Video, Trophy } from 'lucide-react';
import { COACH_WHATSAPP_LINK } from '../services/api';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className={`navbar-wrap ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <a
            href="#home"
            className="nav-brand"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
          >
            <div className="brand-crest">
              <img src="/logo.png" alt="Dialight Football Academy Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div className="brand-info">
              <h1>Dialight FA</h1>
              <span>Future Stars</span>
            </div>
          </a>

          <nav className="nav-links">
            <button
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              Home
            </button>
            <button
              className={`nav-link ${currentPage === 'matches' ? 'active' : ''}`}
              onClick={() => handleNavClick('matches')}
            >
              Matches & Live
            </button>
            <button
              className={`nav-link ${currentPage === 'squads' ? 'active' : ''}`}
              onClick={() => handleNavClick('squads')}
            >
              Squads & Pathways
            </button>
            <button
              className={`nav-link ${currentPage === 'gallery' ? 'active' : ''}`}
              onClick={() => handleNavClick('gallery')}
            >
              Gallery
            </button>
            <button
              className={`nav-link ${currentPage === 'videos' ? 'active' : ''}`}
              onClick={() => handleNavClick('videos')}
            >
              Videos
            </button>
            <button
              className={`nav-link ${currentPage === 'join' ? 'active' : ''}`}
              onClick={() => handleNavClick('join')}
            >
              Trials & Join
            </button>
          </nav>

          <div className="nav-cta">
            <a
              href={COACH_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-green nav-cta-whatsapp"
              title="Chat with Head Coach on WhatsApp"
            >
              <MessageCircle size={17} />
              <span>WhatsApp Coach</span>
            </a>

            <button
              className="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}>
        <div className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div className="nav-brand">
              <div className="brand-crest" style={{ background: '#fff' }}>
                <img src="/logo.png" alt="Dialight Football Academy Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div className="brand-info">
                <h1 style={{ color: '#0A2352' }}>Dialight FA</h1>
                <span style={{ color: '#5A6A88' }}>Lagos, Nigeria</span>
              </div>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} style={{ color: '#5A6A88' }}>
              <X size={24} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            <button
              className={`mobile-nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              <Trophy size={20} />
              <span>Academy Home</span>
            </button>
            <button
              className={`mobile-nav-link ${currentPage === 'matches' ? 'active' : ''}`}
              onClick={() => handleNavClick('matches')}
            >
              <Calendar size={20} />
              <span>Matches & Live Score</span>
            </button>
            <button
              className={`mobile-nav-link ${currentPage === 'squads' ? 'active' : ''}`}
              onClick={() => handleNavClick('squads')}
            >
              <Users size={20} />
              <span>Squads & Age Grades</span>
            </button>
            <button
              className={`mobile-nav-link ${currentPage === 'gallery' ? 'active' : ''}`}
              onClick={() => handleNavClick('gallery')}
            >
              <Camera size={20} />
              <span>Photo Gallery</span>
            </button>
            <button
              className={`mobile-nav-link ${currentPage === 'videos' ? 'active' : ''}`}
              onClick={() => handleNavClick('videos')}
            >
              <Video size={20} />
              <span>Video Highlights</span>
            </button>
            <button
              className={`mobile-nav-link ${currentPage === 'join' ? 'active' : ''}`}
              onClick={() => handleNavClick('join')}
            >
              <Shield size={20} />
              <span>Request a Trial</span>
            </button>
            <button
              className={`mobile-nav-link ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={() => handleNavClick('admin')}
              style={{ marginTop: 12, borderTop: '1px solid #E8F0FC', paddingTop: 14 }}
            >
              <span>Coach & Staff Login</span>
            </button>
          </div>

          <div style={{ paddingTop: 20, borderTop: '1px solid #D6E0F2' }}>
            <a
              href={COACH_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-green"
              style={{ width: '100%' }}
            >
              <MessageCircle size={18} />
              <span>WhatsApp: +234 814 053 2536</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
