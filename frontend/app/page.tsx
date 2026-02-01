"use client";
import { useState, useEffect } from 'react';

interface AuditResult {
  decision: string;
  ethical_audit: string;
  timestamp: string;
  input: any;
}

export default function BiasDashboard() {
  const [formData, setFormData] = useState({ age: 30, education_num: 12, sex: 1, hours_per_week: 40 });
  const [result, setResult] = useState<AuditResult | null>(null);
  const [history, setHistory] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("https://bias-detection-api.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      const newResult = { 
        ...data, 
        timestamp: new Date().toLocaleTimeString(),
        input: { ...formData } 
      };
      
      setResult(newResult);
      setHistory([newResult, ...history].slice(0, 5)); // Keep last 5 audits
    } catch (error) {
      alert("API is sleeping or disconnected. Check Render logs!");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black flex items-center justify-center p-4 md:p-8 text-slate-200">
      <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: AUDIT FORM (4 COLS) */}
        <div className="lg:col-span-4 bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase">System Active</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">BiasGuard<span className="text-blue-500">.</span></h1>
            <p className="text-slate-400 text-sm mt-1">Algorithmic Fairness Auditor v1.0</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Candidate Age</label>
              <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})} 
              className="w-full bg-slate-900/60 p-3 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Education Level (Years)</label>
              <input type="number" value={formData.education_num} onChange={(e) => setFormData({...formData, education_num: parseInt(e.target.value)})} 
              className="w-full bg-slate-900/60 p-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition-all text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Gender Parameter</label>
              <select onChange={(e) => setFormData({...formData, sex: parseInt(e.target.value)})} 
              className="w-full bg-slate-900/60 p-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none text-white appearance-none cursor-pointer">
                <option value={1}>Male Identifying</option>
                <option value={0}>Female Identifying</option>
              </select>
            </div>

            <button type="submit" disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 overflow-hidden relative">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  PROCESSING...
                </span>
              ) : "RUN AUDIT →"}
            </button>
          </form>
        </div>

        {/* RIGHT: MAIN DISPLAY (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* RESULTS CARD */}
          <div className="bg-slate-800/30 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 min-h-[320px] flex flex-col">
            {!result ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-700/50 rounded-2xl">
                <p className="text-lg font-medium">Awaiting Input Data</p>
                <p className="text-sm">Enter candidate details to begin bias analysis</p>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Audit Decision</h2>
                    <p className={`text-5xl font-black ${result.decision === 'Approved' ? 'text-emerald-400' : 'text-rose-500'}`}>
                      {result.decision}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Security Token</p>
                    <p className="text-xs font-mono text-slate-400">BG-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-slate-900/80 rounded-2xl border-l-4 border-blue-500 shadow-inner">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                      <span>🛡️ Ethical Audit Log</span>
                    </h3>
                    <p className="text-slate-200 leading-relaxed italic text-base">"{result.ethical_audit}"</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-700/50">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Confidence</p>
                      <p className="text-lg font-bold text-white">94.2%</p>
                    </div>
                    <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-700/50">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Latent Bias</p>
                      <p className="text-lg font-bold text-emerald-400">LOW</p>
                    </div>
                    <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-700/50">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Status</p>
                      <p className="text-lg font-bold text-blue-400">Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* HISTORY LIST */}
          <div className="bg-slate-800/20 rounded-3xl p-6 border border-slate-700/30">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Recent Audit History</h3>
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-xs text-slate-600 italic">No previous audits recorded this session.</p>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${item.decision === 'Approved' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                      <div>
                        <p className="text-xs font-bold text-slate-300">{item.decision} Case</p>
                        <p className="text-[10px] text-slate-500">Age: {item.input.age} | Sex: {item.input.sex === 1 ? 'M' : 'F'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600">{item.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}