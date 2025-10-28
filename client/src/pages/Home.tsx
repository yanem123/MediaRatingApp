import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import { User } from '../context/UserContext';
import axios from 'axios';

export default function Home() {
	interface Item {
		id: string;
		title: string;
		authors: string[];
		image: string;
		type: 'book' | 'movie';
		imdb?: string;
		userRating?: number | null;
	}

	const [items, setItems] = useState<Item[]>([]);
	const [error, setError] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 20;
	const [hasSearched, setHasSearched] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sortOrder, setSortOrder] = useState<'none' | 'booksFirst' | 'moviesFirst'>('none');
	const [user, setUser] = useState<User | null>(null);
	const [ratings, setRatings] = useState<any[]>([]);

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	useEffect(() => {
		if (!user?.id) return;
		axios
			.get(`http://localhost:5183/api/ratings/${user.id}`)
			.then(res => setRatings(res.data))
			.catch(err => console.error('Failed to load ratings:', err));
	}, [user]);

	const handleSearch = async (params: {
		query: string;
		filter: 'all' | 'book' | 'movie';
		author?: string;
		yearFrom?: number;
		yearTo?: number;
	}) => {
		const { query, filter, author, yearFrom, yearTo } = params;

		setError('');
		setLoading(true);
		setHasSearched(true);
		setCurrentPage(1);

		try {
			const requests = [];

			if (filter === 'all' || filter === 'book') {
				requests.push(fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&language=eng`));
			} else {
				requests.push(Promise.resolve(null));
			}

			if (filter === 'all' || filter === 'movie') {
				requests.push(fetch(`https://www.omdbapi.com/?apikey=7a1b0cbd&s=${encodeURIComponent(query)}&type=movie`));
			} else {
				requests.push(Promise.resolve(null));
			}

			const [booksRes, moviesRes] = await Promise.all(requests);
			const openLibData = booksRes ? await booksRes.json() : null;
			const moviesData = moviesRes ? await moviesRes.json() : null;

			const placeholderImage = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

			let openLibBooks = openLibData?.docs?.map((book: any) => ({
				id: book.key,
				title: book.title,
				authors: book.author_name || ["Unknown author"],
				year: book.first_publish_year,
				image: book.cover_i
					? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
					: placeholderImage,
				type: 'book'
			})) || [];

			if (author) {
				openLibBooks = openLibBooks.filter((b) =>
					b.authors.some((a: string) =>
						a.toLowerCase().includes(author.toLowerCase())
					));
			}

			if (yearFrom || yearTo) {
				openLibBooks = openLibBooks.filter((b) => {
					if (!b.year) return false;
					return (!yearFrom || b.year >= yearFrom) && (!yearTo || b.year <= yearTo);
				});
			}

			let movies = moviesData?.Search
				? await Promise.all(
					moviesData.Search.map(async (movie: any) => {
						const detailRes = await fetch(`https://www.omdbapi.com/?apikey=7a1b0cbd&i=${movie.imdbID}`);
						const detailData = await detailRes.json();

						return {
							id: movie.imdbID,
							title: movie.Title,
							authors: [movie.Year],
							year: parseInt(movie.Year),
							image: movie.Poster !== 'N/A' ? movie.Poster : placeholderImage,
							type: 'movie',
							imdb: detailData.imdbRating || 'N/A'
						};
					})
				)
				: [];

			if (author) {
				movies = movies.filter((m) =>
					m.title.toLowerCase().includes(author.toLowerCase())
				);
			}

			if (yearFrom || yearTo) {
				movies = movies.filter((m) => {
					if (!m.year) return false;
					return (!yearFrom || m.year >= yearFrom) && (!yearTo || m.year <= yearTo);
				});
			}

			const results =
				filter === 'book'
					? openLibBooks
					: filter === 'movie'
						? movies
						: [...openLibBooks, ...movies];

			const resultsWithRatings = results.map(item => {
				const userRating = ratings.find(
					r => r.mediaId === item.id && r.mediaType === item.type
				);
				return {
					...item,
					userRating: userRating ? userRating.score : null
				};
			});

			setItems(resultsWithRatings);
		} catch (err) {
			setError('Failed to fetch results');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (sortOrder === 'none') return;

		setItems((prev) => {
			const sorted = [...prev];
			if (sortOrder === 'booksFirst') {
				sorted.sort((a, b) => (a.type === 'book' && b.type === 'movie' ? -1 : 1));
			} else if (sortOrder === 'moviesFirst') {
				sorted.sort((a, b) => (a.type === 'movie' && b.type === 'book' ? -1 : 1));
			}
			return sorted;
		});
	}, [sortOrder]);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [currentPage]);

	return (
		<div className="min-h-screen bg-gray-900 p-8">
			<h1
				id = "homeText"
				className="text-4xl font-bold text-center mb-10 text-gray-100">
				Welcome to RateVerse
			</h1>

			<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
				<div className="flex gap-4">
					<SearchBar onSearch={handleSearch} />
					<select
						value={sortOrder}
						onChange={(e) => setSortOrder(e.target.value as 'none' | 'booksFirst' | 'moviesFirst')}
						className="bg-gray-800 text-gray-200 px-4 py-2 rounded-lg border border-gray-700 h-[42px]">
						<option value="none">Default order</option>
						<option value="booksFirst">Books first</option>
						<option value="moviesFirst">Movies first</option>
					</select>
				</div>
			</div>

			{error && <p className="text-red-500 text-center mt-4">{error}</p>}

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
				{loading ? (
					<p className="text-gray-200 text-center w-full col-span-full">Fetching results...</p>
				) : items.length === 0 && hasSearched ? (
					<p className="text-gray-200 text-center w-full col-span-full">No results found.</p>
				) : (
					items
						.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
						.map(item => <Card key={item.id} item={item} />)
				)}
			</div>

			{items.length > itemsPerPage && (
				<div className="flex justify-center items-center gap-4 mt-8">
					<button
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}
						className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50">
						Previous
					</button>

					<span className="text-gray-300">
						Page {currentPage} of {Math.ceil(items.length / itemsPerPage)}
					</span>

					<button
						onClick={() =>
							setCurrentPage((prev) =>
								Math.min(prev + 1, Math.ceil(items.length / itemsPerPage))
							)
						}
						disabled={currentPage === Math.ceil(items.length / itemsPerPage)}
						className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50">
						Next
					</button>
				</div>
			)}
		</div>
	);
}
