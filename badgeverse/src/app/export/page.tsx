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
    setTimeout(() => setToastMessage(null), 2200);
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

  const handleDownload = async (format: 'png' | 'jpg' | 'pdf') => {
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
        showToast('Export failed. Check your connection and try again.');
        setRendering(false);
        return;
      }

      if (format === 'png' || format === 'jpg') {
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const ext = format;

        const frontCanvas = await captureCard(cardElFront, 3);
        const frontLink = document.createElement('a');
        frontLink.download = `badgeverse-front.${ext}`;
        frontLink.href = frontCanvas.toDataURL(mimeType, 0.95);
        frontLink.click();

        await new Promise((resolve) => setTimeout(resolve, 500));

        const backCanvas = await captureCard(cardElBack, 3);
        const backLink = document.createElement('a');
        backLink.download = `badgeverse-back.${ext}`;
        backLink.href = backCanvas.toDataURL(mimeType, 0.95);
        backLink.click();
      } else if (format === 'pdf') {
        const isLandscape = cardWidth > cardHeight;
        const pdf = new jsPDF({
          orientation: isLandscape ? 'landscape' : 'portrait',
          unit: 'px',
          format: [cardWidth, cardHeight],
          hotfixes: ['px_scaling'],
        });

        const frontCanvas = await captureCard(cardElFront, 3);
        const frontData = frontCanvas.toDataURL('image/png');
        pdf.addImage(frontData, 'PNG', 0, 0, cardWidth, cardHeight);

        pdf.addPage([cardWidth, cardHeight], isLandscape ? 'landscape' : 'portrait');
        const backCanvas = await captureCard(cardElBack, 3);
        const backData = backCanvas.toDataURL('image/png');
        pdf.addImage(backData, 'PNG', 0, 0, cardWidth, cardHeight);

        pdf.save('badgeverse-cards.pdf');
      }

      showToast('Downloaded');
    } catch {
      showToast('Export failed. Check your connection and try again.');
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
          text: 'Check out the ID card I generated on BadgeVerse!',
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => showToast('Link copied'))
        .catch(() => showToast('Copy failed'));
    }
  };

  return (
    <>
      <div className="wrap">
        <h2 style={{ fontSize: '48px' }}>Preview &amp; export</h2>
        <div className="row" style={{ marginTop: '14px' }}>
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

        <motion.div
          className="exp"
          initial="hidden"
          animate="visible"
          variants={expContainerVariants}
        >
          <motion.figure variants={figureVariants}>
            <div id="xf" ref={frontRef}>
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
            <figcaption>Front</figcaption>
          </motion.figure>

          <motion.figure variants={figureVariants}>
            <div id="xb" ref={backRef}>
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
            <figcaption>Back</figcaption>
          </motion.figure>

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

        <div className="row" style={{ justifyContent: 'center' }}>
          <motion.button
            className="btn"
            disabled={rendering}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleDownload('png')}
          >
            {rendering ? 'Rendering…' : 'Download PNG'}
          </motion.button>
          <motion.button
            className="btn"
            disabled={rendering}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleDownload('jpg')}
          >
            {rendering ? 'Rendering…' : 'Download JPG'}
          </motion.button>
          <motion.button
            className="btn"
            disabled={rendering}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleDownload('pdf')}
          >
            {rendering ? 'Rendering…' : 'Download PDF'}
          </motion.button>
          <motion.button
            className="btn alt"
            whileTap={{ scale: 0.96 }}
            onClick={handleShare}
          >
            Share
          </motion.button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px' }}>
          For entertainment, creative, collectible, cosplay or personal use only.
        </p>
      </div>

      <Toast message={toastMessage} />
    </>
  );
}
