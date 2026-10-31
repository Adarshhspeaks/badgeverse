'use client';

import React, { useEffect, useState, useCallback } from 'react';
import type { CardElement, TextureType, CardFormat } from '@/lib/types';
import { generateBarcodeSVG } from '@/lib/generators';
import QRCode from 'qrcode';

function CardElementDiv({
  element,
  isSelected,
  isEditing,
  onSelect,
  onPointerDown,
}: {
  element: CardElement;
  isSelected: boolean;
  isEditing: boolean;
  onSelect?: (id: string) => void;
  onPointerDown?: (e: React.PointerEvent, el: CardElement, mode: 'move' | 'resize') => void;
}) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (element.type === 'qr') {
      QRCode.toDataURL(element.text || ' ', {
        width: (element.w || 80) * 3,
        margin: 2,
        color: { dark: element.color || '#17141f', light: element.bg || '#ffffff' },
        errorCorrectionLevel: 'M',
      })
        .then(setQrDataUrl)
        .catch(() => setQrDataUrl(''));
    }
  }, [element.type, element.text, element.color, element.bg, element.w]);

  const style: React.CSSProperties = {
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.w}px`,
    height: `${element.h}px`,
    transform: `rotate(${element.rot || 0}deg)`,
  };

  // Text/sticker styles matching prototype line 167
  if (element.type === 'text' || element.type === 'sticker') {
    style.fontFamily = `'${element.font}', sans-serif`;
    style.fontSize = `${element.size}px`;
    style.color = element.color;
    style.background = element.bg || 'transparent';
    style.textAlign = (element.align as React.CSSProperties['textAlign']) || 'left';
    style.lineHeight = 1.05;
    style.whiteSpace = 'pre-line';
    if (element.border) {
      style.border = element.border.includes(' ')
        ? element.border
        : `3px solid ${element.color}`;
    }
  }

  // Shape styles matching prototype line 168
  if (element.type === 'shape') {
    style.background = element.bg;
    if (element.border) {
      style.border = element.border.includes(' ')
        ? element.border
        : `4px solid ${element.border}`;
    }
  }

  // Image styles matching prototype line 169
  if (element.type === 'img') {
    if (element.border === 'none' || element.border === 'transparent') {
      style.border = 'none';
      style.background = 'transparent';
    } else {
      style.border = element.border?.includes(' ')
        ? element.border
        : `4px solid ${element.border || '#17141f'}`;
      style.background = element.bg || '#ccc';
    }
  }

  // Additional element styles matching prototype line 171
  if (element.br) style.borderRadius = `${element.br}px`;
  if (element.op != null) style.opacity = element.op;
  if (element.ls) style.letterSpacing = `${element.ls}px`;
  if (element.fw) style.fontWeight = element.fw;
  if (element.bd) style.border = element.bd;
  if (element.bb) style.borderBottom = element.bb;
  if (element.sh) style.boxShadow = '3px 4px 0 rgba(0,0,0,.28)';
  if (element.ctr) {
    style.display = 'flex';
    style.alignItems = 'center';
    style.justifyContent = 'center';
  }
  if (element.ts) style.textShadow = element.ts;

  let content: React.ReactNode = null;

  if (element.type === 'text' || element.type === 'sticker') {
    content = element.text || '';
  } else if (element.type === 'img') {
    content = (
      <div className="clip" style={{ borderRadius: element.br ? `${element.br}px` : undefined }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={element.src}
          alt=""
          draggable={false}
          style={{
            transform: `scale(${element.zoom || 1})`,
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    );
  } else if (element.type === 'qr') {
    content = qrDataUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={qrDataUrl}
        alt="QR code"
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    ) : null;
  } else if (element.type === 'bar') {
    const svg = generateBarcodeSVG(element.text || 'BV', element.color || '#17141f');
    content = (
      <div
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{ width: '100%', height: '100%' }}
      />
    );
  }

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (onSelect) onSelect(element.id);
      if (onPointerDown) {
        onPointerDown(e, element, 'move');
      }
    },
    [element, onSelect, onPointerDown]
  );

  return (
    <div
      className={`el ${isSelected ? 'sel' : ''}`}
      data-id={element.id}
      tabIndex={0}
      role="button"
      aria-label={`${element.type} element`}
      style={style}
      onPointerDown={isEditing ? handlePointerDown : undefined}
    >
      {content}
      {isSelected && isEditing && (
        <i
          className="handle"
          onPointerDown={(e) => {
            e.stopPropagation();
            if (onPointerDown) onPointerDown(e, element, 'resize');
          }}
        />
      )}
    </div>
  );
}

export function CardRenderer({
  elements,
  bg,
  texture,
  holo,
  format = 'card',
  width,
  height,
  selectedId,
  isEditing = false,
  onSelect,
  onPointerDown,
  scale = 1,
  id,
}: {
  elements: CardElement[];
  bg: string;
  texture: TextureType;
  holo: boolean;
  format?: CardFormat;
  width: number;
  height: number;
  selectedId?: string | null;
  isEditing?: boolean;
  onSelect?: (id: string) => void;
  onPointerDown?: (e: React.PointerEvent, el: CardElement, mode: 'move' | 'resize') => void;
  scale?: number;
  id?: string;
}) {
  const isKey = format === 'key';
  const isLandscape = width > height;

  return (
    <div
      id={id}
      className={`card${isKey ? ' key' : ''}`}
      style={{
        background: bg,
        width: `${width}px`,
        height: `${height}px`,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: '0 0',
      }}
    >
      {texture && texture !== 'none' && <div className={`tex ${texture}`} />}
      {elements.map((el) => (
        <CardElementDiv
          key={el.id}
          element={el}
          isSelected={selectedId === el.id}
          isEditing={isEditing}
          onSelect={onSelect}
          onPointerDown={onPointerDown}
        />
      ))}
      {holo && <div className="holo" />}
      {isKey && <div className={`hole${isLandscape ? ' l' : ''}`} />}
    </div>
  );
}

// Matches prototype's thumb(t, sc, fmt)
export function CardThumbnail({
  elements,
  bg,
  texture = 'paper',
  holo = true,
  format = 'card',
  width,
  height,
  scale = 0.5,
}: {
  elements: CardElement[];
  bg: string;
  texture?: TextureType;
  holo?: boolean;
  format?: CardFormat;
  width: number;
  height: number;
  scale?: number;
}) {
  return (
    <div
      className="th"
      style={{ width: `${width * scale}px`, height: `${height * scale}px` }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: '0 0', width: `${width}px` }}>
        <CardRenderer
          elements={elements}
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
  );
}
