// src/utils/genreUtils.ts

// Pemetaan genre ID ke nama genre
const genreMapping: { [key: number]: string } = {
  16: "Animation",
  878: "Science Fiction",
  10751: "Family",
  27: "Horror",
  18: "Drama",
  28: "Action",
  35: "Comedy",
  53: "Thriller",
  80: "Crime",
  14: "Fantasy",
  // Tambahkan genre lain sesuai dengan data dari TMDB
};

// Fungsi untuk mendapatkan nama-nama genre berdasarkan genre_ids
export const getGenres = (genre_ids: number[]): string => {
  return genre_ids.map((id) => genreMapping[id] || "Unknown").join(", ");
};
