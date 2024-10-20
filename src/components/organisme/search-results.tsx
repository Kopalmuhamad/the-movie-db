import { IMovie } from "@/services/apis/interface";
import { searchMovie } from "@/services/apis/movies";
import { isSearchOpenAtom, searchQuery } from "@/services/atom/atom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SearchResults = () => {
    const [query] = useAtom(searchQuery);
    const [, setIsSearchOpen] = useAtom(isSearchOpenAtom);
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            if (!query) return; // If no query, do nothing
            setLoading(true);
            setError(null);

            try {
                const data = await searchMovie(query);
                setMovies(data.results);
                if (data.results.length === 0) {
                    toast.error("No movies found");
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                setError("Failed to fetch movies");
                toast.error("Failed to fetch movies");
            } finally {
                setLoading(false); // Ensure loading is set to false
            }
        };

        fetchMovies();
        setIsSearchOpen(true);
    }, [query, setIsSearchOpen]);
    return (
        <section className="container mx-auto pt-10 space-y-4">
            <header>
                <h1 className="font-bebas text-3xl font-semibold">
                    Search Results for "{query}"
                </h1>
            </header>
            <div>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {movies.map((movie) => (
                            <li key={movie.id} className="p-4 border rounded-md">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-auto mb-4"
                                />
                                <h2 className="font-bold text-lg">{movie.title}</h2>
                                <p>{movie.overview}</p>
                                <p className="text-sm text-gray-500">Release Date: {movie.release_date}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    )
}

export default SearchResults