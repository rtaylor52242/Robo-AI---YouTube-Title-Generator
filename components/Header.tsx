import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center pt-6">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400">
        Robo AI - YouTube Title Generator
      </h1>
      <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
        Generate clear, compelling, and non-hype titles for your next video. Enter your idea below to get started.
      </p>
    </header>
  );
};

export default Header;