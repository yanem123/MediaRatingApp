import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useEffect, useContext } from 'react';
;
const UserContext = createContext(undefined);
export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored)
            setUser(JSON.parse(stored));
    }, []);
    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };
    const addRating = (rating) => {
        if (!user)
            return;
        const currentRatings = user.ratings || [];
        const newRatings = [...currentRatings.filter(r => r.id !== rating.id), rating];
        const updatedUser = { ...user, ratings: newRatings };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };
    return (_jsx(UserContext.Provider, Object.assign({ value: { user, login, logout, addRating } }, { children: children }), void 0));
}
export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
