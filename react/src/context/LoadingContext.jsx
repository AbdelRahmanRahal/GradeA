import React, { createContext, useContext, useState } from 'react';

// Create the context for loading state
const LoadingContext = createContext();

// Provider component that will wrap the children components
export function LoadingProvider({ children }) {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

// Custom hook to allow easy access to the LoadingContext values
export function useLoading() {
    const context = useContext(LoadingContext);

    // Ensure that the hook is used inside a LoadingProvider
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }

    return context;
}
