import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import qs from "qs";
import { cors } from "./config/cors";
import { httpLogger } from "./config/logger";
import { apiRoutes } from "./routes";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import path from "path";
import { globalLimiter } from "./config/rate-limit";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

// app initialization
const app: Application = express();

// app settings
app.set("query parser", (str: string) => qs.parse(str));

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`))

// middlewares
app.use(express.json());
app.use(helmet());
app.use(httpLogger);
app.use(cors);
app.use(globalLimiter);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// trust proxy when behind proxies (load balancers)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Home page route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    title: "Welcome AIT APIs",
    description:
      "Advance Institute of Technology Backend API",
    version: "1.1.0",
    docs: "https://github.com/mahmud-reza-rafsun/ait_university_backend",
  });
});

// API auth routes
app.use("/api/auth", (req, res) => {
  return toNodeHandler(auth)(req, res);
});

// API routes
app.use("/api/v1", apiRoutes);

// unhandled routes
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

export { app };
