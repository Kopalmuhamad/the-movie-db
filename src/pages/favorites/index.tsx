import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { getAccountDetails, getFavoriteMovies } from '@/services/apis/auth';
import MovieCard from '@/components/moleculs/movie-card';
import { IMovie, IUser } from '@/services/apis/interface';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/atom/skeleton';
import { Link } from 'react-router-dom';

const FavoritePage = () => {
    const [account, setAccount] = useState<IUser | null>(null);
    const [favoriteMovies, setFavoriteMovies] = useState<IMovie[]>([]);
    const [loading, setLoading] = useState(true);
    const sessionId = localStorage.getItem('session_id');

    useEffect(() => {
        const fetchAccountDetails = async () => {
            if (sessionId) {
                try {
                    const accountData = await getAccountDetails(sessionId);
                    setAccount(accountData);

                    const favoriteMoviesData = await getFavoriteMovies(accountData.id, sessionId);
                    setFavoriteMovies(favoriteMoviesData);
                } catch (error) {
                    console.error('Error fetching account or favorite movies:', error);
                    toast.error('Cannot get account or favorite movies');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchAccountDetails();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="container mx-auto pt-20 space-y-10">
                {/* Use the Skeleton component while loading */}
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        ); // Loader saat data sedang diambil
    }

    return (
        <MainLayout>
            <section className='container mx-auto pt-20'>
                <div>
                    <h2 className='text-xl'>
                        <span>Welcome</span>, <span className='font-semibold'>{account ? account.username : "As guest"}!</span>
                    </h2>
                    {account && <p>Your Account ID: <span className='font-semibold'>{account.id}</span></p>}
                </div>
            </section>
            <section className="container mx-auto pt-10 space-y-10">
                <header>
                    <h1 className='text-3xl font-bebas'>A List of Your Favorite Movies</h1>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteMovies.length > 0 ? (
                        favoriteMovies.map((movie) => (
                            <Link to={`/movie/${movie.id}`}>
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    accountId={account?.id}
                                    sessionId={sessionId || ''}
                                />
                            </Link>
                        ))
                    ) : (
                        <p>You don't have any favorite movies yet.</p>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}

export default FavoritePage;
