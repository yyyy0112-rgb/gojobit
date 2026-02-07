
import React, { useState, useEffect, useRef } from 'react';
import { View, RecordEntry, SiteSettings, WebClapMessage, Banner } from './types';
import Sidebar from './components/Sidebar';
import RetroWindow from './components/RetroWindow';
import { INITIAL_ENTRIES, DEFAULT_SETTINGS, INITIAL_BANNERS } from './constants';
import { generateReflection, generateMoodEmoji, analyzeDream } from './services/geminiService';

const App: React.FC = () => {
  const getSavedSettings = (): SiteSettings => {
    const saved = localStorage.getItem('pigcat_settings_v6_bitmap');
    const settings = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    if (!settings.mainImages) {
      settings.mainImages = [settings.mainImageUrl || DEFAULT_SETTINGS.mainImageUrl];
    }
    return settings;
  };

  const getSavedEntries = (): RecordEntry[] => {
    const saved = localStorage.getItem('pigcat_entries');
    return saved ? JSON.parse(saved) : INITIAL_ENTRIES;
  };

  const getSavedClaps = (): number => {
    return parseInt(localStorage.getItem('pigcat_total_claps') || '3313');
  };

  const getSavedClapMessages = (): WebClapMessage[] => {
    const saved = localStorage.getItem('pigcat_clap_messages');
    return saved ? JSON.parse(saved) : [];
  };

  const getSavedBanners = (): Banner[] => {
    const saved = localStorage.getItem('pigcat_banners');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  };

  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [entries, setEntries] = useState<RecordEntry[]>(getSavedEntries());
  const [settings, setSettings] = useState<SiteSettings>(getSavedSettings());
  const [totalClaps, setTotalClaps] = useState<number>(getSavedClaps());
  const [clapMessages, setClapMessages] = useState<WebClapMessage[]>(getSavedClapMessages());
  const [banners, setBanners] = useState<Banner[]>(getSavedBanners());
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminTab, setAdminTab] = useState<'settings' | 'messages' | 'banners' | 'images' | 'profile'>('settings');
  const [showLogin, setShowLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [todayCount, setTodayCount] = useState(0);
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [dreamInput, setDreamInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dreamResult, setDreamResult] = useState('');

  const [clapName, setClapName] = useState('');
  const [clapMessage, setClapMessage] = useState('');
  
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const [newBannerImg, setNewBannerImg] = useState('');
  const [newBannerLink, setNewBannerLink] = useState('');
  const [newBannerTitle, setNewBannerTitle] = useState('');

  const [newMainImageUrl, setNewMainImageUrl] = useState('');

  useEffect(() => {
    if (settings.mainImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % settings.mainImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [settings.mainImages]);

  useEffect(() => {
    const lastDate = localStorage.getItem('pigcat_last_visit_date');
    const todayStr = new Date().toLocaleDateString();
    let currentCount = parseInt(localStorage.getItem('pigcat_today_count') || '0');

    if (lastDate !== todayStr) {
      currentCount = Math.floor(Math.random() * 10) + 5;
      localStorage.setItem('pigcat_last_visit_date', todayStr);
    } else {
      currentCount += 1;
    }
    
    setTodayCount(currentCount);
    localStorage.setItem('pigcat_today_count', currentCount.toString());
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const bgFixed = document.getElementById('bg-fixed');
    
    root.style.setProperty('--sidebar-bg', settings.sidebarColor);
    root.style.setProperty('--bg-start', settings.bgStartColor);
    root.style.setProperty('--bg-end', settings.bgEndColor);
    root.style.setProperty('--gradient-angle', settings.gradientAngle);
    root.style.setProperty('--marquee-bg', settings.marqueeBgColor);
    
    if (bgFixed) {
      if (settings.autoGradient) {
        bgFixed.classList.add('auto-animate');
      } else {
        bgFixed.classList.remove('auto-animate');
      }
    }
    
    const fontValue = settings.fontFamily === 'Gulim' 
      ? "'Gulim', '굴림', 'DotGothic16', 'Nanum Gothic Coding', sans-serif" 
      : "'Dotum', '돋움', 'DotGothic16', 'Nanum Gothic Coding', sans-serif";
    
    root.style.setProperty('--main-font', fontValue);
    root.style.setProperty('--main-font-size', settings.fontSize);
    root.style.setProperty('--main-letter-spacing', settings.letterSpacing);
    root.style.setProperty('--main-line-height', settings.lineHeight);
    
    localStorage.setItem('pigcat_settings_v6_bitmap', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pigcat_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('pigcat_total_claps', totalClaps.toString());
  }, [totalClaps]);

  useEffect(() => {
    localStorage.setItem('pigcat_clap_messages', JSON.stringify(clapMessages));
  }, [clapMessages]);

  useEffect(() => {
    localStorage.setItem('pigcat_banners', JSON.stringify(banners));
  }, [banners]);

  const handleAdminLogin = () => {
    if (passwordInput === '1234') {
      setIsAdmin(true);
      setShowLogin(false);
      setPasswordInput('');
      setShowAdminPanel(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const updateSetting = (key: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    setIsPosting(true);
    try {
      const reflection = await generateReflection(newPostContent);
      const mood = await generateMoodEmoji(newPostContent);
      
      const newEntry: RecordEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('ko-KR'),
        title: newPostTitle,
        content: newPostContent,
        imageUrl: newPostImage.trim() || undefined,
        mood: mood,
        tags: ['Archive'],
        aiReflection: reflection
      };

      setEntries([newEntry, ...entries]);
      setNewPostTitle('');
      setNewPostContent('');
      setNewPostImage('');
      alert('성공적으로 기록되었습니다!');
    } catch (err) {
      alert('기록 중 오류가 발생했습니다.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleClap = () => {
    setTotalClaps(prev => prev + 1);
  };

  const handleSendClapMessage = () => {
    if (!clapMessage.trim()) {
      alert('메시지를 입력해주세요.');
      return;
    }
    const newMessage: WebClapMessage = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ko-KR'),
      name: clapName.trim() || '익명',
      message: clapMessage.trim()
    };
    setClapMessages([newMessage, ...clapMessages]);
    setClapMessage('');
    alert('박수와 메시지가 전송되었습니다! 감사합니다♡');
  };

  const handleAddBanner = () => {
    if (!newBannerImg.trim() || !newBannerLink.trim()) {
      alert('이미지 주소와 링크 주소를 입력해주세요.');
      return;
    }
    const nb: Banner = {
      id: Date.now().toString(),
      imageUrl: newBannerImg.trim(),
      siteUrl: newBannerLink.trim(),
      title: newBannerTitle.trim() || 'Neighbor'
    };
    setBanners([...banners, nb]);
    setNewBannerImg('');
    setNewBannerLink('');
    setNewBannerTitle('');
  };

  const handleAddMainImage = () => {
    if (!newMainImageUrl.trim()) return;
    setSettings({
      ...settings,
      mainImages: [...settings.mainImages, newMainImageUrl.trim()]
    });
    setNewMainImageUrl('');
  };

  const handleRemoveMainImage = (index: number) => {
    if (settings.mainImages.length <= 1) {
      alert('최소 하나의 이미지는 있어야 합니다.');
      return;
    }
    const newList = [...settings.mainImages];
    newList.splice(index, 1);
    setSettings({ ...settings, mainImages: newList });
    if (currentSlideIndex >= newList.length) {
      setCurrentSlideIndex(0);
    }
  };

  const handleAnalyzeDream = async () => {
    if (!dreamInput.trim()) {
      alert('분석할 꿈 내용을 입력해주세요.');
      return;
    }
    setIsAnalyzing(true);
    setDreamResult('');
    try {
      const result = await analyzeDream(dreamInput);
      setDreamResult(result);
    } catch (err) {
      setDreamResult("심연과의 연결이 끊어졌습니다...");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const visitorDigits = todayCount.toString().padStart(8, '0').split('');
  const recentUpdates = entries.slice(0, 5);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        settings={settings}
        isAdmin={isAdmin}
        onAdminClick={() => isAdmin ? setShowAdminPanel(true) : setShowLogin(true)}
      />

      <main className="flex-1 flex flex-col items-center p-2 md:p-4 text-black">
        {showLogin && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="pointer-events-auto">
              <div className="bg-white border-2 border-black p-4 w-64 shadow-[4px_4px_0px_#000]">
                 <div className="bg-[#000080] text-white px-2 mb-2 font-bold text-xs">ADMIN_LOGIN</div>
                 <p className="mb-2 text-xs">Password:</p>
                 <input 
                  type="password"
                  className="w-full border border-gray-400 mb-4 p-1 outline-none text-black bg-white"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                  autoFocus
                />
                <button 
                  onClick={handleAdminLogin}
                  className="w-full bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#808080] py-1 active:border-none text-xs"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {isAdmin && showAdminPanel && (
          <div className="fixed inset-0 flex items-start justify-end md:items-center md:justify-center z-[60] p-4 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-4xl">
              <RetroWindow title="Owner Dashboard" onClose={() => setShowAdminPanel(false)}>
                <div className="flex gap-2 mb-4 border-b border-gray-300 pb-2 overflow-x-auto">
                  <button onClick={() => setAdminTab('settings')} className={`px-3 py-1 text-xs border whitespace-nowrap ${adminTab === 'settings' ? 'bg-blue-800 text-white' : 'bg-gray-200'}`}>General</button>
                  <button onClick={() => setAdminTab('profile')} className={`px-3 py-1 text-xs border whitespace-nowrap ${adminTab === 'profile' ? 'bg-blue-800 text-white' : 'bg-gray-200'}`}>Profile</button>
                  <button onClick={() => setAdminTab('images')} className={`px-3 py-1 text-xs border whitespace-nowrap ${adminTab === 'images' ? 'bg-blue-800 text-white' : 'bg-gray-200'}`}>Slideshow</button>
                  <button onClick={() => setAdminTab('messages')} className={`px-3 py-1 text-xs border whitespace-nowrap ${adminTab === 'messages' ? 'bg-blue-800 text-white' : 'bg-gray-200'}`}>Claps ({clapMessages.length})</button>
                  <button onClick={() => setAdminTab('banners')} className={`px-3 py-1 text-xs border whitespace-nowrap ${adminTab === 'banners' ? 'bg-blue-800 text-white' : 'bg-gray-200'}`}>Banners</button>
                </div>

                <div className="flex flex-col gap-4 text-black overflow-y-auto max-h-[70vh]">
                  {adminTab === 'settings' && (
                    <>
                      <section className="bg-[#f0f0f0] border border-[#888] p-3">
                        <h3 className="font-bold border-b border-black mb-1 text-red-700">✍️ Create New Entry</h3>
                        <div className="space-y-2">
                          <input type="text" placeholder="제목" className="admin-input" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} />
                          <input type="text" placeholder="이미지 URL (선택사항)" className="admin-input" value={newPostImage} onChange={(e) => setNewPostImage(e.target.value)} />
                          <textarea placeholder="내용" className="admin-input h-24 resize-none" value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} />
                          <button onClick={handleCreatePost} disabled={isPosting} className="w-full bg-[#c0c0c0] border border-gray-600 font-bold py-1 text-xs">
                            {isPosting ? 'SAVING...' : 'SAVE TO ARCHIVE'}
                          </button>
                        </div>
                      </section>
                      <section>
                        <h3 className="font-bold border-b border-black mb-2 text-blue-800">🎨 Site Design</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div className="col-span-2 md:col-span-1">
                            <label className="admin-label">사이트 제목</label>
                            <input className="admin-input" value={settings.siteTitle} onChange={(e) => updateSetting('siteTitle', e.target.value)} />
                          </div>
                          <div className="col-span-2 md:col-span-1">
                            <label className="admin-label">사이드바 색</label>
                            <input type="color" className="admin-input h-8" value={settings.sidebarColor} onChange={(e) => updateSetting('sidebarColor', e.target.value)} />
                          </div>
                          <div className="col-span-2">
                            <label className="admin-label">Marquee Text</label>
                            <input className="admin-input" value={settings.marqueeText} onChange={(e) => updateSetting('marqueeText', e.target.value)} />
                          </div>
                        </div>
                      </section>
                    </>
                  )}

                  {adminTab === 'profile' && (
                    <section className="bg-[#f9f9f9] border border-[#888] p-3">
                      <h3 className="font-bold border-b border-black mb-3">👤 Profile Editor</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <label className="admin-label">이름</label>
                          <input className="admin-input" value={settings.profileName} onChange={(e) => updateSetting('profileName', e.target.value)} />
                        </div>
                        <div>
                          <label className="admin-label">상태 (Status)</label>
                          <input className="admin-input" value={settings.profileStatus} onChange={(e) => updateSetting('profileStatus', e.target.value)} />
                        </div>
                        <div>
                          <label className="admin-label">정체 (Identity)</label>
                          <input className="admin-input" value={settings.profileIdentity} onChange={(e) => updateSetting('profileIdentity', e.target.value)} />
                        </div>
                        <div>
                          <label className="admin-label">프로필 이미지 URL</label>
                          <input className="admin-input" value={settings.profileImageUrl} onChange={(e) => updateSetting('profileImageUrl', e.target.value)} />
                        </div>
                        <div className="col-span-2">
                          <label className="admin-label">좋아하는 것들 (Likes)</label>
                          <input className="admin-input" value={settings.profileLikes} onChange={(e) => updateSetting('profileLikes', e.target.value)} />
                        </div>
                        <div className="col-span-2">
                          <label className="admin-label">자기소개 (Bio)</label>
                          <textarea className="admin-input h-20" value={settings.profileBio} onChange={(e) => updateSetting('profileBio', e.target.value)} />
                        </div>
                      </div>
                    </section>
                  )}

                  {adminTab === 'images' && (
                    <section className="bg-white border border-[#888] p-3 min-h-[300px]">
                      <h3 className="font-bold border-b border-black mb-2">🖼️ Slideshow Images</h3>
                      <div className="space-y-2 bg-[#f9f9f9] p-2 border mb-4">
                        <label className="admin-label">Add New Main Image URL</label>
                        <div className="flex gap-2">
                          <input className="admin-input mb-0" placeholder="https://..." value={newMainImageUrl} onChange={(e) => setNewMainImageUrl(e.target.value)} />
                          <button onClick={handleAddMainImage} className="bg-[#000080] text-white px-4 py-1 text-xs shrink-0">ADD</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {settings.mainImages.map((img, idx) => (
                          <div key={idx} className="border p-1 bg-white relative">
                            <img src={img} alt={`Main ${idx}`} className="w-full h-24 object-cover border border-black mb-1" />
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="truncate flex-1 mr-2">{img}</span>
                              <button onClick={() => handleRemoveMainImage(idx)} className="text-red-600 underline">DEL</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {adminTab === 'messages' && (
                    <section className="bg-white border border-[#888] p-3 min-h-[300px]">
                      <h3 className="font-bold border-b border-black mb-2 flex justify-between">
                        <span>💌 Received Messages</span>
                        <span className="text-red-600">Total Claps: {totalClaps}</span>
                      </h3>
                      <div className="space-y-3">
                        {clapMessages.length > 0 ? clapMessages.map(m => (
                          <div key={m.id} className="border-b border-dotted pb-2 text-xs">
                            <div className="flex justify-between text-gray-500 mb-1">
                              <strong>From: {m.name}</strong>
                              <span>{m.date}</span>
                            </div>
                            <p className="bg-gray-50 p-2 border border-gray-100">{m.message}</p>
                            <button onClick={() => setClapMessages(clapMessages.filter(x => x.id !== m.id))} className="text-[9px] text-red-500 mt-1 underline">삭제</button>
                          </div>
                        )) : <p className="text-gray-400 italic text-center py-10 text-xs">No messages yet...</p>}
                      </div>
                    </section>
                  )}

                  {adminTab === 'banners' && (
                    <section className="bg-white border border-[#888] p-3 min-h-[300px]">
                      <h3 className="font-bold border-b border-black mb-2">🤝 Neighbors / Banners</h3>
                      <div className="space-y-2 bg-[#f9f9f9] p-2 border mb-4">
                        <input className="admin-input" placeholder="Banner Image URL" value={newBannerImg} onChange={(e) => setNewBannerImg(e.target.value)} />
                        <input className="admin-input" placeholder="Target Site URL" value={newBannerLink} onChange={(e) => setNewBannerLink(e.target.value)} />
                        <input className="admin-input" placeholder="Banner Title" value={newBannerTitle} onChange={(e) => setNewBannerTitle(e.target.value)} />
                        <button onClick={handleAddBanner} className="w-full bg-[#000080] text-white py-1 text-xs">ADD BANNER (200x40)</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {banners.map(b => (
                          <div key={b.id} className="border p-1 bg-white flex flex-col items-center relative group">
                            <img src={b.imageUrl} alt={b.title} className="w-[200px] h-[40px] border border-black mb-1" />
                            <p className="text-[9px] truncate w-full text-center">{b.title}</p>
                            <button onClick={() => setBanners(banners.filter(x => x.id !== b.id))} className="absolute top-0 right-0 bg-red-600 text-white px-1 text-[8px]">DEL</button>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <div className="flex justify-between items-center mt-2 border-t pt-2">
                    <button className="bg-red-100 text-red-600 border border-red-300 px-2 py-0.5 text-xs" onClick={() => { if(confirm('모든 설정을 초기화할까요?')) setSettings(DEFAULT_SETTINGS); }}>RESET</button>
                    <div className="flex gap-2">
                      <button onClick={() => setShowAdminPanel(false)} className="bg-gray-200 border border-gray-400 px-3 py-0.5 text-xs">CLOSE</button>
                      <button onClick={() => { setIsAdmin(false); setShowAdminPanel(false); }} className="bg-black text-white px-4 py-0.5 text-xs">LOGOUT</button>
                    </div>
                  </div>
                </div>
              </RetroWindow>
            </div>
          </div>
        )}

        <div className="w-full max-w-4xl flex flex-col items-center mb-6">
          <div className="mb-2">
            <h1 className="text-3xl font-bold tracking-[-0.05em] leading-tight text-center uppercase">{settings.siteTitle}</h1>
          </div>
          <div className="marquee-area mb-1 py-0.5 font-bold w-full overflow-hidden">
            <div className="whitespace-nowrap animate-marquee">{settings.marqueeText}</div>
          </div>
          <div className="flex flex-col items-center mb-2">
            <div className="mb-0.5 font-bold">Today <div className="counter-led mx-1.5 shadow-[1px_1px_0px_#000]">{visitorDigits.map((d, i) => (<span key={i} className="led-digit">{d}</span>))}</div>!</div>
          </div>
        </div>

        <div className="w-full max-w-4xl space-y-4">
          {currentView === View.HOME && (
            <>
              <div className="flex flex-col border border-[#000] shadow-[2px_2px_0px_#000]">
                <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex justify-between">
                  <span>NOTICE</span>
                  <span>[?] [x]</span>
                </div>
                <div className="p-3 leading-tight whitespace-pre-wrap bg-white">{settings.systemMessage}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                <div className="md:col-span-7 flex flex-col gap-3">
                  <div className="bg-white p-0.5 border border-[#000] shadow-[2px_2px_0px_#000]">
                    <div className="relative border border-gray-200 overflow-hidden aspect-[8/5.5] bg-black">
                      {settings.mainImages.map((img, idx) => (
                        <img key={idx} src={img} alt={`Main Visual ${idx}`} className={`absolute top-0 left-0 w-full h-full object-cover block transition-opacity duration-1000 ${idx === currentSlideIndex ? 'opacity-100' : 'opacity-0'}`} />
                      ))}
                      <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                        {settings.mainImages.map((_, idx) => (
                          <div key={idx} className={`w-1.5 h-1.5 border border-white ${idx === currentSlideIndex ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col border border-[#000] shadow-[2px_2px_0px_#000] flex-1">
                    <div className="bg-[#000080] text-white px-2 py-0.5 font-bold flex justify-between">
                      <span>BANNERS / NEIGHBORS</span>
                      <span>[+]</span>
                    </div>
                    <div className="bg-white flex-1 overflow-y-auto custom-scrollbar p-3 min-h-0">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 justify-items-center">
                        {banners.length > 0 ? (
                          banners.map(b => (
                            <a key={b.id} href={b.siteUrl} target="_blank" rel="noopener noreferrer" title={b.title} className="block w-full max-w-[200px]">
                              <img src={b.imageUrl} alt={b.title} className="w-full h-[40px] border border-gray-300 hover:border-blue-500 transition-colors object-cover" />
                            </a>
                          ))
                        ) : (<p className="text-xs text-gray-400 italic col-span-2 text-center">No neighbor banners yet...</p>)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-5 flex flex-col gap-3">
                  <div className="scroll-box shadow-inner flex-shrink-0">
                    <div className="font-bold text-[#000080] border-b border-dotted mb-1 pb-0.5 text-center">--- NEW UPDATES ---</div>
                    <ul className="space-y-1 text-black">
                      {recentUpdates.length > 0 ? (
                        recentUpdates.map(e => (
                          <li key={e.id} className="truncate" title={e.title}>• <span className="text-gray-500">[{e.date.slice(2)}]</span> {e.title}</li>
                        ))
                      ) : (<li className="text-gray-400 italic text-center">No entries yet...</li>)}
                    </ul>
                  </div>
                  <div className="web-clap-container flex flex-col text-center border border-[#84a2c4] shadow-[1px_1px_0px_#000] flex-1">
                    <div className="web-clap-inner-box">
                      <p className="mb-4 text-xs leading-relaxed">사이트 잘 보고 있다는 의미로<br/>박수 한 번!</p>
                      <button onClick={handleClap} className="web-clap-btn mb-4">♡ 박수 보내기 ♡</button>
                      <p className="text-xs">총 박수: <span className="text-red-600 font-bold">{totalClaps}</span></p>
                    </div>
                    <div className="web-clap-inner-box mb-0 flex-1">
                      <p className="mb-3 text-xs">관리인에게 응원 메시지를 남겨주세요♡</p>
                      <input type="text" placeholder="이름 (생략 시 익명)" className="w-full border border-gray-400 p-1 mb-2 text-xs outline-none focus:border-blue-500" value={clapName} onChange={(e) => setClapName(e.target.value)} />
                      <textarea placeholder="메시지를 입력하세요..." className="w-full border border-gray-400 p-1 mb-3 text-xs h-16 resize-none outline-none focus:border-blue-500" value={clapMessage} onChange={(e) => setClapMessage(e.target.value)} />
                      <button onClick={handleSendClapMessage} className="web-clap-btn px-10 text-xs">메시지 보내기</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentView === View.ABOUT && (
            <div className="p-4 bg-white border border-[#000] shadow-[2px_2px_0px_#000] text-black">
              <div className="bg-[#000080] text-white px-2 py-0.5 font-bold mb-4 flex justify-between">
                <span>USER_PROFILE_DATA_v1.02</span>
                <span className="animate-pulse">ONLINE</span>
              </div>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                 <div className="w-40 h-40 border-2 border-double border-[#000] shrink-0 bg-[#f0f0f0] p-1 shadow-[2px_2px_0px_#ccc]">
                    <img src={settings.profileImageUrl} className="w-full h-full object-cover grayscale-[30%]" alt="p" />
                 </div>
                 <div className="flex-1">
                    <table className="w-full text-xs border-collapse">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="w-24 bg-[#f8f8f8] p-1 font-bold border-r border-gray-200">NAME</td>
                          <td className="p-1">{settings.profileName}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="bg-[#f8f8f8] p-1 font-bold border-r border-gray-200">STATUS</td>
                          <td className="p-1">{settings.profileStatus}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="bg-[#f8f8f8] p-1 font-bold border-r border-gray-200">IDENTITY</td>
                          <td className="p-1">{settings.profileIdentity}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="bg-[#f8f8f8] p-1 font-bold border-r border-gray-200">LIKES</td>
                          <td className="p-1">{settings.profileLikes}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="bg-[#f8f8f8] p-1 font-bold border-r border-gray-200">MOOD</td>
                          <td className="p-1 text-blue-600 font-bold italic">Stable / Reflective</td>
                        </tr>
                      </tbody>
                    </table>
                 </div>
              </div>
              
              <div className="border border-dotted border-gray-400 p-4 mb-4 bg-[#fdfdfd]">
                <h3 className="text-xs font-bold text-gray-500 mb-2 border-b border-gray-100 pb-1 uppercase tracking-widest">Digital Bio</h3>
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{settings.profileBio}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-[10px]">
                <div className="bg-[#fcf7e1] border border-[#eaddb4] p-2">
                   <h4 className="font-bold mb-1 border-b border-[#eaddb4]">System Activity</h4>
                   <p>CPU: IDLE</p>
                   <p>MEMORY: ARCHIVE_LOADED</p>
                </div>
                <div className="bg-[#e6f3ff] border border-[#84a2c4] p-2">
                   <h4 className="font-bold mb-1 border-b border-[#84a2c4]">Current Stream</h4>
                   <p>Now Playing: 2000s Mix (Lofi)</p>
                </div>
              </div>
            </div>
          )}

          {currentView === View.ARCHIVE && (
            <div className="p-2 bg-white border border-[#000] shadow-[2px_2px_0px_#000] min-h-[400px] text-black">
              <div className="bg-[#808080] text-white px-2 py-0.5 font-bold mb-4 flex justify-between">
                <span>DIGITAL_VAULT / DIARY & GALLERY</span>
                <span className="text-[10px]">{entries.length} LOGS FOUND</span>
              </div>
              
              <div className="space-y-8 p-2">
                {entries.length > 0 ? entries.map(e => (
                   <article key={e.id} className="border-2 border-[#808080] bg-[#fdfdfd] shadow-[2px_2px_0px_#000]">
                      <div className="bg-[#f0f0f0] border-b border-[#808080] px-2 py-1 flex justify-between items-center">
                        <h3 className="font-bold text-xs"><span className="text-red-700">TITLE:</span> {e.title}</h3>
                        <span className="text-[10px] font-mono">#{e.id.slice(-4)} | {e.date}</span>
                      </div>
                      <div className="p-4">
                        {e.imageUrl && (
                          <div className="mb-4 border border-[#ccc] p-1 bg-white inline-block max-w-full">
                            <img src={e.imageUrl} className="max-w-full max-h-[400px] object-contain" alt={e.title} />
                          </div>
                        )}
                        <p className="text-xs leading-normal mb-4 whitespace-pre-wrap">{e.content}</p>
                        
                        {e.aiReflection && (
                          <div className="bg-[#f0f9ff] border-l-4 border-blue-400 p-3 italic text-[11px] text-blue-900 font-serif">
                            "{e.aiReflection}"
                          </div>
                        )}
                      </div>
                      <div className="bg-[#f9f9f9] border-t border-gray-200 px-2 py-1 flex justify-between items-center text-[10px] text-gray-500">
                        <span>Mood: {e.mood || 'Standard'}</span>
                        <div className="flex gap-2">
                          {isAdmin && (
                            <button onClick={() => { if(confirm('Delete this entry?')) setEntries(entries.filter(ent => ent.id !== e.id)); }} className="text-red-500 hover:underline">DELETE</button>
                          )}
                        </div>
                      </div>
                   </article>
                )) : (
                  <div className="py-20 text-center text-gray-400 italic text-xs">
                    The vault is currently empty...
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === View.AI_GEN && (
            <div className="p-4 bg-white border border-[#000] shadow-[2px_2px_0px_#000] min-h-[400px] text-black">
              <div className="bg-[#800080] text-white px-2 py-0.5 font-bold mb-4">DREAM_ANALYZER_V1.0</div>
              <p className="text-xs mb-4 text-gray-600 leading-tight">어젯밤 꾼 꿈을 적어주세요. 인공지능이 그 심연의 의미를 해석해 드립니다.</p>
              <div className="space-y-4">
                <textarea className="w-full border border-[#888] p-2 h-32 resize-none text-xs outline-none focus:border-[#800080]" placeholder="예: 바닷가를 걷는데 하늘에서 픽셀 조각들이 눈처럼 내리고 있었어요..." value={dreamInput} onChange={(e) => setDreamInput(e.target.value)} />
                <button onClick={handleAnalyzeDream} disabled={isAnalyzing} className="w-full bg-[#c0c0c0] border-t border-l border-white border-b-2 border-r-2 border-[#444] py-2 font-bold text-xs active:border-none active:bg-[#a0a0a0]">{isAnalyzing ? 'SEARCHING THE ABYSS...' : '◆ 꿈 분석하기 ◆'}</button>
                {dreamResult && (
                  <div className="mt-6 border-2 border-dotted border-[#800080] p-4 bg-[#fdf5ff] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 text-[8px] text-[#800080] opacity-30">ANALYSIS_COMPLETE</div>
                    <p className="text-[10pt] leading-relaxed italic text-[#333]">" {dreamResult} "</p>
                    <div className="mt-4 flex justify-end"><span className="text-[8px] text-[#800080] font-bold">─ FROM THE DIGITAL VOID</span></div>
                  </div>
                )}
              </div>
              <div className="mt-10 pt-4 border-t border-gray-200"><p className="text-[9px] text-gray-400 italic">※ 인공지능의 분석은 참고용이며, 실제 운세나 의학적 소견과는 무관합니다.</p></div>
            </div>
          )}
        </div>

        <p className="mt-10 text-gray-500 uppercase tracking-widest font-mono font-bold">© 2024 {settings.siteTitle.toUpperCase()}. ALL RIGHTS RESERVED.</p>
      </main>
    </div>
  );
};

export default App;
