'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/editor';
import { templates } from '@/lib/template-data';
import { STICKERS, TextureType } from '@/lib/types';

interface LeftPanelProps {
  onToast: (msg: string) => void;
}

export function LeftPanel({ onToast }: LeftPanelProps) {
  const {
    loadTemplate,
    addElement,
    bg,
    setBg,
    texture,
    setTexture,
    holo,
    setHolo,
    commit,
  } = useEditorStore();

  const newId = () => 'el_' + Math.random().toString(36).slice(2, 8);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onToast('Pick an image file (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      addElement({
        id: newId(),
        type: 'img',
        x: 40,
        y: 100,
        w: 120,
        h: 150,
        src: reader.result as string,
        zoom: 1,
        border: '#17141f',
        rot: 0,
      });
      commit();
      onToast('Photo uploaded');
    };
    reader.onerror = () => onToast('Could not read that file.');
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <aside className="side" aria-label="Library">
      <h3>Templates</h3>
      <div className="r">
        {templates.map((t) => (
          <motion.button
            key={t.id}
            className="btn alt sm"
            whileTap={{ scale: 0.96 }}
            onClick={() => loadTemplate(t)}
          >
            {t.name}
          </motion.button>
        ))}
      </div>

      <h3>Add</h3>
      <div className="r">
        <motion.button
          className="btn sm"
          whileTap={{ scale: 0.96 }}
          onClick={() =>
            addElement({
              id: newId(),
              type: 'text',
              x: 40,
              y: 200,
              w: 200,
              h: 40,
              text: 'New text',
              font: 'Anton',
              size: 28,
              color: '#17141f',
              rot: 0,
            })
          }
        >
          Text
        </motion.button>
        <motion.button
          className="btn sm"
          whileTap={{ scale: 0.96 }}
          onClick={() =>
            addElement({
              id: newId(),
              type: 'shape',
              x: 40,
              y: 200,
              w: 120,
              h: 60,
              bg: '#ffc933',
              border: '#17141f',
              rot: 0,
            })
          }
        >
          Shape
        </motion.button>
        <motion.button
          className="btn sm"
          whileTap={{ scale: 0.96 }}
          onClick={() =>
            addElement({
              id: newId(),
              type: 'qr',
              x: 230,
              y: 430,
              w: 80,
              h: 80,
              text: 'https://badgeverse.app/BV-0026',
              color: '#17141f',
              bg: '#ffffff',
              rot: 0,
            })
          }
        >
          QR
        </motion.button>
        <motion.button
          className="btn sm"
          whileTap={{ scale: 0.96 }}
          onClick={() =>
            addElement({
              id: newId(),
              type: 'bar',
              x: 24,
              y: 440,
              w: 180,
              h: 46,
              text: 'BV-0026',
              color: '#17141f',
              rot: 0,
            })
          }
        >
          Barcode
        </motion.button>
      </div>

      <label className="f">
        Photo upload
        <input
          id="up"
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
        />
      </label>

      <h3>Stickers</h3>
      <div className="r">
        {STICKERS.map((stk) => (
          <motion.button
            key={stk}
            className="btn alt sm"
            whileTap={{ scale: 0.96 }}
            onClick={() =>
              addElement({
                id: newId(),
                type: 'sticker',
                x: 200,
                y: 150,
                w: 110,
                h: 36,
                text: stk,
                font: 'Permanent Marker',
                size: 16,
                color: '#17141f',
                bg: '#ffc933',
                align: 'center',
                border: 'true',
                rot: -8,
              })
            }
          >
            {stk}
          </motion.button>
        ))}
      </div>

      <h3>Background</h3>
      <label className="f">
        Color
        <input
          type="color"
          value={bg && bg.startsWith('#') ? bg : '#f3e8dc'}
          onChange={(e) => {
            setBg(e.target.value);
            commit();
          }}
        />
      </label>
      <label className="f">
        Texture
        <select
          value={texture}
          onChange={(e) => {
            setTexture(e.target.value as TextureType);
            commit();
          }}
        >
          <option value="paper">Paper grain</option>
          <option value="halftone">Halftone</option>
          <option value="none">None</option>
        </select>
      </label>
      <label className="f">
        <span>
          <input
            type="checkbox"
            checked={holo}
            style={{ width: 'auto' }}
            onChange={(e) => {
              setHolo(e.target.checked);
              commit();
            }}
          />{' '}
          Holographic sheen
        </span>
      </label>
    </aside>
  );
}
