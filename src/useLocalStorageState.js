import { useState, useEffect } from 'react';


export function useLocalStorageState(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : initialValue;
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error writing to localStorage", error);
        }
    }, [key, value]);

    return [value, setValue];
}