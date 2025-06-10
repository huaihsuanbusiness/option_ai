import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mic, MicOff, Play, Pause, Square, Clock, Users, MessageSquare, Sparkles, Download, FileText, Brain } from 'lucide-react';
import ConclusionPage from './ConclusionPage';
import { createClient } from '@supabase/supabase-js'
// import { Alert, Flex, Spin } from 'antd';

interface MeetingRoomProps {
  onBack: () => void;
  participants: number;
  duration: number;
  topic: string;
}

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  commonThemes: string[];
  conclusions: string[];
  sentiment: string;
  participationAnalysis: string;
  decisionOptions?: string[];
}


export default function MeetingRoom({ onBack, participants, duration, topic }: MeetingRoomProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [currentPage, setCurrentPage] = useState<'meeting' | 'conclusion'>('meeting');
  const [hasConclusion, setHasConclusion] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);


const supabase = createClient('https://dkcugvwfmwjknplqrrki.supabase.co/', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrY3VndndmbXdqa25wbHFycmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMjc0NTYsImV4cCI6MjA2NDkwMzQ1Nn0.HUEWplsnAM8vuqXqRsa2_6MEME4J_J17Le6xsyflWlk')


  const contentStyle: React.CSSProperties = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};
  
  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !isPaused) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Auto-stop recording when time is up
      if (isRecording) {
        stopRecording();
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isPaused, isRecording]);

  // Recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      recordingTimerRef.current = setTimeout(() => {
        setRecordingTime(recordingTime + 1);
      }, 1000);
    }

    return () => {
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current);
      }
    };
  }, [isRecording, isPaused, recordingTime]);

  useEffect(() => {
  const channel = supabase
    .channel('realtime:file_events')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'file_events' },
      (payload) => {
        const newRow = payload.new;
        if (newRow.action === 'result') {
          console.log('📥 收到分析結果：', newRow.result);
          // 你可以在這裡處理結果，例如 setResult(newRow.result
               setIsAnalyzing(false);
        }
      }
    )
    .subscribe();

    
  return () => {
    supabase.removeChannel(channel);
  };
}, []);


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
  };
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data);
    };
    reader.readAsDataURL(blob);
  });
};

const analyzeWithOpenAI = async () => {
  if (!audioBlob) {
    alert('No recording available to analyze');
    return;
  }

  setIsAnalyzing(true);

  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'student_audio.wav');

    const response = await fetch('http://localhost:4000/run-analysis', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Backend analysis complete:', result.output);
      try {
        // The output from the backend is a JSON string, so we need to parse it.
        const parsedResult: AnalysisResult = JSON.parse(result.output);
        setAnalysisResult(parsedResult);
        setHasConclusion(true);
        setCurrentPage('conclusion');
      } catch (e) {
        console.error("❌ Failed to parse analysis JSON:", e);
        alert("Failed to parse the analysis from the server.");
      }
    } else {
      console.error('❌ Analysis failed:', result.error);
      alert('Analysis failed: ' + result.error);
    }
  } catch (error) {
    console.error('❌ 请求异常：', error);
    alert('分析异常，请检查后端状态。');
  } finally {
    setIsAnalyzing(false);
  }
};


  

  const downloadRecording = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `discussion-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };




  const downloadAnalysis = () => {
    if (analysisResult) {
      const analysisText = `
AI Discussion Analysis Report
============================

Topic: ${topic}
Participants: ${participants}
Duration: ${duration} minutes
Date: ${new Date().toLocaleString()}

SUMMARY
-------
${analysisResult.summary}

KEY POINTS
----------
${analysisResult.keyPoints.map(point => `• ${point}`).join('\n')}

COMMON THEMES
-------------
${analysisResult.commonThemes.map(theme => `• ${theme}`).join('\n')}

CONCLUSIONS
-----------
${analysisResult.conclusions.map(conclusion => `• ${conclusion}`).join('\n')}

SENTIMENT ANALYSIS
------------------
${analysisResult.sentiment}

PARTICIPATION ANALYSIS
----------------------
${analysisResult.participationAnalysis}

