import axiosInstance from "./axios-instance";
import { IMovieApiResponse } from "./interface";

export const fetchNowPlayingMovies = async (page = 1) => {
  try {
    const response = await axiosInstance.get<IMovieApiResponse>(
      "/movie/now_playing",
      {
        params: {
          page: page, // Menambahkan parameter page untuk pagination
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    throw error;
  }
};

export const fetchPopularMovies = async (
  page?: number
): Promise<IMovieApiResponse> => {
  try {
    const response = await axiosInstance.get<IMovieApiResponse>(
      "/movie/popular",
      {
        params: {
          page,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

export const addToFavorite = async (
  accountId: string,
  sessionId: string,
  movieId: number,
  favorite: boolean
) => {
  try {
    const response = await axiosInstance.post(
      `/account/${accountId}/favorite`,
      {
        media_type: "movie",
        media_id: movieId,
        favorite: favorite,
      },
      {
        params: {
          session_id: sessionId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to favorite:", error);
    throw error;
  }
};

export const searchMovie = async (
  query: string,
  page = 1
): Promise<IMovieApiResponse> => {
  try {
    const response = await axiosInstance.get<IMovieApiResponse>(
      "/search/movie",
      {
        params: {
          query, // Judul film yang ingin dicari
          page, // Halaman untuk pagination
          include_adult: false, // Opsional: Tidak menyertakan film dewasa
          language: "en-US", // Opsional: Menetapkan bahasa hasil pencarian
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching for movie:", error);
    throw error;
  }
};


export const fetchMovieById = async (id: string | number | undefined) => {
  try {
    const response = await axiosInstance.get(`/movie/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}