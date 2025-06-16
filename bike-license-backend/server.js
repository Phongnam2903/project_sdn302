const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");


const authRouter = require("./routes/auth");
const questionsRouter = require("./routes/questions");
const examsRouter = require("./routes/exams");
// Load environment variables
dotenv.config();

//Create server
const server = express();

//Connect to MongoDB
connectDB();

// Config CORS before have route.
server.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// Middleware parse JSON
server.use(express.json());

//routes
server.use("/api/auth", authRouter);
server.use("/api/questions", questionsRouter);
server.use("/api/exams", examsRouter);

// Start the server
const PORT = process.env.PORT || 5000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running at http://${HOSTNAME}:${PORT}`);
});
