import React from 'react';

const logos = [
  { name: 'GPT-4.5' },
  { name: 'DeepSeek-R1' },
  { name: 'Qwen2.5-Max' },
  { name: 'Grok 3' },
  { name: 'LlaMA 3.3' },
  { name: 'Claude 3.7 Sonnet' },
  { name: 'Mistral Small 3' },
  { name: 'Gemini 2.5' },
  { name: 'Command R+' },
];

const LogoCloud = () => {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-100 text-center mb-4">Powered by a Council of Experts</h2>
        <p className="text-lg text-slate-300 text-center mb-12 max-w-3xl mx-auto">
          Our platform leverages a diverse suite of state-of-the-art models to ensure robust, unbiased consensus.
        </p>
        <div className="relative w-full overflow-hidden bg-surface-card/50 py-8">
          <div className="marquee flex space-x-16">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                {logos.map((logo) => (
                  <span key={logo.name} className="text-2xl font-semibold text-slate-300 whitespace-nowrap">{logo.name}</span>
                ))}
              </React.Fragment>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
        </div>
      </div>
    </div>
  );
};

export default LogoCloud;
