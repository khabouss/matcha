import express from "express";
import attachAuthRoute from "./Modules/Auth/Routes/Auth.route";

const app = express();
app.use(express.json({ limit: "100mb" }));
app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

const authRouter = express.Router();

/** AUTH */
attachAuthRoute(authRouter);

app.use("/auth", authRouter);

export default app;
