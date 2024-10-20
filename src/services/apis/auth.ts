import axiosInstance from "./axios-instance";

export const getGuestSession = async () => {
  try {
    const response = await axiosInstance.get(
      "/authentication/guest_session/new"
    );
    return response.data.guest_session_id;
  } catch (error) {
    console.error("Error creating guest session:", error);
    throw error;
  }
};

export const getRequestToken = async () => {
  try {
    const response = await axiosInstance.get("/authentication/token/new");
    return response.data.request_token; // Mengembalikan request token
  } catch (error) {
    console.error("Error fetching request token:", error);
    throw error;
  }
};

export const validateWithLogin = async (
  username: string,
  password: string,
  requestToken: string
) => {
  try {
    const response = await axiosInstance.post(
      "/authentication/token/validate_with_login",
      {
        username,
        password,
        request_token: requestToken, // Request token yang didapat sebelumnya
      }
    );
    return response.data.request_token; // Mengembalikan request token yang telah tervalidasi
  } catch (error) {
    console.error("Error validating token with login:", error);
    throw error;
  }
};

export const createSession = async (validatedRequestToken: string) => {
  try {
    const response = await axiosInstance.post("/authentication/session/new", {
      request_token: validatedRequestToken, // Request token yang sudah tervalidasi
    });
    return response.data.session_id; // Mengembalikan session ID
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

export const logoutFromTMDB = async (sessionId: string) => {
  try {
    const response = await axiosInstance.delete("/authentication/session", {
      data: {
        session_id: sessionId, // Mengirim session ID dalam body request
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error logging out from TMDB:", error);
    throw error;
  }
};

export const getAccountDetails = async (sessionId: string) => {
  try {
    const response = await axiosInstance.get("/account", {
      params: {
        session_id: sessionId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching account details:", error);
    throw error;
  }
};

export const getFavoriteMovies = async (
  accountId: string,
  sessionId: string,
  page = 1
) => {
  try {
    const response = await axiosInstance.get(
      `/account/${accountId}/favorite/movies`,
      {
        params: {
          session_id: sessionId,
          language: "en-US",
          sort_by: "created_at.asc",
          page: page,
        },
      }
    );
    return response.data.results; // Kembalikan daftar film favorit
  } catch (error) {
    console.error("Error fetching favorite movies:", error);
    throw error;
  }
};

export const removeFromFavorite = async (
  accountId: string,
  sessionId: string,
  movieId: number
) => {
  try {
    const response = await axiosInstance.post(
      `/account/${accountId}/favorite`,
      {
        media_type: "movie",
        media_id: movieId,
        favorite: false, // Set 'favorite' to false to remove from favorites
      },
      {
        params: {
          session_id: sessionId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing from favorite:", error);
    throw error;
  }
};
