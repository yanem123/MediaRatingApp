import { useState } from 'react';

interface Props {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSearch(input.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <input
                type="text"
                placeholder="Search for books or movies..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-800 focus:outline-none"/>
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
                Search
            </button>
        </form>
    );
}
