import { CarouselItem } from "@/components/atom/carousel";
import MainLayout from "@/components/layout/main-layout";
import CardSlider from "@/components/moleculs/card-slider";
import { fetchNowPlayingMovies, fetchPopularMovies } from "@/services/apis/movies"; // Fetch for popular movies
import { useEffect, useState } from "react";
import MovieCard from "@/components/moleculs/movie-card";
import { IMovie } from "@/services/apis/interface";
import { Button } from "@/components/atom/button"; // Import Button for Load More
import { useAtom } from "jotai";
import { isSearchOpenAtom } from "@/services/atom/atom";
import SearchResults from "@/components/organisme/search-results";

const HomePage = () => {
    const [nowPlayingMovies, setNowPlayingMovies] = useState<IMovie[]>([]);
    const [popularMovies, setPopularMovies] = useState<IMovie[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalMovies, setTotalMovies] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isSearchOpen] = useAtom(isSearchOpenAtom)

    //! Get now playing movies
    useEffect(() => {
        const getNowPlayingMovies = async () => {
            try {
                const data = await fetchNowPlayingMovies();
                setNowPlayingMovies(data.results);
            } catch (error) {
                console.error("Error fetching now playing movies:", error);
            }
        };
        getNowPlayingMovies();
    }, []);

    //! Get popular movies with Load More functionality (limit 30)
    const MOVIES_PER_LOAD = 6;
    const MAX_MOVIES = 30;

    const loadMoreMovies = async () => {
        try {
            if (totalMovies >= MAX_MOVIES) {
                setHasMore(false); // Stop loading if we've reached the max limit
                return;
            }

            const data = await fetchPopularMovies(page); // Fetch popular movies by page
            const newMovies = data.results.slice(0, MOVIES_PER_LOAD);

            setPopularMovies((prevMovies) => [...prevMovies, ...newMovies]);
            setTotalMovies((prevTotal) => prevTotal + newMovies.length);
            setPage((prevPage) => prevPage + 1);

            if (totalMovies + newMovies.length >= MAX_MOVIES) {
                setHasMore(false); // Stop loading if we've reached 30 movies
            }
        } catch (error) {
            console.error("Error loading more movies:", error);
        }
    };

    // Load initial movies when component mounts
    useEffect(() => {
        loadMoreMovies(); // Load initial movies
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    const limitMovies = nowPlayingMovies.slice(0, 6); // Limit now playing movies to 6

    return (
        <MainLayout>

            {isSearchOpen ?
                <>
                    <SearchResults />
                </>
                :
                <>
                    <section className="container mx-auto pt-10 space-y-4">
                        <header>
                            <h1 className="font-bebas text-3xl font-semibold">Now Playing</h1>
                        </header>
                        <CardSlider>
                            {limitMovies.map((movie) => (
                                <CarouselItem className="basis-1/1 cursor-pointer" key={movie.id}>
                                    <MovieCard
                                        movie={movie}
                                    />
                                </CarouselItem>
                            ))}
                        </CardSlider>
                    </section>
                    <section className="container mx-auto pt-10 space-y-4 pb-10">
                        <header>
                            <h1 className="font-bebas text-3xl font-semibold">Popular Movies</h1>
                        </header>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {popularMovies.map((movie) => (
                                <MovieCard
                                    movie={movie}
                                />
                            ))}
                        </div>

                        {hasMore && (
                            <div className="flex justify-center mt-8">
                                <Button variant="outline" onClick={loadMoreMovies}>
                                    Load More
                                </Button>
                            </div>
                        )}
                    </section>
                </>
            }
        </MainLayout>
    );
};

export default HomePage;
