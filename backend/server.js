import express from "express";
import connectDB from "./database/db.js";
import cors from "cors";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import userAuthRoute from "./routes/userRoutes.js";
import addressRouter from "./routes/addressRoute.js"
const app = express();
const PORT = 5000; // Ensure this matches the port in app.listen

// Connect to the database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // or the frontend URL
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
    credentials: true,
  })
);
app.use(cors())
app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/auth", userAuthRoute);
app.use("/api/addresses", addressRouter)
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));




// ===================================
// import express from "express";
// import connectDB from "./database/db.js";
// import cors from "cors";
// import productRouter from "./routes/productRoutes.js";
// import cartRouter from "./routes/cartRoutes.js";
// import userAuthRoute from "./routes/userRoutes.js";
// import cluster from "cluster";
// import os from "os";

// const PORT = 5000; // Ensure this matches the port in app.listen

// // If the current process is the master, fork workers
// if (cluster.isPrimary) {
//   const numCPUs = os.cpus().length; // Get the number of CPU cores
//   console.log(`Primary ${process.pid} is running`);

//   // Fork workers (one for each CPU core)
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   // Restart workers when they die
//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
//     cluster.fork();
//   });
// } else {
//   // Workers can share the TCP connection
//   const app = express();

//   // Connect to the database
//   connectDB();

//   // Middleware to parse JSON bodies
//   app.use(express.json());
//   app.use(
//     cors({
//       origin: "http://localhost:3000", // or the frontend URL
//       methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
//       credentials: true,
//     })
//   );

//   // Basic route
//   app.get("/", (req, res) => {
//     res.send("Hello from Worker " + process.pid);
//   });

//   // API routes
//   app.use("/api", productRouter);
//   app.use("/api/cart", cartRouter);
//   app.use("/api", userAuthRoute);

//   // Start the server in each worker process
//   app.listen(PORT, () => {
//     console.log(`Worker ${process.pid} is running on PORT: ${PORT}`);
//   });
// }
