import React, { useState } from 'react';
import { Users, Clock, Download, RefreshCw, Sparkles, FileText, Target, Lightbulb, Info } from 'lucide-react';
import Header from './Header';

interface ConclusionPageProps {
  onBack: () => void;
  analysisResult: AnalysisResult | null;
  topic: string;
  participants: number;
  duration: number;
}

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  commonThemes: string[];
  conclusions: string[];
  sentiment: string;
  participationAnalysis: string;
  confidenceScore?: number;
  reasoning?: string;
}

const ConfidenceMeter = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score * circumference);

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className="text-primary"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-slate-100">{(score * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
};

export default function ConclusionPage({
  onBack,
  analysisResult,
  topic,
  participants,
  duration,
}: ConclusionPageProps) {
  const hasConclusion = analysisResult && analysisResult.conclusions && analysisResult.conclusions.length > 0;

  const downloadReport = () => {
    if (analysisResult) {
      const reportText = `
Option.ai - The AI Decision Platform
=====================================
      
Discussion Topic: ${topic}
Participants: ${participants}
Duration: ${duration} minutes
      
-------------------------------------
      
✅ FINAL CONCLUSION
------------------
${analysisResult.conclusions[0]}
      
Confidence: ${(analysisResult.confidenceScore || 0) * 100}%
Reasoning: ${analysisResult.reasoning}
      
🔑 KEY ARGUMENTS
-----------------
- ${analysisResult.keyPoints.join('\n- ')}
      
💡 COMMON THEMES
----------------
- ${analysisResult.commonThemes.join('\n- ')}
      
📝 SUMMARY
-----------
${analysisResult.summary}
      
😊 SENTIMENT & PARTICIPATION
-----------------------------
Sentiment: ${analysisResult.sentiment}
Participation: ${analysisResult.participationAnalysis}
      `;
      const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Option.ai_Report_${topic.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const restartDiscussion = () => {
    onBack();
  };

  return (
    <div className="min-h-screen">
      <Header showBackButton onBack={onBack} />

      {/* Main Content */}
      <main className="relative z-10 p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Discussion Outcome</h2>
            <p className="text-lg text-slate-300 mt-2">{topic}</p>
          </div>

          {hasConclusion && analysisResult ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Conclusion & Reasoning */}
              <div className="lg:col-span-2 bg-surface-card backdrop-blur-lg border border-surface-border rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <Target className="w-8 h-8 text-primary" />
                  <h3 className="text-2xl font-bold text-slate-100">Final Conclusion</h3>
                </div>
                <div className="bg-background/50 rounded-lg p-6 mb-6">
                  <p className="text-2xl font-semibold text-primary leading-relaxed">{analysisResult.conclusions[0]}</p>
                </div>

                <div className="flex items-center space-x-3 mb-6">
                  <Info className="w-6 h-6 text-secondary" />
                  <h3 className="text-xl font-bold text-slate-100">Reasoning</h3>
                </div>
                <div className="bg-background/50 rounded-lg p-6">
                  <p className="text-slate-300 leading-relaxed">{analysisResult.reasoning}</p>
                </div>
              </div>

              {/* Right Column: Confidence & Key Info */}
              <div className="space-y-8">
                <div className="bg-surface-card backdrop-blur-lg border border-surface-border rounded-2xl p-8 text-center">
                  <h3 className="text-xl font-bold text-slate-100 mb-4">Confidence Score</h3>
                  <ConfidenceMeter score={analysisResult.confidenceScore || 0} />
                </div>
                <div className="bg-surface-card backdrop-blur-lg border border-surface-border rounded-2xl p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <Lightbulb className="w-6 h-6 text-yellow-300" />
                    <h3 className="text-xl font-bold text-slate-100">Key Arguments</h3>
                  </div>
                  <ul className="space-y-3">
                    {analysisResult.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                        <p className="text-slate-300">{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center bg-surface-card backdrop-blur-lg border border-red-400/30 rounded-2xl p-12">
              <h3 className="text-3xl font-bold text-red-300 mb-4">No Definitive Conclusion Reached</h3>
              <p className="text-slate-300 max-w-2xl mx-auto">The AI facilitator analyzed the discussion but could not determine a single, high-confidence outcome. This may be due to deeply divided opinions, a lack of actionable proposals, or insufficient time for the complexity of the topic.</p>
            </div>
          )}

          {/* Other Analyses & Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-surface-card backdrop-blur-sm border border-surface-border rounded-xl p-6">
              <h4 className="text-lg font-semibold text-slate-100 mb-3 flex items-center space-x-2"><Sparkles className="w-5 h-5 text-primary" /><span>Sentiment</span></h4>
              <p className="text-slate-300">{analysisResult?.sentiment}</p>
            </div>
            <div className="bg-surface-card backdrop-blur-sm border border-surface-border rounded-xl p-6">
              <h4 className="text-lg font-semibold text-slate-100 mb-3 flex items-center space-x-2"><Users className="w-5 h-5 text-green-300" /><span>Participation</span></h4>
              <p className="text-slate-300">{analysisResult?.participationAnalysis}</p>
            </div>
            <div className="bg-surface-card backdrop-blur-sm border border-surface-border rounded-xl p-6">
              <h4 className="text-lg font-semibold text-slate-100 mb-3 flex items-center space-x-2"><FileText className="w-5 h-5 text-secondary" /><span>Full Summary</span></h4>
              <p className="text-slate-300 text-sm">{analysisResult?.summary}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <button onClick={downloadReport} className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg">
              <Download className="w-6 h-6" />
              <span>Download Full Report</span>
            </button>
            <button onClick={restartDiscussion} className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg">
              <RefreshCw className="w-6 h-6" />
              <span>Start New Discussion</span>
            </button>
          </div>

          {/* Devil's Advocate & Alternative View */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-card backdrop-blur-sm border border-surface-border rounded-xl p-6">
              <h4 className="text-lg font-semibold text-slate-100 mb-3 flex items-center space-x-2">
                <Info className="w-5 h-5 text-red-400" />
                <span>Devil's Advocate</span>
              </h4>
              <p className="text-slate-300 text-sm mb-4">Challenge the current consensus to uncover potential blind spots.</p>
              <button className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 rounded-lg text-red-300 transition-colors px-4 py-2 text-sm font-semibold">
                Challenge Consensus
              </button>
            </div>
            <div className="bg-surface-card backdrop-blur-sm border border-surface-border rounded-xl p-6">
              <h4 className="text-lg font-semibold text-slate-100 mb-3 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-300" />
                <span>Alternative Views</span>
              </h4>
              <p className="text-slate-300 text-sm mb-4">Explore alternative solutions and perspectives.</p>
              <button className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 rounded-lg text-yellow-300 transition-colors px-4 py-2 text-sm font-semibold">
                Explore Alternatives
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
