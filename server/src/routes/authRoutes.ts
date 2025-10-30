import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {z} from 'zod';
import { userSignupSchema, userSigninSchema } from '../validation/validationSchemas'

const router = express.Router();
const prisma = new PrismaClient();

const formatZodError = (error: z.ZodError) =>
  error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

/**
 * -------------------- SIGNUP --------------------
 */
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const parsed = userSignupSchema.safeParse(req.body);

    if (!parsed.success) {
        const formattedErrors = formatZodError(parsed.error);
       
        return res.status(400).json({
          success: false,
          errors: formattedErrors, 
        });
      }

    const { username, email, password } = parsed.data;
      
    // 🔍 Check existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
        errors: [{ field: "email", message: "Email already registered" }],
      });
    }

    // 🔒 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * -------------------- SIGNIN --------------------
 */
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const parsed = userSigninSchema.safeParse(req.body);

    if (!parsed.success) {
        const formattedErrors = formatZodError(parsed.error);
        return res.status(400).json({
          success: false,
          errors: formattedErrors,
        });
      }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
        errors: [{ field: "email", message: "User not found" }],
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
        errors: [{ field: "password", message: "Invalid credentials" }],
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Signin successful",
      token,
    });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});
  
export default router;
