const express = require("express");
const connectToDb = require("./config/connectToDb");
const xss = require("xss-clean");
const rateLimiting = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const { errorHandler, notFound } = require("./middlewares/error");
const cors = require("cors");

require("dotenv").config();

// Connect to Database
connectToDb();

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());

// Security Headers
app.use(helmet());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Prevent XSS (Cross Site Scripting) Attacks
app.use(xss());

// Rate Limiting
app.use(rateLimiting({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200,
}));

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://blog-mern-stack-frontend.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/posts", require("./routes/postsRoute"));
app.use("/api/comments", require("./routes/commentsRoute"));
app.use("/api/categories", require("./routes/categoriesRoute"));
app.use("/api/password", require("./routes/passwordRoute"));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start the Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

