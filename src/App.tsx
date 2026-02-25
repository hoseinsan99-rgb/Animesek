import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, PlusSquare, Library, Heart, User, Send, Vote, MessageCircle, BarChart2 } from 'lucide-react';
import SakuraPetals from './components/SakuraPetals';
import ChatModal from './components/ChatModal';
import VoteModal from './components/VoteModal';
import GlobalChat from './components/GlobalChat';
import { Anime, User as UserType, Stat } from './types';

// Pages
const HomePage = () => {
  const [featured, setFeatured] = useState<Anime[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoteOpen, setIsVoteOpen] = useState(false);
  
  useEffect(() => {
    fetch('/api/anime').then(res => res.json()).then(setFeatured);
  }, []);

  const handleVote = async (category: string) => {
    if (!selectedAnime) return;
    await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: localStorage.getItem('userId') || 'user_1',
        animeId: selectedAnime.id,
        category
      })
    });
    setIsVoteOpen(false);
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-[3rem] overflow-hidden border border-white/10 group">
        <img 
          src="https://picsum.photos/seed/animehero/1200/800" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          alt="Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]">Trending Now</span>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mt-4 leading-[0.85] uppercase">
              NEON <br /> <span className="text-blue-500">GENESIS</span>
            </h1>
            <p className="text-white/60 max-w-md mt-6 text-sm leading-relaxed">
              Step into the futuristic world of AnimeSek. Connect with AI characters, vote for your favorites, and share your journey with the global community.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="px-8 py-4 bg-white text-black rounded-2xl font-black italic uppercase tracking-tighter hover:bg-blue-500 hover:text-white transition-all shadow-xl">Start Journey</button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl font-black italic uppercase tracking-tighter hover:bg-white/20 transition-all">Explore All</button>
            </div>
          </motion.div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Featured <span className="text-blue-500">Universe</span></h2>
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">Handpicked for you</p>
          </div>
          <button className="text-blue-500 text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition-colors">View All →</button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide -mx-4 px-4">
          {featured.slice(0, 10).map((anime) => (
            <motion.div
              key={anime.id}
              whileHover={{ y: -10 }}
              className="flex-none w-56 group cursor-pointer"
            >
              <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedAnime(anime); setIsChatOpen(true); }}
                      className="flex-1 py-2 bg-white text-black text-[10px] font-black uppercase rounded-xl hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      Chat
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedAnime(anime); setIsVoteOpen(true); }}
                      className="flex-1 py-2 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-xl hover:bg-white/30 transition-colors"
                    >
                      Vote
                    </button>
                  </div>
                </div>
              </div>
              <h3 className="mt-4 text-sm font-black italic uppercase tracking-tighter truncate group-hover:text-blue-500 transition-colors">{anime.title}</h3>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{anime.genre}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 rounded-[3rem] border border-blue-500/20 relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Seasonal Event</span>
            <h3 className="text-3xl font-black italic tracking-tighter uppercase mt-2">Cherry Blossom <br /> <span className="text-blue-400">Festival</span></h3>
            <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-xs">Join the seasonal voting arena and unlock exclusive Sakura-themed AI skins!</p>
            <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black italic uppercase tracking-tighter hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)]">Enter Arena</button>
          </div>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700"></div>
        </div>

        <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 p-8 rounded-[3rem] border border-red-500/20 relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">Community</span>
            <h3 className="text-3xl font-black italic tracking-tighter uppercase mt-2">Global Otaku <br /> <span className="text-red-400">Leaderboard</span></h3>
            <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-xs">See who's leading the seasonal rankings and earn your place among the legends.</p>
            <button className="mt-8 px-6 py-3 bg-red-600 text-white rounded-2xl font-black italic uppercase tracking-tighter hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)]">View Stats</button>
          </div>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full group-hover:bg-red-600/20 transition-all duration-700"></div>
        </div>
      </section>

      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        characterName={selectedAnime?.title || 'Anime Character'} 
      />
      <VoteModal 
        isOpen={isVoteOpen} 
        onClose={() => setIsVoteOpen(false)} 
        anime={selectedAnime} 
        onVote={handleVote} 
      />
    </div>
  );
};

