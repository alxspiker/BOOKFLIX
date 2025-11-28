
import React, { useState, useEffect } from 'react';
import { Search, Bell, Library, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onSearch: (query: string) => void;
  onNavigate: (view: string, genre?: string) => void;
  activeView: string;
}

const GENRES = [
  'Fantasy', 'Science Fiction', 'Thriller', 'Romance', 
  'Mystery', 'Horror', 'History', 'Biography', 'Children', 'Art'
];

const Navbar: React.FC<NavbarProps> = ({ onSearch, onNavigate, activeView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showBrowse, setShowBrowse] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput);
    }
  };

  const toggleSearch = () => {
    if (showSearch && searchInput) {
      setSearchInput('');
      onNavigate('home'); // Clear search goes home
      setShowSearch(false);
    } else {
      setShowSearch(!showSearch);
    }
  };

  const navItemClass = (viewName: string) => 
    `cursor-pointer transition font-medium ${activeView === viewName ? 'text-white font-bold' : 'text-gray-300 hover:text-white'}`;

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/70 to-transparent'}`}>
      <div className="px-4 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div 
            className="text-red-600 text-2xl md:text-3xl font-bold cursor-pointer tracking-tighter"
            onClick={() => {
              setSearchInput('');
              onNavigate('home');
            }}
          >
            BOOKFLIX
          </div>
          <ul className="hidden md:flex gap-6 text-sm">
            <li 
              className={navItemClass('home')} 
              onClick={() => onNavigate('home')}
            >
              Home
            </li>
            <li 
              className={navItemClass('tbr')} 
              onClick={() => onNavigate('tbr')}
            >
              TBR
            </li>
            <li 
              className={navItemClass('want-it')} 
              onClick={() => onNavigate('want-it')}
            >
              Want It
            </li>
            <li 
              className={navItemClass('history')} 
              onClick={() => onNavigate('history')}
            >
              History
            </li>
            <li 
              className={`relative group ${navItemClass('browse')}`}
              onMouseEnter={() => setShowBrowse(true)}
              onMouseLeave={() => setShowBrowse(false)}
            >
              <div className="flex items-center gap-1">
                Browse <ChevronDown size={14} className={`transition-transform ${showBrowse ? 'rotate-180' : ''}`} />
              </div>
              
              {/* Dropdown Menu */}
              {showBrowse && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 border border-gray-700 py-2 rounded shadow-xl flex flex-col gap-1">
                  <div className="absolute -top-2 left-4 w-4 h-4 bg-black/90 border-t border-l border-gray-700 rotate-45"></div>
                  {GENRES.map(genre => (
                    <div 
                      key={genre}
                      className="px-4 py-2 hover:underline text-gray-300 hover:text-white text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('category', genre);
                        setShowBrowse(false);
                      }}
                    >
                      {genre}
                    </div>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-6 text-white">
          <div className={`flex items-center border border-white/0 ${showSearch ? 'border-white/100 bg-black/80' : ''} transition-all duration-300 p-1`}>
            <Search className="w-6 h-6 cursor-pointer" onClick={toggleSearch} />
            <form onSubmit={handleSearchSubmit}>
              <input 
                className={`bg-transparent text-white outline-none text-sm transition-all duration-300 ${showSearch ? 'w-48 ml-2' : 'w-0'}`}
                placeholder="Titles, people, genres"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
          </div>
          <div className="hidden sm:block cursor-pointer">
            <Bell className="w-6 h-6" />
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('tbr')}
          >
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
               <Library size={16} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
