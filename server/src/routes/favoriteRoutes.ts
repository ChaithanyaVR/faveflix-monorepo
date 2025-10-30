import express, { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { favoriteSchema, favoriteUpdateSchema } from "../validation/validationSchemas";

const router = express.Router();
const prisma = new PrismaClient();


const formatZodError = (error: z.ZodError) =>
  error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));


const getUserIdFromToken = (req: Request): number | null => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return null;

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    return decoded.id;
  } catch {
    return null;
  }
};

/**
 * -------------------- ADD FAVORITE --------------------
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        errors: [{ field: "token", message: "Invalid or missing token" }],
      });
    }

    // ✅ Validate input
    const parsed = favoriteSchema.safeParse(req.body);

    if (!parsed.success) {
      const formattedErrors = formatZodError(parsed.error);
      return res.status(400).json({
        success: false,
        errors: formattedErrors,
      });
    }

    const data = parsed.data;

    // ✅ Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        title: data.title,
        type: data.type as any, // Prisma enum already validated by refine()
        director: data.director,
        budget: data.budget,
        location: data.location,
        duration: data.duration,
        year: data.year,
        userId,
        posterUrl: data.posterUrl,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Favorite saved successfully",
      favorite,
    });

  } catch (err) {
    console.error("Favorite add error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/**
 * -------------------- GET USER FAVORITES --------------------
 */
 router.get("/", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const page: number = req.query.page ? Number(req.query.page) : 1;
const limit: number = req.query.limit ? Number(req.query.limit) : 10;
const search: string = typeof req.query.search === "string" ? req.query.search : "";
const typeParam: string = typeof req.query.type === "string" ? req.query.type.toLowerCase() : "all";


const searchTerm = search.trim();

const where: Prisma.FavoriteWhereInput = {
  userId,
  ...(typeParam !== "all" ? { type: typeParam as "movie" | "show" } : {}),
  ...(searchTerm
    ? {
        title: {
          contains: searchTerm,
          mode: "insensitive"
        }
      }
    : {}),
};



    const favorites = await prisma.favorite.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.favorite.count({ where });

    return res.json({
      success: true,
      data: favorites,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (err) {
    console.error("Favorites fetch error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const id = Number(req.params.id);

    // Full validation
    const parsed = favoriteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: formatZodError(parsed.error) });
    }

    const updated = await prisma.favorite.updateMany({
      where: { id, userId },
      data: parsed.data
    });

    if (!updated.count) {
      return res.status(404).json({ success: false, message: "Favorite not found" });
    }

    return res.json({ success: true, message: "Favorite updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


// ✅ PARTIAL UPDATE (PATCH) — Only validates provided fields
router.patch("/:id", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const id = Number(req.params.id);

    // Partial validation
    const parsed = favoriteUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: formatZodError(parsed.error) });
    }

    const updated = await prisma.favorite.updateMany({
      where: { id, userId },
      data: parsed.data
    });

    if (!updated.count) {
      return res.status(404).json({ success: false, message: "Favorite not found" });
    }

    return res.json({ success: true, message: "Favorite partially updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const id = Number(req.params.id);

    const deleted = await prisma.favorite.deleteMany({
      where: { id, userId }
    });

    if (!deleted.count) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    return res.json({ success: true, message: "Deleted successfully" });
  } catch {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
