'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { getTemplate } from '@/lib/template-data';
import { CardRenderer } from '@/components/cards/CardRenderer';
import { DualCardThumbnail } from '@/components/cards/DualCardThumbnail';
import { CardMockup } from '@/components/cards/CardMockup';

export default function PreviewPage() {
  const params = useParams();
  const id = params?.id as string;
  const template = getTemplate(id);

  if (!template) {
    return <div className="wrap"><p>Template not found</p></div>;
  }

  return (
    <div className="wrap" style={{ padding: '40px 20px', maxWidth: '1440px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '42px', margin: 0 }}>{template.name}</h1>
        <p style={{ fontSize: '16px', color: '#666' }}>
          Category: <b>{template.cat}</b> · Tier: <b>{template.tier}</b> · ID: <code>{template.id}</code>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(560px, 1fr))', gap: '40px' }}>
        {/* FRONT SIDE */}
        <section style={{ background: 'var(--card)', padding: '24px', borderRadius: '16px', border: '3px solid var(--line)', boxShadow: '5px 5px 0 var(--line)' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>1. Personal Front Design</h2>
          <div style={{ width: `${template.w}px`, height: `${template.h}px`, margin: '0 auto' }}>
            <CardRenderer
              elements={template.front}
              bg={template.defaults?.bg || template.bg}
              texture={template.defaults?.texture || 'paper'}
              holo={template.defaults?.holo ?? true}
              format="card"
              width={template.w}
              height={template.h}
              scale={1}
            />
          </div>
        </section>

        {/* BACK HERO SIDE */}
        <section style={{ background: 'var(--card)', padding: '24px', borderRadius: '16px', border: '3px solid var(--line)', boxShadow: '5px 5px 0 var(--line)' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>2. Hero Back Poster Design</h2>
          <div style={{ width: `${template.w}px`, height: `${template.h}px`, margin: '0 auto' }}>
            <CardRenderer
              elements={template.back}
              bg={template.defaults?.bg || template.bg}
              texture={template.defaults?.texture || 'paper'}
              holo={template.defaults?.holo ?? true}
              format="card"
              width={template.w}
              height={template.h}
              scale={1}
            />
          </div>
        </section>

        {/* DUAL THUMBNAIL */}
        <section style={{ background: 'var(--card)', padding: '24px', borderRadius: '16px', border: '3px solid var(--line)', boxShadow: '5px 5px 0 var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', alignSelf: 'flex-start' }}>3. Dual-Sided Thumbnail (Gallery)</h2>
          <div style={{ marginTop: '20px' }}>
            <DualCardThumbnail
              frontElements={template.front}
              backElements={template.back}
              bg={template.defaults?.bg || template.bg}
              texture={template.defaults?.texture || 'paper'}
              holo={template.defaults?.holo ?? true}
              width={template.w}
              height={template.h}
              scale={0.65}
            />
          </div>
        </section>

        {/* REALISTIC 3D MOCKUP */}
        <section style={{ background: 'var(--card)', padding: '24px', borderRadius: '16px', border: '3px solid var(--line)', boxShadow: '5px 5px 0 var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', alignSelf: 'flex-start' }}>4. Realistic Card Mockup (3D Flip)</h2>
          <CardMockup
            frontElements={template.front}
            backElements={template.back}
            bg={template.defaults?.bg || template.bg}
            texture={template.defaults?.texture || 'paper'}
            holo={template.defaults?.holo ?? true}
            width={template.w}
            height={template.h}
            scale={0.88}
            interactive={true}
          />
        </section>
      </div>
    </div>
  );
}
