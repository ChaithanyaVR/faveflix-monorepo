import * as React from "react";
import Navbar from "../components/Navbar";
import { addFavorite, type FavoritePayload } from "../utils/favorite";
import MovieSelector from "../components/MovieSelector";
import { Save } from "lucide-react";

const AddFavorite: React.FC = () => {
  const [localPosterPreview, setLocalPosterPreview] = React.useState<
    string | null
  >(null);
  const [formData, setFormData] = React.useState({
    title: "",
    type: "movie" as "movie" | "show",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: "",
    posterUrl: "",
  });

  const handleMovieSelect = (movie: any) => {
    setLocalPosterPreview(null);

    setFormData({
      title: movie.title || "",
      type: "movie",
      director: movie.director || "",
      budget: movie.budget?.toString() || "",
      location: movie.location || "",
      duration: movie.duration || "",
      year: movie.year ? movie.year.toString() : "",
      posterUrl: movie.posterUrl || "",
    });
  };

  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    const payload: Partial<FavoritePayload> = {
      title: formData.title.trim(),
      type: formData.type as "movie" | "show",
      director: formData.director.trim() || undefined,
      budget: formData.budget ? Number(formData.budget) : undefined,
      location: formData.location.trim() || undefined,
      duration: formData.duration?.trim() || undefined, // ✅ string
      year: formData.year ? Number(formData.year) : undefined,
      posterUrl: formData.posterUrl || undefined,
    };

    const res = await addFavorite(payload);
    setLoading(false);

    if (res.success) {
      setMessage("✅ Added to favorites!");
      setFormData({
        title: "",
        type: "movie",
        director: "",
        budget: "",
        location: "",
        duration: "",
        year: "",
        posterUrl: "",
      });
      setLocalPosterPreview(null);
    } else {
      setError(
        res.errors?.[0]?.message || res.message || "❌ Something went wrong"
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-black text-white">
        <form
          onSubmit={handleSubmit}
          className="bg-[#141414] p-8 rounded-xl shadow-lg w-full max-w-xl border border-gray-800 space-y-5"
        >
          <h2 className="text-3xl text-center font-bold text-red-600 mb-3">
            Add Movie / Show
          </h2>

          {message && <p className="text-green-500 text-center">{message}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="space-y-2 mb-3">
            <label className="text-sm text-gray-300 mb-1">Search Movie</label>
            <MovieSelector onSelect={handleMovieSelect} />
          </div>

          {(localPosterPreview || formData.posterUrl) && (
            <div className="flex justify-center mb-3">
              <img
                src={localPosterPreview || formData.posterUrl}
                alt="Poster"
                className="w-32 h-48 object-cover rounded-lg border border-gray-700"
              />
            </div>
          )}
          <label className="font-medium text-[#c9d1d9]">Title *</label>

          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#0d0d0d] border border-gray-700 rounded-lg"
          />

          <label className="font-medium text-[#c9d1d9]">Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-3 bg-[#0d0d0d] border border-gray-700 rounded-lg"
          >
            <option value="movie">Movie</option>
            <option value="show">Show</option>
          </select>

          <label className="font-medium text-[#c9d1d9]">Director</label>
          <input
            name="director"
            value={formData.director}
            onChange={handleChange}
            className="w-full p-3 bg-[#0d0d0d] border border-gray-700 rounded-lg"
          />

          <label className="font-medium text-[#c9d1d9]">Budget</label>
          <input
            name="budget"
            type="number"
            value={formData.budget}
            onChange={handleChange}
            className="w-full p-3 bg-[#0d0d0d] border border-gray-700 rounded-lg"
          />

          <label className="font-medium text-[#c9d1d9]">Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 bg-[#0d0d0d] border border-gray-700 rounded-lg"
          />

          <label className="font-medium text-[#c9d1d9]">Duration </label>
          <input
            name="duration"
            type="text"
            placeholder="e.g. 148 mins"
            value={formData.duration}
            onChange={handleChange}
            className="w-full p-3 bg-[#0d0d0d] border border-gray-700 rounded-lg"
          />

          <label className="font-medium text-[#c9d1d9]">Year</label>
          <input
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            className="w-full p-3 bg-[#0d0d0d] border border-gray-700 rounded-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-60"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Add to Favorites"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddFavorite;
