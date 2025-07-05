import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Header() {
    const { user, logout } = useUser();
    const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem('user');
        logout();
        navigate('/');
    };

    return (
        <header className="bg-gray-800 text-white px-6 py-4 shadow-md">
            <nav className="flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    <Link to="/" className="hover:text-blue-400 transition">
                        RateVerse
                    </Link>
                </h1>
                <div className="space-x-4">
                    {user ? (
                        <>
                            <span className="text-sm">Welcome, {user.username}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-xl text-sm"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-blue-400 transition">
                                Log in
                            </Link>
                            <Link to="/register" className="hover:text-blue-400 transition">
                                Registration
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}