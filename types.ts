
export interface RecordEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  imageUrl?: string;
  mood?: string;
  tags: string[];
  aiReflection?: string;
}

export interface WebClapMessage {
  id: string;
  date: string;
  name: string;
  message: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  siteUrl: string;
  title: string;
}

export interface SiteSettings {
  siteTitle: string;
  marqueeText: string;
  systemMessage: string;
  profileName: string;
  profileStatus: string;
  profileIdentity: string;
  profileLikes: string;
  profileDislikes?: string;
  profileBio: string;
  profileFavs?: string;
  sinceDate: string;
  // Design settings
  sidebarColor: string;
  bgStartColor: string;
  bgEndColor: string;
  gradientAngle: string;
  autoGradient: boolean;
  marqueeBgColor: string;
  mainImageUrl: string;
  mainImages: string[];
  mainImageArtist: string;
  profileImageUrl: string;
  // Typography settings
  fontFamily: 'Gulim' | 'Dotum';
  fontSize: string;
  letterSpacing: string;
  lineHeight: string;
}

export enum View {
  HOME = 'home',
  ARCHIVE = 'archive',
  ABOUT = 'about',
  AI_GEN = 'ai_gen',
  ADMIN = 'admin'
}
