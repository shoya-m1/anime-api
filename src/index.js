import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

app.use(cors());

app.use(routes);

app.listen(3002, () => {
  console.log(`Server berjalan di http://localhost:3002`);
});
