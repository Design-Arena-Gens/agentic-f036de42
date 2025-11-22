"use client";
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

export default function BarcodeScanner({ onDetected }: { onDetected: (text: string) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const scanner = new Html5QrcodeScanner(ref.current.id, { fps: 10, qrbox: 250 }, false);
    scanner.render((decodedText) => {
      onDetected(decodedText);
    }, (err) => {
      // ignore
    });
    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onDetected]);

  return <div id="lekya-barcode-scanner" ref={ref} />;
}
