import React from 'react';
import { MessageCircle, Phone, MapPin, Mail, Shield } from 'lucide-react';
import { COACH_PHONE, COACH_WHATSAPP_LINK, SOCIAL_LINKS } from '../services/api';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer style={{ background: '#061635', color: '#B9C9EA', paddingTop: 64, paddingBottom: 72, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40, marginBottom: 50 }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fff', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                <img src="/logo.png" alt="Dialight Football Academy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <h3 style={{ color: '#fff', fontSize: 22, margin: 0 }}>Dialight FA</h3>
                <span style={{ fontSize: 13, color: '#1F9D55', fontWeight: 700 }}>Breeding the Future Stars</span>
              </div>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#9FB0D0', marginBottom: 20 }}>
              Premier grassroots football academy based in Alagbado, Lagos. Committed to elite tactical development, character building, and international player pathways.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 18 }} title="Instagram">📷</a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 18 }} title="Facebook">f</a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 18 }} title="YouTube">▶</a>
              <a href={COACH_WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" style={{ width: 38, height: 38, borderRadius: '50%', background: '#25D366', display: 'grid', placeItems: 'center', color: '#fff' }} title="WhatsApp Coach">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: 18, marginBottom: 18, letterSpacing: '0.04em' }}>Academy Programs</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14.5 }}>
              <li><button onClick={() => onNavigate('squads')} style={{ color: '#9FB0D0' }}>Under-10 Grassroots (Foundation)</button></li>
              <li><button onClick={() => onNavigate('squads')} style={{ color: '#9FB0D0' }}>Under-13 Development (Tactical)</button></li>
              <li><button onClick={() => onNavigate('squads')} style={{ color: '#9FB0D0' }}>Under-17 Championship (Elite)</button></li>
              <li><button onClick={() => onNavigate('squads')} style={{ color: '#9FB0D0' }}>Free Age Squad (Senior League)</button></li>
              <li><button onClick={() => onNavigate('matches')} style={{ color: '#9FB0D0' }}>Matchday Fixtures & Results</button></li>
              <li><button onClick={() => onNavigate('gallery')} style={{ color: '#9FB0D0' }}>Academy Photo Moments</button></li>
            </ul>
          </div>

          {/* Contact & Coach Info */}
          <div>
            <h4 style={{ color: '#fff', fontSize: 18, marginBottom: 18, letterSpacing: '0.04em' }}>Head Coach & Trials</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14.5 }}>
              <a
                href={COACH_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#25D366', fontWeight: 700 }}
              >
                <MessageCircle size={18} />
                <span>WhatsApp: {COACH_PHONE}</span>
              </a>
              <a href={`tel:${COACH_PHONE.replace(/\s+/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9FB0D0' }}>
                <Phone size={18} />
                <span>Call Coach: {COACH_PHONE}</span>
              </a>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: '#9FB0D0' }}>
                <MapPin size={18} style={{ flexShrink: 0, marginTop: 3 }} />
                <span>Adura Field, Alagbado, Lagos State, Nigeria</span>
              </div>
              <a href="mailto:info@dialightfa.com" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9FB0D0' }}>
                <Mail size={18} />
                <span>info@dialightfa.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, fontSize: 13.5 }}>
          <div>
            © {new Date().getFullYear()} Dialight Football Academy. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <button onClick={() => onNavigate('join')} style={{ color: '#1F9D55', fontWeight: 600 }}>
              Request a Trial
            </button>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
            <button onClick={() => onNavigate('admin')} style={{ color: '#5A6A88', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Shield size={14} />
              <span>Coach & Staff Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
