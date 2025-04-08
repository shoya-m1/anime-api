// src/app.js
const express = require("express");
const cors = require("cors");

// const animeRoutes = require("./routes/animeRoutes");
// const episodeRoutes = require("./routes/episodeRoutes");
// const serverRoutes = require("./routes/server");
const defaultRoute = require("./routes/defaultRoute");
const notFound = require("./routes/notFound");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", defaultRoute);
// app.use("/anime", animeRoutes);
// app.use("/episode", episodeRoutes);
// app.use("/server", serverRoutes);
app.use(notFound);

module.exports = app;
