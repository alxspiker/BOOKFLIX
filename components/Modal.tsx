
import React from 'react';
import { X, Plus, Check, Play, BookOpen, Bookmark, Heart } from 'lucide-react';
import { Book, ReadingStatus, LibraryItem } from '../types';

interface ModalProps {
  book: Book;
  onClose: () => void;
  libraryItem?: LibraryItem;
  onUpdateStatus: (book: Book, status: ReadingStatus | null) => void;
}

const Modal: React.FC<ModalProps> = ({ book, onClose, libraryItem, onUpdateStatus }) => {
  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleStatusClick = (status: ReadingStatus) => {
    if (libraryItem?.status === status) {
      onUpdateStatus(book, null); // Remove if clicked again
    } else {
      onUpdateStatus(book, status);
    }
  };

  const getIconForStatus = (status: ReadingStatus) => {
    switch (status) {
      case ReadingStatus.WANT_IT: return <Heart size={20} />;
      case ReadingStatus.TBR: return <Bookmark size={20} />;
      case ReadingStatus.READING: return <BookOpen size={20} />;
      case ReadingStatus.COMPLETED: return <Check size={20} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-[#181818] rounded-lg shadow-2xl overflow-hidden animate-fadeIn text-white">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#181818] flex items-center justify-center hover:bg-zinc-800 transition"
        >
          <X size={24} />
        </button>

        {/* Modal Hero */}
        <div className="relative h-64 md:h-96">
          <img 
            src={book.coverUrl} 
            alt={book.title} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>
          
          <div className="absolute bottom-8 left-8 md:left-12 right-8">
            <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">{book.title}</h2>
            <div className="flex items-center gap-4">
              <span className="text-green-400 font-bold">98% Match</span>
              <span className="text-gray-400">{book.first_publish_year}</span>
              <span className="border border-gray-500 text-xs px-1 text-gray-400">HD</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 md:px-12 pb-12 flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="flex gap-4 mb-6">
               <button 
                  className="bg-white text-black px-8 py-2 rounded font-bold hover:bg-gray-200 transition flex items-center gap-2"
                  onClick={() => window.open(`https://openlibrary.org${book.id}`, '_blank')}
               >
                 <Play fill="black" size={20} />
                 Read
               </button>
               
               <div className="flex gap-2">
                 {[ReadingStatus.WANT_IT, ReadingStatus.TBR, ReadingStatus.READING, ReadingStatus.COMPLETED].map((status) => {
                    const isActive = libraryItem?.status === status;
                    return (
                       <button
                          key={status}
                          onClick={() => handleStatusClick(status)}
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition tooltip-trigger group relative
                            ${isActive ? 'border-white bg-white/20' : 'border-gray-500 hover:border-white'}
                          `}
                          title={status}
                       >
                          {getIconForStatus(status)}
                          <span className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-gray-800 text-xs px-2 py-1 rounded">
                             {status}
                          </span>
                       </button>
                    );
                 })}
               </div>
            </div>

            <p className="text-gray-300 text-base leading-relaxed">
              {book.description || "No description available for this title. Visit Open Library for more details about this edition and its authors."}
            </p>
          </div>

          <div className="w-full md:w-1/3 text-sm space-y-3">
             <div>
                <span className="text-gray-500">Authors:</span>{' '}
                <span className="text-gray-300">{book.author_name?.join(', ') || 'Unknown'}</span>
             </div>
             <div>
                <span className="text-gray-500">Subjects:</span>{' '}
                <span className="text-gray-300">
                  {book.subject?.slice(0, 5).join(', ') || 'General'}
                </span>
             </div>
             <div>
                <span className="text-gray-500">Original Title:</span>{' '}
                <span className="text-gray-300">{book.title}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
