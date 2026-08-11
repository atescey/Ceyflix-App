const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchFromTMDB(endpoint, params = {}) {
    const query = new URLSearchParams({
        api_key: API_KEY,
        language: "tr-TR",
        ...params,
    });

    const url = `${BASE_URL}${endpoint}?${query.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`TMDB API hatası: ${response.status}`);
    }

    return response.json();
}

export function getTrendingMovies(page = 1) {
    return fetchFromTMDB("/trending/movie/day", { page });
}

export function getPopularTVShows(page = 1) {
    return fetchFromTMDB("/tv/popular", { page });
}
export function getMovieGenres() {
    return fetchFromTMDB("/genre/movie/list");
}
export function searchMovies(query, page = 1) {
    return fetchFromTMDB("/search/movie", { query, page });
}
export function getMovieDetails(id) {
    return fetchFromTMDB(`/movie/${id}`, { append_to_response: "videos,credits" });
}
export function getTVDetails(id) {
    return fetchFromTMDB(`/tv/${id}`, { append_to_response: "videos,credits" });
}
export function getNowPlayingMovies(page = 1) {
    return fetchFromTMDB("/movie/now_playing", { page });
}

export function getMoviesByGenre(genreId, page = 1) {
    return fetchFromTMDB("/discover/movie", { with_genres: genreId, page, sort_by: "popularity.desc" });
}
export function getPopularMovies(page = 1) {
    return fetchFromTMDB("/movie/popular", { page });
}

export function getTrendingTVShows(page = 1) {
    return fetchFromTMDB("/trending/tv/day", { page });
}

export function getOnTheAirTVShows(page = 1) {
    return fetchFromTMDB("/tv/on_the_air", { page });
}

export function getTVGenres() {
    return fetchFromTMDB("/genre/tv/list");
}

export function getTVByGenre(genreId, page = 1) {
    return fetchFromTMDB("/discover/tv", { with_genres: genreId, page, sort_by: "popularity.desc" });
}