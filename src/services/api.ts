import { Match, Fixture, Photo, Video, TrialRequest, NewsItem } from '../types';

export const COACH_PHONE = '+234 814 053 2536';
export const COACH_WHATSAPP_RAW = '2348140532536';
export const COACH_WHATSAPP_LINK = `https://wa.me/${COACH_WHATSAPP_RAW}?text=${encodeURIComponent(
  'Hello Coach, I want to inquire about player trials at Dialight Football Academy.'
)}`;

export const SOCIAL_LINKS = {
  whatsapp: COACH_WHATSAPP_LINK,
  phone: 'tel:+2348140532536',
  instagram: 'https://instagram.com/dialightfa',
  facebook: 'https://facebook.com/dialightfa',
  youtube: 'https://youtube.com/@dialightfa',
  email: 'mailto:contact@dialightfa.com',
  address: 'Adura Field, Alagbado, Lagos State, Nigeria'
};

export const getBaseUrl = (): string => {
  const saved = localStorage.getItem('dfa_api_url');
  if (saved) return saved.replace(/\/+$/, '');
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl.replace(/\/+$/, '');
  if (import.meta.env.PROD) {
    return 'https://dialight-fa-backend.onrender.com';
  }
  return '';
};

export const resolveMediaUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const base = getBaseUrl();
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const isImageAttachment = (url?: string): boolean => {
  if (!url) return false;
  const clean = url.split('?')[0].split('#')[0].toLowerCase();
  return /\.(jpeg|jpg|png|webp|gif|svg|avif)$/.test(clean) || url.startsWith('data:image/');
};

// Fallback – no demo data, all empty until admin posts real content
export const FALLBACK_MATCH: Match = {
  homeTeam: '',
  awayTeam: '',
  homeShort: '',
  awayShort: '',
  homeScore: null,
  awayScore: null,
  status: 'No Match',
  minute: '',
  competition: '',
  sofaScoreUrl: '',
  note: ''
};

export const FALLBACK_FIXTURES: Fixture[] = [];

export const FALLBACK_VIDEOS: Video[] = [];

// Alumni photos are real records, kept as static data
export const DEFAULT_PLACEHOLDERS: Photo[] = [
  {
    id: 'p-alumni-1',
    title: 'Opebi Ibrahim – FC Ebedei & FC Midtjylland (Denmark)',
    category: 'alumni',
    url: '/alumni/opebi-ibrahim.jpg',
    caption: 'Dialight FA alumnus Opebi Ibrahim wearing the FC Midtjylland crest after progressing through FC Ebedei and travelling to Denmark.',
    layout: 'span-2 row-2'
  },
  {
    id: 'p-alumni-2',
    title: 'Fabiola Gideon – Nigeria Under-17 & Giant Brillars FC',
    category: 'alumni',
    url: '/alumni/fabiola-gideon.jpg',
    caption: 'Dialight FA star alumnus Fabiola Gideon celebrating. Represented Nigeria at Under-17 level and played for Giant Brillars FC.',
    layout: 'span-2'
  }
];

export const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Training Schedule Confirmed: Mon, Wed & Fri (3–5 PM U10/U13 | 4–6 PM U17/Free Age)',
    content: 'Dialight Football Academy training sessions take place weekly on Mondays, Wednesdays & Fridays at Adura Field, Alagbado. Training runs from 3:00 PM to 5:00 PM for U10 & U13 squads, and 4:00 PM to 6:00 PM for U17 & Free Age squads.',
    category: 'Training',
    date: 'Mon, 12 Oct 2026',
    time: '3:00 PM – 6:00 PM',
    location: 'Adura Field, Alagbado, Lagos',
    badge: 'Official Schedule',
    attachmentUrl: '/alumni/fabiola-gideon.jpg'
  },
  {
    id: 'n2',
    title: 'Open Player Trials: Under-10, Under-13, Under-17 & Free Age Squads',
    content: 'Talented young footballers are invited to attend trials at Adura Field under the direct assessment of Coach Imole Tobi and senior technical staff. Register online or message on WhatsApp.',
    category: 'Trials',
    date: 'Mon, 12 Oct 2026',
    time: '3:00 PM – 6:00 PM',
    location: 'Adura Field, Alagbado, Lagos',
    badge: 'Trials Open',
    attachmentUrl: '/alumni/opebi-ibrahim.jpg'
  },
  {
    id: 'n4',
    title: 'Academy Ground Location Guide: Under the Powerline, Adura Field',
    content: 'Easily locate our pitch along Lagos-Abeokuta Expressway at Adura Bus Stop / Field, Alagbado. Central training hub for grassroots players across Lagos and Ogun states.',
    category: 'Announcement',
    date: 'Ongoing',
    time: 'Full Season',
    location: 'Adura Field, Alagbado, Lagos',
    badge: 'Venue Guide'
  }
];

export const api = {
  getLiveMatch: async (): Promise<Match> => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/match/live`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return FALLBACK_MATCH;
  },

  getFixtures: async (): Promise<Fixture[]> => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/fixtures`);
      if (res.ok) {
        const list = await res.json();
        if (list && list.length > 0) return list;
      }
    } catch (_) {}
    return FALLBACK_FIXTURES;
  },

  getPhotos: async (category?: string): Promise<Photo[]> => {
    try {
      const url = `${getBaseUrl()}/api/photos${category && category !== 'all' ? `?category=${category}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const list = await res.json();
        if (list && list.length > 0) return list;
      }
    } catch (_) {}
    // Return alumni placeholders for alumni filter/all, empty for other categories
    if (!category || category === 'all' || category === 'alumni') {
      return DEFAULT_PLACEHOLDERS.filter(p => !category || category === 'all' || p.category === category);
    }
    return [];
  },

  getVideos: async (): Promise<Video[]> => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/videos`);
      if (res.ok) {
        const list = await res.json();
        if (list && list.length > 0) return list;
      }
    } catch (_) {}
    return FALLBACK_VIDEOS;
  },

  getNews: async (): Promise<NewsItem[]> => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/news`);
      if (res.ok) {
        const list = await res.json();
        if (list && list.length > 0) return list;
      }
    } catch (_) {}
    return FALLBACK_NEWS;
  },

  submitTrial: async (data: TrialRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/trials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  }
};
