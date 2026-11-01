'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, type Variants } from 'framer-motion';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useEditorStore } from '@/store/editor';
import { templates } from '@/lib/template-data';
import { CardRenderer } from '@/components/cards/CardRenderer';
import { Toast } from '@/components/ui/Toast';

const expContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const figureVariants: Variants = {
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

export default function ExportPage() {
  const router = useRouter();
  const {
    templateId,
    elements,
    bg,
    texture,
    holo,
    cardWidth,
    cardHeight,
    loadTemplate,
    setSelectedId,
  } = useEditorStore();

  const [rendering, setRendering] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!templateId && templates.length > 0) {
      loadTemplate(templates[0]);
    }
    setSelectedId(null);
  }, [templateId, loadTemplate, setSelectedId]);

  // Responsive scale down preview on small screens matching prototype fitExp()
  useEffect(() => {
    const fitExp = () => {
      const k = Math.min(1, (window.innerWidth - 36) / cardWidth);
      document.querySelectorAll<HTMLElement>('.exp figure').forEach((f) => {
        f.style.zoom = String(k);
      });
    };

    fitExp();
    window.addEventListener('resize', fitExp);
    return () => window.removeEventListener('resize', fitExp);
  }, [cardWidth]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const captureCard = async (
    element: HTMLElement,
    scale: number = 3
  ): Promise<HTMLCanvasElement> => {
    return await html2canvas(element, {
      scale,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
  };

  // Direct 1-click Save as PDF (both Front and Back included)
  const handleSaveAsPdf = async () => {
    if (!frontRef.current || !backRef.current) return;
    setRendering(true);

    try {
      const cardElFront = frontRef.current.querySelector(
        '.card'
      ) as HTMLElement | null;
      const cardElBack = backRef.current.querySelector(
        '.card'
      ) as HTMLElement | null;

      if (!cardElFront || !cardElBack) {
        showToast('Export failed. Check your card elements and try again.');
        setRendering(false);
        return;
      }

      const isLandscape = cardWidth > cardHeight;

      // 1. Capture Front Card at 3x scale
      const frontCanvas = await captureCard(cardElFront, 3);
      const frontData = frontCanvas.toDataURL('image/png');

      // 2. Capture Back Card at 3x scale
      const backCanvas = await captureCard(cardElBack, 3);
      const backData = backCanvas.toDataURL('image/png');

      // 3. Generate 2-Page Print-Ready PDF
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'px',
        format: [cardWidth, cardHeight],
        hotfixes: ['px_scaling'],
      });

      // Page 1: Front
      pdf.addImage(frontData, 'PNG', 0, 0, cardWidth, cardHeight);

      // Page 2: Back
      pdf.addPage([cardWidth, cardHeight], isLandscape ? 'landscape' : 'portrait');
      pdf.addImage(backData, 'PNG', 0, 0, cardWidth, cardHeight);

      pdf.save('badgeverse-card.pdf');
      showToast('PDF downloaded successfully (Front & Back included)!');
    } catch (err) {
      console.error(err);
      showToast('Export failed. Please check connection and try again.');
    } finally {
      setRendering(false);
    }
  };

  const handleStartOver = () => {
    if (confirm('Start over? Unsaved edits to this card will be lost.')) {
      if (templates.length > 0) {
        loadTemplate(templates[0]);
      }
      router.push('/editor');
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: 'BadgeVerse Card',
          text: 'Check out the ID card I generated on BadgeVerse! Save as PDF with front and back.',
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => showToast('Link copied to clipboard'))
        .catch(() => showToast('Copy failed'));
    }
  };

  return (
    <>
      <div className="wrap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '48px' }}>Preview &amp; export</h2>
            <p style={{ margin: '6px 0 0', opacity: 0.8, fontSize: '14px' }}>
              High-resolution 2-page print-ready PDF containing both Front and Back card artwork.
            </p>
          </div>
          <div className="row" style={{ margin: 0 }}>
            <motion.button
              className="btn alt"
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push('/editor')}
            >
              Back to editor
            </motion.button>
            <motion.button
              className="btn alt"
              whileTap={{ scale: 0.96 }}
              onClick={handleStartOver}
            >
              Start over
            </motion.button>
          </div>
        </div>

        {/* Card Previews */}
        <motion.div
          className="exp"
          initial="hidden"
          animate="visible"
          variants={expContainerVariants}
          style={{ marginTop: '28px' }}
        >
          {/* FRONT */}
          <motion.figure variants={figureVariants} style={{ position: 'relative' }}>
            <div id="xf" ref={frontRef} style={{ position: 'relative', overflow: 'hidden' }}>
              <CardRenderer
                elements={elements.front}
                bg={bg}
                texture={texture}
                holo={holo}
                format="card"
                width={cardWidth}
                height={cardHeight}
              />
            </div>
            <figcaption>Front side (Included in PDF)</figcaption>
          </motion.figure>

          {/* BACK */}
          <motion.figure variants={figureVariants} style={{ position: 'relative' }}>
            <div id="xb" ref={backRef} style={{ position: 'relative', overflow: 'hidden' }}>
              <CardRenderer
                elements={elements.back}
                bg={bg}
                texture={texture}
                holo={holo}
                format="card"
                width={cardWidth}
                height={cardHeight}
              />
            </div>
            <figcaption>Back side (Included in PDF)</figcaption>
          </motion.figure>

          {/* KEYCHAIN MOCKUP */}
          <motion.figure className="kc" variants={figureVariants}>
            <div className="ringx"></div>
            <CardRenderer
              elements={elements.front}
              bg={bg}
              texture={texture}
              holo={holo}
              format="key"
              width={cardWidth}
              height={cardHeight}
            />
            <figcaption>Keychain mockup</figcaption>
          </motion.figure>
        </motion.div>

        {/* Primary Download Actions: Only "Save as PDF" */}
        <div
          className="row"
          style={{
            justifyContent: 'center',
            marginTop: '36px',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <motion.button
            className="btn"
            style={{
              padding: '14px 32px',
              fontSize: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--sun)',
            }}
            disabled={rendering}
            whileTap={{ scale: 0.96 }}
            onClick={handleSaveAsPdf}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            {rendering ? 'Generating PDF…' : 'Save as PDF (Front + Back)'}
          </motion.button>

          <motion.button
            className="btn alt"
            style={{ padding: '14px 24px', fontSize: '15px' }}
            whileTap={{ scale: 0.96 }}
            onClick={handleShare}
          >
            Share
          </motion.button>
        </div>

        <div
          style={{
            maxWidth: '560px',
            margin: '28px auto 0',
            textAlign: 'center',
            padding: '12px 18px',
            background: 'rgba(23, 20, 31, 0.04)',
            borderRadius: '8px',
            border: '1px dashed var(--line)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '13px' }}>
            📄 Single Print-Ready Document
          </div>
          <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.85 }}>
            Both front and back card images are compiled at 3x resolution into a 2-page PDF ready for PVC card printers, photo paper, or digital archiving.
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', opacity: 0.7 }}>
          For entertainment, creative, collectible, cosplay or personal use only.
        </p>
      </div>

      <Toast message={toastMessage} />
    </>
  );
}
