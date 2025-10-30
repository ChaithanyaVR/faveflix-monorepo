import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { MovieSearchResult, MovieDetails } from "../types/Movie";

dotenv.config();
const router = express.Router();

const TMDB_KEY = process.env.TMDB_KEY;

/* ---------------------- ✅ Search Movies ---------------------- */
router.get("/search", async (req: Request, res: Response) => {
  const query = req.query.query as string;

  if (!query) {
    return res.status(400).json({ message: "Query required" });
  }

  try {
    const tmdbRes = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: { query, api_key: TMDB_KEY }
    });

    const movies: MovieSearchResult[] = tmdbRes.data.results.map((m: any) => ({
      id: m.id,
      title: m.title,
      poster_path: m.poster_path,
      release_date: m.release_date,
    }));

    return res.json({ results: movies });
  } catch (err: any) {
    console.error("TMDB Search Error:", err?.response?.data);
    return res.status(500).json({ message: "TMDB search failed" });
  }
});

/* ---------------------- ✅ Movie Details ---------------------- */
router.get("/details/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tmdbRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
      params: { api_key: TMDB_KEY }
    });

    const m = tmdbRes.data;

    const movie: MovieDetails = {
      title: m.title || "",
      type: "movie",
      director: "", 
      budget: m.budget ?? null,
      location: m.production_countries?.[0]?.name || "",
      duration: m.runtime ? `${m.runtime} mins` : "N/A",
      year: m.release_date ? Number(m.release_date.split("-")[0]) : null,
      posterUrl: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : "",
    };

    return res.json({ movie });
  } catch (err: any) {
    console.error("TMDB Details Error:", err?.response?.data);
    return res.status(500).json({ message: "Failed to fetch movie details" });
  }
});

export default router;
