import { useState, useEffect } from "react";

const key = "af403830";

export function useMovies({query = "batman"} = {}) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    //const [query, setQuery] = useState("batman");

    useEffect(
        function () {
            // Simulate fetching data from an API
            async function fetchMovieDetails() {
                try {
                    setLoading(true);
                    setError(null);
                    const response = await fetch(
                        `https://www.omdbapi.com/?s=${query}&apikey=${key}`,
                    );
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const data = await response.json();
                    setMovies(data.Search);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            }
            if (query.length < 3) {
                setMovies([]);
                setError("Please enter at least 3 characters to search.");
                return;
            }
            fetchMovieDetails();
        },
        [query]
    );

    return { movies, loading, error };
}
