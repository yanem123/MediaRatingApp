import { createContext, useState, useEffect, useContext, ReactNode } from 'react';


interface UserContextType  {
	user: User | null;
	login: (userData: User) => void;
	logout: () => void;
	addRating: (rating: Rating) => void;
};

export interface Rating {
	id: string;
	type: 'book' | 'movie';
	score: number;
}
export interface User {
	id: number
	username: string;
	email: string;
	ratings: Rating[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const stored = localStorage.getItem('user');
		if (stored) setUser(JSON.parse(stored));
	}, []);

	const login = (userData: User) => {
		localStorage.setItem('user', JSON.stringify(userData));
		setUser(userData);
	};

	const logout = () => {
		localStorage.removeItem('user');
		setUser(null);
	};
	const addRating = (rating: Rating) => {
		if (!user) return;

		const currentRatings = user.ratings || [];
		const newRatings = [...currentRatings.filter(r => r.id !== rating.id), rating];

		const updatedUser = { ...user, ratings: newRatings };
		setUser(updatedUser);
		localStorage.setItem('user', JSON.stringify(updatedUser));
	};

	return (
		<UserContext.Provider value={{ user, login, logout, addRating}}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
}
