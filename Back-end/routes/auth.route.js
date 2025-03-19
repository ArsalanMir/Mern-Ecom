import express from "express";

import {logIn, logOut, refreshToken, signUp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup",signUp);

router.post("/login", logIn);

router.post("/logout", logOut);

router.post("/refresh-token", refreshToken);

// router.get("/profile", getProfile);

export default router;
