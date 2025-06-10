import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

const Header = ({ showBackButton, onBack }: HeaderProps) => {
  return (
    <header className="relative z-10 bg-background/80 backdrop-blur-lg border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-surface-card rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-slate-100" />
              </button>
            )}
            <div className="flex items-center space-x-3">
              <img 
                src="/ChatGPT Image 2025年6月7日 上午11_04_52 copy copy.png" 
                alt="Option.ai Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-slate-100">Option.ai</h1>
                <p className="text-xs text-primary opacity-80">Decision Engine</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
