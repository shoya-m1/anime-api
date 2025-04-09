import express from "express";
import * as controllers from "../controllers/index.js";

const router = express.Router();

router.get("/", controllers.defaultPage);
router.get("/anime/:animeId", controllers.getAnimeDetail);
router.get("/episode/:episodeId", controllers.getEpisodeDetail);
router.get("/server/:serverId", controllers.getServers);

export default router;
