import React from 'react';

export const Modal = ({ children, open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 w-full max-w-2xl rounded-3xl p-8 border border-white/10 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};