import React, { createContext, useContext, useState, useEffect } from 'react';

export const LoginContext = createContext(null);

export function useLogin() {
  return useContext(LoginContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        console.log("User loaded from localStorage:", savedUser);  // Logga datan som laddas
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (user) => {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        console.log("User saved to localStorage:", JSON.stringify(user));  // Logga datan som sparas
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <LoginContext.Provider value={{ user, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
};