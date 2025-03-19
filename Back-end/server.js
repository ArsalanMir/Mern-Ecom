import express from "express";
import dotenv  from "dotenv";
import authRouter from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import couponRouter from "./routes/coupon.route.js";
import paymentRouter from "./routes/payment.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter);
app.use("/api/products",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/coupons",couponRouter);
app.use("/api/payments",paymentRouter);

app.listen(PORT,()=>{
  console.log(`server is running on ${PORT}`)
connectDB();
});
