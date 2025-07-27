import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setIsLoading(true);
      try {
        navigate('/builder', { state: { prompt } });
      } catch (error) {
        console.error('Navigation error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-xl font-bold text-white">PageCraft AI</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-black" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Build Your Dream Website
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Describe your vision in plain English, and watch as AI transforms your ideas into a fully functional website
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-2xl">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-zinc-300 mb-3">
                  What kind of website do you want to build?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A modern portfolio website for a graphic designer with a dark theme, showcasing projects, contact form, and smooth animations..."
                  className="w-full h-40 p-6 bg-zinc-800 text-white border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none placeholder-zinc-500 text-lg leading-relaxed transition-all"
                />
              </div>
              
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="w-full bg-white text-black py-4 px-8 rounded-xl font-semibold text-lg hover:bg-zinc-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Start Building
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 text-center">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-zinc-400 text-sm">Advanced AI understands your requirements and generates code accordingly</p>
            </div>
            
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 text-center">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Preview</h3>
              <p className="text-zinc-400 text-sm">See your website come to life instantly with live preview functionality</p>
            </div>
            
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 text-center">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Step by Step</h3>
              <p className="text-zinc-400 text-sm">Follow the building process with detailed steps and explanations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}