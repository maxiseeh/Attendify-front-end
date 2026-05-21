import { QRCodeSVG } from 'qrcode.react';
// Component to generate and display a QR code for a session
function QRGenerator({ value, title, subtitle }) {
  if (!value) return null;
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 animate-in">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title || "Attendance QR Code"}</h3>
        <p className="text-sm text-slate-400 mt-1">{subtitle || "Scan this code with your phone to mark presence."}</p>
      </div>
      <div className="p-6 bg-white rounded-3xl shadow-inner border border-slate-50 flex items-center justify-center">
        <QRCodeSVG 
          value={value} 
          size={200}
          level="H"
          includeMargin={true}
          className="rounded-lg"
        />
      </div>
      <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-100 dark:border-emerald-500/20">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Live Session Active</span>
      </div>
    </div>
  );
}
export default QRGenerator;
