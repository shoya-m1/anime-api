// routes/notFound.js
const express = require("express");
const router = express.Router();

router.use((req, res) => {
  res.status(404).json({
    method: req.method,
    message: "Endpoint not found. Please check the documentation.",
    status: false,
    code: 404,
    path: req.originalUrl,
  });
});

module.exports = router;
