
import React from 'react';
import { View, SiteSettings } from '../types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  settings: SiteSettings;
  isAdmin: boolean;
  onAdminClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, settings, isAdmin, onAdminClick }) => {
  const menuItems = [
    { id: View.HOME, label: 'TOP', isNew: false },
    { id: View.ABOUT, label: 'PROFILE', isNew: false },
    { id: View.ARCHIVE, label: 'DIARY / GALLERY', isNew: true },
    { id: View.AI_GEN, label: 'DREAM ANALYZER', isNew: true }
  ];

  return (
    <div className="w-full md:w-96 shrink-0 sidebar-pattern min-h-screen border-r border-[#000] p-6 flex flex-col gap-6 shadow-[4px_0px_0px_rgba(0,0,0,0.1)]">
      <div 
        className="text-center dashed-border pb-4 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onNavigate(View.HOME)}
      >
        <h2 className="text-xl font-bold text-[#000] mb-1 tracking-tight pixel-text">{settings.siteTitle}</h2>
        <p className="text-[8pt] text-[#4a422d] font-mono tracking-[0.2em]">── MENU SYSTEM ──</p>
      </div>

      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`group flex items-center gap-2 text-[10pt] text-left leading-none transition-all ${
              currentView === item.id ? 'font-bold text-blue-900 translate-x-1' : 'text-[#333]'
            }`}
          >
            <span className="text-[#c00] text-[8pt]">◆</span>
            <span className="hover:underline hover:text-blue-700 tracking-tight">
              {item.label}
              {item.isNew && <span className="ml-2 text-[7pt] text-red-600 font-bold italic border border-red-600 px-1">New!</span>}
            </span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-8 text-[8pt] text-[#4a422d] leading-[1.6] font-sans">
        <div className="border-t-2 border-double border-[#8c7e5a] pt-4 mb-4"></div>
        <p className="mb-1">본 사이트는 <span className="font-bold underline italic text-blue-800">Link-Free</span> 입니다.</p>
        <p className="mb-1">상호 링크는 언제나 환영해요 ☆</p>
        <p className="mb-1">배너는 반드시 저장 후 사용 부탁드립니다.</p>
        <p className="font-bold text-red-700 mt-2 tracking-tighter bg-red-50 p-1 border border-red-200 text-center">※ NO HOTLINKING ※</p>
        
        <div className="mt-6 border border-[#000] p-1 bg-white shadow-[2px_2px_0px_#000]">
          <div className="bg-[#fdf9e1] border border-[#eaddb4] text-[9pt] font-bold text-center py-2 flex items-center justify-center gap-1">
             <span className="text-blue-700">🌙 {settings.siteTitle.split('의')[0]}</span><span className="text-[#8c7e5a]">의</span><span className="text-orange-600">방 🐷</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-[7pt] text-gray-400">Since {settings.sinceDate}</p>
          <button 
            onClick={onAdminClick}
            className={`text-[6pt] px-1 border border-gray-300 hover:bg-gray-100 ${isAdmin ? 'text-red-500 font-bold' : 'text-gray-300'}`}
          >
            {isAdmin ? '[ADMIN_ON]' : '[MGMT]'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
