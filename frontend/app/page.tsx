'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    text: '',
    category: 'Gender'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // FIXED: Added the React.FormEvent type here
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
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("API Connection Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6">Ethical AI Guardrail</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea 
            className="w-full p-4 bg-gray-800 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none text-white"
            placeholder="Enter text to analyze for bias..."
            value={formData.text}
            onChange={(e) => setFormData({...formData, text: e.target.value})}
            rows={4}
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Check for Bias"}
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-gray-800/50 rounded-lg border border-blue-500/30">
            <h2 className="text-xl font-semibold mb-2">Analysis Result:</h2>
            <p className="text-lg">Bias Score: <span className="text-blue-400">{(result.bias_score * 100).toFixed(2)}%</span></p>
            <p className="mt-2 text-gray-300 italic">"{result.verdict}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