---
Generated by Option.ai - AI-Powered Discussion Platform
      `;

      const blob = new Blob([analysisText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `discussion-analysis-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleBackFromConclusion = () => {
    setCurrentPage('meeting');
  };

  if (currentPage === 'conclusion') {
    return (
      <ConclusionPage
        onBack={handleBackFromConclusion}
        analysisResult={analysisResult}
        topic={topic}
        participants={participants}
        duration={duration}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <div className="flex items-center space-x-3">
                <img 
                  src="/ChatGPT Image 2025年6月7日 上午11_04_52 copy copy.png" 
                  alt="Option.ai Logo" 
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-white">Option.ai</h1>
                  <p className="text-xs text-blue-200 opacity-80">Meeting Room</p>
                </div>
              </div>
            </div>

            {/* Meeting Info */}
            <div className="flex items-center space-x-6 text-white/80">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">{participants} participants</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm truncate max-w-[200px]">{topic}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <Clock className="w-8 h-8 text-blue-300" />
              <div>
                <div className="text-4xl font-bold text-white mb-1">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-white/60 text-sm">Time Remaining</p>
              </div>
            </div>
          </div>

          {/* Recording Controls */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-6">Discussion Recording</h2>
              
              {/* Recording Status */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-white font-medium">
                  {isRecording ? (isPaused ? 'Recording Paused' : 'Recording Discussion') : 'Ready to Record'}
                </span>
                {isRecording && (
                  <span className="text-white/60">
                    {formatTime(recordingTime)}
                  </span>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center space-x-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <Mic className="w-6 h-6" />
                    <span>Start Recording Discussion</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={pauseRecording}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200"
                    >
                      {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                      <span>{isPaused ? 'Resume' : 'Pause'}</span>
                    </button>
                    <button
                      onClick={stopRecording}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200"
                    >
                      <Square className="w-5 h-5" />
                      <span>Stop Recording</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Recording Actions */}
          {audioBlob && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Discussion Recorded Successfully</h3>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={downloadRecording}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Recording</span>
                </button>
                {/* <button
                  onClick={getConsensus}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200"
                >
                  <Download className="w-5 h-5" />
                  <span>Get Consensus</span>
                </button> */}
                <button
                  onClick={analyzeWithOpenAI}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
                >
                  <Brain className="w-5 h-5" />
                  <span>{isAnalyzing ? 'Analyzing Discussion...' : 'Analyze with AI'}</span>
                </button>
                {/* <Spin tip="Loading..." size="large" spinning={isAnalyzing}>
      {content}
    </Spin> */}
              </div>
            </div>
          )}

          {/* AI Analysis Results */}
          {analysisResult && currentPage === 'meeting' && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-purple-300" />
                  <span>AI Discussion Analysis</span>
                </h3>
                <button
                  onClick={downloadAnalysis}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Report</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Summary */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-blue-300" />
                    <span>Discussion Summary</span>
                  </h4>
                  <p className="text-white/80 bg-white/5 rounded-lg p-4 leading-relaxed">{analysisResult.summary}</p>
                </div>

                {/* Key Points */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-green-300" />
                    <span>Key Discussion Points</span>
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.keyPoints.map((point, index) => (
                      <li key={index} className="text-white/80 bg-white/5 rounded-lg p-3 flex items-start space-x-2">
                        <span className="text-green-300 font-bold mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Themes */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-300" />
                    <span>Common Themes Identified</span>
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.commonThemes.map((theme, index) => (
                      <li key={index} className="text-white/80 bg-white/5 rounded-lg p-3 flex items-start space-x-2">
                        <span className="text-purple-300 font-bold mt-1">•</span>
                        <span>{theme}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Conclusions */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-yellow-300" />
                    <span>Final Conclusions</span>
                  </h4>
                  {analysisResult.conclusions.length > 0 ? (
                    <ul className="space-y-2">
                      {analysisResult.conclusions.map((conclusion, index) => (
                        <li key={index} className="text-white/80 bg-white/5 rounded-lg p-3 flex items-start space-x-2">
                          <span className="text-yellow-300 font-bold mt-1">•</span>
                          <span>{conclusion}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                      <p className="text-red-300 font-medium">No clear conclusions reached in this discussion.</p>
                      <p className="text-white/70 text-sm mt-2">Consider scheduling a follow-up meeting or gathering more information.</p>
                    </div>
                  )}
                </div>

                {/* Additional Analysis */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Sentiment Analysis</h4>
                    <p className="text-white/80 bg-white/5 rounded-lg p-4">{analysisResult.sentiment}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Participation Analysis</h4>
                    <p className="text-white/80 bg-white/5 rounded-lg p-4">{analysisResult.participationAnalysis}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
