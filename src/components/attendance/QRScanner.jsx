import { useState } from 'react'

// QR scanner component - student scans code to mark attendance
// TODO: integrate a real qr scanner library later

function QRScanner({ onScan }) {
  const [scanning, setScanning] = useState(false)

  const startScan = () => {
    setScanning(true)
    // placeholder - will add actual scanning logic later
    console.log('scanning started...')
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="w-64 h-64 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg bg-gray-50">
        {scanning ? (
          <p className="text-gray-500 text-sm">Scanning...</p>
        ) : (
          <p className="text-gray-400 text-sm">Camera will show here</p>
        )}
      </div>
      <button
        onClick={startScan}
        className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700"
      >
        Start Scan
      </button>
    </div>
  )
}

export default QRScanner
