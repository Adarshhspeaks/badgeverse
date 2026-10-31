declare module 'qrcode' {
  export interface QRCodeOptions {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  }

  export function toDataURL(
    text: string,
    options?: QRCodeOptions
  ): Promise<string>;

  export function toString(
    text: string,
    options?: QRCodeOptions
  ): Promise<string>;
}

declare module 'html2canvas' {
  export interface Html2CanvasOptions {
    scale?: number;
    backgroundColor?: string | null;
    useCORS?: boolean;
    allowTaint?: boolean;
    logging?: boolean;
  }

  export default function html2canvas(
    element: HTMLElement,
    options?: Html2CanvasOptions
  ): Promise<HTMLCanvasElement>;
}
