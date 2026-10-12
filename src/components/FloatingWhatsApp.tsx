import React from 'react';
import { MessageCircle } from 'lucide-react';
import { COACH_PHONE, COACH_WHATSAPP_LINK } from '../services/api';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href={COACH_WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      title={`Chat with Coach on WhatsApp (${COACH_PHONE})`}
    >
      <MessageCircle size={22} fill="currentColor" />
      <span>Trial Inquiries ({COACH_PHONE})</span>
    </a>
  );
};
