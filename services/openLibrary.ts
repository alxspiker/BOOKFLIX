import { Book } from '../types';

const BASE_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org/b/id';

// Helper to transform API result to our Book interface
const transformBook = (item: any): Book => {
  return {
    id: item.key,
    title: item.title,
    author_name: item.author_name || ['Unknown Author'],
    cover_i: item.cover_i,
    first_publish_year: item.first_publish_year,
    description: item.first_sentence ? item.first_sentence[0] : undefined, // Try to get a blurb
    subject: item.subject ? item.subject.slice(0, 5) : [],
    coverUrl: item.cover_i 
      ? `${COVERS_URL}/${item.cover_i}-L.jpg` 
      : 'https://via.placeholder.com/300x450?text=No+Cover'
  };
};

export const searchBooks = async (query: string): Promise<Book[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=20`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.docs.map(transformBook).filter((b: Book) => b.cover_i); // Filter out books without covers for aesthetics
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
};

export const getBooksBySubject = async (subject: string, limit: number = 15): Promise<Book[]> => {
  try {
    const response = await fetch(`${BASE_URL}/search.json?subject=${encodeURIComponent(subject)}&limit=${limit}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.docs.map(transformBook).filter((b: Book) => b.cover_i);
  } catch (error) {
    console.error(`Error fetching subject ${subject}:`, error);
    return [];
  }
};