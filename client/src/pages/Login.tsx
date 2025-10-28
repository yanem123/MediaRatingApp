import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useUser();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5183/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: userName, password }),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                setMessage('Login unsuccessful. Invalid credentials.');
                return;
            }

            const userData = await response.json();

            if (userData && userData.id) {
                login(userData);
                navigate('/profile');
            } else {
                setMessage('Login unsuccessful. Invalid credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('An error occurred while logging in. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <form
                onSubmit={handleLogin}
                className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Log in</h2>
                {message && <p className="text-red-500 text-sm mb-4">{message}</p>}
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                    <input
                    id="usernameInput"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-300 text-gray-700"
                    required/>
                    </div>

        <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input
                id="passwordInput"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-300 text-gray-700"
                required/>
        </div>
                <button
                    id="submitButton"
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-600 transition">
                    Log in
                </button>
            </form>
        </div>
    );
}