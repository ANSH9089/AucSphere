import { config } from "dotenv";
import express from "express";
import { connection } from "./database/connection.js";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import ErrorHandler, { errorMiddleware } from "./middlewares/error.js";
import userRoutes from "./router/userRoutes.js"
import auctionItemsRouter from "./router/auctionItemRoutes.js"
import bidRouter from "./router/bidRoutes.js";
import commissionRouter from "./router/commissionRouter.js";
import superAdminRouter from "./router/superAdminRoutes.js";
import { endedAuctionCron } from "./automation/endedAuctionCron.js";
import { verifyCommissionCron } from "./automation/verifyCommissionCron.js";


config({
  path: "./config/config.env",
});
app.use(
    cors({
      origin: [process.env.FRONTEND_URL],
      methods: ["POST", "GET", "PUT", "DELETE"],
      credentials: true,
    })
  );
  
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );


  app.use("/api/v1/user",userRoutes);
  app.use("/api/v1/auctionitem",auctionItemsRouter)
  app.use("/api/v1/bid", bidRouter);
  app.use("/api/v1/commission", commissionRouter);
  app.use("/api/v1/superadmin", superAdminRouter);
  endedAuctionCron();
  verifyCommissionCron();
  connection()
  app.use(errorMiddleware)

export default app;