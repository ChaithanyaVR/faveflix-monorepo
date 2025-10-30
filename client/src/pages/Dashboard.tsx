import * as React from "react";
import Navbar from "../components/Navbar";
import {
  getFavorites,
  deleteFavorite,
  type FavoritePayload,
  patchFavorite,
} from "../utils/favorite";
import { Pencil, Trash2, ChevronUp, Save, X } from "lucide-react";

interface FavoriteItem extends FavoritePayload {
  id: number;
}

const Dashboard: React.FC = () => {
  const [favorites, setFavorites] = React.useState<FavoriteItem[]>([]);
  const [page, setPage] = React.useState(1);
  const [filterType, setFilterType] = React.useState("all");
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [editItem, setEditItem] = React.useState<FavoriteItem | null>(null);
  const [originalItem, setOriginalItem] = React.useState<FavoriteItem | null>(
    null
  );
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  const observer = React.useRef<IntersectionObserver | null>(null);

  const lastItemRef = React.useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getFavorites(page, 10, filterType);

      if (res.success) {
        const items = res.data || [];

        setFavorites((prev) =>
          page === 1
            ? items // reset on page = 1
            : Array.from(
                new Map([...prev, ...items].map((i) => [i.id, i])).values()
              )
        );

        setHasMore(res.hasMore);
      }
      setLoading(false);
    };

    fetchData();
  }, [page, filterType]);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this?")) return;

    const res = await deleteFavorite(id);
    if (res.success) {
      setFavorites((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEditSubmit = async () => {
    if (!editItem || !originalItem) return;

    const { id } = editItem;

    const changedFields: Partial<FavoritePayload> = {};

    (Object.keys(editItem) as (keyof FavoriteItem)[]).forEach((key) => {
      if (key === "id") return;

      if (editItem[key] !== originalItem[key]) {
        (changedFields as any)[key] = editItem[key];
      }
    });

    if (Object.keys(changedFields).length === 0) {
      alert("No changes to update");
      setEditItem(null);
      return;
    }

    const res = await patchFavorite(id, changedFields);

    if (res.success) {
      setFavorites((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...changedFields } : f))
      );
      setEditItem(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-4 py-8 bg-black text-white">
        <h2 className="text-4xl font-extrabold mb-8 text-red-600 tracking-wide">
          My Watchlist 🎬
        </h2>
        <div className="flex gap-4 mb-4">
          <select
            value={filterType}
            onChange={(e) => {
              setPage(1);
              setFavorites([]);
              setFilterType(e.target.value);
            }}
            className="bg-[#141414] border border-gray-700 px-4 py-2 rounded-lg text-white focus:border-red-600 focus:ring-2 focus:ring-red-700 transition"
          >
            <option value="all">All</option>
            <option value="movie">Movie</option>
            <option value="show">Show</option>
          </select>
        </div>

        <div className="bg-[#141414] p-5 rounded-xl shadow-xl border border-gray-800 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1a1a1a] text-gray-300 text-sm">
                <th className="p-3">Poster</th>
                <th className="p-3">Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Director</th>
                <th className="p-3">Budget</th>
                <th className="p-3">Location</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Year</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {favorites.map((item, idx) => {
                const isLast = idx === favorites.length - 1;

                return (
                  <tr
                    key={item.id}
                    ref={isLast ? lastItemRef : null}
                    className="border-b border-gray-800 hover:bg-[#222] transition"
                  >
                    <td className="p-2">
                      {item.posterUrl ? (
                        <img
                          src={item.posterUrl}
                          alt={item.title}
                          className="w-12 h-16 rounded"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="p-2">{item.title}</td>
                    <td className="p-2 capitalize text-red-400">{item.type}</td>
                    <td className="p-2">{item.director || "-"}</td>
                    <td className="p-2">{item.budget || "-"}</td>
                    <td className="p-2">{item.location || "-"}</td>
                    <td className="p-2">{item.duration || "-"}</td>
                    <td className="p-2">{item.year || "-"}</td>
                    <td className="p-2 space-x-3 space-y-3">
                      <button
                        onClick={() => {
                          setEditItem(item);
                          setOriginalItem(item);
                        }}
                        className="text-red-500 hover:text-red-400 font-medium transition hover:scale-105"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-400 hover:text-white font-medium transition hover:scale-105"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {loading &&
                [...Array(5)].map((_, i) => (
                  <tr key={`sk-${i}`} className="animate-pulse">
                    {[
                      "w-28",
                      "w-16",
                      "w-24",
                      "w-20",
                      "w-20",
                      "w-16",
                      "w-12",
                    ].map((w, id) => (
                      <td key={id} className="p-2">
                        <div
                          className={`h-4 ${w} bg-[#2d333b] rounded-md skeleton`}
                        />
                      </td>
                    ))}
                    <td className="p-2">
                      <div className="h-4 w-14 bg-[#2d333b] rounded-md skeleton" />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {!hasMore && (
            <p className="text-center py-4 text-gray-500">No more results</p>
          )}
        </div>

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition hover:scale-110"
          >
            <ChevronUp size={22} />
          </button>
        )}

      
        {editItem && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-[#111] w-[90%] max-w-md p-6 rounded-xl border border-gray-800 shadow-2xl animate-fadeIn">
              <h3 className="text-2xl font-bold text-red-600 mb-5">
                Edit Details
              </h3>

              <div className="space-y-4">
                {["title", "director", "location", "duration"].map((field) => (
                  <input
                    key={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={(editItem as any)[field] ?? ""}
                    onChange={(e) =>
                      setEditItem({ ...editItem!, [field]: e.target.value })
                    }
                    className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:border-red-500"
                  />
                ))}

                <input
                  type="number"
                  placeholder="Budget"
                  value={editItem.budget ?? ""}
                  onChange={(e) =>
                    setEditItem({ ...editItem, budget: Number(e.target.value) })
                  }
                  className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:border-red-500"
                />

                <input
                  type="number"
                  placeholder="Year"
                  value={editItem.year ?? ""}
                  onChange={(e) =>
                    setEditItem({ ...editItem, year: Number(e.target.value) })
                  }
                  className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:border-red-500"
                />

                <select
                  value={editItem.type}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      type: e.target.value as "movie" | "show",
                    })
                  }
                  className="w-full p-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:border-red-500"
                >
                  <option value="movie">Movie</option>
                  <option value="show">Show</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleEditSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold hover:scale-105 transition"
                >
                  <Save size={16} /> Save
                </button>
                <button
                  onClick={() => setEditItem(null)}
                  className="bg-gray-700 hover:bg-gray-600 px-5 py-2 text-white rounded-lg font-semibold hover:scale-105 transition"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
