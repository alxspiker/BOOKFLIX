import React from 'react';
import { Info, Play } from 'lucide-react';
import { Book } from '../types';

interface HeroProps {
  book: Book | null;
  onMoreInfo: (book: Book) => void;
}

const Hero: React.FC<HeroProps> = ({ book, onMoreInfo }) => {
  if (!book) return (
    <div className="w-full h-[60vh] md:h-[80vh] bg-zinc-900 animate-pulse flex items-center justify-center">
      <span className="text-gray-600">Loading Featured Book...</span>
    </div>
  );

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh]">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0">
        <img 
          src={book.coverUrl} 
          alt={book.title}
          className="w-full h-full object-cover object-center md:object-[center_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute top-[30%] md:top-[35%] left-4 md:left-12 max-w-xl z-10 space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg tracking-tight leading-tight">
          {book.title}
        </h1>
        <p className="text-white text-lg md:text-xl font-medium drop-shadow-md text-gray-200">
           {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
        </p>
        <p className="text-gray-300 text-sm md:text-base line-clamp-3 md:line-clamp-4 max-w-lg drop-shadow-sm">
          {book.first_publish_year ? `Published in ${book.first_publish_year}. ` : ''}
          Explore this masterpiece in our collection. A defining work that has captured the imagination of readers worldwide.
        </p>

        <div className="flex items-center gap-3 pt-4">
          <button 
            className="bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded hover:bg-opacity-80 transition flex items-center gap-2 font-bold"
            onClick={() => onMoreInfo(book)}
          >
            <Play fill="black" size={20} />
            Read Now
          </button>
          <button 
            className="bg-gray-500/70 text-white px-6 md:px-8 py-2 md:py-3 rounded hover:bg-gray-500/50 transition flex items-center gap-2 font-semibold backdrop-blur-sm"
            onClick={() => onMoreInfo(book)}
          >
            <Info size={24} />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
