'use client';

import { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { templates } from '@/lib/template-data';
import { CATEGORIES, Template } from '@/lib/types';
import { DualCardThumbnail } from '@/components/cards/DualCardThumbnail';
import { CardMockup } from '@/components/cards/CardMockup';
import { useEditorStore } from '@/store/editor';

const TIERS = ['All', 'Popular', 'New', 'Premium'] as const;

function GalleryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'All';

  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>(
    CATEGORIES.includes(initialCat as (typeof CATEGORIES)[number]) ? initialCat : 'All'
  );
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [mockupTemplate, setMockupTemplate] = useState<Template | null>(null);

  const loadTemplate = useEditorStore((s) => s.loadTemplate);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchCat = selectedCat === 'All' || t.cat === selectedCat;
      const matchTier = selectedTier === 'All' || t.tier === selectedTier;
      const matchQuery =
        !query ||
        (t.name + ' ' + t.cat).toLowerCase().includes(query.toLowerCase());
      return matchCat && matchTier && matchQuery;
    });
  }, [query, selectedCat, selectedTier]);

  const handleUseTemplate = (id: string) => {
    const t = templates.find((tpl) => tpl.id === id);
    if (t) {
      loadTemplate(t);
      router.push('/editor');
    }
  };

  const filterKey = `${query}-${selectedCat}-${selectedTier}`;

  return (
    <div className="wrap">
      <h2 style={{ fontSize: '48px' }}>Templates</h2>
      <p>
        <input
          id="q"
          type="search"
          placeholder="Search templates"
          aria-label="Search templates"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ maxWidth: '360px' }}
        />
      </p>

      <div className="chips" style={{ margin: '12px 0' }}>
        {CATEGORIES.map((c) => (
          <motion.button
            key={c}
            className="btn alt sm"
            aria-pressed={selectedCat === c}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSelectedCat(c)}
          >
            {c}
          </motion.button>
        ))}
      </div>

      <div className="chips" style={{ marginBottom: '24px' }}>
        {TIERS.map((c) => (
          <motion.button
            key={c}
            className="btn alt sm"
            aria-pressed={selectedTier === c}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSelectedTier(c)}
          >
            {c}
          </motion.button>
        ))}
      </div>

      <motion.div className="grid" layout>
        <AnimatePresence mode="popLayout">
          {filtered.length ? (
            filtered.map((t, index) => (
              <motion.article
                key={`${filterKey}-${t.id}`}
                layout
                className="tile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: 'easeOut',
                  layout: { duration: 0.3 },
                }}
              >
                <span className="tag">{t.tier}</span>
                <DualCardThumbnail
                  frontElements={t.front}
                  backElements={t.back}
                  bg={t.defaults?.bg || t.bg}
                  texture={t.defaults?.texture || 'paper'}
                  holo={t.defaults?.holo ?? true}
                  width={t.w}
                  height={t.h}
                  scale={0.46}
                />
                <b>{t.name}</b>
                <small>{t.cat}</small>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <motion.button
                    className="btn sm"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleUseTemplate(t.id)}
                  >
                    Use this template
                  </motion.button>
                  <motion.button
                    className="btn alt sm"
                    style={{ fontSize: '11px', padding: '6px 10px' }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setMockupTemplate(t)}
                  >
                    3D Flip Mockup
                  </motion.button>
                </div>
              </motion.article>
            ))
          ) : (
            <motion.p
              key="empty"
              className="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No templates match. Clear the search or pick another category.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 3D Mockup Modal */}
      <AnimatePresence>
        {mockupTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(23, 20, 31, 0.75)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
            onClick={() => setMockupTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                background: 'var(--card)',
                border: '3px solid var(--line)',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '640px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '8px 12px 0 var(--line)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '24px' }}>{mockupTemplate.name} · 3D Mockup</h3>
                <button className="btn alt sm" onClick={() => setMockupTemplate(null)}>
                  ✕ Close
                </button>
              </div>

              <CardMockup
                frontElements={mockupTemplate.front}
                backElements={mockupTemplate.back}
                bg={mockupTemplate.defaults?.bg || mockupTemplate.bg}
                texture={mockupTemplate.defaults?.texture || 'paper'}
                holo={mockupTemplate.defaults?.holo ?? true}
                width={mockupTemplate.w}
                height={mockupTemplate.h}
                scale={0.88}
                interactive={true}
              />

              <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <button
                  className="btn"
                  onClick={() => {
                    handleUseTemplate(mockupTemplate.id);
                    setMockupTemplate(null);
                  }}
                >
                  Customize in Editor
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="wrap"><p>Loading templates…</p></div>}>
      <GalleryContent />
    </Suspense>
  );
}
