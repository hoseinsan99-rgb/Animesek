export interface Anime {
  id: string;
  title: string;
  description: string;
  poster: string;
  genre: string;
  rating: number;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  rank: string;
  bio: string;
}

export interface Stat {
  id: number;
  userId: string;
  username: string;
  avatar: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
  timestamp: string;
}

export interface ChatMessage {
  id: number;
  room: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}
