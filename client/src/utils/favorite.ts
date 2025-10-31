import axios from "axios";
import { getToken } from "./auth";

const API_URL = `${import.meta.env.VITE_API_URL}/api/favorites`;


const authHeaders = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

/* ------------------ ✅ Types ------------------ */
export interface FavoritePayload {
  title: string;
  type: "movie" | "show";
  year: number;
  director?: string;
  budget?: number;
  location?: string;
  duration?: string;
  posterUrl?: string;
}

/* ------------------ ✅ Create ------------------ */
export const addFavorite = async (data: Partial<FavoritePayload>) => {
  try {
    const res = await axios.post(API_URL, data, authHeaders());
    return { success: true, data: res.data };
  } catch (err: any) {
    return {
      success: false,
      errors: err.response?.data?.errors,
      message: err.response?.data?.message || "Failed to save favorite",
    };
  }
};

/* ------------------ ✅ Get with Pagination ------------------ */
export const getFavorites = async (page = 1, limit = 10, type = "all") => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      type,
    });
    try {
      const res = await axios.get(`${API_URL}?${params.toString()}`, authHeaders());
  
      return {
        success: true,
        data: res.data.data,
        pagination: res.data.pagination,
        hasMore: res.data.pagination?.hasMore ?? false,
      };
      
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to fetch favorites",
      };
    }
  };
  

/* ------------------ ✅ Update ------------------ */
export const updateFavorite = async (id: number, data: Partial<FavoritePayload>) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data, authHeaders());
    return { success: true, data: res.data };
  } catch (err: any) {
    return {
      success: false,
      errors: err.response?.data?.errors,
      message: err.response?.data?.message || "Failed to update favorite",
    };
  }
};

export const patchFavorite = async (id: number, data: Partial<FavoritePayload>) => {
    const token = localStorage.getItem("token");
  
    const res = await fetch(`${API_URL}/${id}`, {

      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  
    return res.json();
  };
  

/* ------------------ ✅ Delete ------------------ */
export const deleteFavorite = async (id: number) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, authHeaders());
    return { success: true, data: res.data };
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to delete favorite",
    };
  }
};
