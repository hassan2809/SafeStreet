import express from "express";
import connectToDB from "./config/db.config.js";
import cors from "cors";
import cron from "node-cron";
import { scrapeStatsAndSave } from "./utils/deathStatsScrapper.js";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import advertisementRoutes from "./routes/advertisement.route.js";
import rewardRoutes from "./routes/reward.route.js";
import reportRoutes from "./routes/report.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import mediaRequestRouter from "./routes/mediaRequest.route.js";
import homeRoutes from "./routes/home.route.js";
import paymentDetailsRoutes from "./routes/paymentDetails.route.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import helmet from "helmet";
import { deleteOldMediaRequests } from "./utils/deleteMediaRequestWithMoreThanFourDays.js";

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "no-referrer" },
  })
);

// Parsers and CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:3000"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/advertisements", advertisementRoutes);
app.use("/api/reward", rewardRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/media-requests", mediaRequestRouter);
app.use("/api/home", homeRoutes);
app.use("/api/payment-details", paymentDetailsRoutes);

// 404 and error handler
app.use(notFound);
app.use(errorHandler);

// Connect to the database
connectToDB();

cron.schedule("0 2 * * *", () => {
  scrapeStatsAndSave();
});

cron.schedule("0 1 * * *", async () => {
  await deleteOldMediaRequests();
});

// Start the server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
export default app;
