const express = require("express");
const animeRoutes = require("./routes/animeRoutes");
const episodeRoutes = require("./routes/episodeRoutes");
const serverRoute = require("./routes/server");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use("/anime", animeRoutes);
app.use("/episode", episodeRoutes);
app.use("/server", serverRoute);

module.exports = app;
