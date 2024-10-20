import { Badge } from "@/components/atom/badge";
import { Button } from "@/components/atom/button";
import { Card, CardContent } from "@/components/atom/card";
import MainLayout from "@/components/layout/main-layout";
import { IDetailMovie } from "@/services/apis/interface";
import { fetchMovieById } from "@/services/apis/movies";
import { ArrowLeftIcon, Calendar, Star, ThumbsUp, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/atom/skeleton";
import { useParams, useNavigate } from "react-router-dom";

export default function MovieDetail() {
    const [detailMovie, setDetailMovie] = useState<IDetailMovie | null>(null);
    const { movieId } = useParams();
    const navigate = useNavigate()

    const getDetailMovie = async () => {
        try {
            const data = await fetchMovieById(movieId);
            setDetailMovie(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getDetailMovie();
    }, []);



    // Show loading skeletons while data is being fetched
    if (!detailMovie) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            <Skeleton className="w-full h-96 rounded-lg" />
                        </div>
                        <div className="md:col-span-2">
                            <Skeleton className="h-10 mb-4" />
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Skeleton className="h-6 rounded-md" />
                                <Skeleton className="h-6 rounded-md" />
                                <Skeleton className="h-6 rounded-md" />
                            </div>
                            <Skeleton className="h-4 mb-6" />
                            <Card className="mb-6">
                                <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">
                                    <Skeleton className="h-16" />
                                    <Skeleton className="h-16" />
                                    <Skeleton className="h-16" />
                                    <Skeleton className="h-16" />
                                </CardContent>
                            </Card>
                            <div className="flex gap-4">
                                <Skeleton className="h-10 w-40" />
                                <Skeleton className="h-10 w-40" />
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8 space-y-4">
                <Button onClick={() => navigate(-1)}>
                    <span><ArrowLeftIcon /></span>
                    <span>Back</span>
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${detailMovie.poster_path}`}
                            alt={detailMovie.title}
                            className="w-full rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <h1 className="text-4xl font-bold mb-4">{detailMovie.title}</h1>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {/* Display genre badges */}
                            {detailMovie.genres.map((genre) => (
                                <Badge key={genre.id} variant="secondary">
                                    {genre.name}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-muted-foreground mb-6">{detailMovie.overview}</p>
                        <Card className="mb-6">
                            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">
                                <div className="flex items-start flex-col gap-2">
                                    <div className="flex gap-x-1">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm">Release Date</span>
                                    </div>
                                    <span className="font-semibold">{detailMovie.release_date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-400" />
                                    <span className="text-sm">Rating</span>
                                    <span className="font-semibold">{detailMovie.vote_average.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ThumbsUp className="h-4 w-4" />
                                    <span className="text-sm">Votes</span>
                                    <span className="font-semibold">{detailMovie.vote_count}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="text-sm">Adult</span>
                                    <span className="font-semibold">{detailMovie.adult ? "Yes" : "No"}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
