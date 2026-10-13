import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Calendar, Check, ExternalLink, Compass } from 'lucide-react';
import { COACH_WHATSAPP_LINK } from '../services/api';

export const AduraMapSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const address = 'Adura Field, Under the Powerline, Adura Bus Stop, Lagos-Abeokuta Expressway, Alagbado, Lagos State';
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Adura+Field+Alagbado+Lagos';

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="training-ground" className="section" style={{ background: '#F8FAFD', padding: '64px 0' }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: 36 }}>
          <span className="section-tag">Home Pitch & Training Ground</span>
          <h2 className="section-title">Adura Field · Alagbado, Lagos</h2>
          <p className="section-desc">
            Centrally located in Alagbado, Lagos. Easily accessible from Kola, Meiran, Toll Gate, Abule Egba and Sango-Ota.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 24,
          alignItems: 'stretch'
        }}>
          {/* Interactive Map Container */}
          <div style={{
            background: '#ffffff',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(10,35,82,0.08)',
            border: '1.5px solid #D6E0F2',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 400
          }}>
            <div style={{
              background: '#0A2352',
              color: '#fff',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.12)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#FFD700'
                }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14.5 }}>Adura Field, Alagbado</div>
                  <div style={{ fontSize: 11.5, color: '#9FB0D0' }}>Lagos-Abeokuta Expressway Axis</div>
                </div>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 700,
                  transition: 'all 0.2s'
                }}
              >
                <span>Google Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Embedded Responsive Google Map */}
            <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: 340 }}>
              <iframe
                title="Dialight Football Academy Training Ground - Adura Field, Alagbado Lagos"
                src="https://maps.google.com/maps?q=Adura+Field,+Alagbado,+Lagos,+Nigeria&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block', minHeight: 340 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Location & Training Information Card */}
          <div style={{
            background: 'linear-gradient(145deg, #0A2352, #103780)',
            borderRadius: 20,
            padding: '36px 30px',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 12px 36px rgba(10,35,82,0.2)'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(255, 215, 0, 0.15)',
                color: '#FFD700',
                padding: '5px 12px',
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 800,
                marginBottom: 16,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                <Compass size={14} /> Official Pitch Location
              </div>

              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, color: '#fff' }}>
                Under the Powerline, Adura Field
              </h3>

              <p style={{ color: '#C5D6F5', fontSize: 14.5, lineHeight: 1.6, marginBottom: 24 }}>
                {address}
              </p>

              {/* Training Schedules on Adura Pitch */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 14,
                padding: '18px 20px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                marginBottom: 24
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontWeight: 800,
                  fontSize: 13,
                  color: '#FFD700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 12
                }}>
                  <Calendar size={15} /> Weekly Training Schedule
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBottom: 8,
                    borderBottom: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14.5, color: '#fff' }}>Monday, Wednesday & Friday</div>
                      <div style={{ fontSize: 12, color: '#9FB0D0' }}>U10 & U13 Squads</div>
                    </div>
                    <div style={{
                      background: 'rgba(31, 157, 85, 0.3)',
                      color: '#4ADE80',
                      padding: '4px 10px',
                      borderRadius: 8,
                      fontWeight: 800,
                      fontSize: 13
                    }}>
                      3:00 PM – 5:00 PM
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14.5, color: '#fff' }}>Monday, Wednesday & Friday</div>
                      <div style={{ fontSize: 12, color: '#9FB0D0' }}>U17 & Free Age Squads</div>
                    </div>
                    <div style={{
                      background: 'rgba(255, 215, 0, 0.2)',
                      color: '#FFD700',
                      padding: '4px 10px',
                      borderRadius: 8,
                      fontWeight: 800,
                      fontSize: 13
                    }}>
                      4:00 PM – 6:00 PM
                    </div>
                  </div>
                </div>
              </div>

              {/* Transit Directions Guide */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.18)',
                borderRadius: 12,
                padding: '14px 16px',
                fontSize: 13,
                color: '#B9C9EA',
                lineHeight: 1.5,
                marginBottom: 24
              }}>
                <strong style={{ color: '#fff' }}>Transit Guide: </strong>
                Board any bus or tricycle heading along the Lagos-Abeokuta Expressway and stop at <span style={{ color: '#FFD700', fontWeight: 700 }}>Adura Bus Stop</span>. Walk 2 minutes down towards the Powerline field behind the bus stop.
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  minWidth: 140,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '13px 18px',
                  borderRadius: 12,
                  background: '#1F9D55',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(31, 157, 85, 0.35)'
                }}
              >
                <Navigation size={16} />
                <span>Get Directions</span>
              </a>

              <button
                onClick={copyAddress}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '13px 18px',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {copied ? <Check size={16} color="#4ADE80" /> : <MapPin size={16} />}
                <span>{copied ? 'Address Copied!' : 'Copy Address'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
