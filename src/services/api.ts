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

// Fallback initial data
export const FALLBACK_MATCH: Match = {
  homeTeam: 'Dialight U17',
  awayTeam: 'Opponent FC',
  homeShort: 'DFA',
  awayShort: 'OPP',
  homeScore: 2,
  awayScore: 1,
  status: 'Live',
  minute: "63'",
  competition: 'Lagos Grassroots League',
  sofaScoreUrl: 'https://www.sofascore.com',
  note: 'Live scores update pitchside from our coaching staff.'
};

export const FALLBACK_FIXTURES: Fixture[] = [
  {
    id: 'f1',
    date: 'Sat 17 Oct',
    time: '3:00 pm',
    homeTeam: 'Dialight U13',
    awayTeam: 'First Touch FA',
    competition: 'Youth Cup',
    status: 'Upcoming',
    result: '3:00 pm'
  },
  {
    id: 'f2',
    date: 'Sat 24 Oct',
    time: '4:00 pm',
    homeTeam: 'Dialight U17',
    awayTeam: 'Golden Stars FC',
    competition: 'Lagos Youth League',
    status: 'Upcoming',
    result: '4:00 pm'
  },
  {
    id: 'f3',
    date: 'Sat 3 Oct',
    time: '2:00 pm',
    homeTeam: 'Dialight Free Age',
    awayTeam: 'Alagbado United',
    competition: 'Senior Friendly',
    status: 'Completed',
    result: 'W 2–0',
    isResult: true
  }
];

export const FALLBACK_VIDEOS: Video[] = [
  {
    id: 'v1',
    title: 'U17 League Highlights: Dialight 2–1 Opponent FC',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'highlight',
    caption: 'Matchday highlights from the thrilling U17 victory.'
  },
  {
    id: 'v2',
    title: 'Midfield Transition Drills · Morning Session',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'training',
    caption: 'Tactical positioning and quick ball movement at Adura Field.'
  },
  {
    id: 'v3',
    title: 'Striker Finishing & Movement Inside the Box',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'training',
    caption: 'First-time finishing drills with our Under-17 squad.'
  }
];

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
  },
  {
    id: 'p1',
    title: 'U17 Match Day Action',
    category: 'match',
    url: '',
    caption: 'Dialight U17 attacking the opponent defensive third.',
    layout: 'span-2 row-2'
  },
  {
    id: 'p2',
    title: 'Morning Drills & Conditioning',
    category: 'train',
    url: '',
    caption: 'Speed, agility and ball coordination at Adura field.',
    layout: ''
  },
  {
    id: 'p3',
    title: 'Under-10 Grassroots Squad',
    category: 'team',
    url: '',
    caption: 'Our youngest future champions learning fundamentals.',
    layout: ''
  },
  {
    id: 'p4',
    title: 'Free Age Senior Showcase',
    category: 'match',
    url: '',
    caption: 'Free Age team competing in regional showcase tournament.',
    layout: 'span-2'
  },
  {
    id: 'p5',
    title: 'Tactical Briefing Session',
    category: 'train',
    url: '',
    caption: 'Pre-match strategy review with Head Coach Imole.',
    layout: ''
  },
  {
    id: 'p6',
    title: 'Under-13 Championship Team',
    category: 'team',
    url: '',
    caption: 'U13 squad celebrated after cup progression.',
    layout: ''
  },
  {
    id: 'p7',
    title: 'Goal Celebration',
    category: 'match',
    url: '',
    caption: 'Team unity after a crucial 88th-minute winning goal.',
    layout: ''
  },
  {
    id: 'p8',
    title: 'Full Academy Assembly',
    category: 'team',
    url: '',
    caption: 'Over 60 dedicated players developing at Dialight FA.',
    layout: 'span-2'
  },
  {
    id: 'p9',
    title: 'Speed & Agility Workshop',
    category: 'train',
    url: '',
    caption: 'Physical performance testing under coach supervision.',
    layout: ''
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
    badge: 'Official Schedule'
  },
  {
    id: 'n2',
    title: 'Open Player Trials: Under-10, Under-13, Under-17 & Free Age Squads',
    content: 'Talented young footballers are invited to attend trials at Adura Field under the direct assessment of Coach Imole Tobi and senior technical staff. Register online or message on WhatsApp.',
    category: 'Trials',
    date: 'Mon, 12 Oct 2026',
    time: '3:00 PM – 6:00 PM',
    location: 'Adura Field, Alagbado, Lagos',
    badge: 'Trials Open'
  },
  {
    id: 'n3',
    title: 'Matchday Showcase: Dialight FA U17 vs Golden Stars FC',
    content: 'Our U17 championship squad prepares for the upcoming Lagos Grassroots League showcase match this weekend at Adura Field.',
    category: 'Match',
    date: 'Sat, 17 Oct 2026',
    time: '3:00 PM',
    location: 'Adura Field, Alagbado, Lagos',
    badge: 'Upcoming Fixture'
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
    return DEFAULT_PLACEHOLDERS.filter(p => !category || category === 'all' || p.category === category);
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
