'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CardRenderer } from '@/components/cards/CardRenderer';
import type { CardElement, TextureType, CardFormat } from '@/lib/types';

interface CardMockupProps {
  frontElements: CardElement[];
  backElements: CardElement[];
  bg: string;
  texture?: TextureType;
  holo?: boolean;
  format?: CardFormat;
  width: number;
  height: number;
  scale?: number;
  interactive?: boolean;
}

export function CardMockup({
  frontElements,
  backElements,
  bg,
  texture = 'paper',
  holo = true,
  format = 'card',
  width,
  height,
  scale = 0.85,
  interactive = true,
}: CardMockupProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardW = width * scale;
  const cardH = height * scale;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
      }}
    >
      {/* 3D Perspective Container */}
      <div
        style={{
          width: `${cardW}px`,
          height: `${cardH}px`,
          perspective: '1200px',
          cursor: interactive ? 'pointer' : 'default',
        }}
        onClick={() => interactive && setIsFlipped((prev) => !prev)}
        title={interactive ? 'Click to flip card' : undefined}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* FRONT FACE */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              borderRadius: format === 'key' ? '32px' : '16px',
              boxShadow:
                '0 12px 28px -4px rgba(0, 0, 0, 0.35), 0 4px 10px -2px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 -1px 2px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: '0 0',
                width: `${width}px`,
                height: `${height}px`,
              }}
            >
              <CardRenderer
                elements={frontElements}
                bg={bg}
                texture={texture}
                holo={holo}
                format={format}
                width={width}
                height={height}
                scale={1}
              />
            </div>
            {/* Realistic Gloss / Specular Sheen */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.08) 35%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.12) 100%)',
                pointerEvents: 'none',
                borderRadius: 'inherit',
              }}
            />
          </div>

          {/* BACK FACE */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: format === 'key' ? '32px' : '16px',
              boxShadow:
                '0 12px 28px -4px rgba(0, 0, 0, 0.35), 0 4px 10px -2px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.4), inset 0 -1px 2px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: '0 0',
                width: `${width}px`,
                height: `${height}px`,
              }}
            >
              <CardRenderer
                elements={backElements}
                bg={bg}
                texture={texture}
                holo={holo}
                format={format}
                width={width}
                height={height}
                scale={1}
              />
            </div>
            {/* Specular Sheen on Back */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 40%, rgba(0, 0, 0, 0) 55%, rgba(255, 255, 255, 0.1) 100%)',
                pointerEvents: 'none',
                borderRadius: 'inherit',
              }}
            />
          </div>
        </motion.div>
      </div>

      {interactive && (
        <button
          type="button"
          className="btn alt sm"
          style={{ fontSize: '12px', padding: '6px 14px' }}
          onClick={() => setIsFlipped((prev) => !prev)}
        >
          {isFlipped ? 'Show Front ↺' : 'Flip to Back (Hero Side) ↻'}
        </button>
      )}
    </div>
  );
}

