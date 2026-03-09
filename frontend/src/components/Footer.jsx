import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] border-t border-slate-800 text-slate-400 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-sky-500 rounded-lg flex items-center justify-center">
                <span className="text-[#0f172a] font-black text-xl">F</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">FLEET</span>
            </div>
            <p className="text-sm leading-relaxed">
              Global logistics management and real-time package tracking systems.
            </p>
          </div>

          

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">System Status</h4>
            <div className="flex items-center gap-2 text-sm text-emerald-500 bg-emerald-500/10 w-fit px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Operational
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {currentYear} Fleet Logistics Systems. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;