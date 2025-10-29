import * as React from "react";
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import type {  SigninData } from "../utils/auth";
import { signin } from "../utils/auth";

interface FieldError {
  field: string;
  message: string;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SigninData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear field error when typing
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError("");

    try {
      const result = await signin(formData);

      if (!result.success) {
        if (result.errors) {
          const fieldErrors: Record<string, string> = {};
          result.errors.forEach((err: FieldError) => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          setGeneralError(result.message || "Signin failed");
        }
        setLoading(false);
        return; // ❌ stop here on error — do NOT show success popup
      }

      // ✅ Only here login is successful
      alert("Signin successful!");
      navigate("/landing");
    } catch (err: any) {
      setGeneralError(err.response?.data?.message || "Signin failed");
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
          Sign In
        </h2>

        
        {generalError && (
          <p className="text-red-400 text-sm text-center mb-3">{generalError}</p>
        )}

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
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-sm mt-4 text-gray-300">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};


export default SignIn;
