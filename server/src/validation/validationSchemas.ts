import { z } from "zod";

export const userSignupSchema = z.object({
  username: z.string()
    .min(2, { message: "Username must be at least 2 characters long" })
    .max(50, { message: "Username must be less than 50 characters" }),

 
  email: z.email({ message: "Invalid email address" }),

  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password is too long" }),
});

export const userSigninSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export const favoriteSchema = z.object({
  title: z.string().min(1, "Title is required"),

  type: z.string()
  .refine(val => val === "movie" || val === "show", {
    message: "Type must be either movie or show",
  }),


  director: z.string().optional(),
  budget: z.coerce.number().optional(),
  location: z.string().optional(),
  duration: z.string().optional(),
  year: z.coerce.number().optional(),
  posterUrl: z.url().optional()
});

export const favoriteUpdateSchema = favoriteSchema.partial();
export type SignupInput = z.input<typeof userSignupSchema>;
export type SigninInput = z.input<typeof userSigninSchema>;
export type FavoriteInput = z.input<typeof favoriteSchema>;
