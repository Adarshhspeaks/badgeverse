'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useEditorStore } from '@/store/editor';
import { templates } from '@/lib/template-data';
import { CardRenderer } from '@/components/cards/CardRenderer';
import { Toast } from '@/components/ui/Toast';
import { generateQRDataUrl } from '@/lib/generators';

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

type ExportTier = 'watermark' | 'clean';

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

  // Watermark toggle in preview
  const [previewWatermark, setPreviewWatermark] = useState<boolean>(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<ExportTier>('clean');
  const [paymentStep, setPaymentStep] = useState<'choose' | 'pay' | 'success'>('choose');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!templateId && templates.length > 0) {
      loadTemplate(templates[0]);
    }
    setSelectedId(null);
  }, [templateId, loadTemplate, setSelectedId]);

  // Generate UPI QR code for the selected tier
  useEffect(() => {
    const amount = selectedTier === 'clean' ? '30' : '20';
    const upiUri = `upi://pay?pa=badgeverse@upi&pn=BadgeVerse&am=${amount}&cu=INR&tn=BadgeVerse%20Card%20Export`;
    generateQRDataUrl(upiUri, '#17141f', '#fffaf0', 160).then((url) => {
      setQrDataUrl(url);
    });
  }, [selectedTier]);

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

  const applyWatermarkToCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Compact side watermark badge on bottom-right (not in the center)
    const badgeW = Math.round(w * 0.40);
    const badgeH = Math.round(h * 0.065);
    const pad = Math.round(w * 0.025);
    const x = w - badgeW - pad;
    const y = h - badgeH - pad;
    const radius = Math.round(w * 0.012);

    ctx.save();
    // Dark pill container
    ctx.fillStyle = 'rgba(23, 20, 31, 0.94)';
    ctx.beginPath();
    ctx.roundRect(x, y, badgeW, badgeH, radius);
    ctx.fill();

    // Retro yellow border
    ctx.strokeStyle = '#ffc933';
    ctx.lineWidth = Math.max(2, Math.round(w * 0.004));
    ctx.stroke();

    // Primary text: BADGEVERSE
    ctx.font = `900 ${Math.round(badgeH * 0.52)}px Anton, sans-serif`;
    ctx.fillStyle = '#ffc933';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('BADGEVERSE', x + Math.round(badgeW * 0.08), y + badgeH / 2);

    // Separator line
    const sepX = x + Math.round(badgeW * 0.50);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = Math.max(1, Math.round(w * 0.002));
    ctx.beginPath();
    ctx.moveTo(sepX, y + badgeH * 0.2);
    ctx.lineTo(sepX, y + badgeH * 0.8);
    ctx.stroke();

    // Subtext: WATERMARK (₹20)
    ctx.font = `700 ${Math.round(badgeH * 0.32)}px "Space Mono", monospace`;
    ctx.fillStyle = '#fffaf0';
    ctx.textAlign = 'left';
    ctx.fillText('WATERMARK (₹20)', sepX + Math.round(badgeW * 0.06), y + badgeH / 2);

    ctx.restore();
  };

  const handleDownloadPdf = async (tier: ExportTier) => {
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

      const isWatermarked = tier === 'watermark';
      const isLandscape = cardWidth > cardHeight;

      // Capture Front card
      const frontCanvas = await captureCard(cardElFront, 3);
      if (isWatermarked) {
        applyWatermarkToCanvas(frontCanvas);
      }
      const frontData = frontCanvas.toDataURL('image/png');

      // Capture Back card
      const backCanvas = await captureCard(cardElBack, 3);
      if (isWatermarked) {
        applyWatermarkToCanvas(backCanvas);
      }
      const backData = backCanvas.toDataURL('image/png');

      // Generate 2-Page Print-Ready PDF (Page 1: Front, Page 2: Back)
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

      const filename = isWatermarked
        ? 'badgeverse-card-watermarked.pdf'
        : 'badgeverse-card-clean-hd.pdf';

      pdf.save(filename);
      showToast(
        isWatermarked
          ? 'Standard PDF downloaded (Watermarked)'
          : 'Clean HD PDF downloaded (Watermark Removed)'
      );
    } catch (err) {
      console.error(err);
      showToast('Export failed. Please try again.');
    } finally {
      setRendering(false);
    }
  };

  const openExportModal = () => {
    setPaymentStep('choose');
    setModalOpen(true);
  };

  const handleProceedToPayment = (tier: ExportTier) => {
    setSelectedTier(tier);
    setPaymentStep('pay');
  };

  const handleConfirmPaymentAndDownload = async () => {
    setIsProcessingPayment(true);

    // Simulate UPI verification delay
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setPaymentStep('success');

    // Trigger PDF generation
    await handleDownloadPdf(selectedTier);
    setIsProcessingPayment(false);

    // Auto close modal after brief delay
    setTimeout(() => {
      setModalOpen(false);
      setPaymentStep('choose');
    }, 2200);
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

  const copyUpiId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('badgeverse@upi');
      showToast('UPI ID copied: badgeverse@upi');
    }
  };

  return (
    <>
      <div className="wrap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '48px' }}>Preview &amp; export</h2>
            <p style={{ margin: '6px 0 0', opacity: 0.8, fontSize: '14px' }}>
              High-resolution 2-page PDF containing both Front and Back card artwork.
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

        {/* Live Watermark Preview Controller */}
        <div
          style={{
            marginTop: '24px',
            padding: '12px 18px',
            background: 'var(--card)',
            border: '3px solid var(--line)',
            borderRadius: '12px',
            boxShadow: '4px 4px 0 var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Preview Mode:
            </span>
            <div style={{ display: 'inline-flex', border: '2px solid var(--line)', borderRadius: '6px', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setPreviewWatermark(true)}
                style={{
                  padding: '6px 14px',
                  font: '700 12px "Space Mono", monospace',
                  background: previewWatermark ? 'var(--sun)' : 'transparent',
                  border: 'none',
                  borderRight: '2px solid var(--line)',
                  cursor: 'pointer',
                  color: 'var(--ink)',
                }}
              >
                With Watermark (₹20)
              </button>
              <button
                type="button"
                onClick={() => setPreviewWatermark(false)}
                style={{
                  padding: '6px 14px',
                  font: '700 12px "Space Mono", monospace',
                  background: !previewWatermark ? 'var(--pop)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: !previewWatermark ? '#fff' : 'var(--ink)',
                }}
              >
                Clean HD (₹30)
              </button>
            </div>
          </div>
          <div style={{ fontSize: '12px', opacity: 0.85 }}>
            {previewWatermark
              ? 'Showing Standard Edition with BadgeVerse Watermark (₹20)'
              : 'Showing Clean Studio Edition without Watermark (₹30)'}
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
              {/* Visual Watermark Overlay — Compact side badge */}
              {previewWatermark && (
                <div
                  style={{
                    position: 'absolute',
                    right: '10px',
                    bottom: '10px',
                    zIndex: 25,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(23, 20, 31, 0.94)',
                    color: '#fffaf0',
                    border: '2px solid #ffc933',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.5)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Anton, sans-serif',
                      fontSize: '13px',
                      color: '#ffc933',
                      letterSpacing: '0.6px',
                    }}
                  >
                    BADGEVERSE
                  </span>
                  <span
                    style={{
                      width: '1px',
                      height: '14px',
                      background: 'rgba(255,255,255,0.3)',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: '"Space Mono", monospace',
                      fontSize: '9px',
                      fontWeight: 700,
                      color: '#fffaf0',
                      textTransform: 'uppercase',
                    }}
                  >
                    WATERMARK (₹20)
                  </span>
                </div>
              )}
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
              {/* Visual Watermark Overlay — Compact side badge */}
              {previewWatermark && (
                <div
                  style={{
                    position: 'absolute',
                    right: '10px',
                    bottom: '10px',
                    zIndex: 25,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(23, 20, 31, 0.94)',
                    color: '#fffaf0',
                    border: '2px solid #ffc933',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.5)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Anton, sans-serif',
                      fontSize: '13px',
                      color: '#ffc933',
                      letterSpacing: '0.6px',
                    }}
                  >
                    BADGEVERSE
                  </span>
                  <span
                    style={{
                      width: '1px',
                      height: '14px',
                      background: 'rgba(255,255,255,0.3)',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: '"Space Mono", monospace',
                      fontSize: '9px',
                      fontWeight: 700,
                      color: '#fffaf0',
                      textTransform: 'uppercase',
                    }}
                  >
                    WATERMARK (₹20)
                  </span>
                </div>
              )}
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
            onClick={openExportModal}
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
            {rendering ? 'Rendering PDF…' : 'Save as PDF (Front + Back)'}
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
            Both front and back images are compiled at 3x resolution into a 2-page PDF ready for PVC card printers, A4 printing, or digital archiving.
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', opacity: 0.7 }}>
          For entertainment, creative, collectible, cosplay or personal use only.
        </p>
      </div>

      {/* Checkout / Payment Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(23, 20, 31, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => !isProcessingPayment && setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ duration: 0.2 }}
              style={{
                width: '100%',
                maxWidth: '560px',
                background: 'var(--card)',
                border: '3px solid var(--line)',
                borderRadius: '16px',
                boxShadow: '8px 8px 0 var(--line)',
                padding: '28px clamp(18px, 4vw, 32px)',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              {!isProcessingPayment && (
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '34px',
                    height: '34px',
                    border: '2px solid var(--line)',
                    borderRadius: '8px',
                    background: 'var(--bg)',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              )}

              {/* STEP 1: CHOOSE EDITION (₹20 vs ₹30) */}
              {paymentStep === 'choose' && (
                <div>
                  <h3 style={{ fontSize: '28px', margin: '0 0 6px' }}>Save as PDF</h3>
                  <p style={{ margin: '0 0 20px', fontSize: '13px', opacity: 0.8 }}>
                    Includes <strong>both Front and Back</strong> in a single high-resolution PDF document.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    {/* OPTION 1: ₹20 WITH WATERMARK */}
                    <div
                      style={{
                        border: '3px solid var(--line)',
                        borderRadius: '12px',
                        padding: '18px',
                        background: 'var(--bg)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'inline-block',
                            background: '#e2d7c0',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            border: '1px solid var(--line)',
                            marginBottom: '8px',
                          }}
                        >
                          Standard Edition
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{ fontSize: '32px', fontFamily: 'Anton, sans-serif' }}>₹20</span>
                          <span style={{ fontSize: '12px', opacity: 0.8 }}>/ card</span>
                        </div>
                        <ul style={{ margin: '14px 0', paddingLeft: '18px', fontSize: '12px', lineHeight: 1.7 }}>
                          <li>Front + Back in 1 PDF</li>
                          <li>3x High Resolution</li>
                          <li><strong>Includes BadgeVerse Watermark</strong></li>
                          <li>Ideal for preview &amp; social display</li>
                        </ul>
                      </div>

                      <motion.button
                        className="btn alt"
                        style={{ width: '100%', marginTop: '12px' }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleProceedToPayment('watermark')}
                      >
                        Choose ₹20 Edition
                      </motion.button>
                    </div>

                    {/* OPTION 2: ₹30 WATERMARK REMOVED (POPULAR) */}
                    <div
                      style={{
                        border: '3px solid var(--line)',
                        borderRadius: '12px',
                        padding: '18px',
                        background: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        boxShadow: '4px 4px 0 var(--line)',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '-12px',
                          right: '14px',
                          background: 'var(--pop)',
                          color: '#fff',
                          fontFamily: 'Anton, sans-serif',
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '2px solid var(--line)',
                          letterSpacing: '0.5px',
                        }}
                      >
                        WATERMARK REMOVED ★
                      </div>

                      <div>
                        <div
                          style={{
                            display: 'inline-block',
                            background: 'var(--sun)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            border: '1px solid var(--line)',
                            marginBottom: '8px',
                          }}
                        >
                          Clean Studio Edition
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span style={{ fontSize: '32px', fontFamily: 'Anton, sans-serif' }}>₹30</span>
                          <span style={{ fontSize: '12px', opacity: 0.8 }}>/ card</span>
                        </div>
                        <ul style={{ margin: '14px 0', paddingLeft: '18px', fontSize: '12px', lineHeight: 1.7 }}>
                          <li>Front + Back in 1 PDF</li>
                          <li><strong>100% Watermark Removed</strong></li>
                          <li>Studio 3x Crisp Resolution</li>
                          <li>Ready for PVC Card Printing &amp; Cosplay</li>
                        </ul>
                      </div>

                      <motion.button
                        className="btn"
                        style={{ width: '100%', marginTop: '12px' }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleProceedToPayment('clean')}
                      >
                        Pay ₹30 (No Watermark)
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: UPI PAYMENT CHECKOUT */}
              {paymentStep === 'pay' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentStep('choose')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 700,
                        textDecoration: 'underline',
                        padding: 0,
                      }}
                    >
                      ← Back
                    </button>
                    <span style={{ opacity: 0.4 }}>|</span>
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>
                      {selectedTier === 'clean' ? 'Clean HD PDF (₹30)' : 'Standard PDF with Watermark (₹20)'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '26px', margin: '0 0 4px' }}>Scan &amp; Pay with UPI</h3>
                  <p style={{ margin: '0 0 18px', fontSize: '13px', opacity: 0.8 }}>
                    Pay <strong>₹{selectedTier === 'clean' ? '30' : '20'}</strong> using any UPI app to generate and download both front and back in PDF.
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: 'var(--bg)',
                      border: '3px solid var(--line)',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '20px',
                    }}
                  >
                    {/* QR Display */}
                    <div
                      style={{
                        background: '#fffaf0',
                        padding: '12px',
                        border: '2px solid var(--line)',
                        borderRadius: '10px',
                        boxShadow: '3px 3px 0 var(--line)',
                        marginBottom: '14px',
                      }}
                    >
                      {qrDataUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={qrDataUrl}
                          alt="UPI QR Code"
                          width={150}
                          height={150}
                          style={{ display: 'block', borderRadius: '4px' }}
                        />
                      ) : (
                        <div style={{ width: 150, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          Loading QR…
                        </div>
                      )}
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                      UPI ID: <code style={{ background: '#fff', padding: '2px 6px', border: '1px solid var(--line)', borderRadius: '4px' }}>badgeverse@upi</code>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        style={{
                          fontSize: '11px',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          border: '1px solid var(--line)',
                          background: 'var(--card)',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        Copy UPI ID
                      </button>
                    </div>

                    {/* UPI App Icons Badges */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'CRED'].map((app) => (
                        <span
                          key={app}
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            background: '#fff',
                            border: '1px solid var(--line)',
                            borderRadius: '4px',
                          }}
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Payment Simulator / Confirmation Button */}
                  <motion.button
                    className="btn"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '15px',
                      background: selectedTier === 'clean' ? 'var(--sun)' : 'var(--bg)',
                      border: '3px solid var(--line)',
                    }}
                    disabled={isProcessingPayment || rendering}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleConfirmPaymentAndDownload}
                  >
                    {isProcessingPayment
                      ? 'Verifying Payment & Generating PDF…'
                      : `I Have Paid ₹${selectedTier === 'clean' ? '30' : '20'} — Download PDF`}
                  </motion.button>
                </div>
              )}

              {/* STEP 3: SUCCESS CONFIRMATION */}
              {paymentStep === 'success' && (
                <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: 'var(--sun)',
                      border: '3px solid var(--line)',
                      boxShadow: '4px 4px 0 var(--line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '34px',
                      margin: '0 auto 18px',
                    }}
                  >
                    ✓
                  </motion.div>
                  <h3 style={{ fontSize: '30px', margin: '0 0 8px' }}>Payment Confirmed!</h3>
                  <p style={{ margin: '0 0 16px', fontSize: '14px' }}>
                    Your print-ready PDF containing <strong>both Front and Back</strong> is downloading now.
                  </p>
                  <div
                    style={{
                      display: 'inline-block',
                      background: 'var(--bg)',
                      border: '2px solid var(--line)',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {selectedTier === 'clean'
                      ? '★ Clean HD Edition (Watermark Removed)'
                      : 'Standard Edition (With Watermark)'}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toast message={toastMessage} />
    </>
  );
}
