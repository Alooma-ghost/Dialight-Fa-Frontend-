export interface Match {
  _id?: string;
  id?: string;
  homeTeam: string;
  awayTeam: string;
  homeShort: string;
  awayShort: string;
  homeScore: number | null;
  awayScore: number | null;
  status: 'Live' | 'Upcoming' | 'Full Time' | 'Half Time' | 'No Match';
  minute: string;
  competition: string;
  date?: string;
  sofaScoreUrl?: string;
  note?: string;
}

export interface Fixture {
  _id?: string;
  id?: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  status: string;
  result?: string;
  isResult?: boolean;
}

export interface Photo {
  _id?: string;
  id?: string;
  title: string;
  caption?: string;
  category: 'match' | 'train' | 'team' | 'alumni' | 'all';
  url: string;
  dataUrl?: string;
  layout?: string;
  uploadedAt?: string;
}

export interface Video {
  _id?: string;
  id?: string;
  title: string;
  url: string;
  videoType?: 'upload' | 'youtube';
  filename?: string;
  youtubeId?: string;
  category: 'highlight' | 'training' | 'feature';
  caption?: string;
}

export interface TrialRequest {
  _id?: string;
  id?: string;
  playerName: string;
  ageGroup: string;
  phone: string;
  parentName?: string;
  preferredFoot?: string;
  position?: string;
  previousClub?: string;
  message?: string;
  status?: 'pending' | 'contacted' | 'approved' | 'rejected';
  createdAt?: string;
}

export interface CoachInfo {
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  experience: string;
  bio: string;
  image?: string;
}

export interface NewsItem {
  _id?: string;
  id?: string;
  title: string;
  content?: string;
  category: 'Announcement' | 'Trials' | 'Match' | 'Training' | string;
  date: string;
  time: string;
  location?: string;
  badge?: string;
  attachmentUrl?: string;
  createdAt?: string;
}
