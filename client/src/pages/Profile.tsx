import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
                {user ? (
                    <div>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                ) : (
                    <p>Loading profile...</p>
                )}
            </div>
        </div>
    );
}
