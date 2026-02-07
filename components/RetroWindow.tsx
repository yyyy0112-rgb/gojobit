
import React from 'react';

interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

const RetroWindow: React.FC<RetroWindowProps> = ({ title, children, className = '', onClose }) => {
  return (
    <div className={`retro-window p-1 mb-4 flex flex-col ${className}`}>
      <div className="bg-[#000080] text-white px-2 py-0.5 flex justify-between items-center select-none">
        <span className="text-xs font-bold font-sans tracking-wide">{title}</span>
        <div className="flex gap-1">
          <button className="bg-[#c0c0c0] w-4 h-4 text-black text-[10px] flex items-center justify-center border-t border-l border-white border-b border-r border-[#808080] active:border-none active:bg-[#a0a0a0]">
            ?
          </button>
          <button 
            onClick={onClose}
            className="bg-[#c0c0c0] w-4 h-4 text-black text-[10px] flex items-center justify-center border-t border-l border-white border-b border-r border-[#808080] active:border-none active:bg-[#a0a0a0]"
          >
            ×
          </button>
        </div>
      </div>
      <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white p-4 overflow-auto max-h-[500px]">
        {children}
      </div>
    </div>
  );
};

export default RetroWindow;
