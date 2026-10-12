import React, { useState } from 'react';
import { TrialRequest } from '../types';
import { api, COACH_WHATSAPP_LINK, COACH_PHONE } from '../services/api';
import { MessageCircle, Phone, CheckCircle, AlertCircle, Shield } from 'lucide-react';

const INITIAL: TrialRequest = {
  playerName: '',
  ageGroup: '',
  phone: '',
  parentName: '',
  preferredFoot: '',
  position: '',
  previousClub: '',
  message: ''
};

export const JoinPage: React.FC = () => {
  const [form, setForm] = useState<TrialRequest>(INITIAL);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k: keyof TrialRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.playerName || !form.ageGroup || !form.phone) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    const result = await api.submitTrial(form);
    if (result.success) {
      setStatus('success');
      setForm(INITIAL);
    } else {
      setStatus('error');
      setErrorMsg(result.error || 'Submission failed. Please try WhatsApp instead.');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ paddingTop: 100, minHeight: '100vh', background: '#F8FAFD', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E6F6EC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={40} color="#1F9D55" />
          </div>
          <h2 style={{ color: '#0A2352', fontSize: 30, marginBottom: 12 }}>Trial Request Submitted!</h2>
          <p style={{ color: '#5A6A88', fontSize: 16, lineHeight: 1.6, marginBottom: 28 }}>
            Our coaching team will review your application and contact you within 48 hours. You can also WhatsApp the coach directly for faster response.
          </p>
          <a
            href={COACH_WHATSAPP_LINK}
            target="_blank" rel="noopener noreferrer"
            className="btn btn-green"
            style={{ fontSize: 16, padding: '14px 28px' }}
          >
            <MessageCircle size={18} />
            <span>WhatsApp Coach Now</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#F8FAFD' }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start' }}>

          {/* Left: Info */}
          <div>
            <span className="section-tag"><Shield size={14} /> Player Trials</span>
            <h1 className="section-title" style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 16 }}>
              Request a Player Trial
            </h1>
            <p style={{ fontSize: 16, color: '#5A6A88', lineHeight: 1.7, marginBottom: 32 }}>
              All ability levels welcome. Our head coach evaluates every player individually and provides honest, constructive feedback — regardless of the outcome.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
              {[
                { icon: '📋', title: 'Complete the form', desc: 'Fill in the player details on this page.' },
                { icon: '📞', title: 'We call you back', desc: 'Our team responds within 48 hours to confirm the date.' },
                { icon: '⚽', title: 'Come to the trial', desc: 'Bring boots and water. We provide the rest.' },
                { icon: '🏆', title: 'Get your result', desc: 'Honest feedback and next steps from Head Coach.' }
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F0FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                    {step.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0A2352', marginBottom: 2 }}>{step.title}</div>
                    <div style={{ fontSize: 14, color: '#5A6A88' }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '20px 24px', background: '#fff', borderRadius: 16, border: '1px solid #D6E0F2' }}>
              <div style={{ fontWeight: 700, color: '#0A2352', fontSize: 15, marginBottom: 12 }}>Prefer to call or WhatsApp?</div>
              <a href={COACH_WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1F9D55', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
                <MessageCircle size={18} />{COACH_PHONE}
              </a>
              <a href={`tel:${COACH_PHONE.replace(/\s+/g, '')}`}
                style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#5A6A88', fontSize: 14 }}>
                <Phone size={16} /> Call Coach Directly
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #D6E0F2', padding: '36px 32px', boxShadow: '0 8px 32px rgba(10,35,82,0.07)' }}>
            <h2 style={{ fontSize: 24, color: '#0A2352', marginBottom: 24 }}>Trial Application Form</h2>

            {errorMsg && (
              <div style={{ padding: '12px 16px', background: '#FFF1F0', border: '1px solid #FCA5A5', borderRadius: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertCircle size={18} color="#D92534" />
                <span style={{ fontSize: 14, color: '#D92534', fontWeight: 600 }}>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <FormField label="Player Full Name *" required>
                <input
                  type="text" value={form.playerName} onChange={set('playerName')}
                  placeholder="e.g. Tunde Okafor"
                  required
                  style={inputStyle}
                />
              </FormField>

              <FormField label="Age Category *" required>
                <select value={form.ageGroup} onChange={set('ageGroup')} required style={inputStyle}>
                  <option value="">Select Age Group</option>
                  <option value="U10">Under-10 (Ages 6–10)</option>
                  <option value="U13">Under-13 (Ages 11–13)</option>
                  <option value="U17">Under-17 (Ages 14–17)</option>
                  <option value="Free Age">Free Age (18+)</option>
                </select>
              </FormField>

              <FormField label="Parent / Guardian Phone *" required>
                <input
                  type="tel" value={form.phone} onChange={set('phone')}
                  placeholder="+234 800 000 0000"
                  required
                  style={inputStyle}
                />
              </FormField>

              <FormField label="Parent / Guardian Name">
                <input
                  type="text" value={form.parentName} onChange={set('parentName')}
                  placeholder="e.g. Mr. Okafor"
                  style={inputStyle}
                />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <FormField label="Preferred Position">
                  <select value={form.position} onChange={set('position')} style={inputStyle}>
                    <option value="">Any</option>
                    <option value="GK">Goalkeeper</option>
                    <option value="DEF">Defender</option>
                    <option value="MID">Midfielder</option>
                    <option value="FWD">Forward</option>
                  </select>
                </FormField>
                <FormField label="Preferred Foot">
                  <select value={form.preferredFoot} onChange={set('preferredFoot')} style={inputStyle}>
                    <option value="">Any</option>
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                    <option value="Both">Both</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Previous Club (if any)">
                <input
                  type="text" value={form.previousClub} onChange={set('previousClub')}
                  placeholder="e.g. Alagbado United"
                  style={inputStyle}
                />
              </FormField>

              <FormField label="Additional Message">
                <textarea
                  value={form.message} onChange={set('message')}
                  placeholder="Anything else the coach should know..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }}
                />
              </FormField>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: 16, marginTop: 8 }}
              >
                {status === 'loading' ? 'Submitting…' : 'Submit Trial Request'}
              </button>

              <p style={{ fontSize: 12.5, color: '#9FB0D0', textAlign: 'center', lineHeight: 1.5 }}>
                Your details are only used to contact you about the trial and are never shared.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1.5px solid #D6E0F2',
  fontFamily: 'inherit',
  fontSize: 15,
  color: '#12203D',
  background: '#F8FAFD',
  outline: 'none',
  transition: 'border-color 0.2s ease'
};

const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <div>
    <label style={{ display: 'block', fontWeight: 600, fontSize: 13.5, color: '#0A2352', marginBottom: 6 }}>
      {label}{required && <span style={{ color: '#D92534', marginLeft: 4 }}>*</span>}
    </label>
    {children}
  </div>
);
