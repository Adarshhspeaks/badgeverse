// Element types matching the prototype's element model
export type ElementType = 'text' | 'sticker' | 'shape' | 'img' | 'qr' | 'bar';

export interface CardElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  // Text properties
  text?: string;
  font?: string;
  size?: number;
  color?: string;
  bg?: string;
  align?: 'left' | 'center' | 'right';
  fw?: number;
  ls?: number; // letter-spacing
  // Image properties
  src?: string;
  zoom?: number;
  border?: string;
  // Style properties
  bd?: string; // border CSS shorthand
  bb?: string; // border-bottom CSS shorthand
  br?: number; // border-radius
  op?: number; // opacity
  sh?: number; // box-shadow flag (1 = on)
  ctr?: number; // flex center flag (1 = on)
  ts?: string; // text-shadow
}

export type LayoutType = 'lic' | 'trv' | 'foil' | 'lan';

export interface TemplateDefaults {
  bg: string;
  texture: TextureType;
  holo: boolean;
}

export interface Template {
  id: string;
  cat: string;
  tier: string;
  lay: LayoutType;
  bg: string;
  ink: string;
  ac: string;
  ac2: string;
  title: string;
  holder: string;
  city: string;
  ex: string;
  tag: string;
  name: string;
  w: number;
  h: number;
  idn: string;
  defaults: TemplateDefaults;
  front: CardElement[];
  back: CardElement[];
}

export type TextureType = 'paper' | 'halftone' | 'none';
export type CardFormat = 'card' | 'key';
export type CardSide = 'front' | 'back';

export interface EditorState {
  templateId: string;
  format: CardFormat;
  bg: string;
  texture: TextureType;
  holo: boolean;
  side: CardSide;
  elements: {
    front: CardElement[];
    back: CardElement[];
  };
  selectedId: string | null;
  zoom: number;
  cardWidth: number;
  cardHeight: number;
}

export const FONTS = [
  'Anton',
  'Archivo Black',
  'Special Elite',
  'Caveat',
  'Pinyon Script',
  'Permanent Marker',
  'Space Mono',
  'Georgia',
] as const;

export const CATEGORIES = [
  'All',
  'F1',
  'Spider-Man',
  'Batman',
  'Creator',
  'Gamer',
  'VIP',
  'K-pop',
  'Festival',
  'Pet ID',
  'School',
] as const;

export const STICKERS = [
  'LEVEL 99',
  'VIP',
  'HOLO',
  'EST. 2026',
  'TOP SECRET',
] as const;

export type FontName = (typeof FONTS)[number];
export type Category = (typeof CATEGORIES)[number];

