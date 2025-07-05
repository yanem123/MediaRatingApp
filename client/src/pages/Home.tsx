import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';

export default function Home() {
    const [items, setItems] = useState<any[]>([]);
    const [error, setError] = useState('');

    const handleSearch = async (query: string) => {
        setError('');
        setError('');
        try {
            const [booksRes, moviesRes] = await Promise.all([
                fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=en`),
                fetch(`https://www.omdbapi.com/?apikey=7a1b0cbd&s=${encodeURIComponent(query)}&type=movie`)
            ]);

            const booksData = await booksRes.json();
            const moviesData = await moviesRes.json();
            const placeholderImage = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

            const books = (booksData.items || []).map((item: any) => {
                const imageLink = item.volumeInfo.imageLinks?.thumbnail?.replace(/zoom=\d/, 'zoom=3');
                return {
                    id: item.id,
                    title: item.volumeInfo.title,
                    authors: item.volumeInfo.authors,
                    image: imageLink || placeholderImage,
                    type: 'book'
                };
            });

            const movies = (moviesData.Search || []).map((movie: any) => ({
                id: movie.imdbID,
                title: movie.Title,
                authors: [movie.Year],
                image: movie.Poster !== 'N/A' ? movie.Poster : placeholderImage,
                type: 'movie'
            }));

            setItems([...books, ...movies]);
        } catch (err) {
            setError('Failed to fetch results');
        }

    }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
          <h1 className="text-4xl font-bold text-center mb-10 text-gray-100">Welcome to RateVerse</h1>
          <h1 className="text-3xl font-bold mb-4">Explore Books & Movies</h1>
          <SearchBar onSearch={handleSearch} />

          {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                  <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105"
                  >
                      {item.image && (
                          <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-64 object-cover"
                          />
                      )}
                      <div className="p-4 text-gray-900">
                          <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                          {item.authors && (
                              <p className="text-sm text-gray-600">
                                  {item.type === 'book' ? `by ${item.authors.join(', ')}` : `Year: ${item.authors[0]}`}
                              </p>
                          )}
                          <span className="text-xs uppercase font-semibold text-blue-500">
                              {item.type}
                          </span>
                      </div>
                  </div>
              ))}
      </div>
    </div>
  );
}