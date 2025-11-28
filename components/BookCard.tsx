import React from 'react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <div 
      className="relative group w-[120px] md:w-[160px] flex-none cursor-pointer transition-transform duration-300 hover:z-10 hover:scale-105"
      onClick={() => onClick(book)}
    >
      <div className="aspect-[2/3] rounded-md overflow-hidden relative shadow-lg bg-zinc-800">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
          <p className="text-white text-xs font-semibold truncate">{book.title}</p>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
