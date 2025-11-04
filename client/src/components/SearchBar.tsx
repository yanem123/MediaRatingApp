import { useState } from 'react';

interface SearchParams {
	query: string;
	filter: 'all' | 'book' | 'movie';
	author?: string;
	yearFrom?: number;
	yearTo?: number;
}

interface Props {
	onSearch: (params: SearchParams) => void;
}

export default function SearchBar({ onSearch }: Props) {
	const [query, setQuery] = useState('');
	const [filter, setFilter] = useState<'all' | 'book' | 'movie'>('all');
	const [author, setAuthor] = useState('');
	const [yearFrom, setYearFrom] = useState<number | undefined>();
	const [yearTo, setYearTo] = useState<number | undefined>();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		onSearch({
		query,
		filter,
		author,
		yearFrom,
		yearTo,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
		<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
			<input
				id="searchInput"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search for a book or movie..."
				className="flex-1 px-4 py-2 rounded-lg bg-white text-gray-900"/>

			<input
				id="authorInput"
				value={author}
				onChange={(e) => setAuthor(e.target.value)}
				placeholder="Author or Director..."
				className="p-2 rounded-md text-gray-900"/>

			<input
				id="yearFromInput"
				type="number"
				value={yearFrom ?? ''}
				onChange={(e) => setYearFrom(e.target.value ? parseInt(e.target.value) : undefined)}
				placeholder="Year from"
				min="1800"
				max="2025"
				className="p-2 w-28 rounded-md text-gray-900"/>
			<input
					id="yearToInput"
				type="number"
				value={yearTo ?? ''}
				onChange={(e) => setYearTo(e.target.value ? parseInt(e.target.value) : undefined)}
				placeholder="to"
				min="1800"
				max="2025"
				className="p-2 w-28 rounded-md text-gray-900"/>

			<select
				id="filter"
				value={filter}
				onChange={(e) => setFilter(e.target.value as 'all' | 'book' | 'movie')}
				className="bg-gray-800 text-gray-200 px-4 py-2 rounded-lg border border-gray-700">
				<option value="all">All</option>
				<option value="book">Books</option>
				<option value="movie">Movies</option>
			</select>

			<button
				id="searchButton"
				type="submit"
				className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
				Search
			</button>
		</div>
		</form>
	);
}
