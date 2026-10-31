import { create } from 'zustand';
import type {
  CardElement,
  CardFormat,
  CardSide,
  TextureType,
  Template,
} from '@/lib/types';

interface HistoryEntry {
  elements: { front: CardElement[]; back: CardElement[] };
  bg: string;
  texture: TextureType;
  holo: boolean;
  format: CardFormat;
}

interface EditorStore {
  // Template
  templateId: string;
  cardWidth: number;
  cardHeight: number;

  // Card state
  format: CardFormat;
  bg: string;
  texture: TextureType;
  holo: boolean;
  side: CardSide;
  elements: { front: CardElement[]; back: CardElement[] };
  selectedId: string | null;
  zoom: number;

  // History
  history: HistoryEntry[];
  historyIndex: number;

  // Actions
  loadTemplate: (template: Template) => void;
  setFormat: (format: CardFormat) => void;
  setBg: (bg: string) => void;
  setTexture: (texture: TextureType) => void;
  setHolo: (holo: boolean) => void;
  setSide: (side: CardSide) => void;
  setSelectedId: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;

  // Element actions
  addElement: (element: CardElement) => void;
  updateElement: (id: string, updates: Partial<CardElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  moveForward: (id: string) => void;
  moveBackward: (id: string) => void;
  nudgeElement: (id: string, dx: number, dy: number) => void;

  // History actions
  commit: () => void;
  undo: () => void;
  redo: () => void;

  // Helpers
  getCurrentElements: () => CardElement[];
  getSelectedElement: () => CardElement | undefined;
}

let uidCounter = 0;
export const newId = (): string => 'e' + ++uidCounter;

function snapshot(state: EditorStore): HistoryEntry {
  return {
    elements: {
      front: state.elements.front.map((e) => ({ ...e })),
      back: state.elements.back.map((e) => ({ ...e })),
    },
    bg: state.bg,
    texture: state.texture,
    holo: state.holo,
    format: state.format,
  };
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  templateId: '',
  cardWidth: 540,
  cardHeight: 340,
  format: 'card',
  bg: '#f3e8dc',
  texture: 'paper',
  holo: true,
  side: 'front',
  elements: { front: [], back: [] },
  selectedId: null,
  zoom: 1,
  history: [],
  historyIndex: -1,

  loadTemplate: (template: Template) => {
    const front = template.front.map((e) => ({ ...e }));
    const back = template.back.map((e) => ({ ...e }));
    const entry: HistoryEntry = {
      elements: { front: front.map((e) => ({ ...e })), back: back.map((e) => ({ ...e })) },
      bg: template.defaults?.bg ?? template.bg,
      texture: template.defaults?.texture ?? 'paper',
      holo: template.defaults?.holo ?? true,
      format: 'card',
    };
    set({
      templateId: template.id,
      cardWidth: template.w,
      cardHeight: template.h,
      format: 'card',
      bg: entry.bg,
      texture: entry.texture,
      holo: entry.holo,
      side: 'front',
      elements: { front, back },
      selectedId: null,
      history: [entry],
      historyIndex: 0,
    });
  },

  setFormat: (format) => {
    set({ format });
    get().commit();
  },
  setBg: (bg) => set({ bg }),
  setTexture: (texture) => set({ texture }),
  setHolo: (holo) => set({ holo }),
  setSide: (side) => set({ side, selectedId: null }),
  setSelectedId: (id) => set({ selectedId: id }),
  setZoom: (zoom) => set({ zoom }),
  zoomIn: () => set((s) => ({ zoom: Math.min(2, +(s.zoom + 0.1).toFixed(1)) })),
  zoomOut: () => set((s) => ({ zoom: Math.max(0.4, +(s.zoom - 0.1).toFixed(1)) })),

  addElement: (element) => {
    const { side, elements } = get();
    const updated = { ...elements, [side]: [...elements[side], element] };
    set({ elements: updated, selectedId: element.id });
    get().commit();
  },

  updateElement: (id, updates) => {
    const { side, elements } = get();
    const updated = {
      ...elements,
      [side]: elements[side].map((e) => (e.id === id ? { ...e, ...updates } : e)),
    };
    set({ elements: updated });
  },

  deleteElement: (id) => {
    const { side, elements } = get();
    const updated = {
      ...elements,
      [side]: elements[side].filter((e) => e.id !== id),
    };
    set({ elements: updated, selectedId: null });
    get().commit();
  },

  duplicateElement: (id) => {
    const { side, elements } = get();
    const el = elements[side].find((e) => e.id === id);
    if (!el) return;
    const clone: CardElement = { ...JSON.parse(JSON.stringify(el)), id: newId(), x: el.x + 16, y: el.y + 16 };
    const updated = { ...elements, [side]: [...elements[side], clone] };
    set({ elements: updated, selectedId: clone.id });
    get().commit();
  },

  moveForward: (id) => {
    const { side, elements } = get();
    const arr = [...elements[side]];
    const i = arr.findIndex((e) => e.id === id);
    if (i < 0 || i >= arr.length - 1) return;
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    set({ elements: { ...elements, [side]: arr } });
    get().commit();
  },

  moveBackward: (id) => {
    const { side, elements } = get();
    const arr = [...elements[side]];
    const i = arr.findIndex((e) => e.id === id);
    if (i <= 0) return;
    [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
    set({ elements: { ...elements, [side]: arr } });
    get().commit();
  },

  nudgeElement: (id, dx, dy) => {
    const { side, elements } = get();
    const updated = {
      ...elements,
      [side]: elements[side].map((e) =>
        e.id === id ? { ...e, x: e.x + dx, y: e.y + dy } : e
      ),
    };
    set({ elements: updated });
    get().commit();
  },

  commit: () => {
    const state = get();
    const entry = snapshot(state);
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(entry);
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const entry = history[newIndex];
    set({
      historyIndex: newIndex,
      elements: {
        front: entry.elements.front.map((e) => ({ ...e })),
        back: entry.elements.back.map((e) => ({ ...e })),
      },
      bg: entry.bg,
      texture: entry.texture,
      holo: entry.holo,
      format: entry.format,
      selectedId: null,
    });
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const entry = history[newIndex];
    set({
      historyIndex: newIndex,
      elements: {
        front: entry.elements.front.map((e) => ({ ...e })),
        back: entry.elements.back.map((e) => ({ ...e })),
      },
      bg: entry.bg,
      texture: entry.texture,
      holo: entry.holo,
      format: entry.format,
      selectedId: null,
    });
  },

  getCurrentElements: () => {
    const { side, elements } = get();
    return elements[side];
  },

  getSelectedElement: () => {
    const { side, elements, selectedId } = get();
    return elements[side].find((e) => e.id === selectedId);
  },
}));

