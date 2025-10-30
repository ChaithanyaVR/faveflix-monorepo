import axios from "axios";
import { getToken } from "./auth";
import type { MovieSearchResult, MovieDetails } from '../types/movie';

const API_URL = "http://localhost:3000/api/movies";

const authHeaders = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

/* --------------------------------- ✅ Search Movies --------------------------------- */
export const searchMovies = async (
  query: string
): Promise<{
  success: boolean;
  data?: MovieSearchResult[];
  message?: string;
}> => {
  try {
    const res = await axios.get(`${API_URL}/search?query=${query}`, authHeaders());
    return { success: true, data: res.data.results };
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to search movies",
    };
  }
};

/* ---------------------------- ✅ Get Movie Details ---------------------------- */
export const getMovieDetails = async (
  id: number
): Promise<{
  success: boolean;
  data?: MovieDetails;
  message?: string;
}> => {
  try {
    const res = await axios.get(`${API_URL}/details/${id}`, authHeaders());
    return { success: true, data: res.data.movie };
  } catch {
    return { success: false, message: "Failed to fetch movie details" };
  }
};
