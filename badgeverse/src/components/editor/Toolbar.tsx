'use client';

import { motion } from 'framer-motion';
import { useEditorStore } from '@/store/editor';
import { MotionLink } from '@/components/ui/MotionElements';

export function Toolbar() {
  const {
    undo,
    redo,
    zoom,
    zoomIn,
    zoomOut,
    side,
    setSide,
    format,
    setFormat,
  } = useEditorStore();

  return (
    <div className="tb">
      <motion.button className="btn sm" whileTap={{ scale: 0.96 }} onClick={undo}>
        Undo
      </motion.button>
      <motion.button className="btn sm" whileTap={{ scale: 0.96 }} onClick={redo}>
        Redo
      </motion.button>
      <motion.button
        className="btn alt sm"
        whileTap={{ scale: 0.96 }}
        onClick={zoomOut}
        aria-label="Zoom out"
      >
        −
      </motion.button>
      <b id="zl">{Math.round(zoom * 100)}%</b>
      <motion.button
        className="btn alt sm"
        whileTap={{ scale: 0.96 }}
        onClick={zoomIn}
        aria-label="Zoom in"
      >
        +
      </motion.button>
      <motion.button
        className="btn alt sm"
        aria-pressed={side === 'front'}
        whileTap={{ scale: 0.96 }}
        onClick={() => setSide('front')}
      >
        Front
      </motion.button>
      <motion.button
        className="btn alt sm"
        aria-pressed={side === 'back'}
        whileTap={{ scale: 0.96 }}
        onClick={() => setSide('back')}
      >
        Back
      </motion.button>
      <motion.button
        className="btn alt sm"
        aria-pressed={format === 'card'}
        whileTap={{ scale: 0.96 }}
        onClick={() => setFormat('card')}
      >
        Card
      </motion.button>
      <motion.button
        className="btn alt sm"
        aria-pressed={format === 'key'}
        whileTap={{ scale: 0.96 }}
        onClick={() => setFormat('key')}
      >
        Keychain
      </motion.button>
      <MotionLink href="/export" className="btn sm" whileTap={{ scale: 0.96 }}>
        Preview &amp; export
      </MotionLink>
    </div>
  );
}
