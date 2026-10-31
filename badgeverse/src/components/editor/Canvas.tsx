'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/editor';
import { CardRenderer } from '@/components/cards/CardRenderer';
import type { CardElement } from '@/lib/types';

export function Canvas() {
  const {
    cardWidth,
    cardHeight,
    zoom,
    setZoom,
    bg,
    texture,
    holo,
    format,
    side,
    elements,
    selectedId,
    setSelectedId,
    updateElement,
    nudgeElement,
    deleteElement,
    undo,
    redo,
    commit,
  } = useEditorStore();

  const currentElements = elements[side] || [];

  const dragRef = useRef<{
    elementId: string;
    mode: 'move' | 'resize';
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
    hasMoved: boolean;
  } | null>(null);

  // Auto-fit zoom on window resize & on mount matching prototype fitZ()
  useEffect(() => {
    const handleResize = () => {
      const available =
        window.innerWidth <= 900
          ? window.innerWidth - 28
          : window.innerWidth - 548;
      const calculatedZoom = Math.max(
        0.4,
        Math.min(1, +(available / cardWidth).toFixed(2))
      );
      setZoom(calculatedZoom);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cardWidth, setZoom]);

  // Pointer drag and resize handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, el: CardElement, mode: 'move' | 'resize') => {
      e.stopPropagation();
      setSelectedId(el.id);
      dragRef.current = {
        elementId: el.id,
        mode,
        startX: e.clientX,
        startY: e.clientY,
        origX: el.x,
        origY: el.y,
        origW: el.w,
        origH: el.h,
        hasMoved: false,
      };
    },
    [setSelectedId]
  );

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!dragRef.current) return;
      const { elementId, mode, startX, startY, origX, origY, origW, origH } =
        dragRef.current;
      dragRef.current.hasMoved = true;
      const dx = (e.clientX - startX) / zoom;
      const dy = (e.clientY - startY) / zoom;

      if (mode === 'move') {
        updateElement(elementId, {
          x: Math.round(origX + dx),
          y: Math.round(origY + dy),
        });
      } else if (mode === 'resize') {
        updateElement(elementId, {
          w: Math.max(20, Math.round(origW + dx)),
          h: Math.max(10, Math.round(origH + dy)),
        });
      }
    };

    const handlePointerUp = () => {
      if (dragRef.current) {
        if (dragRef.current.hasMoved) {
          commit();
        }
        dragRef.current = null;
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [zoom, updateElement, commit]);

  // Keyboard controls: nudge, delete, undo, redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT'
      ) {
        return;
      }

      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (isMeta && e.key === 'y') {
        e.preventDefault();
        redo();
      } else if (selectedId) {
        const step = e.shiftKey ? 10 : 1;
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          deleteElement(selectedId);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          nudgeElement(selectedId, -step, 0);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nudgeElement(selectedId, step, 0);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          nudgeElement(selectedId, 0, -step);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          nudgeElement(selectedId, 0, step);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, nudgeElement, deleteElement, undo, redo]);

  return (
    <motion.div
      id="co"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      style={{
        width: `${cardWidth * zoom}px`,
        height: `${cardHeight * zoom}px`,
      }}
      onClick={() => setSelectedId(null)}
    >
      <div
        id="cv"
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          transform: `scale(${zoom})`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CardRenderer
          elements={currentElements}
          bg={bg}
          texture={texture}
          holo={holo}
          format={format}
          width={cardWidth}
          height={cardHeight}
          selectedId={selectedId}
          isEditing={true}
          onSelect={setSelectedId}
          onPointerDown={handlePointerDown}
          scale={1}
        />
      </div>
    </motion.div>
  );
}
