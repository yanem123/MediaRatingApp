import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { User, useUser } from '../context/UserContext';

interface Rating {
	id: number;
	mediaId: string;
	mediaType: string;
	score: number;
	comment?: string;
}

interface MediaInfo extends Rating {
	title: string;
	image: string;
}

export default function Profile() {
	const [user, setUser] = useState<User>();
	const [ratings, setRatings] = useState<MediaInfo[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const storedUser = localStorage.getItem('user');

		if (storedUser) {
			setUser(JSON.parse(storedUser));
		} else {
			navigate('/login');
		}

	}, [navigate]);

	useEffect(() => {
		if (!user?.id) return;
		axios
			.get(`http://localhost:5183/api/ratings/${user?.id}`)
			.then(async (res) => {
				const ratingData: Rating[] = res.data;
				const mediaDetails = await Promise.all(
					ratingData.map(async (r) => {
						if (r.mediaType === 'book') {
							const bookRes = await fetch(`https://openlibrary.org/search.json?q=${r.mediaId}`);
							const bookData = await bookRes.json();
							const firstResult = bookData.docs[0];

							const coverUrl = firstResult?.cover_i
								? `https://covers.openlibrary.org/b/id/${firstResult.cover_i}-M.jpg`
								: 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

							return {
								...r,
								title: firstResult?.title || 'Unknown book',
								image: coverUrl,
							};
						} else {
							const movieRes = await fetch(`https://www.omdbapi.com/?apikey=7a1b0cbd&i=${r.mediaId}`);
							const movieData = await movieRes.json();

							return {
								...r,
								title: movieData?.Title || 'Unknown Movie',
								image: movieData?.Poster !== 'N/A' ? movieData.Poster : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg',
							};
						}
					})
				);
				setRatings(mediaDetails.sort((a, b) => b.score - a.score));
			})
	})
	const handleDelete = async (ratingId: number) => {
		if (!window.confirm("Are you sure you want to delete this rating?")) return;

		try {
			await axios.delete(`http://localhost:5183/api/ratings/${ratingId}`);
			setRatings(prev => prev.filter(r => r.id !== ratingId));
		} catch (error) {
			console.error("Error deleting rating:", error);
			alert("Failed to delete rating.");
		}
	};

	return (
		<div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
			<div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-2xl">
				<h1 id="profileText" className="text-3xl font-bold mb-4 text-center">User Profile</h1>

				<div className="mb-6">
					<p><strong>Username:</strong> {user?.username}</p>
					<p><strong>Email:</strong> {user?.email}</p>
				</div>

				<h2 className="text-2xl font-semibold mb-3 border-b border-gray-700 pb-2">
					Your Rated Media
				</h2>

				{ratings.length > 0 ? (
					<ul className="space-y-3">
						{ratings.map(r => (
							<li key={r.id} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between ratedMedia">
								<div className="flex items-center space-x-4">
									<img
										src={r.image}
										alt={r.title}
										className="w-16 h-24 object-cover rounded-md shadow-md"/>
									<div>
										<p className="font-semibold text-lg">{r.title}</p>
										<p className="text-xs uppercase font-semibold text-blue-500">{r.mediaType}</p>
									</div>
								</div>

								<div className="flex items-center space-x-3">
									<span className="text-yellow-400 font-bold text-xl">⭐ {r.score}</span>
									<button
										onClick={() => handleDelete(r.id)}
										className="text-red-500 hover:text-red-700 text-xl font-bold deleteButton">
										✖
									</button>
								</div>
							</li>
						))}
					</ul>
				) : (
					<p className="text-gray-400 text-center mt-4" id="noRatedMedia">
						You haven't rated any media yet.
					</p>
				)}
			</div>
		</div>
	);
}
