import * as React from "react";
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SignupData } from "../utils/auth";
import { signup } from "../utils/auth";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupData>({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(formData);
      alert("Signup successful!");
      navigate("/landing"); // redirect after success
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
       <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-2xl rounded-xl p-8 w-96 border border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Create Account
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-3">{error}</p>
        )}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full bg-gray-700 text-white border border-gray-600 p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-gray-700 text-white border border-gray-600 p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full bg-gray-700 text-white border border-gray-600 p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center text-sm mt-4 text-gray-300">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-400 hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};


export default SignUp;
