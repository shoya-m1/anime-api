const express = require("express");
const app = express();

const animeRoutes = require("./src/routes/animeRoutes");
const episodeRoutes = require("./src/routes/episodeRoutes");
const serverRoutes = require("./src/routes/server");
const defaultRoute = require("./src/routes/defaultRoute");
const notFound = require("./src/routes/notFound");

const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/", defaultRoute);
app.use("/anime", animeRoutes);
app.use("/episode", episodeRoutes);
app.use("/server", serverRoutes);
app.use(notFound);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Server running at http://localhost:${PORT}`);
});
