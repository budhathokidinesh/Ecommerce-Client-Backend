import express from "express";
import { dbConnect } from "./src/config/dbconfig.js";
import bodyParser from "body-parser";
const app = express();
const PORT = process.env.PORT || 8001;

//Middlewares
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./src/middleware/errorHandler.js";
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("dev"));

import authRoute from "./src/routes/authRoute.js";
import imageRoutes from "./src/routes/imageRoute.js";
import { responseClient } from "./src/middleware/responseClient.js";
import productRouter from "./src/routes/productRoutes.js";
import categoryRouter from "./src/routes/categoryRoutes.js";
import orderRouter from "./src/routes/orderRoutes.js";
import webhookRoute from "./src/routes/webhookRoute.js";
import stripeRouter from "./src/routes/stripe.js";
import reviewRouter from "./src/routes/reviewRoutes.js";

//for webhook
app.use(
  "/api/v1/stripe/webhook",
  bodyParser.raw({ type: "*/*" }),
  webhookRoute
);
app.use(express.json());
//Auth Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/payment", stripeRouter);
app.use("/api/v1/reviews", reviewRouter);

//end poins for image
app.use("/api/v1/all", imageRoutes);

app.use(errorHandler); // To handle errors globally in the application

//DB Connection and Server status
dbConnect()
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to mongoose
    instance. */
    app.listen(PORT, (error) => {
      return !error
        ? console.log(`server is running at http://localhost:${PORT}`)
        : console.log(error);
    });
  })
  .catch((error) => console.log(error));
// To define a route handler for GET requests to the root URL ("/"):
app.get("/", (req, res) => {
  const message = " Welcome to the server, Its LIVE now";
  responseClient({ req, res, message }); // To send a response to the client
});
