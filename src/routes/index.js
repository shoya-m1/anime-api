import express from "express";
import * as controllers from "../controllers/index.js";

const router = express.Router();

router.get("/", controllers.defaultPage);
router.get("/anime/:animeId", controllers.getAnimeDetail);
router.get("/episode/:episodeId", controllers.getEpisodeDetail);
router.get("/server/:serverId", controllers.getServers);
router.get("/test", async (req, res) => {
  try {
    const response = await axios.get("https://otakudesu.cloud/episode/snf-episode-27-sub-indo/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://otakudesu.cloud/",
      },
    });

    res.send("✅ SUCCESS");
  } catch (err) {
    res.status(403).json({
      message: "❌ BLOCKED",
      code: err.response?.status,
      headers: err.response?.headers,
    });
  }
});

export default router;
