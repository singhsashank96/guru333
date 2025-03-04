const express = require("express");
const connectDB = require("./db.js");
const cors = require("cors");
const http = require("http");
const PORT = 5000;
const path = require("path");

const app = express();

// Body parsing middleware
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

// Use CORS middleware with default options (allowing all origins, methods, and headers)
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/user", require("././Routes/auth_routes.js"));
app.use("/payment", require("././Routes/payment_routes.js"));
app.use("/game", require("././Routes/game_routes.js"));
app.use("/dashbaord", require("././Routes/dashbaord_routes.js"));
app.use("/contact", require("././Routes/contact_routes.js"));





// Static files
// app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// Server setup
const server = http.createServer(app);

// Socket.io setup

// Start server and connect to the database
server.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
  connectDB();
});
