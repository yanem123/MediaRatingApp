import { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (password !== confirmPassword) {
          setError("Passwords do not match!");
          return;
      }

      const response = await fetch('http://localhost:5183/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              email,
              username: userName,
              password  }),
      });

      if (response.ok) {
          setSuccess('Registration successful!');
      } else {
          const error = await response.text();
          setError(error);
      }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-900">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registration</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">Username</label>
                  <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-300"
                      required
                  />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-600 transition">
          Register
        </button>
      </form>
    </div>
  );
}
