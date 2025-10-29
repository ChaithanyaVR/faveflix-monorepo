import * as React from "react";
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SignupData } from "../utils/auth";
import { signup } from "../utils/auth";

interface FieldError {
  field: string;
  message: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<SignupData>({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" })); // clear field error on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError("");

    const result = await signup(formData);

    if (!result.success) {
      if (result.errors) {
        // Convert array of { field, message } → { fieldName: message }
        const fieldErrors: Record<string, string> = {};
        result.errors.forEach((err: FieldError) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        setGeneralError(result.message || "Signup failed");
      }
      setLoading(false);
      return;
    }

    alert("Signup successful!");
    navigate("/landing");
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

        {generalError && (
          <p className="text-red-400 text-sm text-center mb-3">
            {generalError}
          </p>
        )}

<div className="mb-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full bg-gray-700 text-white border ${
              errors.username ? "border-red-500" : "border-gray-600"
            } p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
            required
          />
          {errors.username && (
            <p className="text-red-400 text-xs mt-1">{errors.username}</p>
          )}
        </div>

        <div className="mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full bg-gray-700 text-white border ${
              errors.email ? "border-red-500" : "border-gray-600"
            } p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
            required
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full bg-gray-700 text-white border ${
              errors.password ? "border-red-500" : "border-gray-600"
            } p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
            required
          />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password}</p>
          )}
        </div>

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
