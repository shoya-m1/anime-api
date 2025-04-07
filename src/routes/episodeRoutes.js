const express = require("express");
const router = express.Router();
const { scrapeEpisodePage } = require("../scrapers/episodeDetail");

router.get("episode/:episodeId", async (req, res) => {
  try {
    const result = await scrapeEpisodePage(req.params.episodeId);
    res.json({
      statusCode: 200,
      statusMessage: "OK",
      message: "",
      ok: true,
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      statusMessage: "ERROR",
      message: "Failed to scrape episode",
      ok: false,
    });
  }
});

module.exports = router;
