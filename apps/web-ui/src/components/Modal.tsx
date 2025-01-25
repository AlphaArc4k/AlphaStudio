import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#12131A] border border-blue-200/20 rounded-lg p-8 max-w-md w-11/12 z-40"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-300"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {children}
      </div>
    </>
  );
};