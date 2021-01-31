import express from "express";
import { connectDB } from "./config/DB";
import { authRouter } from "./Routes/API/Auth";
import { postsRouter } from "./Routes/API/Posts";
import { profileRouter } from "./Routes/API/Profile";
import { userRouter } from "./Routes/API/Users";

const app = express();
const PORT = process.env.PORT || 5000;

// connect to database
connectDB();

app.get("/", (req, res) => {
  res.send("API is running");
});

// Define Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/posts", postsRouter);

app.listen(PORT, () => {
  console.log(`server is running ${PORT} `);
});
