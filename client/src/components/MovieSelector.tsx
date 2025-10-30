"use client";
import { useState, useEffect } from "react";
import { searchMovies, getMovieDetails } from "../utils/movieSearch";

interface MovieSelectorProps {
  onSelect: (movieData: any) => void;
}

export default function MovieSelector({ onSelect }: MovieSelectorProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!query) return setSuggestions([]);
      setLoading(true);

      const res = await searchMovies(query);
      if (res.success && res.data) setSuggestions(res.data);

      setLoading(false);
    };

    const timer = setTimeout(fetch, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = async (id: number, title: string) => {
    setQuery(title);
    setSuggestions([]);

    const res = await getMovieDetails(id);
    if (res.success && res.data) onSelect(res.data);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="border rounded p-2 w-full"
        placeholder="Search movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <div className="text-sm p-2">Searching...</div>}

      {suggestions.length > 0 && (
        <div className="absolute z-50 bg-white border mt-1 rounded shadow w-full max-h-60 overflow-y-auto text-black">
          {suggestions.map((m) => (
            <div
              key={m.id}
              onClick={() => handleSelect(m.id, m.title)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
            {m.title || "N/A"}{" "}
            {m.release_date && `(${m.release_date.slice(0, 4)})`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
