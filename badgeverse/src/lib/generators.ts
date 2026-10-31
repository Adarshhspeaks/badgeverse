// QR code SVG generator — matches the prototype's qrSvg()
// Uses the qrcode npm package for generation
import QRCodeLib from 'qrcode';

export async function generateQRDataUrl(
  text: string,
  color: string,
  bg: string,
  size: number
): Promise<string> {
  try {
    const url = await QRCodeLib.toDataURL(text || ' ', {
      width: size * 3,
      margin: 2,
      color: {
        dark: color,
        light: bg,
      },
      errorCorrectionLevel: 'M',
    });
    return url;
  } catch {
    return '';
  }
}

// Simple barcode SVG generator — matches the prototype's barSvg()
export function generateBarcodeSVG(text: string, color: string): string {
  let x = 0;
  let rects = '';
  const input = (text || 'BV') + '#';
  for (const ch of input) {
    const v = ch.charCodeAt(0);
    for (let i = 0; i < 7; i++) {
      const w = 1 + ((v >> i) & 1) * 1.6;
      if (i % 2 === 0) {
        rects += `<rect x="${x}" width="${w}" height="40"/>`;
      }
      x += w + 0.9;
    }
  }
  return `<svg viewBox="0 0 ${x} 40" width="100%" height="100%" preserveAspectRatio="none" fill="${color}">${rects}</svg>`;
}