const StatsPage = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchStats = () => fetch('/api/stats').then(res => res.json()).then(setStats);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'user_1'); // Hardcoded for demo
    formData.append('caption', caption);
    formData.append('type', file.type.startsWith('image') ? 'image' : 'video');

    await fetch('/api/stats', {
      method: 'POST',
      body: formData,
    });
    setFile(null);
    setCaption('');
    setUploading(false);
    fetchStats();
  };

  return (
    <div className="space-y-8 pb-24">
      <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">Share Your Anime Stats</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <input 
            type="file" 
            accept="image/*,video/*" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
          />
          <textarea 
            placeholder="What's on your mind, Otaku?" 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
          />
          <button 
            disabled={uploading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Post Stat'}
          </button>
        </form>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <motion.div 
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 rounded-3xl overflow-hidden border border-white/10"
          >
            <div className="p-4 flex items-center gap-3">
              <img src={stat.avatar} alt={stat.username} className="w-10 h-10 rounded-full border border-blue-500/50" />
              <span className="text-white font-bold">{stat.username}</span>
            </div>
            {stat.type === 'image' ? (
              <img src={stat.url} alt="stat" className="w-full aspect-video object-cover" />
            ) : (
              <video src={stat.url} controls className="w-full aspect-video object-cover" />
            )}
            <div className="p-4">
              <p className="text-white/80">{stat.caption}</p>
              <p className="text-xs text-white/40 mt-2">{new Date(stat.timestamp).toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ username: '', bio: '', avatar: '' });

  const fetchUser = () => {
    const userId = localStorage.getItem('userId') || 'user_1';
    fetch(`/api/user/${userId}`).then(res => res.json()).then(data => {
      setUser(data);
      setEditData({ username: data.username, bio: data.bio || '', avatar: data.avatar });
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user?.id, ...editData })
    });
    setIsEditing(false);
    fetchUser();
  };

  if (!user) return null;

  return (
    <div className="space-y-8 pb-24">
      <div className="relative h-64 rounded-3xl overflow-hidden border border-white/10">
        <img src="https://picsum.photos/seed/profile-bg/1200/400" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div className="flex items-end gap-6">
            <div className="relative">
              <img src={user.avatar} className="w-32 h-32 rounded-3xl border-4 border-blue-500 shadow-[0_0_20px_#3b82f6]" />
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">LVL {Math.floor(user.xp / 100) + 1}</div>
            </div>
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-white">{user.username}</h1>
              <p className="text-blue-400 font-medium">{user.rank}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="mb-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all border border-white/10"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
          <p className="text-xs text-white/40 uppercase tracking-wider">XP Points</p>
          <p className="text-2xl font-bold text-white">{user.xp}</p>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
          <p className="text-xs text-white/40 uppercase tracking-wider">Rank</p>
          <p className="text-lg font-bold text-orange-400">{user.rank.split(' ')[0]}</p>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
          <p className="text-xs text-white/40 uppercase tracking-wider">Badges</p>
          <p className="text-2xl font-bold text-white">12</p>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold mb-6">Edit Your Profile</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 uppercase font-bold mb-1 block">Username</label>
                  <input type="text" value={editData.username} onChange={e => setEditData({...editData, username: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase font-bold mb-1 block">Avatar URL</label>
                  <input type="text" value={editData.avatar} onChange={e => setEditData({...editData, avatar: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase font-bold mb-1 block">Bio</label>
                  <textarea value={editData.bio} onChange={e => setEditData({...editData, bio: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none h-24" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold shadow-[0_0_15px_#3b82f6]">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LoginModal = ({ isOpen, onLogin }: { isOpen: boolean, onLogin: (userId: string) => void }) => {
  return null;
};

const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link to={to} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-blue-500' : 'text-white/40 hover:text-white/70'}`}>
    <div className={`p-2 rounded-xl transition-all ${active ? 'bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : ''}`}>
      <Icon size={24} />
    </div>
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </Link>
);

export default function App() {
  const location = useLocation();
  const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  const fetchUser = (userId: string) => {
    fetch(`/api/user/${userId}`).then(res => res.json()).then(setUser);
  };

  useEffect(() => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'user_1';
      localStorage.setItem('userId', userId);
    }
    fetchUser(userId);
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <SakuraPetals />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          >
            <span className="text-xl font-black italic text-white">AS</span>
          </motion.div>
          <div>
            <h1 className="text-xl font-black tracking-tighter italic leading-none">ANIMESEK <span className="text-blue-500">HOME</span></h1>
            <p className="text-[8px] uppercase tracking-[0.2em] text-white/40 font-bold">AI Anime Universe</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10"><Compass size={20} className="text-white/70" /></button>
          <button 
            onClick={() => setIsGlobalChatOpen(true)}
            className="p-2.5 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 relative"
          >
            <MessageCircle size={20} className="text-white/70" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]"></span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-4 md:px-6 max-w-6xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<div className="text-center py-40 text-white/20 font-black italic text-4xl tracking-tighter">EXPLORE <span className="text-blue-500/20">SOON</span></div>} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/library" element={<div className="text-center py-40 text-white/20 font-black italic text-4xl tracking-tighter">LIBRARY <span className="text-red-500/20">SOON</span></div>} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <nav className="bg-black/60 backdrop-blur-3xl border border-white/10 px-6 py-3 flex justify-between items-center rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <NavItem to="/" icon={Home} label="Home" active={location.pathname === '/'} />
          <NavItem to="/explore" icon={Compass} label="Explore" active={location.pathname === '/explore'} />
          <NavItem to="/stats" icon={BarChart2} label="Stats" active={location.pathname === '/stats'} />
          <NavItem to="/library" icon={Library} label="Library" active={location.pathname === '/library'} />
          <NavItem to="/profile" icon={User} label="Profile" active={location.pathname === '/profile'} />
        </nav>
      </div>

      {user && (
        <GlobalChat 
          isOpen={isGlobalChatOpen} 
          onClose={() => setIsGlobalChatOpen(false)} 
          username={user.username}
          userId={user.id}
        />
      )}
    </div>
  );
}
