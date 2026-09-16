import express from "express";
import UserRouter from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    msg: "server is running",
  });
});
app.use("/api/users", UserRouter);
app.use("/api/auth", authRoutes);

export default app;
