import { createContext, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState("light");

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    const value = useMemo(() => ({
        theme,
        toggleTheme
    }), [theme])

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
} 