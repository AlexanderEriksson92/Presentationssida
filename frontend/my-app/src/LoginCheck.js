import React, { createContext, useContext, useState, useEffect } from 'react';

export const LoginContext = createContext(null);

export function useLogin() {
  return useContext(LoginContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Lägg till laddningsstatus

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        console.log("User loaded from localStorage:", savedUser);
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
            } catch (e) {
                console.error('Error parsing user data:', e);
                localStorage.removeItem('user'); // Rensa korrupt data om det misslyckas att parsa
            }
        }
        setLoading(false); // Autentiseringskontrollen är klar
    }, []);

    const login = (apikey) => {
        console.log("Received token for login:", apikey);  
        localStorage.setItem('user', JSON.stringify({ token: apikey }));
        setUser({ token: apikey });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <LoginContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </LoginContext.Provider>
    );
};
