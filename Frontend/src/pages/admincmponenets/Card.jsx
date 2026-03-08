import React from 'react';
import clsx from 'clsx';

export const Card = ({ children, className }) => (
  <div className={clsx('bg-zinc-900 p-6 rounded-3xl border border-white/10', className)}>
    {children}
  </div>
);