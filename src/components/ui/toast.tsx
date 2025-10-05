import React from 'react';

export type ToastType = 'success' | 'error' | 'info';

export const showToast = (message: string, type: ToastType = 'info') => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform translate-x-full ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 
    'bg-blue-500'
  }`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);
  
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 4000);
};
