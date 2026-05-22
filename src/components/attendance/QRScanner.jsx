import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

function QRScanner({ onScan }) {
  const scannerRef = useRef(null)
  const html5QrRef = useRef(null)

  useEffect(() => {
    html5QrRef.current = new Html5Qrcode('qr-reader')
    html5QrRef.current.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      (decodedText) => {
        onScan(decodedText)
        html5QrRef.current?.stop()
      },
      () => {}
    ).catch(() => {})

    return () => {
      html5QrRef.current?.stop().catch(() => {})
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <div id="qr-reader" ref={scannerRef} className="w-full max-w-sm rounded-2xl overflow-hidden" />
      <p className="text-xs text-slate-400 font-medium">Point your camera at a session QR code</p>
    </div>
  )
}

export default QRScanner