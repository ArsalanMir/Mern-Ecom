import Stripe from "stripe";
import dotenv from "dotenv";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);