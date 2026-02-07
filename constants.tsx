
import React from 'react';
import { SiteSettings, Banner } from './types';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: "거대돼지고양이의 방",
  marqueeText: "★★★ Welcome to VERYBIGPIGCAT's Personal Archive! 200X Digital Space ★★★",
  systemMessage: "제 개인 홈페이지를 방문해주셔서 감사합니다!\nhttp://verybigpigcat.woobi.co.kr/ 의 새로운 보금자리입니다.\n아직 공사 중인 곳이 많지만 천천히 둘러보세요☆",
  profileName: "거대돼지고양이 (Very Big Pig Cat)",
  profileStatus: "Digital Wanderer",
  profileIdentity: "http://verybigpigcat.woobi.co.kr/ 관리인",
  profileLikes: "Retro Web Design, 90s Anime, Cats, Sleeping",
  profileBio: "세상은 넓고 맛있는 것은 많다. \n하지만 가장 좋은 곳은 역시 이 픽셀로 된 방 안.",
  sinceDate: "2024.10.10",
  // Design Defaults
  sidebarColor: "#eaddb4",
  bgStartColor: "#bed5ff",
  bgEndColor: "#7296ff",
  gradientAngle: "180deg",
  autoGradient: false,
  marqueeBgColor: "#000080",
  mainImageUrl: "https://picsum.photos/seed/verybigpigcat-retro/800/550",
  mainImages: [
    "https://picsum.photos/seed/slide1/800/550",
    "https://picsum.photos/seed/slide2/800/550",
    "https://picsum.photos/seed/slide3/800/550"
  ],
  mainImageArtist: "거대돼지고양이 (Very Big Pig Cat)",
  profileImageUrl: "https://picsum.photos/seed/verybigpigcat/300/300",
  // Typography Defaults (Optimized for 12x12 bitmap look)
  fontFamily: 'Gulim',
  fontSize: '12px',
  letterSpacing: '0em',
  lineHeight: '1.4'
};

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'b1',
    imageUrl: 'https://picsum.photos/seed/banner1/200/40',
    siteUrl: 'https://yachiyo.net',
    title: 'Yachiyo'
  },
  {
    id: 'b2',
    imageUrl: 'https://picsum.photos/seed/banner2/200/40',
    siteUrl: '#',
    title: 'Sample Neighbor'
  }
];

export const INITIAL_ENTRIES: any[] = [
  {
    id: '1',
    date: '2024. 10. 21.',
    title: '가을비 내리는 저녁',
    content: '창문에 부딪히는 빗소리가 시부야의 옛 아파트를 떠올리게 합니다. 그때는 모든 것이 조금 더 느리게 흘러갔던 것 같아요.',
    mood: '🍂',
    tags: ['일상', '날씨'],
    aiReflection: '빗방울은 과거의 기억을 깨우는 파동입니다. 고요함 속에 당신의 조각이 머물러 있네요.'
  },
  {
    id: '2',
    date: '2024. 11. 05.',
    title: '픽셀 같은 꿈',
    content: '오늘 꿈속에서 8비트 구름으로 이루어진 세상을 보았습니다. 우리는 격자무늬 위를 걷고 있었죠.',
    mood: '🌙',
    tags: ['꿈', '예술'],
    aiReflection: '꿈은 무의식이 그려낸 단순화된 기하학적 세상입니다. 그곳에서 당신은 자유로웠나요?'
  }
];
