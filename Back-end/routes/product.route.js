import express from "express";
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductsByCategory, getRecomendedProducts, toggleFeatureProduct } from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",protectRoute ,adminRoute ,getAllProducts);
router.get("/featured",getFeaturedProducts);
router.get("/category",getProductsByCategory);
router.get("/recommendations",getRecomendedProducts);
router.post("/",protectRoute ,adminRoute, createProduct);
router.patch("/:id",protectRoute,adminRoute, toggleFeatureProduct);
router.delete("/:id",protectRoute,adminRoute, deleteProduct);

export default router;