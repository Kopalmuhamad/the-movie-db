import { CarouselItem } from "@/components/atom/carousel";
import MainLayout from "@/components/layout/main-layout";
import CardSlider from "@/components/moleculs/card-slider";
import { fetchNowPlayingMovies, fetchPopularMovies } from "@/services/apis/movies";
import { useEffect, useState } from "react";
import MovieCard from "@/components/moleculs/movie-card";
import { IMovie } from "@/services/apis/interface";
import { Button } from "@/components/atom/button";
import { useAtom } from "jotai";
import { isSearchOpenAtom } from "@/services/atom/atom";
import SearchResults from "@/components/organisme/search-results";
import { Skeleton } from "@/components/atom/skeleton";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [nowPlayingMovies, setNowPlayingMovies] = useState<IMovie[]>([]);
    const [popularMovies, setPopularMovies] = useState<IMovie[]>([]);
    const [isSearchOpen] = useAtom(isSearchOpenAtom);
    const [loadingNowPlaying, setLoadingNowPlaying] = useState<boolean>(true);
    const [loadingPopular, setLoadingPopular] = useState<boolean>(true);
    const [limitPopularMovies, setLimitPopularMovies] = useState<number>(6); // Awal batas 6
    const [totalMoviesFetched, setTotalMoviesFetched] = useState<number>(0); // Jumlah total movie yang telah di-fetch
    const MAX_MOVIES_DISPLAYED = 30; // Batas maksimum film yang akan ditampilkan

    // Fetch now playing movies
    useEffect(() => {
        const getNowPlayingMovies = async () => {
            setLoadingNowPlaying(true);
            try {
                const data = await fetchNowPlayingMovies();
                setNowPlayingMovies(data.results.slice(0, 6));
            } catch (error) {
                console.error("Error fetching now playing movies:", error);
            } finally {
                setLoadingNowPlaying(false);
            }
        };
        getNowPlayingMovies();
    }, []);
    const limitNowPlayingMovies = nowPlayingMovies.slice(0, 6);

    // Fetch Popular Movies
    const getPopularMovies = async (pages: number[]) => {
        setLoadingPopular(true);
        try {
            const data = await Promise.all(
                pages.map((page) => fetchPopularMovies(page))
            );

            const combinedResults = data.flatMap((response) => response.results);

            const uniqueMovies = combinedResults.filter(
                (movie, index, self) =>
                    index === self.findIndex((m) => m.id === movie.id)
            );

            setPopularMovies((prev) => {
                const combinedMovies = [...prev, ...uniqueMovies];
                return combinedMovies.filter(
                    (movie, index, self) =>
                        index === self.findIndex((m) => m.id === movie.id)
                );
            });

            setTotalMoviesFetched((prev) => prev + uniqueMovies.length);
        } catch (error) {
            console.error("Error fetching popular movies:", error);
        } finally {
            setLoadingPopular(false);
        }
    };


    useEffect(() => {
        getPopularMovies([1]);
    }, []);

    const loadMoreMovies = async () => {
        const nextPage = Math.ceil(totalMoviesFetched / 20) + 1;
        await getPopularMovies([nextPage]);

        setLimitPopularMovies((prev) => Math.min(prev + 6, MAX_MOVIES_DISPLAYED));
    };

    return (
        <MainLayout>
            {isSearchOpen ? (
                <SearchResults />
            ) : (
                <>
                    <section className="container mx-auto pt-10 space-y-4">
                        <header>
                            <h1 className="font-bebas text-3xl font-semibold">Now Playing</h1>
                        </header>
                        <CardSlider>
                            {loadingNowPlaying ? (
                                Array.from({ length: 6 }).map((_, index) => (
                                    <CarouselItem className="basis-1/1 cursor-pointer" key={index}>
                                        <Skeleton className="h-60 w-full" />
                                    </CarouselItem>
                                ))
                            ) : (
                                limitNowPlayingMovies.map((movie) => (
                                    <CarouselItem className="basis-1/1 cursor-pointer" key={movie.id}>
                                        <Link to={`/movie/${movie.id}`}>
                                            <MovieCard movie={movie} />
                                        </Link>
                                    </CarouselItem>
                                ))
                            )}
                        </CardSlider>
                    </section>
                    <section className="container mx-auto pt-10 space-y-4 pb-10">
                        <header>
                            <h1 className="font-bebas text-3xl font-semibold">Popular Movies</h1>
                        </header>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {loadingPopular ? (
                                Array.from({ length: 6 }).map((_, index) => (
                                    <Skeleton key={index} className="h-80 w-full" />
                                ))
                            ) : (
                                popularMovies.slice(0, limitPopularMovies).map((movie) => (
                                    <Link to={`/movie/${movie.id}`}>
                                        <MovieCard key={movie.id} movie={movie} />
                                    </Link>
                                ))
                            )}
                        </div>
                        {!loadingPopular && limitPopularMovies < MAX_MOVIES_DISPLAYED && (
                            <div className="flex justify-center mt-8">
                                <Button variant="outline" onClick={loadMoreMovies}>
                                    Load More
                                </Button>
                            </div>
                        )}
                    </section>
                </>
            )}
        </MainLayout>
    );
};

export default HomePage;
