import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookRow from './components/BookRow';
import Modal from './components/Modal';
import { getBooksBySubject, searchBooks } from './services/openLibrary';
import { Book, LibraryItem, ReadingStatus } from './types';

type ViewType = 'home' | 'search' | 'category' | 'want-it' | 'tbr' | 'history';

const App: React.FC = () => {
  // State
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [viewTitle, setViewTitle] = useState<string>('');
  const [viewBooks, setViewBooks] = useState<Book[]>([]); // For non-home full page views
  const [isLoading, setIsLoading] = useState(false);

  const [featuredBook, setFeaturedBook] = useState<Book | null>(null);
  const [homeRowBooks, setHomeRowBooks] = useState<{ [category: string]: Book[] }>({});
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [myLibrary, setMyLibrary] = useState<LibraryItem[]>([]);

  // Initial Data Loading
  useEffect(() => {
    const loadHomeData = async () => {
      // Fetch categories for Home Page
      const categories = ['Trending', 'Fantasy', 'Science_Fiction', 'History', 'Thriller'];
      
      for (const cat of categories) {
        const books = await getBooksBySubject(cat.toLowerCase(), 15);
        setHomeRowBooks(prev => ({ ...prev, [cat.replace('_', ' ')]: books }));
        
        // Set hero if not set
        if (!featuredBook && books.length > 0) {
           setFeaturedBook(books[0]);
        }
      }
    };

    // Load LocalStorage
    const savedLibrary = localStorage.getItem('bookflix_library');
    if (savedLibrary) {
      setMyLibrary(JSON.parse(savedLibrary));
    }

    loadHomeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync Library to LocalStorage
  useEffect(() => {
    localStorage.setItem('bookflix_library', JSON.stringify(myLibrary));
  }, [myLibrary]);

  // Derived Data
  const wantItBooks = myLibrary
    .filter(item => item.status === ReadingStatus.WANT_IT || (item.status as any) === 'My List') // Legacy support
    .map(item => item.book);
    
  const tbrBooks = myLibrary
    .filter(item => item.status === ReadingStatus.TBR)
    .map(item => item.book);

  const readingBooks = myLibrary
    .filter(item => item.status === ReadingStatus.READING)
    .map(item => item.book);

  const readBooks = myLibrary
    .filter(item => item.status === ReadingStatus.COMPLETED)
    .map(item => item.book);

  const getLibraryItem = (bookId: string) => myLibrary.find(item => item.book.id === bookId);

  // Handlers
  const handleUpdateStatus = (book: Book, status: ReadingStatus | null) => {
    if (status === null) {
      setMyLibrary(prev => prev.filter(item => item.book.id !== book.id));
    } else {
      setMyLibrary(prev => {
        const existing = prev.find(item => item.book.id === book.id);
        if (existing) {
          return prev.map(item => item.book.id === book.id ? { ...item, status } : item);
        }
        return [...prev, { book, status, addedAt: Date.now() }];
      });
    }
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setCurrentView('search');
    setViewTitle(`Results for "${query}"`);
    setViewBooks([]);
    
    const results = await searchBooks(query);
    setViewBooks(results);
    setIsLoading(false);
  };

  const handleNavigate = async (view: string, payload?: string) => {
    // Reset Scroll
    window.scrollTo(0, 0);

    if (view === 'home') {
      setCurrentView('home');
      return;
    }

    if (view === 'want-it') {
      setCurrentView('want-it');
      setViewTitle('Want It');
      return;
    }
    
    if (view === 'tbr') {
      setCurrentView('tbr');
      setViewTitle('To Be Read');
      return;
    }

    if (view === 'history') {
      setCurrentView('history');
      setViewTitle('Read History');
      return;
    }

    if (view === 'category' && payload) {
      setCurrentView('category');
      setViewTitle(payload);
      setIsLoading(true);
      setViewBooks([]);
      
      const books = await getBooksBySubject(payload.toLowerCase(), 40); // Fetch more for full page
      setViewBooks(books);
      setIsLoading(false);
    }
  };

  // Render Helpers
  const renderGrid = (books: Book[], emptyMessage: string) => (
    <div className="pt-24 px-4 md:px-12 min-h-screen animate-fadeIn pb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">{viewTitle}</h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : books.length === 0 ? (
         <div className="text-gray-500 text-lg mt-12 text-center">{emptyMessage}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {books.map(book => (
            <div key={book.id} onClick={() => setSelectedBook(book)} className="cursor-pointer transition hover:scale-105 hover:z-10 group relative">
               <div className="aspect-[2/3] rounded overflow-hidden bg-zinc-800">
                <img 
                  src={book.coverUrl} 
                  alt={book.title} 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                />
               </div>
               <p className="mt-2 text-sm text-gray-300 truncate group-hover:text-white transition-colors">{book.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans overflow-x-hidden">
      <Navbar 
        onSearch={handleSearch} 
        onNavigate={handleNavigate} 
        activeView={currentView}
      />

      {/* Main Content Router */}
      {currentView === 'home' && (
        <>
          <Hero book={featuredBook} onMoreInfo={setSelectedBook} />
          <div className="-mt-16 md:-mt-32 relative z-20 space-y-8 pb-12">
            {readingBooks.length > 0 && (
               <BookRow 
                 title="Continue Reading" 
                 books={readingBooks} 
                 onBookClick={setSelectedBook} 
                 onTitleClick={() => handleNavigate('tbr')}
               />
            )}
            
            {tbrBooks.length > 0 && (
               <BookRow 
                 title="Up Next (TBR)" 
                 books={tbrBooks} 
                 onBookClick={setSelectedBook} 
                 onTitleClick={() => handleNavigate('tbr')}
               />
            )}
            
            {wantItBooks.length > 0 && (
              <BookRow 
                title="Wishlist (Want It)" 
                books={wantItBooks} 
                onBookClick={setSelectedBook} 
                onTitleClick={() => handleNavigate('want-it')}
              />
            )}

            {Object.entries(homeRowBooks).map(([category, books]) => (
              <BookRow 
                key={category} 
                title={category} 
                books={books} 
                onBookClick={setSelectedBook} 
                onTitleClick={() => handleNavigate('category', category)}
              />
            ))}

            {readBooks.length > 0 && (
               <BookRow 
                 title="Read Again" 
                 books={readBooks} 
                 onBookClick={setSelectedBook} 
                 onTitleClick={() => handleNavigate('history')}
               />
            )}
          </div>
        </>
      )}

      {currentView === 'search' && renderGrid(viewBooks, "No books found matching your search.")}
      
      {currentView === 'category' && renderGrid(viewBooks, `No books found in ${viewTitle}.`)}
      
      {currentView === 'want-it' && renderGrid(wantItBooks, "Your wishlist is empty.")}
      
      {currentView === 'tbr' && (
        <div className="pt-24 min-h-screen animate-fadeIn pb-12">
          {readingBooks.length > 0 && (
            <BookRow title="Currently Reading" books={readingBooks} onBookClick={setSelectedBook} />
          )}
          
          <div className="px-4 md:px-12 mt-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">To Be Read (TBR)</h2>
            {tbrBooks.length === 0 ? (
               <div className="text-gray-500 text-lg mt-12 text-center">You haven't added any books to your TBR shelf yet.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {tbrBooks.map(book => (
                  <div key={book.id} onClick={() => setSelectedBook(book)} className="cursor-pointer transition hover:scale-105 hover:z-10 group relative">
                     <div className="aspect-[2/3] rounded overflow-hidden bg-zinc-800">
                      <img 
                        src={book.coverUrl} 
                        alt={book.title} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                      />
                     </div>
                     <p className="mt-2 text-sm text-gray-300 truncate group-hover:text-white transition-colors">{book.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {currentView === 'history' && renderGrid(readBooks, "You haven't finished any books yet.")}

      {/* Modal Overlay */}
      {selectedBook && (
        <Modal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
          libraryItem={getLibraryItem(selectedBook.id)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
      
      <footer className="py-8 text-center text-gray-500 text-sm bg-black/50 mt-auto">
         <p>BookFlix &copy; 2025. Data provided by Open Library.</p>
      </footer>
    </div>
  );
};

export default App;