'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/editor';
import { FONTS } from '@/lib/types';

interface PropsPanelProps {
  onToast: (msg: string) => void;
}

export function PropsPanel({ onToast }: PropsPanelProps) {
  const {
    getSelectedElement,
    updateElement,
    commit,
    moveForward,
    moveBackward,
    duplicateElement,
    deleteElement,
  } = useEditorStore();

  const element = getSelectedElement();

  const handleChange = (key: string, value: unknown) => {
    if (!element) return;
    updateElement(element.id, { [key]: value });
  };

  const handleCommit = () => {
    commit();
  };

  const handlePhotoReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!element) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onToast('Pick an image file (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateElement(element.id, { src: reader.result as string });
      commit();
      onToast('Photo replaced');
    };
    reader.onerror = () => onToast('Could not read that file.');
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <aside className="side R" id="props" aria-label="Properties">
      <motion.div
        key={element ? element.id : 'empty'}
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {!element ? (
          <>
            <h3>Properties</h3>
            <p className="hint">
              Click an element on the card to edit it. Drag to move, pull the red dot
              to resize, arrow keys nudge, Delete removes.
            </p>
          </>
        ) : (
          <>
            <h3>Properties</h3>

            {/* Text / Sticker properties */}
            {(element.type === 'text' || element.type === 'sticker') && (
              <>
                <label className="f">
                  Content
                  <textarea
                    rows={2}
                    value={element.text || ''}
                    onChange={(e) => handleChange('text', e.target.value)}
                    onBlur={handleCommit}
                  />
                </label>
                <label className="f">
                  Font
                  <select
                    value={element.font || 'Anton'}
                    onChange={(e) => {
                      handleChange('font', e.target.value);
                      commit();
                    }}
                  >
                    {FONTS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="f">
                  Size
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="1"
                    value={element.size || 24}
                    onChange={(e) => handleChange('size', +e.target.value)}
                    onMouseUp={handleCommit}
                    onTouchEnd={handleCommit}
                  />
                </label>
                <label className="f">
                  Color
                  <input
                    type="color"
                    value={
                      element.color && element.color.startsWith('#')
                        ? element.color
                        : '#17141f'
                    }
                    onChange={(e) => {
                      handleChange('color', e.target.value);
                      commit();
                    }}
                  />
                </label>
                <label className="f">
                  Fill
                  <input
                    type="color"
                    value={
                      element.bg && element.bg.startsWith('#')
                        ? element.bg
                        : '#ffffff'
                    }
                    onChange={(e) => {
                      handleChange('bg', e.target.value);
                      commit();
                    }}
                  />
                </label>
                <motion.button
                  className="btn alt sm"
                  style={{ width: 'fit-content' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    handleChange('bg', 'transparent');
                    commit();
                  }}
                >
                  No fill
                </motion.button>
              </>
            )}

            {/* Image properties */}
            {element.type === 'img' && (
              <>
                <label className="f">
                  Replace photo
                  <input
                    id="up2"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoReplace}
                  />
                </label>
                <label className="f">
                  Crop zoom
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={element.zoom || 1}
                    onChange={(e) => handleChange('zoom', +e.target.value)}
                    onMouseUp={handleCommit}
                    onTouchEnd={handleCommit}
                  />
                </label>
                <label className="f">
                  Border
                  <input
                    type="color"
                    value={
                      element.border && element.border.startsWith('#')
                        ? element.border
                        : '#17141f'
                    }
                    onChange={(e) => {
                      handleChange('border', e.target.value);
                      commit();
                    }}
                  />
                </label>
              </>
            )}

            {/* QR & Barcode properties */}
            {(element.type === 'qr' || element.type === 'bar') && (
              <>
                <label className="f">
                  {element.type === 'qr' ? 'QR content' : 'Barcode text'}
                  <input
                    type="text"
                    value={element.text || ''}
                    onChange={(e) => handleChange('text', e.target.value)}
                    onBlur={handleCommit}
                  />
                </label>
                <label className="f">
                  Color
                  <input
                    type="color"
                    value={
                      element.color && element.color.startsWith('#')
                        ? element.color
                        : '#17141f'
                    }
                    onChange={(e) => {
                      handleChange('color', e.target.value);
                      commit();
                    }}
                  />
                </label>
                {element.type === 'qr' && (
                  <label className="f">
                    Background
                    <input
                      type="color"
                      value={
                        element.bg && element.bg.startsWith('#')
                          ? element.bg
                          : '#ffffff'
                      }
                      onChange={(e) => {
                        handleChange('bg', e.target.value);
                        commit();
                      }}
                    />
                  </label>
                )}
              </>
            )}

            {/* Shape properties */}
            {element.type === 'shape' && (
              <>
                <label className="f">
                  Fill
                  <input
                    type="color"
                    value={
                      element.bg && element.bg.startsWith('#')
                        ? element.bg
                        : '#ffc933'
                    }
                    onChange={(e) => {
                      handleChange('bg', e.target.value);
                      commit();
                    }}
                  />
                </label>
                <label className="f">
                  Border
                  <input
                    type="color"
                    value={
                      element.border && element.border.startsWith('#')
                        ? element.border
                        : '#17141f'
                    }
                    onChange={(e) => {
                      handleChange('border', e.target.value);
                      commit();
                    }}
                  />
                </label>
              </>
            )}

            {/* Rotation */}
            <label className="f">
              Rotation
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={element.rot || 0}
                onChange={(e) => handleChange('rot', +e.target.value)}
                onMouseUp={handleCommit}
                onTouchEnd={handleCommit}
              />
            </label>

            {/* Layer and element actions */}
            <div className="r">
              <motion.button
                className="btn alt sm"
                whileTap={{ scale: 0.96 }}
                onClick={() => moveForward(element.id)}
              >
                Forward
              </motion.button>
              <motion.button
                className="btn alt sm"
                whileTap={{ scale: 0.96 }}
                onClick={() => moveBackward(element.id)}
              >
                Backward
              </motion.button>
              <motion.button
                className="btn alt sm"
                whileTap={{ scale: 0.96 }}
                onClick={() => duplicateElement(element.id)}
              >
                Duplicate
              </motion.button>
              <motion.button
                className="btn alt sm"
                whileTap={{ scale: 0.96 }}
                onClick={() => deleteElement(element.id)}
              >
                Delete
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </aside>
  );
}
