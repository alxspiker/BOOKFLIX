
export interface Book {
  id: string; // Open Library ID (usually /works/OL...)
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  description?: string;
  subject?: string[];
  coverUrl: string; // Computed property
}

export enum ReadingStatus {
  WANT_IT = 'Want It',
  TBR = 'TBR',
  READING = 'Reading',
  COMPLETED = 'Read',
}

export interface LibraryItem {
  book: Book;
  status: ReadingStatus;
  addedAt: number;
}
