"use client";
import { useState } from 'react';

export default function BiasDashboard() {
  const [formData, setFormData] = useState({ age: 30, education_num: 12, sex: 1, hours_per_week: 40 });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // REPLACE THIS URL with your actual Render API URL
      const response = await fetch("https://bias-detection-api.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("API is sleeping or disconnected.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <h1 className="text-2xl font-bold mb-6 text-center">⚖️ Bias Guardrail</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Age</label>
            <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})} 
            className="w-full bg-slate-700 p-2 rounded border border-slate-600 outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm mb-1">Education Level (Years)</label>
            <input type="number" value={formData.education_num} onChange={(e) => setFormData({...formData, education_num: parseInt(e.target.value)})} 
            className="w-full bg-slate-700 p-2 rounded border border-slate-600 outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm mb-1">Gender</label>
            <select onChange={(e) => setFormData({...formData, sex: parseInt(e.target.value)})} 
            className="w-full bg-slate-700 p-2 rounded border border-slate-600 outline-none focus:border-blue-500 text-white">
              <option value={1}>Male</option>
              <option value={0}>Female</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold transition-all mt-4">
            {loading ? "ANALYZING..." : "RUN BIAS AUDIT →"}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 rounded-lg bg-slate-700 border border-blue-500/50">
            <p className="text-xs uppercase text-slate-400 font-bold">Result</p>
            <p className="text-xl font-bold text-blue-400">{result.decision}</p>
            <p className="text-sm mt-2 text-slate-300 italic">{result.ethical_audit}</p>
          </div>
        )}
      </div>
    </main>
  );
}