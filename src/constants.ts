export interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  url: string;
}

export const SONGS: Song[] = [
  {
    id: '1',
    title: 'Cyber Drift',
    artist: 'AI Gen: Synthwave',
    cover: 'https://picsum.photos/seed/cyber/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
  },
  {
    id: '2',
    title: 'Neon Nights',
    artist: 'AI Gen: RetroFuture',
    cover: 'https://picsum.photos/seed/neon/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Pulse Protocol',
    artist: 'AI Gen: Electro',
    cover: 'https://picsum.photos/seed/pulse/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export interface Point {
  x: number;
  y: number;
}

export const GRID_SIZE = 20;
export const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
export const GAME_SPEED = 100;
