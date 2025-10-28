import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Menu, X } from 'lucide-react';

export default function Header() {
	const { user, logout } = useUser();
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);

	const handleLogout = () => {
		localStorage.removeItem('user');
		logout();
		navigate('/');
		window.location.reload();
	};

	return (
		<header className="bg-gray-800 text-white px-6 py-4 shadow-md sticky top-0 z-50">
			<nav className="flex justify-between items-center">
			  
				<h1 className="text-xl font-bold">
					<Link id="logoButton" to="/" className="hover:text-blue-400 transition">
						RateVerse
					</Link>
				</h1>

				<button
					onClick={() => setMenuOpen(!menuOpen)}
					className="focus:outline-none hover:text-blue-400 transition"
					id="hamburgerButton"
				>
					{menuOpen ? <X size={28} /> : <Menu size={28} />}
				</button>
			</nav>

			{menuOpen && (
				<>
					<div
						className="fixed inset-0 bg-black bg-opacity-50 z-40"
						onClick={() => setMenuOpen(false)}></div>

					<div className="fixed top-4 right-4 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-56 z-50 animate-slideIn">
						<div className="flex flex-col items-center py-4 space-y-3">
							{user ? (
								<>
									<Link
										id="profileButton"
										to="/profile"
										onClick={() => setMenuOpen(false)}
										className="w-44 text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm transition">
										Profile
									</Link>
									<button
										id="logoutButton"
										onClick={() => {
											handleLogout();
											setMenuOpen(false);
										}}
										className="w-44 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition">
										Log out
									</button>
								</>
							) : (
								<>
									<Link
										id="registrationButton"
										to="/register"
										onClick={() => setMenuOpen(false)}
										className="w-44 text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm transition">
										Registration
									</Link>
									<Link
										id="loginButton"
										to="/login"
										onClick={() => setMenuOpen(false)}
										className="w-44 text-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm transition">
										Log in
									</Link>
								</>
							)}
						</div>
					</div>
				</>
			)}
		</header>
	);
}
