import React, { useState, useEffect } from 'react';
import { useUser, Rating as UserRating } from '../context/UserContext';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

interface Item {
	id: string;
	title: string;
	authors: string[];
	image: string;
	type: 'book' | 'movie';
	imdb?: string;
}

interface CardProps {
	item: any;
}

const Card: React.FC<CardProps> = ({ item }) => {
	const { user, addRating } = useUser();

	const [value, setValue] = useState<number | null>(0);

	useEffect(() => {
		if (!user || !user.ratings) return;
		const existing = user.ratings.find(r => r.id === item.id);
		if (existing) setValue(existing.score);
	}, [user, item.id]);

	const handleChange = async (event: React.SyntheticEvent, newValue: number | null) => {
		if (!newValue) return;

		if (!user) {
			alert('Please log in to rate!');
			return;
		}

		const mediaIdToSave = item.id;

		try {
			const res = await fetch('http://localhost:5183/api/ratings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: user.id,
					mediaId: mediaIdToSave,
					mediaType: item.type,
					score: newValue,
				})
			});

			if (!res.ok) throw new Error('Failed to save rating');

			const updatedRatings = await res.json();

			addRating({ id: item.id, type: item.type, score: newValue });
			console.log("Added rating: " + {
				userId: user.id,
				mediaId: mediaIdToSave,
				mediaType: item.type,
				score: newValue
			})

		} catch (err) {
			console.log({
				userId: user.id,
				mediaId: mediaIdToSave,
				mediaType: item.type,
				score: newValue,
			});
			console.error(err);
			alert('Could not save rating');
			setValue(0);
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105">
			<div className="relative w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
				<img
					src={item.image}
					alt={item.title}
					className="w-full h-full object-contain p-2"
					onError={(e) =>
					(e.currentTarget.src =
						'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg')
					}
				/>
			</div>
			<div className="p-4 text-gray-900">
				<h3 className="font-bold text-lg mb-2 truncate">{item.title}</h3>

				{item.authors && (
					<p className="text-sm text-gray-600 truncate">
						{item.type === 'book'
							? `by ${item.authors.join(', ')}`
							: `Year: ${item.authors[0]}`}
					</p>
				)}
				{item.type === 'movie' && item.imdb && (
					<p className="text-sm text-yellow-400 font-semibold truncate">
						IMDb: {item.imdb}/10
					</p>
				)}

				<span className="text-xs uppercase font-semibold text-blue-500">
					{item.type}
				</span>

				<div className="mt-2 flex justify-center">
					{item.userRating ? (
						<Box>
							<Rating
								name={`rating-readonly-${item.id}`}
								value={item.userRating}
								readOnly/>
						</Box>
					) : (
						<Box>
							<Rating
								name={`rating-${item.id}`}
								value={value}
								onChange={handleChange}
							/>
						</Box>
					)}
				</div>
			</div>
		</div>
	);
};

export default Card;
