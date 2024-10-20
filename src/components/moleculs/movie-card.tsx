import { Star, Heart, List } from "lucide-react";
import { Button } from "@/components/atom/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/atom/card";
import { Badge } from "@/components/atom/badge";
import { IMovie } from "@/services/apis/interface";
import { getGenres } from "@/services/genreUtils";
import { addToFavorite } from "@/services/apis/movies";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
    movie: IMovie;
    accountId?: string | number;
    sessionId?: string;  // Tambahkan sessionId
    onAddToWatchlist?: () => void;
}

const MovieCard = ({
    movie,
    accountId,
    sessionId,  // Tambahkan sessionId
    onAddToWatchlist,
}: MovieCardProps) => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const maxStars = 5;

    const filledStars = Math.round((movie.vote_average / 10) * maxStars);

    const handleAddToFavorite = async () => {
        const storedSessionId = sessionId || localStorage.getItem('session_id');

        if (!storedSessionId) {
            navigate('/login');
            toast({
                title: "Authentication Required",
                description: "Please login to add to favorites.",
                variant: "destructive",
            });
            return;
        }

        try {
            await addToFavorite(String(accountId), storedSessionId, movie.id, true);
            toast({
                title: "Added to Favorites",
                description: `${movie.title} has been added to your favorites.`,
            });
            navigate('/favorite')
        } catch (error) {
            console.error('Error adding to favorite:', error);
            toast({
                title: "Error",
                description: "Failed to add to favorites.",
                variant: "destructive",
            });
        }
    };

    return (
        <Card className="w-full max-w-sm overflow-hidden">
            <div className="relative aspect-[2/3] w-full max-h-[400px]">
                <img
                    src={`${import.meta.env.VITE_IMAGE_URL}${movie.poster_path}`}
                    alt={`${movie.title} poster`}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>
            <CardHeader className="p-4">
                <div className="flex flex-col items-start justify-between">
                    <CardTitle className="line-clamp-2 text-lg font-bold">{movie.title}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                        {getGenres(movie.genre_ids)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex items-center">
                    {[...Array(maxStars)].map((_, i) => (
                        <Star
                            key={i}
                            className={`h-5 w-5 ${i < filledStars
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-300 text-gray-300"
                                }`}
                        />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{movie.vote_average.toFixed(1)}</span>
                </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 p-4">
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleAddToFavorite}
                >
                    <Heart className="mr-2 h-4 w-4" />
                    Favorite
                </Button>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={onAddToWatchlist}
                >
                    <List className="mr-2 h-4 w-4" />
                    Watchlist
                </Button>
            </CardFooter>
        </Card>
    );
};

export default MovieCard;
