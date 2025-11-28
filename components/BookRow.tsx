import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Book } from '../types';
import BookCard from './BookCard';

interface BookRowProps {
  title: string;
  books: Book[];
  onBookClick: (book: Book) => void;
  onTitleClick?: () => void;
}

const BookRow: React.FC<BookRowProps> = ({ title, books, onBookClick, onTitleClick }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (books.length === 0) return null;

  return (
    <div className="space-y-2 px-4 md:px-12 py-4 group">
      <h2 
        className={`text-white text-lg md:text-xl font-semibold mb-2 transition w-fit flex items-end gap-3 ${onTitleClick ? 'hover:text-red-500 cursor-pointer' : ''}`}
        onClick={onTitleClick}
      >
        {title}
        {onTitleClick && (
          <span className="text-xs md:text-sm font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 flex items-center pb-[3px]">
             Explore All <ChevronRight size={14} className="ml-0.5" />
          </span>
        )}
      </h2>
      <div className="relative">
        <div 
          className={`absolute top-0 bottom-0 left-0 bg-black/50 z-40 w-12 m-auto h-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition hover:bg-black/70 ${!isMoved && 'hidden'}`}
          onClick={() => handleClick('left')}
        >
           <ChevronLeft className="text-white w-8 h-8" />
        </div>

        <div 
          ref={rowRef}
          className="flex items-center gap-3 overflow-x-scroll scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map((book) => (
            <BookCard key={book.id} book={book} onClick={onBookClick} />
          ))}
        </div>

        <div 
          className="absolute top-0 bottom-0 right-0 bg-black/50 z-40 w-12 m-auto h-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition hover:bg-black/70"
          onClick={() => handleClick('right')}
        >
           <ChevronRight className="text-white w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

export default BookRow;