import React from 'react';
import clsx from 'clsx';

export const Button = ({ children, variant = 'red', className, ...props }) => {
  const base = 'px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all';
  const variants = {
    red: 'bg-red-600 hover:bg-red-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    gray: 'bg-gray-600 hover:bg-gray-700',
    green: 'bg-green-600 hover:bg-green-700',
  };
  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};