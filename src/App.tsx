import React, { useState } from 'react';
import { MessageCircle, Users, Sparkles, Database, TerminalSquare } from 'lucide-react';
import DiscussionSetup from './components/DiscussionSetup';
import LogoCloud from './components/LogoCloud';
import Header from './components/Header';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'setup'>('landing');

  const handleHostDiscussion = () => {
    setCurrentPage('setup');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  if (currentPage === 'setup') {
    return <DiscussionSetup onBack={handleBackToLanding} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full"></div>
      </div>

      <Header />

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-surface-card backdrop-blur-sm border border-surface-border rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-slate-100 font-medium">Powered by AI</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-6 leading-tight">
            From Ambiguity to
            <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Certainty.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Option.ai provides a high-confidence decision layer for your most critical physical operations, turning ambiguous sensor data into certain, actionable outcomes.
          </p>

          {/* Main CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <button 
              onClick={handleHostDiscussion}
              className="group relative bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 min-w-[240px]"
            >
              <MessageCircle className="w-6 h-6" />
              <span>Get Started</span>
            </button>
            
          </div>

          {/* 3-Pillar Section */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-100 text-center mb-12">From Physical Data to Digital Certainty</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Pillar 1: Ingest */}
              <div className="bg-surface-card backdrop-blur-sm border border-surface-border rounded-xl p-8 text-center hover:bg-surface-card/80 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-500 rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-3">Ingest</h3>
                <p className="text-slate-300">Aggregate multi-modal data from any physical sensor—cameras, LiDAR, vibration, thermal—into a unified stream.</p>
              </div>

              {/* Pillar 2: Consensus */}
              <div className="bg-surface-card backdrop-blur-sm border border-surface-border rounded-xl p-8 text-center hover:bg-surface-card/80 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-purple-500 rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-3">Consensus</h3>
                <p className="text-slate-300">A council of specialized LLM agents debate and cross-validate findings, eliminating errors and bias to reach a high-confidence agreement.</p>
              </div>

              {/* Pillar 3: Act */}
              <div className="bg-surface-card backdrop-blur-sm border border-surface-border rounded-xl p-8 text-center hover:bg-surface-card/80 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-indigo-500 rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <TerminalSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-3">Act</h3>
                <p className="text-slate-300">Deliver clear, actionable insights—from critical safety alerts to automated quality control decisions—in milliseconds.</p>
              </div>
            </div>
          </div>

          <LogoCloud />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-surface-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center">
            <p className="text-slate-400 text-sm">© 2025 Option.ai. Transforming conversations through intelligent technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
