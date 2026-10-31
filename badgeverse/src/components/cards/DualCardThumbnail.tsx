'use client';

import React, { useState } from 'react';
import { CardRenderer } from '@/components/cards/CardRenderer';
import type { CardElement, TextureType, CardFormat } from '@/lib/types';

interface DualCardThumbnailProps {
  frontElements: CardElement[];
  backElements: CardElement[];
  bg: string;
  texture?: TextureType;
  holo?: boolean;
  format?: CardFormat;
  width: number;
  height: number;
  scale?: number;
}

export function DualCardThumbnail({
  frontElements,
  backElements,
  bg,
  texture = 'paper',
  holo = true,
  format = 'card',
  width,
  height,
  scale = 0.46,
}: DualCardThumbnailProps) {
  const [activeSide, setActiveSide] = useState<'both' | 'front' | 'back'>('both');

  const cardW = width * scale;
  const cardH = height * scale;

  // The container allows both overlapping cards with padding for tilts
  const containerW = cardW + 36;
  const containerH = cardH + 28;

  return (
    <div
      style={{
        position: 'relative',
        width: `${containerW}px`,
        height: `${containerH}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="dual-thumb"
    >
      {/* BACK HERO CARD (Tilted Right) */}
      <div
        style={{
          position: 'absolute',
          right: '4px',
          top: '12px',
          width: `${cardW}px`,
          height: `${cardH}px`,
          transform: activeSide === 'back' ? 'scale(1.05) rotate(0deg)' : 'rotate(6deg) translateY(-2px)',
          zIndex: activeSide === 'back' ? 4 : 1,
          transition: 'all 0.28s ease',
          filter: 'drop-shadow(5px 7px 0 rgba(0, 0, 0, 0.28))',
          borderRadius: format === 'key' ? '28px' : '14px',
          overflow: 'hidden',
        }}
        onClick={(e) => {
          e.stopPropagation();
          setActiveSide((s) => (s === 'back' ? 'both' : 'back'));
        }}
        title="Hero Back Side (click to focus)"
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
      </div>

      {/* FRONT ID CARD (Tilted Left) */}
      <div
        style={{
          position: 'absolute',
          left: '4px',
          top: '4px',
          width: `${cardW}px`,
          height: `${cardH}px`,
          transform: activeSide === 'front' ? 'scale(1.05) rotate(0deg)' : 'rotate(-5deg)',
          zIndex: activeSide === 'back' ? 1 : 3,
          transition: 'all 0.28s ease',
          filter: 'drop-shadow(6px 8px 0 rgba(0, 0, 0, 0.32))',
          borderRadius: format === 'key' ? '28px' : '14px',
          overflow: 'hidden',
        }}
        onClick={(e) => {
          e.stopPropagation();
          setActiveSide((s) => (s === 'front' ? 'both' : 'front'));
        }}
        title="Personal Front Side (click to focus)"
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
      </div>

      {/* Subtle indicator pills */}
      <div
        style={{
          position: 'absolute',
          bottom: '-6px',
          display: 'flex',
          gap: '6px',
          zIndex: 5,
        }}
      >
        <span
          style={{
            fontSize: '9px',
            fontFamily: 'monospace',
            fontWeight: 700,
            padding: '1px 5px',
            borderRadius: '4px',
            background: 'var(--line)',
            color: '#fff',
            opacity: 0.9,
          }}
        >
          FRONT + HERO BACK
        </span>
      </div>
    </div>
  );
}

