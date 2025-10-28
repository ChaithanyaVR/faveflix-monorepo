import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();


router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    
    const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

    res.status(201).json({ message: "Signup successful", token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    
    const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );
      

    res.json({ message: "Signin successful", token });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
