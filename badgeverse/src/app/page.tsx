'use client';

import { motion, type Variants } from 'framer-motion';
import { templates } from '@/lib/template-data';
import { CardThumbnail } from '@/components/cards/CardRenderer';
import { CATEGORIES } from '@/lib/types';
import { MotionLink } from '@/components/ui/MotionElements';

const features = [
  ['Drag-and-drop editor', 'Move, resize, layer and rotate every element.'],
  ['Real QR + barcodes', 'Generated live from the text you type.'],
  ['Front and back', 'Design both sides, including an origin story.'],
  ['Keychain tags', 'Same artwork, tag shape with a hanging hole.'],
  ['Holo and halftone', 'Paper grain, halftone dots and a holographic sheen.'],
  ['PNG, JPG, PDF', 'Export both sides at 3x resolution.'],
];

const steps = [
  'Choose a template',
  'Add your photo and details',
  'Tweak colors, stickers, layers',
  'Download or share',
];

const pricing = [
  ['Free', '$0', 'Basic templates, PNG export with watermark'],
  ['Pro', '$5/mo', 'All templates, no watermark, PDF export'],
  ['Studio', '$15/mo', 'Team libraries and bulk generation'],
];

const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
};

const heroChildVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.06,
    },
  },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export default function HomePage() {
  const t0 = templates[0]; // night (center)
  const t3 = templates[3]; // kpop (left)
  const t9 = templates[9]; // campus (right keychain)

  return (
    <>
      <div className="wrap">
        <section className="hero">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={heroContainerVariants}
          >
            <motion.p variants={heroChildVariants}>
              <b>★ Retro · Collectible · Yours</b>
            </motion.p>
            <motion.h1 variants={heroChildVariants}>Create Your ID.</motion.h1>
            <motion.p className="lead" variants={heroChildVariants}>
              Design custom character cards, membership badges, and collectible
              keychains in minutes.
            </motion.p>
            <motion.p className="row" variants={heroChildVariants}>
              <MotionLink className="btn" href="/editor" whileTap={{ scale: 0.96 }}>
                Create a Card
              </MotionLink>
              <MotionLink className="btn alt" href="/templates" whileTap={{ scale: 0.96 }}>
                Browse Templates
              </MotionLink>
            </motion.p>
          </motion.div>

          <div className="fan" aria-hidden="true">
            <div className="fan-item">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0,
                }}
              >
                <CardThumbnail
                  elements={t3.front}
                  bg={t3.defaults?.bg || t3.bg}
                  texture={t3.defaults?.texture || 'paper'}
                  holo={t3.defaults?.holo ?? true}
                  width={t3.w}
                  height={t3.h}
                  scale={0.6}
                />
              </motion.div>
            </div>

            <div className="fan-item">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              >
                <CardThumbnail
                  elements={t0.front}
                  bg={t0.defaults?.bg || t0.bg}
                  texture={t0.defaults?.texture || 'paper'}
                  holo={t0.defaults?.holo ?? true}
                  width={t0.w}
                  height={t0.h}
                  scale={0.72}
                />
              </motion.div>
            </div>

            <div className="fan-item">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1.0,
                }}
              >
                <CardThumbnail
                  elements={t9.front}
                  bg={t9.defaults?.bg || t9.bg}
                  texture={t9.defaults?.texture || 'paper'}
                  holo={t9.defaults?.holo ?? true}
                  format="key"
                  width={t9.w}
                  height={t9.h}
                  scale={0.6}
                />
              </motion.div>
            </div>
          </div>
        </section>

        <motion.section
          className="sec"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          variants={sectionVariants}
        >
          <h2>Pick a niche</h2>
          <div className="chips">
            {CATEGORIES.slice(1).map((c) => (
              <MotionLink
                key={c}
                className="btn alt sm"
                href={`/templates?cat=${encodeURIComponent(c)}`}
                whileTap={{ scale: 0.96 }}
                variants={tileVariants}
              >
                {c}
              </MotionLink>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="sec"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          variants={sectionVariants}
        >
          <h2>Why BadgeVerse</h2>
          <div className="grid">
            {features.map(([title, desc]) => (
              <motion.div key={title} className="tile" variants={tileVariants}>
                <h3>{title}</h3>
                <p>{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="sec"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          variants={sectionVariants}
        >
          <h2>How it works</h2>
          <div className="grid">
            {steps.map((step, i) => (
              <motion.div key={i} className="tile" variants={tileVariants}>
                <h3>Step {i + 1}</h3>
                <p>{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="sec"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          variants={sectionVariants}
        >
          <h2>Pricing</h2>
          <div className="grid">
            {pricing.map(([name, price, desc]) => (
              <motion.div key={name} className="tile price" variants={tileVariants}>
                <h3>{name}</h3>
                <b>{price}</b>
                <p>{desc}</p>
                <MotionLink
                  className="btn sm"
                  href="/templates"
                  whileTap={{ scale: 0.96 }}
                >
                  Choose {name}
                </MotionLink>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      <footer>
        BadgeVerse cards are for entertainment, creative, collectible, cosplay or
        personal use only. They are not official identification.
      </footer>
    </>
  );
}
