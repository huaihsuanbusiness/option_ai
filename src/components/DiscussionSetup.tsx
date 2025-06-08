import React, { useState } from 'react';
import { ArrowLeft, Users, Clock, MessageSquare, Settings, Check, Link, Copy, Share2, QrCode, Mail, MessageCircle } from 'lucide-react';
import MeetingRoom from './MeetingRoom';

interface DiscussionSetupProps {
  onBack: () => void;
}

export default function DiscussionSetup({ onBack }: DiscussionSetupProps) {
  const [participants, setParticipants] = useState(5);
  const [duration, setDuration] = useState(30);
  const [customDuration, setCustomDuration] = useState('');
  const [topic, setTopic] = useState('');
  const [meetingSetup, setMeetingSetup] = useState(false);
  const [currentPage, setCurrentPage] = useState<'setup' | 'meeting'>('setup');
  const [meetingId, setMeetingId] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setupMeeting = async () => {
    if (!topic.trim()) {
      alert('Please enter a discussion topic');
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic,
          duration: getFinalDuration(),
          participants: participants,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to set up meeting');
      }

      const data = await response.json();
      const newMeetingId = data.meetingId;
      const baseUrl = window.location.origin;
      const newInviteLink = `${baseUrl}/join/${newMeetingId}`;

      setMeetingId(newMeetingId);
      setInviteLink(newInviteLink);
      setMeetingSetup(true);
    } catch (error) {
      console.error('Error setting up meeting:', error);
      alert('Could not set up the meeting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startMeeting = () => {
    setCurrentPage('meeting');
  };

  const handleBackFromMeeting = () => {
    setCurrentPage('setup');
    setMeetingSetup(false);
    setMeetingId('');
    setInviteLink('');
  };

  const handleDurationChange = (time: number | 'custom') => {
    if (time === 'custom') {
      setDuration(0); // Set to 0 to indicate custom
    } else {
      setDuration(time as number);
      setCustomDuration(''); // Clear custom input when selecting preset
    }
  };

  const handleCustomDurationChange = (value: string) => {
    setCustomDuration(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setDuration(numValue);
    }
  };

  const getFinalDuration = () => {
    if (duration === 0 && customDuration) {
      const customValue = parseInt(customDuration);
      return !isNaN(customValue) && customValue > 0 ? customValue : 30;
    }
    return duration || 30;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Join Discussion: ${topic}`);
    const body = encodeURIComponent(
      `You're invited to join a discussion about "${topic}"!\n\n` +
      `Meeting Details:\n` +
      `• Topic: ${topic}\n` +
      `• Duration: ${getFinalDuration()} minutes\n` +
      `• Participants: ${participants} people\n\n` +
      `Join the discussion: ${inviteLink}\n\n` +
      `Powered by Option.ai - AI Discussion Platform`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(
      `🎯 Join Discussion: "${topic}"\n\n` +
      `📅 Duration: ${getFinalDuration()} minutes\n` +
      `👥 Participants: ${participants} people\n\n` +
      `🔗 Join here: ${inviteLink}\n\n` +
      `Powered by Option.ai 🤖`
    );
    window.open(`https://wa.me/?text=${message}`);
  };

  const generateQRCode = () => {
    // Generate QR code URL using a free QR code API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteLink)}`;
    window.open(qrCodeUrl, '_blank');
  };

  if (currentPage === 'meeting') {
    return (
      <MeetingRoom
        onBack={handleBackFromMeeting}
        participants={participants}
        duration={getFinalDuration()}
        topic={topic}
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
                  <p className="text-xs text-blue-200 opacity-80">Discussion Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Setup Discussion</h2>
              <p className="text-white/70">Configure your discussion settings before starting</p>
            </div>

            <div className="space-y-6">
              {/* Participants */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-white font-medium">
                  <Users className="w-5 h-5 text-blue-300" />
                  <span>Number of Participants</span>
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setParticipants(Math.max(2, participants - 1))}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center justify-center text-white font-bold transition-colors"
                  >
                    -
                  </button>
                  <div className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-center">
                    <span className="text-2xl font-bold text-white">{participants}</span>
                    <p className="text-sm text-white/60">people</p>
                  </div>
                  <button
                    onClick={() => setParticipants(Math.min(50, participants + 1))}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center justify-center text-white font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-white font-medium">
                  <Clock className="w-5 h-5 text-purple-300" />
                  <span>Discussion Duration</span>
                </label>
                <div className="grid grid-cols-5 gap-3 mb-3">
                  {([5, 10, 30, 60, 'custom'] as const).map((time) => (
                    <button
                      key={time}
                      onClick={() => handleDurationChange(time)}
                      className={`p-3 rounded-lg border transition-all ${
                        (time === 'custom' && duration === 0) || duration === time
                          ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                          : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {time === 'custom' ? (
                        <>
                          <div className="text-sm font-bold">Others</div>
                          <div className="text-xs">custom</div>
                        </>
                      ) : (
                        <>
                          <div className="text-lg font-bold">{time}</div>
                          <div className="text-xs">mins</div>
                        </>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Custom Duration Input */}
                {duration === 0 && (
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm">Enter custom duration (minutes):</label>
                    <input
                      type="number"
                      min="1"
                      max="300"
                      value={customDuration}
                      onChange={(e) => handleCustomDurationChange(e.target.value)}
                      placeholder="e.g., 45"
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                    />
                    {customDuration && parseInt(customDuration) > 0 && (
                      <p className="text-blue-300 text-sm">
                        Duration set to {customDuration} minutes
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Discussion Topic */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-white font-medium">
                  <MessageSquare className="w-5 h-5 text-green-300" />
                  <span>Discussion Topic</span>
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter your discussion topic..."
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
                  rows={3}
                />
              </div>

              {/* Setup Meeting Button */}
              <button
                onClick={setupMeeting}
                disabled={meetingSetup || isLoading}
                className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                  isLoading
                    ? 'bg-gray-500/20 border-2 border-gray-400 text-gray-300 cursor-wait'
                    : meetingSetup
                    ? 'bg-green-500/20 border-2 border-green-400 text-green-300 cursor-default'
                    : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white hover:shadow-indigo-500/25'
                }`}
              >
                <Settings className="w-6 h-6" />
                <span>
                  {isLoading ? 'Setting up...' : meetingSetup ? 'Meeting Setup Complete!' : 'Setup the Meeting'}
                </span>
                {meetingSetup && !isLoading && <Check className="w-6 h-6" />}
              </button>

              {/* Meeting Link Section */}
              {meetingSetup && inviteLink && (
                <div className="space-y-4 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
                      <Link className="w-6 h-6 text-blue-300" />
                      <span>Meeting Ready!</span>
                    </h3>
                    <p className="text-white/70 text-sm">Share this link with participants</p>
                  </div>

                  {/* Meeting ID Display */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-center mb-3">
                      <p className="text-white/60 text-sm">Meeting ID</p>
                      <p className="text-white font-mono text-lg">{meetingId}</p>
                    </div>
                  </div>

                  {/* Invite Link */}
                  <div className="space-y-3">
                    <label className="text-white font-medium text-sm">Invite Link:</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={inviteLink}
                        readOnly
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm focus:outline-none font-mono"
                      />
                      <button
                        onClick={copyToClipboard}
                        className="px-4 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-400/50 rounded-lg text-green-300 transition-colors flex items-center space-x-2 min-w-[100px]"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span className="text-sm">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="text-sm">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Share Options */}
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowShareOptions(!showShareOptions)}
                      className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>More Sharing Options</span>
                    </button>

                    {showShareOptions && (
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        <button
                          onClick={shareViaEmail}
                          className="p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 rounded-lg text-blue-300 transition-colors flex flex-col items-center space-y-1"
                        >
                          <Mail className="w-5 h-5" />
                          <span className="text-xs">Email</span>
                        </button>
                        <button
                          onClick={shareViaWhatsApp}
                          className="p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-400/50 rounded-lg text-green-300 transition-colors flex flex-col items-center space-y-1"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-xs">WhatsApp</span>
                        </button>
                        <button
                          onClick={generateQRCode}
                          className="p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 rounded-lg text-purple-300 transition-colors flex flex-col items-center space-y-1"
                        >
                          <QrCode className="w-5 h-5" />
                          <span className="text-xs">QR Code</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Meeting Info Summary */}
                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <h4 className="text-white font-medium text-sm">Meeting Summary:</h4>
                    <div className="text-white/70 text-sm space-y-1">
                      <p>📋 <strong>Topic:</strong> {topic}</p>
                      <p>⏱️ <strong>Duration:</strong> {getFinalDuration()} minutes</p>
                      <p>👥 <strong>Participants:</strong> {participants} people</p>
                      <p>🤖 <strong>AI Analysis:</strong> Enabled</p>
                    </div>
                  </div>

                  {/* Start Meeting Button */}
                  <button
                    onClick={startMeeting}
                    className="w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:shadow-green-500/25"
                  >
                    <MessageSquare className="w-6 h-6" />
                    <span>Start Meeting Now</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
